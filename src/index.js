var parser = require('./parser');
var converter = require('./converter');
var cascade = require('./cascade');

var globalOptions = {};

function cascadeOptions(options) {
	globalOptions = cascade.options(globalOptions, options);
}

function setOptions(options) {
	globalOptions = options;
}

function render(input, options) {
	input += '';
	if (!options) options = {};
	if (!options.tags) options.tags = {};
	
	options = cascade.options(globalOptions, options);

	var pt = parser.generateParseTreeFromInput(input);
	var ast = parser.generateASTFromParseTree(pt);
	var html = converter.convert(ast, options);
	
	return html;
}

var m42kup = {
	parser,
	converter,
	render,
	cascade: cascadeOptions,
	set: setOptions
};

module.exports = m42kup;
