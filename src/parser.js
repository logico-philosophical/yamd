var peg = require('../dist/peg');

function input2pt(input) {
	var pt = peg.parse(input);
	pt.input = input;
	
	return pt;
}

function pt2ast(pt) {
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
		})

		// join text nodes & remove empty
		.reduce((l, r, i) => {
			if (r.type == 'text') {
				if (!r.text) return l;
				if (i > 0 && l[l.length - 1].type == 'text')
					return l[l.length - 1].text += r.text, l;
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
			code: input.substring(pt.root.location.start.offset, pt.root.location.end.offset),
			location: pt.root.location
		}
	};
}

module.exports = {
	input2pt,
	pt2ast
};