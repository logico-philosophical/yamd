var m42kup = require('../');
var hljs = require('highlight.js');
var katex = require('katex');

m42kup.set({hljs, katex});

function render(text) {
	return m42kup.render(text);
}

var styles = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@10.7.3/styles/tomorrow.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/m42kup@latest/web/m42kup.default.css">`;

module.exports = {
	name: 'm42kup 설명서',
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
					name: 'm42kup 소개',
					file: 'introduction.m42kup'
				},
				{
					name: '간단한 사용법',
					file: 'basic-usage.m42kup'
				},
				{
					name: '설치',
					file: 'installation.m42kup'
				}
			]
		},
		{
			name: 'API',
			dir: 'api',
			list: [
				{
					name: '렌더링 옵션',
					file: 'options.m42kup'
				},
				{
					name: '입출력 형식',
					file: 'formats.m42kup'
				},
				{
					name: 'm42kup',
					file: 'm42kup.m42kup'
				},
				{
					name: 'm42kup.parser',
					file: 'm42kup.parser.m42kup'
				},
				{
					name: 'm42kup.renderer',
					file: 'm42kup.renderer.m42kup'
				},
				{
					name: 'm42kup.highlighter',
					file: 'm42kup.highlighter.m42kup'
				}
			]
		}
	]
};