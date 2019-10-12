var parser = require('./parser');
var renderer = require('./renderer');
var highlighter = require('./highlighter');
var cascade = require('./cascade');

var globalOptions = {};

function cascadeOptions(options) {
	if (typeof options != 'object')
		throw TypeError('typeof options != \'object\'');
	globalOptions = cascade.options(globalOptions, options);
}

function setOptions(options) {
	if (typeof options != 'object')
		throw TypeError('typeof options != \'object\'');
	globalOptions = options;
}

function ast2nt(ast, options) {
	if (!options) options = {};
	if (!options.tags) options.tags = {};

	options = cascade.options(globalOptions, options);

	var nt = renderer.ast2nt(ast, options);

	return nt;
}

function render(input, options) {
	input += '';
	if (!options) options = {};
	if (!options.tags) options.tags = {};
	
	options = cascade.options(globalOptions, options);

	var pt = parser.input2pt(input);
	var ast = parser.pt2ast(pt);
	var html = renderer.ast2nt(ast, options).outerHtml;
	
	return html;
}

function highlight(input) {
	input += '';

	var pt = parser.input2pt(input);
	var hl = highlighter.pt2hl(pt);

	return hl;
}

var m42kup = {
	parser,
	renderer,
	highlighter,
	ast2nt,
	render,
	highlight,
	cascade: cascadeOptions,
	set: setOptions
};

module.exports = m42kup;
