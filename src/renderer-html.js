/**
 * the data part of text and HTML objects are intentionally
 * labeled differently, in order to prevent mistakenly
 * using unescaped text data as HTML data, causing an XSS
 * vulnerability. */
var text = s => ({type: 'text', text: s}),
	html = s => ({type: 'html', html: s});

var error = e => `<code class="error">${escapeHtml(e)}</code>`;

var escapeHtml = s => s.replace(/[&<>"']/g, m => ({
	'&': '&amp;', '<': '&lt;', '>': '&gt;',
	'"': '&quot;', "'": '&#39;'
})[m]);

var htmlFilter = e => {
	if (e.type == 'html') return e;
	if (e.type == 'text') return html(escapeHtml(e.text));
	if (e.type == 'error') return html(error(e.text));
	
	throw new TypeError(`Cannot convert type ${e.type} to HTML`);
};

var pipe = (...fns) => {
	return arg => {
		fns.forEach(fn => arg = fn(arg));
		return arg;
	}
};

/* default renderer functions */
var rf = {};

rf['comment'] = r => text('');

rf['entity'] = r => {
	if (r.type != 'text') {
		throw new TypeError('entity: Non-text input');
	}

	if(!/^([a-z]{1,50}|#[0-9]{1,10}|#x[0-9a-f]{1,10})$/i.test(r.text)) {
		throw new SyntaxError('entity: invalid value');
	}

	return html(`&${r.text};`);
};


[
	'b', 'blockquote', 'code', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'sup', 'sub'
].forEach(name => rf[name] = pipe(htmlFilter, r => {
	return html(`<${name}>${r.html}</${name}>`);
}));

rf['blockcode'] = pipe(htmlFilter, r => {
	return html(`<pre><code>${r.html}</code></pre>`);
});

rf['bi'] = pipe(rf['b'], rf['i']);

[
	'br', 'hr'
].forEach(name => rf[name] = pipe(htmlFilter, r => {
	return html(`<${name}>${r.html}`);
}));

rf['link'] = r => {
	if (r.type != 'text') {
		throw new TypeError('link: Non-text input');
	}
	if (!/^(http:\/\/|https:\/\/)/.test(r.text)) {
		r.text = 'http://' + r.text;
	}

	r = htmlFilter(r);
	return html(`<a href="${r.html}">${r.html}</a>`);
};

[
	'ol', 'ul', 'li'
].forEach(name => rf[name] = pipe(htmlFilter, r => {
	return html(`<${name}>${r.html}</${name}>`);
}));

[
	'table', 'tr', 'td', 'th'
].forEach(name => rf[name] = pipe(htmlFilter, r => {
	return html(`<${name}>${r.html}</${name}>`);
}));

[
	'squote', 'dquote'
].forEach(name => rf[name] = pipe(htmlFilter, r => {
	var quotes = {
		'squote': ['\u2018', '\u2019'],
		'dquote': ['\u201c', '\u201d']
	};

	return html(`${quotes[name][0]}${r.html}${quotes[name][1]}`);
}));

var rfAliases = {
	'"': 'dquote',
	'%': 'comment',
	'&': 'entity',
	"'": 'squote',
	'*': 'i',
	'**': 'b',
	'***': 'bi',
	';': 'code',
	';;': 'blockcode',
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

for (var rfAliasName in rfAliases) {
	if (!rf[rfAliases[rfAliasName]]) {
		throw new TypeError(`rfAliases[${JSON.stringify(rfAliasName)}] aliases non-existing function ${rfAliases[rfAliasName]}`);
	}
	rf[rfAliasName] = rf[rfAliases[rfAliasName]];
}

function generateHTMLFromAST(ast, options) {
	if (!options) options = {};
	

	// shallow copy rf2
	var rf2 = {};
	for (var k in rf) rf2[k] = rf[k];

	// merge options.rf to rf2
	if (options.rf) {
		for (var k in options.rf) {
			// overwrite if function
			if (options.rf[k] instanceof Function) {
				rf2[k] = options.rf[k];
			}
			// delete if false
			else if (options.rf[k] === false) {
				delete rf2[k];
			}
			// throw error otherwise
			else {
				throw new TypeError(`Unsupported value: options.rf[${JSON.stringify(k)}] == ${options.rf[k]}`);
			}
		}
	}

	rf = rf2;

	// recurse top-down, render bottom-up
	var recurse = el => {
		var ret;
		
		try {
			if (!(el.name in rf)) {
				throw new TypeError(`undefined tag name "${el.name}"`);
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

			ret = rf[el.name](el.render);
		} catch (err) {
			ret = html(error(`${el.name}: ${err.message}: ${el.code}`));
		} finally {
			return ret;
		}
	};

	for (var i = 0; i < ast.length; i++) {
		if (ast[i].type == 'element') {
			ast[i] = recurse(ast[i]);
		}
	}

	return [
		'<span class="m42kup">',
		ast
			.map(htmlFilter)
			.map(c => c.html)
			.join(''),
		'</span>'
	].join('');
}

module.exports = {
	generateHTMLFromAST
};
