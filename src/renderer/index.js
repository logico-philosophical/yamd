var {Node, TextNode, HtmlNode, ErrorNode, ElementClass, Element} = require('./nodes');
var {Root, classMap: defClassMap} = require('./classes');
var cascade = require('../cascade');

function ast2nt(ast, options) {
	if (!options) options = {};
	if (!options.tags) options.tags = {};

	var classMap = cascade.tags(defClassMap, options.tags);
	
	for (var k in classMap) if (classMap[k] === false) delete classMap[k];
	
	var recurse = (tree, root) => {
		if (tree.type == 'root') {
			return Root.instantiate({
				code: tree.code,
				children: tree.children.map(c => recurse(c, false)),
				options
			});
		}
		if (tree.type == 'text')
			return new TextNode(tree.text);
		
		if (tree.type == 'error')
			return new ErrorNode({
				message: '[error]',
				code: tree.text
			});
		
		if (tree.type == 'element') {
			if (tree.name in classMap) {
				if (classMap[tree.name].split) {
					var recurseSplit = (list, split) => {
						if (split.length == 0)
							return list.map(c => recurse(c, false));

						var s = split[split.length - 1];

						var a = [], b;

						// find delimiters
						list = list.map(l => {
							if (l.type == 'element' && l.name == s
									&& !l.children.length) {
								return ({
									type: 'delimiter'
								});
							}

							return l;
						});

						// trim left
						if (list.length && list[0].type == 'text'
								&& !list[0].text.trim()) {
							list = list.slice(1);
						}

						// add omitted delimiter
						if (!(list.length && list[0].type == 'delimiter')) {
							list.unshift({
								type: 'delimiter'
							});
						}

						for (var i = 0; i < list.length; i++) {
							if (list[i].type == 'delimiter') {
								if (b) a.push(b);
								b = [];
							} else {
								b.push(list[i]);
							}
						}

						a.push(b);

						return a.map(e => recurseSplit(e, split.slice(0, -1)));
					};

					return classMap[tree.name].instantiate({
						code: tree.code,
						children: recurseSplit(
							tree.children,
							classMap[tree.name].split
						),
						options
					});
				}

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

	var root = recurse(ast.root, true);
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
