var {Node, TextNode, HtmlNode, ErrorNode, ElementClass, Element} = require('./nodes');
var defaultTagNameMap = require('./elements/default');
var cascade = require('../cascade');

var rootClass = new ElementClass({
	name: '[root]',
	display: 'container-block',
	render: el => el.html(el.innerHtml)
});

function ast2nt(ast, options) {
	if (!options) options = {};
	if (!options.tags) options.tags = {};

	var tagNameMap = cascade.tags(defaultTagNameMap, options.tags);
	
	return (function recurse(tree) {
		if (tree.type == 'root') {
			return rootClass.instantiate({
				code: tree.code,
				attributes: [],
				children: tree.children.map(recurse),
				options
			});
		}
		if (tree.type == 'text') {
			return new TextNode(tree.text);
		}
		
		if (tree.type == 'error') {
			return new ErrorNode({
				message: 'Parser error',
				code: tree.text
			});
		}
		
		if (tree.type == 'element') {
			if (tree.name in tagNameMap && tagNameMap[tree.name]) {
				if (tagNameMap[tree.name].split) {
					var recurseSplit = (list, split) => {
						if (split.length == 0)
							return list.map(recurse);

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

					return tagNameMap[tree.name].instantiate({
						code: tree.code,
						attributes: tree.attributes,
						children: recurseSplit(
							tree.children,
							tagNameMap[tree.name].split
						),
						options
					});
				}

				return tagNameMap[tree.name].instantiate({
					code: tree.code,
					attributes: tree.attributes,
					children: tree.children.map(recurse),
					options
				});
			}

			return new ErrorNode({
				message: tree.name ? `Undefined tag name [${tree.name}]` : 'No tag name',
				code: tree.code
			});
		}

		throw TypeError(tree.type);
	})(ast.root);
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
