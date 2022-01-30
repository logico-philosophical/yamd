import defaultTagNameMap from './elements/default';
import cascade from '../cascade';
import Element from './nodes/Element';
import Tag from './nodes/Tag';
import Node from './nodes/Node';
import ErrorNode from './nodes/ErrorNode';
import TextNode from './nodes/TextNode';
import HtmlNode from './nodes/HtmlNode';
import { AstRootType, AstType } from '../parser';

var rootClass = new Tag({
	name: '[root]',
	display: 'container-block',
	renderer: el => el.html(el.innerHtml as string)
});

function ast2nt(ast: AstRootType, options): Element {
	if (!options) options = {};
	if (!options.tags) options.tags = {};

	var tagNameMap = cascade.tags(defaultTagNameMap, options.tags);
	
	var root = (function recurse(tree: AstType): Node {
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
		
		// @ts-ignore
		if (tree.type == 'error') {
			return new ErrorNode({
				message: 'Parser error',
				// @ts-ignore
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

		// @ts-ignore
		throw TypeError(tree.type);
	})(ast.root) as Element;

	root.render();

	return root;
}

export default {
	ast2nt,
	Node,
	TextNode,
	HtmlNode,
	ErrorNode,
	Tag,
	Element
};
