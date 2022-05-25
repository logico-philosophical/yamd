var yamd = require('../');
var hljs = require('highlight.js');
var katex = require('katex');

yamd.set({hljs, katex});

function render(text) {
	return yamd.render(text);
}

var styles = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@10.7.3/styles/tomorrow.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yamd@latest/web/yamd.default.css">`;

module.exports = {
	name: 'yamd 설명서',
	src: 'src',
	dst: 'build',
	render,
	templateData: {
		styles
	},
	list: [
		{
			name: '시작하기',
			dir: 'getting-started',
			list: [
				{
					name: 'yamd 소개',
					file: 'introduction.yamd'
				},
				{
					name: '간단한 사용법',
					file: 'basic-usage.yamd'
				},
				{
					name: '설치',
					file: 'installation.yamd'
				}
			]
		},
		{
			name: 'API',
			dir: 'api',
			list: [
				{
					name: '렌더링 옵션',
					file: 'options.yamd'
				},
				{
					name: '입출력 형식',
					file: 'formats.yamd'
				},
				{
					name: 'yamd',
					file: 'yamd.yamd'
				},
				{
					name: 'yamd.parser',
					file: 'yamd.parser.yamd'
				},
				{
					name: 'yamd.renderer',
					file: 'yamd.renderer.yamd'
				},
				{
					name: 'yamd.highlighter',
					file: 'yamd.highlighter.yamd'
				}
			]
		}
	]
};