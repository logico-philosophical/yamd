var parser = require('./parser');
var converter = require('./converter');
var overwriter = require('./options-overwrite');

var globalOptions = {};

function configure(options) {
	overwriter.overwrite(globalOptions, options);
}

function clearConfig() {
	globalOptions = {};
}

function render(input, options) {
	if (!options) options = {};
	// deep copy globalOptions
	var options2 = overwriter.clone(globalOptions);

	// overwrite
	overwriter.overwrite(options2, options);

	// use options2 as options
	options = options2;

	var pt = parser.generateParseTreeFromInput(input);
	var ast = parser.generateASTFromParseTree(pt);
	var html = converter.convert(ast, options);
	
	return html;
}

var m42kup = {
	parser,
	converter,
	render,
	configure
};

module.exports = m42kup;
