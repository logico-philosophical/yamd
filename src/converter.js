/*
 * the data part of text and HTML objects are intentionally
 * labeled differently, in order to prevent mistakenly
 * using unescaped text data as HTML data, which is an XSS
 * vulnerability.
 */
var text = s => ({type: 'text', text: s}),
	html = s => ({type: 'html', html: s});

var error = e => `<code class="m42kup-error">${escapeHtml(e)}</code>`;

var escapeHtml = s => s.replace(/[&<>"']/g, m => ({
	'&': '&amp;', '<': '&lt;', '>': '&gt;',
	'"': '&quot;', "'": '&#39;'
})[m]);

var htmlFilter = e => {
	if (e.type == 'html') return e;
	if (e.type == 'text') return html(escapeHtml(e.text));
	// parser errors
	if (e.type == 'error') return html(error(e.text));
	
	throw new TypeError(`Cannot convert type ${e.type} to HTML`);
};

var pipe = (...fns) => {
	return arg => {
		fns.forEach(fn => arg = fn(arg));
		return arg;
	}
};

/* default tags */
var dt = {};

dt['comment'] = r => text('');

dt['entity'] = r => {
	if (r.type != 'text')
		throw new TypeError('Non-text input');

	if(!/^([a-z]{1,50}|#[0-9]{1,10}|#x[0-9a-f]{1,10})$/i.test(r.text)) {
		throw new SyntaxError('Invalid value');
	}

	return html(`&${r.text};`);
};


[
	'b', 'blockquote', 'code', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'sup', 'sub'
].forEach(name => dt[name] = pipe(htmlFilter, r => {
	return html(`<${name}>${r.html}</${name}>`);
}));

dt['blockcode'] = pipe(htmlFilter, r => {
	var trimmed = r.html.replace(/(^[ \t]*(\r\n|\r|\n))|((\r\n|\r|\n)[ \t]*$)/g, '');
	return html(`<pre><code>${trimmed}\n</code></pre>`);
});

dt['bi'] = pipe(dt['b'], dt['i']);

[
	'br', 'hr'
].forEach(name => dt[name] = pipe(htmlFilter, r => {
	return html(`<${name}>${r.html}`);
}));

dt['link'] = r => {
	if (r.type != 'text') {
		throw new TypeError('Non-text input');
	}
	if (!/^(http:\/\/|https:\/\/)/.test(r.text)) {
		r.text = 'http://' + r.text;
	}

	// see issue #17
	if (!/^(http:\/\/|https:\/\/)[a-z0-9]+(-+[a-z0-9]+)*(\.[a-z0-9]+(-+[a-z0-9]+)*)+\.?(:[0-9]{1,5})?(\/[^ ]*)?$/.test(r.text)) {
		throw Error('Invalid URL');
	}

	r = htmlFilter(r);
	return html(`<a href="${r.html}">${r.html}</a>`);
};

[
	'ol', 'ul', 'li'
].forEach(name => dt[name] = pipe(htmlFilter, r => {
	return html(`<${name}>${r.html}</${name}>`);
}));

[
	'table', 'tr', 'td', 'th'
].forEach(name => dt[name] = pipe(htmlFilter, r => {
	return html(`<${name}>${r.html}</${name}>`);
}));

[
	'squote', 'dquote'
].forEach(name => dt[name] = pipe(htmlFilter, r => {
	var quotes = {
		'squote': ['\u2018', '\u2019'],
		'dquote': ['\u201c', '\u201d']
	};

	return html(`${quotes[name][0]}${r.html}${quotes[name][1]}`);
}));

// unimplemented elements
[
	'highlight', 'math', 'displaymath'
].forEach(name => dt[name] = content => {
	throw Error('Element not implemented');
});

// element aliases ordered by char code
var aliases = {
	'"': 'dquote',
	'$': 'math',
	'$$': 'displaymath',
	'%': 'comment',
	'&': 'entity',
	"'": 'squote',
	'*': 'i',
	'**': 'b',
	'***': 'bi',
	';': 'code',
	';;': 'blockcode',
	';;;': 'highlight',
	'=': 'h1',
	'==': 'h2',
	'===': 'h3',
	'====': 'h4',
	'=====': 'h5',
	'======': 'h6',
	'>': 'blockquote',
	'\\': 'br',
	'^': 'sup',
	'_': 'sub',
	'~': 'link'
};

for (var k in aliases) {
	if (!dt[aliases[k]]) {
		throw new TypeError(`aliases[${JSON.stringify(k)}] aliases non-existing function ${JSON.stringify(aliases[k])}`);
	}
	dt[k] = dt[aliases[k]];
}

function convert(ast, options) {
	if (!options) options = {};
	if (!options.tags) options.tags = {};

	var tags = require('./cascade').tags(dt, options.tags);
	
	for (var k in tags) if (tags[k] === false) delete tags[k];
	
	// recurse top-down, render bottom-up
	var recurse = el => {
		var ret;
		
		try {
			if (!(el.name in tags)) {
				if (!el.name) {
					throw Error('No tag name');
				}
				throw Error('Undefined tag name');
			}

			el.children = el.children.map(c =>
				c.type == 'element' ? recurse(c) : c);

			if (el.children.every(c => c.type == 'text')) {
				// join as text
				el.render = {
					type: 'text',
					text: el.children.map(c => c.text).join('')
				};
			} else {
				// join as HTML
				el.render = {
					type: 'html',
					html: el.children.map(htmlFilter)
							.map(c => c.html).join('')
				};
			}

			ret = tags[el.name](el.render);
		} catch (err) {
			// err.message should not be printed
			// @see issue #30
			ret = html(error(el.code));
		} finally {
			return ret;
		}
	};

	for (var i = 0; i < ast.length; i++) {
		if (ast[i].type == 'element') {
			ast[i] = recurse(ast[i]);
		}
	}

	return ast
		.map(htmlFilter)
		.map(c => c.html)
		.join('');
}

module.exports = {
	convert,
	text,
	html,
	escapeHtml,
	htmlFilter
};
