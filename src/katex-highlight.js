var katex = require('katex');
var hljs = require('highlight.js');
var m42kup = require('./index');

var elements = {};

elements['highlight'] = elements[';;;'] = r => {
	if (r.type != 'text') {
		throw new TypeError('Non-text input');
	}

	var commonLangs = [
		'apache', 'bash', 'coffeescript', 'cpp', 'cs',
		'css', 'diff', 'http', 'ini', 'java',
		'javascript', 'json', 'makefile', 'xml', 'markdown',
		'nginx', 'objectivec', 'perl', 'php', 'python',
		'ruby', 'sql'
	];

	var trimmed = r.text.replace(/(^[ \t]*\n)|(\n[ \t]*$)/g, ''),
		highlighted = hljs.highlightAuto(trimmed, commonLangs).value;
	return {
		type: 'html',
		html: `<pre class="hljs"><code>${highlighted}\n</code></pre>`
	};
};

elements['math'] = elements['$'] = r => {
	if (r.type != 'text') {
		throw new TypeError(`Non-text input`);
	}
	var rendered = katex.renderToString(r.text, {
		throwOnError: false,
		displayMode: false,
		strict: 'error'
	});

	return {
		type: 'html',
		html: rendered
	};
};

elements['displaymath'] = elements['$$'] = r => {
	if (r.type != 'text') {
		throw new TypeError(`Non-text input`);
	}
	var rendered = katex.renderToString(r.text, {
		throwOnError: false,
		displayMode: true,
		strict: 'error'
	});

	return {
		type: 'html',
		html: rendered
	};
};

var options = {elements};

var ret = {};

for (var k in m42kup) ret[k] = m42kup[k];

ret.renderMore = function renderMore(input) {
	return m42kup.render(input, options);
};

module.exports = ret;
