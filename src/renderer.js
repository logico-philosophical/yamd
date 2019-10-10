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

function Element({name, display, render}) {
	if (!name) throw TypeError('!name');
	if (!['inline', 'leaf-block', 'container-block'].includes(display))
		throw TypeError('display != "inline" | "leaf-block" | "container-block"');
	if (!(render instanceof Function))
		throw TypeError('!(render instanceof Function)');

	[this.name, this.display, this.render] = [name, display, render];
}

var elements = {};

elements.comment = new Element({
	name: 'comment',
	display: 'inline',
	render: (content) => text('')
});

elements.entity = new Element({
	name: 'entity',
	display: 'inline',
	render: (content) => {
		if (content.type != 'text')
			throw TypeError('Non-text input');

		if(!/^([a-z]{1,50}|#[0-9]{1,10}|#x[0-9a-f]{1,10})$/i.test(content.text))
			throw SyntaxError('Invalid value');

		return html(`&${content.text};`);
	}
});

[
	'b', 'code', 'i', 'u', 'sup', 'sub'
].forEach(name => elements[name] = new Element({
	name: name,
	display: 'inline',
	render: pipe(htmlFilter, content => {
		return html(`<${name}>${content.html}</${name}>`);
	})
}));

[
	'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'
].forEach(name => elements[name] = new Element({
	name: name,
	display: 'leaf-block',
	render: pipe(htmlFilter, content => {
		return html(`<${name}>${content.html}</${name}>`);
	})
}));

[
	'blockquote',
	'ol', 'ul', 'li',
	'table', 'tr', 'td', 'th'
].forEach(name => elements[name] = new Element({
	name,
	display: 'container-block',
	render: pipe(htmlFilter, content => {
		return html(`<${name}>${content.html}</${name}>`);
	})
}));

[
	'br', 'hr'
].forEach(name => elements[name] = new Element({
	name,
	display: 'leaf-block',
	render: pipe(htmlFilter, content => {
		return html(`<${name}>${content.html}`);
	})
}));

elements.blockcode = new Element({
	name: 'blockcode',
	display: 'leaf-block',
	render: pipe(htmlFilter, content => {
		var trimmed = content.html.replace(/(^[ \t]*(\r\n|\r|\n))|((\r\n|\r|\n)[ \t]*$)/g, '');
		return html(`<pre><code>${trimmed}\n</code></pre>`);
	})
});

elements.bi = new Element({
	name: 'bi',
	display: 'inline',
	render: pipe(elements.b.render, elements.i.render)
});

elements.link = new Element({
	name: 'link',
	display: 'inline',
	render: content => {
		if (content.type != 'text')
			throw TypeError('Non-text input');

		if (!/^(http:\/\/|https:\/\/)/.test(content.text))
			content.text = 'http://' + content.text;

		// see issue #17
		if (!/^(http:\/\/|https:\/\/)[a-z0-9]+(-+[a-z0-9]+)*(\.[a-z0-9]+(-+[a-z0-9]+)*)+\.?(:[0-9]{1,5})?(\/[^ ]*)?$/.test(content.text))
			throw Error('Invalid URL');

		content = htmlFilter(content);
		return html(`<a href="${content.html}">${content.html}</a>`);
	}
});

[
	'squote', 'dquote'
].forEach(name => elements[name] = new Element({
	name,
	display: 'inline',
	render: pipe(htmlFilter, content => {
		var quotes = {
			'squote': ['\u2018', '\u2019'],
			'dquote': ['\u201c', '\u201d']
		};

		return html(`${quotes[name][0]}${content.html}${quotes[name][1]}`);
	})
}));

elements.highlight = new Element({
	name: 'highlight',
	display: 'leaf-block',
	render: (content, options) => {
		if (!options.hljs)
			throw Error('Element not implemented (options.highlight not given)');

		if (content.type != 'text')
			throw TypeError('Non-text input');

		var commonLangs = [
			'apache', 'bash', 'coffeescript', 'cpp', 'cs',
			'css', 'diff', 'http', 'ini', 'java',
			'javascript', 'json', 'makefile', 'xml', 'markdown',
			'nginx', 'objectivec', 'perl', 'php', 'python',
			'ruby', 'sql'
		];

		var trimmed = content.text.replace(/(^[ \t]*(\r\n|\r|\n))|((\r\n|\r|\n)[ \t]*$)/g, ''),
			highlighted = options.hljs.highlightAuto(trimmed, commonLangs).value;
		return html(`<pre class="hljs"><code>${highlighted}\n</code></pre>`);
	}
});

elements.math = new Element({
	name: 'math',
	display: 'inline',
	render: (content, options) => {
		if (!options.katex)
			throw Error('Element not implemented (options.katex not given)');

		if (content.type != 'text')
			throw TypeError('Non-text input');

		var rendered = options.katex.renderToString(content.text, {
			throwOnError: false,
			displayMode: false,
			strict: 'error'
		});

		return html(rendered);
	}
});

elements.displaymath = new Element({
	name: 'displaymath',
	display: 'leaf-block',
	render: (content, options) => {
		if (!options.katex)
			throw Error('Element not implemented (options.katex not given)');

		if (content.type != 'text')
			throw TypeError('Non-text input');

		var rendered = options.katex.renderToString(content.text, {
			throwOnError: false,
			displayMode: true,
			strict: 'error'
		});

		return html(rendered);
	}
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
	if (!elements[aliases[k]]) {
		throw new TypeError(`aliases[${JSON.stringify(k)}] aliases non-existing function ${JSON.stringify(aliases[k])}`);
	}
	elements[k] = elements[aliases[k]];
}

function ast2html(ast, options) {
	if (!options) options = {};
	if (!options.tags) options.tags = {};

	var tags = require('./cascade').tags(elements, options.tags);
	
	for (var k in tags) if (tags[k] === false) delete tags[k];

	var root = {
		type: 'element',
		root: true,
		children: ast
	};

	var labelDisplayTypes = el => {
		el.display = el.root
			? 'container-block'
			: el.name in tags
				? tags[el.name].display
				: 'inline';

		el.children.forEach(c => c.type == 'element' && labelDisplayTypes(c));
	};

	labelDisplayTypes(root);
	
	// recurse top-down, render bottom-up
	var recurse = el => {
		var ret;
		
		try {
			if (!el.root) {
				if (!(el.name in tags)) {
					if (!el.name) {
						throw Error('No tag name');
					}
					throw Error('Undefined tag name');
				}
			}

			el.children = el.children.map(c =>
				c.type == 'element' ? (c.displayContext = el.display, recurse(c)) : c);

			if (el.children.every(c => c.type == 'text')) {
				// join as text
				var text = el.children.map(c => c.text).join('');

				if (text && el.display == 'container-block') {
					el.content = {
						type: 'html',
						html: text.split(/(?:\r\n|\r|\n){2,}/).map(escapeHtml)
							.map(s => `<p>${s}</p>`).join('')
					};
				} else {
					el.content = {
						type: 'text',
						text
					};
				}
			} else {
				if (el.display == 'container-block') {
					var paragraphs = [], p = [];

					var commit = () => {
						if (p.length) {
							paragraphs.push(p);
							p = [];
						}
					}

					var add = e => p.push(e);

					el.children.forEach(c => {
						if (c.type == 'text') {
							var split = c.text.split(/(?:\r\n|\r|\n){2,}/);
							if (split.length < 2) {
								return add(c);
							}

							split.forEach((s, i) => {
								if (s.length) add({
									type: 'text',
									text: s
								});

								if (i < split.length - 1) commit();
							});
						} else {
							if (c.display != 'inline') {
								commit();
								// direct push to list differentiates non-paragraphs
								paragraphs.push(c);
								commit();
							} else {
								add(c);
							}
						}
					});

					commit();

					el.content = {
						type: 'html',
						html: paragraphs.map(p => {
							if (p instanceof Array)
								return '<p>' + p.map(htmlFilter).map(c => c.html).join('') + '</p>';
							else return p.html;
						}).join('')
					};
				} else {
					// join as HTML
					el.content = {
						type: 'html',
						html: el.children.map(htmlFilter)
								.map(c => c.html).join('')
					};
				}
			}

			if (el.root) ret = el.content;
			else ret = tags[el.name].render(el.content, options);
			ret.display = el.display;
		} catch (err) {
			// err.message should not be printed
			// @see issue #30
			ret = html(error(el.code));
			ret.display = 'inline';
		} finally {
			return ret;
		}
	};

	return htmlFilter(recurse(root)).html;
}

module.exports = {
	ast2html,
	escapeHtml,
	htmlFilter,
	Element
};
