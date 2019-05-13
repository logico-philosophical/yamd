# M42kup

JavaScript로 [M42kup](https://github.com/logico-philosophical/m42kup/wiki)의 HTML 렌더러를 구현한 것입니다. 아직 만들고 있음.

* [클라이언트 사이드 렌더러 테스트 페이지(bleeding edge)](https://logico-philosophical.github.io/m42kup/tests/client.html)

## M42kup의 간추린 사용법

<table>
  <tr><th>M42kup 코드</th><th>HTML 렌더링 결과</th></tr>
  <tr><td><code>[=== Heading 3]</code></td><td><h3>Heading 3</h3></td></tr>
  <tr><td><code>[*italic text]</code></td><td><i>italic text</i></td></tr>
  <tr><td><code>[**bold text]</code></td><td><b>bold text</b></td></tr>
  <tr><td><code>[***bolditalic text]</code></td><td><i><b>bolditalic text</b></i></td></tr>
  <tr><td><code>[~example.com]</code></td><td><a href="http://example.com">http://example.com</a></td></tr>
  <tr><td><code>[&rarr]</code></td><td>&rarr;</td></tr>
  <tr><td><code>`[*not italic]`</code></td><td>[*not italic]</td></tr>
  <tr><td><code>[;`[*not italic]`]</code></td><td><code>[*not italic]</code></td></tr>
  <tr><td><pre><code>[;;`
var three = 3,
    four = 4;
`]</code></pre></td><td><pre><code>var three = 3,
    four = 4;</code></pre></td></tr>
  <tr><td><pre><code>[;;;`
var three = 3,
    four = 4;
`]</code></pre></td><td><i>(syntax highlighted block of code)</i></td></tr>
  <tr><td><code>[$e^{i\pi}=-1]</code></td><td><i>(Euler's identity, inline)</i></td></tr>
  <tr><td><code>[$$e^{i\pi}=-1]</code></td><td><i>(Euler's identity, block)</i></td></tr>
</table>

단 `[;;;]`, `[$]`, `[$$]`를 사용하기 위해서는 추가적인 설정이 필요합니다.

## 특징

* **M42kup**의 구문론적 특성상 새로운 태그를 도입하기가 쉽습니다. 옵션을 통해 원하는 태그를 추가해서 사용할 수 있습니다.
  * [`highlight.js`](https://github.com/highlightjs/highlight.js) 등을 써서 구문 강조(syntax highlighting)를 위한 태그를 만들 수 있습니다.
  * [`KaTeX`](https://github.com/KaTeX/KaTeX) 등을 써서 수식 렌더링을 위한 태그를 만들 수 있습니다.

## 설치

### NPM에서 받기

NPM에 올릴 예정입니다.

### Release에서 받기

아직 릴리즈가 없습니다.

### Bleeding-edge

```bash
~ $ git clone https://github.com/logico-philosophical/m42kup.git
~ $ cd m42kup
~/m42kup $ npm install
```

## 테스트
```bash
~/m42kup $ node
> m42kup = require('.')
> m42kup.render('[*hi]')
'<i>hi</i>'
```

## API (불안정)

### `m42kup.render(input, options)`

#### 입력
* `input` (`String`): M42kup 코드.
* `options` (`Object`)
```js
{
  rf: {
    (tagname): r => {
      // return text or html, or throw error
    },
    ...
  }
}
```

만든 놈도 잘 모르겠음.

#### 출력
렌더링 된 HTML(`String`)이 출력됩니다.

#### 입출력 예시
```bash
> m42kup.render('[*hi]')
'<i>hi</i>'
```

## License
[MIT](LICENSE)
