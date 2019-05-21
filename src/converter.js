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

/* default elements */
var elements = {};

elements['lbrack'] = r => {
	if (r.text || r.html)
		throw new Error('Input to void element');
	
	return text('[');
};

elements['rbrack'] = r => {
	if (r.text || r.html)
		throw new Error('Input to void element');
	
	return text(']');
};

elements['grave'] = r => {
	if (r.text || r.html)
		throw new Error('Input to void element');

	return text('`');
};

elements['comment'] = r => text('');

elements['entity'] = r => {
	if (r.type != 'text')
		throw new TypeError('Non-text input');

	if(!/^([a-z]{1,50}|#[0-9]{1,10}|#x[0-9a-f]{1,10})$/i.test(r.text)) {
		throw new SyntaxError('Invalid value');
	}

	return html(`&${r.text};`);
};


[
	'b', 'blockquote', 'code', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'sup', 'sub'
].forEach(name => elements[name] = pipe(htmlFilter, r => {
	return html(`<${name}>${r.html}</${name}>`);
}));

elements['blockcode'] = pipe(htmlFilter, r => {
	return html(`<pre><code>${r.html}</code></pre>`);
});

elements['bi'] = pipe(elements['b'], elements['i']);

[
	'br', 'hr'
].forEach(name => elements[name] = pipe(htmlFilter, r => {
	return html(`<${name}>${r.html}`);
}));

elements['link'] = r => {
	if (r.type != 'text') {
		throw new TypeError('Non-text input');
	}
	if (!/^(http:\/\/|https:\/\/)/.test(r.text)) {
		r.text = 'http://' + r.text;
	}

	r = htmlFilter(r);
	return html(`<a href="${r.html}">${r.html}</a>`);
};

[
	'ol', 'ul', 'li'
].forEach(name => elements[name] = pipe(htmlFilter, r => {
	return html(`<${name}>${r.html}</${name}>`);
}));

[
	'table', 'tr', 'td', 'th'
].forEach(name => elements[name] = pipe(htmlFilter, r => {
	return html(`<${name}>${r.html}</${name}>`);
}));

[
	'squote', 'dquote'
].forEach(name => elements[name] = pipe(htmlFilter, r => {
	var quotes = {
		'squote': ['\u2018', '\u2019'],
		'dquote': ['\u201c', '\u201d']
	};

	return html(`${quotes[name][0]}${r.html}${quotes[name][1]}`);
}));

// element aliases ordered by char code
var aliases = {
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
	'`': 'grave',
	'{': 'lbrack',
	'}': 'rbrack',
	'~': 'link'
};

for (var k in aliases) {
	if (!elements[aliases[k]]) {
		throw new TypeError(`aliases[${JSON.stringify(k)}] aliases non-existing function ${aliases[k]}`);
	}
	elements[k] = elements[aliases[k]];
}

function convert(ast, options) {
	if (!options) options = {};
	

	// shallow copy elements
	var elements2 = {};
	for (var k in elements) elements2[k] = elements[k];

	// overwrite options.elements to elements2
	if (options.elements) {
		for (var k in options.elements) {
			// overwrite if function
			if (options.elements[k] instanceof Function) {
				elements2[k] = options.elements[k];
			}
			// delete if false
			else if (options.elements[k] === false) {
				delete elements2[k];
			}
			// throw error otherwise
			else {
				throw new TypeError(`Unsupported value: options.elements[${JSON.stringify(k)}] == ${options.elements[k]}`);
			}
		}
	}
	
	// use elements2 as elements
	elements = elements2;

	// recurse top-down, render bottom-up
	var recurse = el => {
		var ret;
		
		try {
			if (!(el.name in elements)) {
				throw new TypeError('Undefined tag name');
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

			ret = elements[el.name](el.render);
		} catch (err) {
			ret = html(error(`[${el.name}]: ${err.message}: ${el.code}`));
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
	helper: {
		escapeHtml,
		htmlFilter,
		pipe
	}
};
