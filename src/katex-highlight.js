var katex = require('katex');
var hljs = require('highlight.js');
var m42kup = require('./index');

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

var rf = {};

rf['highlight'] = rf[';;;'] = r => {
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

rf['math'] = rf['$'] = r => {
	if (r.type != 'text') {
		throw new TypeError('Non-text input');
	}
	return html(katex.renderToString(r.text, {
		throwOnError: false,
		displayMode: false,
		strict: 'error'
	}));
};

rf['displaymath'] = rf['$$'] = r => {
	if (r.type != 'text') {
		throw new TypeError('Non-text input');
	}
	return html(katex.renderToString(r.text, {
		throwOnError: false,
		displayMode: true,
		strict: 'error'
	}));
};

var options = {rf};

var ret = {};

for (var k in m42kup) ret[k] = m42kup[k];

ret.renderMore = input => m42kup.render(input, options);

module.exports = ret;
