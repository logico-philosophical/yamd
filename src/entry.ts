import parser, { AstRootType } from './parser';
import renderer from './renderer';
import highlighter from './highlighter';
import cascade from './cascade';
import addCodeMirrorMode from './codemirror';
import { RenderingOptionsType } from './renderer/RenderingOptionsType';

var globalOptions: RenderingOptionsType = {};

function cascadeOptions(options: RenderingOptionsType) {
	if (typeof options != 'object')
		throw TypeError('typeof options != \'object\'');
	globalOptions = cascade.options(globalOptions, options);
}

function setOptions(options: RenderingOptionsType) {
	if (typeof options != 'object')
		throw TypeError('typeof options != \'object\'');
	globalOptions = options;
}

function ast2nt(ast: AstRootType, options: RenderingOptionsType) {
	if (!options) options = {};
	if (!options.tags) options.tags = {};

	options = cascade.options(globalOptions, options);

	var nt = renderer.ast2nt(ast, options);

	return nt;
}

function render(input: string, options: RenderingOptionsType) {
	input += '';
	if (!options) options = {};
	if (!options.tags) options.tags = {};
	
	options = cascade.options(globalOptions, options);

	var pt = parser.input2pt(input);
	var ast = parser.pt2ast(pt);
	var html = renderer.ast2nt(ast, options).outerHtml;
	
	return html;
}

function highlight(input: string) {
	input += '';

	var pt = parser.input2pt(input);
	var hl = highlighter.pt2hl(pt);

	return hl;
}

var yamd = {
	parser,
	renderer,
	highlighter,
	ast2nt,
	render,
	highlight,
	cascade: cascadeOptions,
	set: setOptions,
	addCodeMirrorMode
};

module.exports = yamd;
