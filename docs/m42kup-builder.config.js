var m42kup = require('../');
var hljs = require('highlight.js');
var katex = require('katex');

m42kup.set({hljs, katex});

function render(text) {
	return m42kup.render(text);
}

module.exports = {
	name: 'm42kup 설명서',
	src: 'src',
	dst: 'build',
	render,
	list: [
		{
			name: '시작하기',
			dir: 'getting-started',
			list: [
				{
					name: 'm42kup 소개',
					file: 'introduction'
				},
				{
					name: '간단한 사용법',
					file: 'basic-usage'
				},
				{
					name: '설치',
					file: 'installation'
				}
			]
		},
		{
			name: 'API',
			dir: 'api',
			list: [
				{
					name: '렌더링 옵션',
					file: 'options'
				},
				{
					name: '입출력 형식',
					file: 'formats'
				},
				{
					name: 'm42kup',
					file: 'm42kup'
				},
				{
					name: 'm42kup.parser',
					file: 'm42kup.parser'
				},
				{
					name: 'm42kup.renderer',
					file: 'm42kup.renderer'
				},
				{
					name: 'm42kup.highlighter',
					file: 'm42kup.highlighter'
				}
			]
		}
	]
};