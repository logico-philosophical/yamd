# `m42kup.js`

JavaScript로 [m42kup](https://github.com/logico-philosophical/m42kup/wiki)의 HTML 렌더러를 구현한 것입니다. 아직 작동 방식이나 API가 불안정합니다.

* [클라이언트 사이드 렌더러 테스트 페이지(bleeding edge)](https://logico-philosophical.github.io/m42kup/tests/client.html)

## m42kup의 간추린 사용법

<table>
  <tr><th>m42kup 코드</th><th>HTML 렌더링 결과</th></tr>
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

* m42kup의 구문론적 특성상 새로운 태그를 도입하기가 쉽습니다. 옵션을 통해 원하는 태그를 추가해서 사용할 수 있습니다.
  * [`highlight.js`](https://github.com/highlightjs/highlight.js) 등을 써서 구문 강조(syntax highlighting)를 위한 태그를 만들 수 있습니다.
  * [`KaTeX`](https://github.com/KaTeX/KaTeX) 등을 써서 수식 렌더링을 위한 태그를 만들 수 있습니다.

## 설치

### NPM에서 받기

NPM에 올릴 예정입니다 ([이슈 #2](https://github.com/logico-philosophical/m42kup/issues/2)).

### Release에서 받기

아직 릴리즈가 없습니다.

### Bleeding-edge (clone)

```bash
~ $ git clone https://github.com/logico-philosophical/m42kup.git
~ $ cd m42kup
~/m42kup $ npm install
```

#### 테스트
```bash
~/m42kup $ node
> m42kup = require('.')
> m42kup.render('[*hi]')
'<i>hi</i>'
```

### Bleeding-edge (npm)

```bash
~ $ cd my-project-dir/
```

다음 중 아무거나 하나 입력하세요.

**HTTPS**
```bash
~/my-project-dir $ npm install --save git+https://git@github.com/logico-philosophical/m42kup.git
```

**SSH**
```bash
~/my-project-dir $ npm install --save git+ssh://git@github.com/logico-philosophical/m42kup.git
```

**간단한 방법**
```bash
~/my-project-dir $ npm install --save github:logico-philosophical/m42kup
```

#### 사용법
```js
const m42kup = require('m42kup');
var options = {...};
var rendered = m42kup.render('[*hi]', options); // <i>hi</i>
```

## API (불안정)

```js
{
    parser: {
        generateParseTreeFromInput: [Function],
        generateASTFromParseTree: [Function]
    },
    converter: {
        convert: [Function],
        text: [Function],
        html: [Function],
        escapeHtml: [Function],
        htmlFilter: [Function]
    },
    render: [Function],
    cascade: [Function],
    set: [Function]
}
```

### 렌더링 옵션

`m42kup.render(input, options)`나 `m42kup.cascade(options)`나 `m42kup.set(options)`에서 쓸 수 있는 옵션은 다음과 같습니다.

```js
options = {
    tags: {
        (tag_name): r => {
            // return text or html, or throw error
        },
        ...
    }
}
```

이때 `options.tags[(tag_name)]`은 `text` 또는 `html` 타입의 인자 하나를 받아 `text` 또는 `html`을 반환하거나 `Error`를 `throw` 해야 합니다.

* `text` 타입은 다음과 같이 생겼습니다.
  ```js
  {
      type: 'text',
      text: (text)
  }
  ```
* `html` 타입은 다음과 같이 생겼습니다.
  ```js
  {
      type: 'html',
      html: (html)
  }
  ```
* `throw`된 것은 `Error`의 인스턴스여야 합니다.

m42kup 코드 `[*a < 3]`을 예로 들어 보자면, 먼저
```js
{
    type: 'text',
    text: 'a < 3'
}
```
이 `[*]`에게 입력되는데, `m42kup.converter.htmlFilter`가 적용되어서 타입이 `html`로 바뀝니다.
```js
{
    type: 'html',
    html: 'a &lt; 3'
}
```
이후 `<i>`와 `</i>`로 둘러싸인 값이 반환됩니다.
```js
{
    type: 'html',
    html: '<i>a &lt; 3</i>'
}
```

`text` 값을 `html` 값으로 잘못 사용하면 XSS 위협에 노출될 수 있습니다. 예를 들어
```js
{
    type: 'text',
    text: '<script>alert(1337)</script>'
}
```
위와 같은 데이터를 `[*]` 요소가 `htmlFilter` 없이 사용한다면
```js
{
    type: 'html',
    html: '<i><script>alert(1337)</script></i>'
}
```
위와 같은 출력이 발생하여 악의적 스크립트가 실행될 수 있습니다. 이를 예방하기 위하여 `text`와 `html`의 데이터 부는 `text`와 `html`로 다르게 레이블 되어 있습니다.

#### 옵션의 예시

```js
options = {
    tags: {
        greet: content => {
            // Converts content type to HTML
            content = m42kup.converter.htmlFilter(content);
            return {
                type: 'html',
                html: `Hello ${content.html}`
            };
        }
    }
}
```

### `m42kup.cascade(options)`

현재의 글로벌 옵션을 보존하면서 `options`로 적당히 덮어 씁니다. `m42kup.cascade`나 `m42kup.set`을 한 번도 호출하지 않은 경우 `m42kup.set`과 효과가 같습니다.

#### 입력
* `options` (`Object`): [렌더링 옵션](#렌더링-옵션)을 보세요.

#### 출력
출력은 의미가 없습니다.

#### 예시
```js
// global options: {}

m42kup.cascade({
    tags: {
        // deletes default element [=]
        '=': false
    }
});

// global options: {tags: {'=': false}}

m42kup.cascade({
    tags: {
        // overwrites default element behavior of [*].
        // wraps content with '*'.
        '*': content => {
            if (content.type == 'text') {
                return {
                    type: 'text',
                    text: `*${content.text}*`
                };
            }
            
            return {
                type: 'html',
                html: `*${content.html}*`
            };
        }
    }
});

// global options: {tags: {'=': false, '*': [Function]}}
```

### `m42kup.set(options)`

현재의 글로벌 옵션을 버리고 `options`로 설정합니다. `m42kup.cascade`나 `m42kup.set`을 한 번도 호출하지 않은 경우 `m42kup.cascade`와 효과가 같습니다.

`m42kup.set({})`으로 글로벌 옵션을 없애버릴 수 있습니다.

#### 입력
* `options` (`Object`): [렌더링 옵션](#렌더링-옵션)을 보세요.

#### 출력
출력은 의미가 없습니다.

#### 예시
```js
// global options: {}

m42kup.set({
    tags: {
        // deletes default element [=]
        '=': false
    }
});

// global options: {tags: {'=': false}}

m42kup.set({
    tags: {
        // overwrites default element behavior of [*].
        // wraps content with '*'.
        '*': content => {
            if (content.type == 'text') {
                return {
                    type: 'text',
                    text: `*${content.text}*`
                };
            }
            
            return {
                type: 'html',
                html: `*${content.html}*`
            };
        }
    }
});

// global options: {tags: {'*': [Function]}}
```

### `m42kup.render(input, options)`

#### 입력
* `input` (`String`): M42kup 코드.
* `options` (`Object`): [렌더링 옵션](#렌더링-옵션)을 보세요. 글로벌 옵션을 cascade 합니다.

#### 출력
렌더링 된 HTML(`String`)이 출력됩니다.

#### 예시
```js
m42kup.render('[greet [**M42kup]]!', {
    tags: {
        greet: content => {
            // Converts content type to HTML
            content = m42kup.converter.htmlFilter(content);
            return m42kup.converter.html(`Hello ${content.html}`);
        }
    }
});
```

```html
Hello <b>M42kup</b>!
```

## 꿀팁

### Node.js에서 글로벌 옵션을 설정해 주는 방법

**`m42kup.config.js`**
```js
const m42kup = require('m42kup');

options = {...};

m42kup.set(options);
```

**`m42kup`이 사용되기 전인 앱의 시작점에서**
```js
require('/path/to/config/m42kup.config');
```

`m42kup.config.js`를 `require` 한 이후부터 글로벌 옵션이 적용됩니다.

## License
[MIT](LICENSE)
