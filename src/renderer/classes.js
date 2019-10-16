var {TextNode, HtmlNode, ErrorNode, ElementClass, Element} = require('./nodes');

var Root = new ElementClass({
	name: '[root]',
	display: 'container-block',
	render: el => el.html(el.innerHtml)
});

var classMap = {};

classMap.comment = new ElementClass({
	name: 'comment',
	display: 'inline',
	render: el => el.text('')
});

classMap.entity = new ElementClass({
	name: 'entity',
	display: 'inline',
	render: el => {
		if (!el.innerIsText)
			return el.error('Non-text input');

		if(!/^([a-z]{1,50}|#[0-9]{1,10}|#x[0-9a-f]{1,10})$/i.test(el.innerText))
			return el.error('Invalid value');

		return el.html(`&${el.innerText};`);
	}
});

[
	'b', 'code', 'i', 'u', 'sup', 'sub'
].forEach(name => classMap[name] = new ElementClass({
	name: name,
	display: 'inline',
	render: el => {
		return el.html(`<${name}>${el.innerHtml}</${name}>`);
	}
}));

[
	'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'
].forEach(name => classMap[name] = new ElementClass({
	name: name,
	display: 'leaf-block',
	render: el => {
		return el.html(`<${name}>${el.innerHtml}</${name}>`);
	}
}));

[
	'blockquote',
	'ol', 'ul', 'li',
	'table', 'tr', 'td', 'th'
].forEach(name => classMap[name] = new ElementClass({
	name,
	display: 'container-block',
	render: el => {
		return el.html(`<${name}>${el.innerHtml}</${name}>`);
	}
}));

[
	'br'
].forEach(name => classMap[name] = new ElementClass({
	name,
	display: 'inline',
	render: el => {
		return el.html(`<${name}>${el.innerHtml}`);
	}
}));

[
	'hr'
].forEach(name => classMap[name] = new ElementClass({
	name,
	display: 'leaf-block',
	render: el => {
		return el.html(`<${name}>${el.innerHtml}`);
	}
}));

classMap.blockcode = new ElementClass({
	name: 'blockcode',
	display: 'leaf-block',
	render: el => {
		var trimmed = el.innerHtml.replace(/(^[ \t]*(\r\n|\r|\n))|((\r\n|\r|\n)[ \t]*$)/g, '');
		return el.html(`<pre><code>${trimmed}\n</code></pre>`);
	}
});

classMap.bi = new ElementClass({
	name: 'bi',
	display: 'inline',
	render: el => {
		return el.html(`<i><b>${el.innerHtml}</b></i>`);
	}
});

classMap.link = new ElementClass({
	name: 'link',
	display: 'inline',
	render: el => {
		if (!el.innerIsText)
			return el.error('Non-text input');

		var url = el.innerText;

		if (!/^(http:\/\/|https:\/\/)/.test(url))
			url = 'http://' + url;

		// see issue #17
		if (!/^(http:\/\/|https:\/\/)[a-z0-9]+(-+[a-z0-9]+)*(\.[a-z0-9]+(-+[a-z0-9]+)*)+\.?(:[0-9]{1,5})?(\/[^ ]*)?$/.test(url))
			return el.error('Invalid URL');

		var htmlUrl = el.escapeHtml(url);
		return el.html(`<a href="${htmlUrl}">${htmlUrl}</a>`);
	}
});

classMap.img = new ElementClass({
	name: 'img',
	display: 'leaf-block',
	render: el => {
		if (!el.innerIsText)
			return el.error('Non-text input');

		var url = el.innerText;

		if (!/^(http:\/\/|https:\/\/)/.test(url))
			url = 'http://' + url;

		// see issue #17
		if (!/^(http:\/\/|https:\/\/)[a-z0-9]+(-+[a-z0-9]+)*(\.[a-z0-9]+(-+[a-z0-9]+)*)+\.?(:[0-9]{1,5})?(\/[^ ]*)?$/.test(url))
			return el.error('Invalid URL');

		var htmlUrl = el.escapeHtml(url);
		return el.html(`<div class="m42kup-img-block"><img src="${htmlUrl}"></div>`);
	}
});

[
	'squote', 'dquote'
].forEach(name => classMap[name] = new ElementClass({
	name,
	display: 'inline',
	render: el => {
		var quotes = {
			'squote': ['\u2018', '\u2019'],
			'dquote': ['\u201c', '\u201d']
		};

		return el.html(`${quotes[name][0]}${el.innerHtml}${quotes[name][1]}`);
	}
}));

classMap.highlight = new ElementClass({
	name: 'highlight',
	display: 'leaf-block',
	render: (el, options) => {
		if (!options.hljs)
			return el.error('Element not implemented (options.highlight not given)');

		if (!el.innerIsText)
			return el.error('Non-text input');

		var commonLangs = [
			'apache', 'bash', 'coffeescript', 'cpp', 'cs',
			'css', 'diff', 'http', 'ini', 'java',
			'javascript', 'json', 'makefile', 'xml', 'markdown',
			'nginx', 'objectivec', 'perl', 'php', 'python',
			'ruby', 'sql'
		];

		var trimmed = el.innerText.replace(/(^[ \t]*(\r\n|\r|\n))|((\r\n|\r|\n)[ \t]*$)/g, ''),
			highlighted = options.hljs.highlightAuto(trimmed, commonLangs).value;
		return el.html(`<pre class="hljs"><code>${highlighted}\n</code></pre>`);
	}
});
 
classMap.math = new ElementClass({
	name: 'math',
	display: 'inline',
	render: (el, options) => {
		if (!options.katex)
			return el.error('Element not implemented (options.katex not given)');

		if (!el.innerIsText)
			return el.error('Non-text input');

		var rendered = options.katex.renderToString(el.innerText, {
			throwOnError: false,
			displayMode: false,
			strict: 'error'
		});

		return el.html(rendered);
	}
});

classMap.displaymath = new ElementClass({
	name: 'displaymath',
	display: 'leaf-block',
	render: (el, options) => {
		if (!options.katex)
			return el.error('Element not implemented (options.katex not given)');

		if (!el.innerIsText)
			return el.error('Non-text input');

		var rendered = options.katex.renderToString(el.innerText, {
			throwOnError: false,
			displayMode: true,
			strict: 'error'
		});

		return el.html(rendered);
	}
});

// tag name aliases ordered by char code
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
	'~': 'link',
	'~~': 'img'
};

for (var k in aliases) {
	if (!classMap[aliases[k]]) {
		throw TypeError(`aliasing failed`);
	}
	classMap[k] = classMap[aliases[k]];
}

module.exports = {
	Root,
	classMap
};