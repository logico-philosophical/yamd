var parser = require('./parser');
var converter = require('./converter');

function render(input, options) {
	var pt = parser.generateParseTreeFromInput(input);
	var ast = parser.generateASTFromParseTree(pt);
	var html = converter.convert(ast, options);
	
	return html;
}

var m42kup = {
	parser,
	converter,
	render
};

module.exports = m42kup;
