var {
	generateParseTreeFromInput,
	generateASTFromParseTree
} = require('./parser');

var {generateHTMLFromAST} = require('./renderer-html');

function render(input, options) {
	var pipe = (...fns) => {
		return arg => {
			fns.forEach(fn => arg = fn(arg));
			return arg;
		}
	};

	var ast = pipe(
		generateParseTreeFromInput,
		generateASTFromParseTree
	)(input);

	return generateHTMLFromAST(ast, options);
}

var m42kup = {
	generateParseTreeFromInput,
	generateASTFromParseTree,
	generateHTMLFromAST,
	render
};

module.exports = m42kup;
