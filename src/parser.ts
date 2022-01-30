import peg from '../dist/peg';

export interface AstRootType {
	input: string;
	root: AstRootTypeInner;
}

export interface AstRootTypeInner {
	type: 'root';
	children: (AstElementType | AstTextType)[];
	code: string;
}

interface AstElementType {
	type: 'element';
	name: string;
	attributes: ({
		name: string;
		value: string;
	})[];
	children: (AstElementType | AstTextType)[];
	code: string;
}

interface AstTextType {
	type: 'text';
	text: string;
}

export type AstType = AstRootTypeInner | AstElementType | AstTextType;

function input2pt(input: string) {
	var pt = peg.parse(input);
	pt.input = input;
	
	return pt;
}

function pt2ast(pt): AstRootType {
	var input = pt.input;

	var r = (function recurse(pt) {
		var ast = pt.map(e => {
			switch (e.type) {
				case 'text':
					return {
						type: 'text',
						text: e.text
					};
				case 'verbatim':
					return {
						type: 'text',
						text: e.child.text
					};
				case 'element':
					var attributes = e.attributes._type != 'parenthesis'
						? []
						: e.attributes.content.filter(({_type}) => _type == 'attribute')
							.map(({attribute}) => ({
								name: attribute[0],
								value: attribute[3]
							}));

					return {
						type: 'element',
						name: e.name,
						attributes,
						code: input.substring(e.location.start.offset, e.location.end.offset),
						children: recurse(e.children)
					};
				default:
					throw new TypeError(`Unknown type: ${e.type}`);
			}
		});

		// join text nodes & remove empty
		ast = ast.reduce((l, r) => {
			if (r.type == 'text') {
				if (!r.text) return l;
				if (l.length && l[l.length - 1].type == 'text') {
					l[l.length - 1].text += r.text;
					return l;
				}
			}

			return l.push(r), l;
		}, []);

		return ast;
	})(pt.root.children);

	return {
		input: pt.input,
		root: {
			type: 'root',
			children: r,
			code: input
		}
	};
}

export default {
	input2pt,
	pt2ast
};