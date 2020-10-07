var m42kup = require('../');
var hljs = require('highlight.js');
var katex = require('katex');

m42kup.set({hljs, katex});

function render(text) {
	return m42kup.render(text);
}

module.exports = {
	name: 'm42kup의 문서화',
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
					name: '기본적인 사용법',
					file: 'basic-usage'
				}
			]
		},
		{
			name: 'API 명세',
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
					name: 'm42kup API',
					file: 'm42kup'
				},
				{
					name: 'm42kup.parser API',
					file: 'm42kup.parser'
				},
				{
					name: 'm42kup.renderer API',
					file: 'm42kup.renderer'
				},
				{
					name: 'm42kup.highlighter API',
					file: 'm42kup.highlighter'
				}
			]
		}
	]
};