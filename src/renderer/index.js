var {Node, TextNode, HtmlNode, ErrorNode, ElementClass, Element} = require('./nodes');
var {Root, classMap: defClassMap} = require('./classes');
var cascade = require('../cascade');

function ast2nt(ast, options) {
	if (!options) options = {};
	if (!options.tags) options.tags = {};

	var classMap = cascade.tags(defClassMap, options.tags);
	
	for (var k in classMap) if (classMap[k] === false) delete classMap[k];
	
	var recurse = (tree, root) => {
		if (root) {
			return Root.instantiate({
				code: '[code unavailable]',
				children: tree.children.map(c => recurse(c, false)),
				options
			});
		} else {
			if (tree.type == 'text')
				return new TextNode(tree.text);
			
			if (tree.type == 'error')
				return new ErrorNode({
					message: '[error]',
					code: tree.text
				});
			
			if (tree.type == 'element') {
				if (tree.name in classMap) {
					return classMap[tree.name].instantiate({
						code: tree.code,
						children: tree.children.map(c => recurse(c, false)),
						options
					});
				}

				return new ErrorNode({
					message: tree.name ? 'Undefined tag name' : 'No tag name',
					code: tree.code
				});
			}

			throw TypeError(tree.type);
		}
	}

	var root = recurse({type: 'element', children: ast}, true);
	return root;
}

module.exports = {
	ast2nt,
	Node,
	TextNode,
	HtmlNode,
	ErrorNode,
	ElementClass,
	Element
};
