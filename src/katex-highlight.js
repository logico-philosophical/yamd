var katex = require('katex');
var hljs = require('highlight.js');
var m42kup = require('./index');

var {text, html} = m42kup.converter;
var {escapeHtml, htmlFilter, pipe} = m42kup.converter.helper;

var elements = {};

elements['highlight'] = elements[';;;'] = r => {
	if (r.type != 'text') {
		throw new TypeError('Non-text input');
	}

	var commonLangs = [
		'apache', 'bash', 'coffeescript', 'cpp', 'cs', 'css', 'diff', 'http', 'ini', 'java', 'javascript', 'json', 'makefile', 'xml', 'markdown', 'nginx', 'objectivec', 'perl', 'php', 'python', 'ruby', 'sql'
	];
	
	return pipe(
		r => text(r.text.replace(/(^[ \t]*\n)|(\n[ \t]*$)/g, '')),
		r => html(hljs.highlightAuto(r.text, commonLangs).value),
		r => html(`<pre class="hljs"><code>${r.html}\n</code></pre>`)
	)(r);
};

elements['math'] = elements['$'] = r => {
	if (r.type != 'text') {
		throw new TypeError('Non-text input');
	}
	return html(katex.renderToString(r.text, {
		throwOnError: false,
		displayMode: false,
		strict: 'error'
	}));
};

elements['displaymath'] = elements['$$'] = r => {
	if (r.type != 'text') {
		throw new TypeError('Non-text input');
	}
	return html(katex.renderToString(r.text, {
		throwOnError: false,
		displayMode: true,
		strict: 'error'
	}));
};

var options = {elements};

var ret = {};

for (var k in m42kup) ret[k] = m42kup[k];



ret.renderMore = function renderMore(input) {
	return m42kup.render(input, options);
};

module.exports = ret;
