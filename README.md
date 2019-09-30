# <img src="https://i.imgur.com/WiJuFSK.png" height="48">

[![Documentation Status](https://readthedocs.org/projects/m42kup/badge/?version=latest)](https://m42kup.readthedocs.io/en/latest/?badge=latest)
[![GitHub](https://img.shields.io/github/license/logico-philosophical/m42kup)](https://github.com/logico-philosophical/m42kup/blob/master/LICENSE)

JavaScript로 미완성 마크업 언어인 [m42kup](https://github.com/logico-philosophical/m42kup/wiki)의 HTML 렌더러를 구현한 것입니다. API가 대단히 불안정하니 조심하세요.

* [클라이언트 사이드 렌더러 테스트 페이지(bleeding edge)](https://logico-philosophical.github.io/m42kup/tests/client.html)

**목차**
* 특징
* 설치
  + NPM에서 받기
  + Release에서 받기
  + 최-신 (clone)
  + 최-신 (npm)
* API (불안정)
  + 렌더링 옵션
    - 옵션의 예시
  + 입출력 형식
    - parse tree의 형식
    - AST의 형식
  + `m42kup.cascade(options)`
  + `m42kup.set(options)`
  + `m42kup.render(input, options)`
* 꿀팁
  + Node.js에서 글로벌 옵션을 설정해 주는 방법
  + 클라이언트 사이드에서 글로벌 옵션을 설정해 주는 방법
    - 설정 파일을 만드는 방법
    - Webpack 하는 방법
* License

## 특징

* m42kup의 구문론적 특성상 새로운 태그를 도입하기가 쉽습니다. 옵션을 통해 원하는 태그를 추가해서 사용할 수 있습니다.
  * [`highlight.js`](https://github.com/highlightjs/highlight.js) 등을 써서 구문 강조(syntax highlighting)를 위한 태그를 만들 수 있습니다.
  * [`KaTeX`](https://github.com/KaTeX/KaTeX) 등을 써서 수식 렌더링을 위한 태그를 만들 수 있습니다.

## 설치

### NPM에서 받기

NPM에 올릴 예정입니다 ([이슈 #2](https://github.com/logico-philosophical/m42kup/issues/2)).

### Release에서 받기

아직 릴리즈가 없습니다.

### 최-신 (clone)

```bash
~ $ git clone https://github.com/logico-philosophical/m42kup.git
~ $ cd m42kup
~/m42kup $ npm install
```

git이 설치되어 있어야 합니다.

**테스트**
```bash
~/m42kup $ node
> m42kup = require('.')
> m42kup.render('[*hi]')
'<i>hi</i>'
```

### 최-신 (npm)

```bash
~ $ cd my-project-dir/
~/my-project-dir $ npm install --save github:logico-philosophical/m42kup
```

역시 git이 설치되어 있어야 합니다. 이후

```js
const m42kup = require('m42kup');
```
하여 사용하면 됩니다.

## API (불안정)

```js
{
    parser: {
        input2pt: [Function],
        pt2ast: [Function]
    },
    renderer: {
        ast2html: [Function],
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

여기다 다 쓰려니 좀 긴 듯;;

### 렌더링 옵션

`m42kup.render(input, options)`나 `m42kup.cascade(options)`나 `m42kup.set(options)`에서 쓸 수 있는 옵션은 다음과 같습니다.

```js
options = {
    tags: {
        (tag_name): content => {
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
이 `[*]`에게 입력되는데, `m42kup.renderer.htmlFilter`가 적용되어서 타입이 `html`로 바뀝니다.
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
            content = m42kup.renderer.htmlFilter(content);
            return {
                type: 'html',
                html: `Hello ${content.html}`
            };
        }
    }
}
```

### 입출력 형식

#### parse tree의 형식

근본 없는 언어로 써 봤는데 알아볼 수 있을 거라 생각합니다.

```
parse-tree = [ (block+ mismatched-rbm?)? ]

where:
    block = text | element | verbatim

    where:
        text = {
            type: 'text',
            start, end, data
        }

        element = {
            type: 'element',
            start, end, data,
            children: [ lbm tag-name separator block* rbm ]
        }

        where:
            lbm = {
                type: 'left boundary marker',
                start, end, data,
                level
            }

            tag-name = {
                type: 'tag name',
                start, end, data
            }

            separator = {
                type: 'separator',
                start, end, data
            }

            rbm = {
                type: 'right boundary marker',
                start, end, data,
                level
            }

        verbatim = {
            type: 'verbatim',
            start, end, data,
            children: [ lvm text rvm ]
        }

        where:
            lvm = {
              type: 'left verbatim marker',
              start, end, data,
              level
            }

            rvm = {
              type: 'right verbatim marker',
              start, end, data,
              level
            }

    mismatched-rbm = {
        type: 'mismatched right boundary marker',
        start, end, data
    } 
```

애들이 공통적으로 `start`, `end`, `data` 프로퍼티를 가집니다.

<table>
  <tr><th><code>start</code></th><td>입력 문자열에서의 시작 index (inclusive)</td></tr>
  <tr><th><code>end</code></th><td>입력 문자열에서의 끝 index (exclusive)</td></tr>
  <tr><th><code>data</code></th><td><code>input.substring(start, end)</code></td></tr>
</table>

#### AST의 형식

똑같은 근본 없는 언어.

```
ast = [ (block+ error?)? ]

where:
    block = text | element

    where:
        text = {
            type: 'text',
            text
        }

        element = {
            type: 'element',
            name, code,
            children: [ block* ]
        }

    error = {
        type: 'error',
        text
    } 
```

`verbatim`이 `text`가 되고(marker들은 없어짐) `mismatched-rbm`이 `error`가 됩니다. `element.name`이 요소 이름이고 `element.code`가 m42kup 코드.

### `m42kup.cascade(options)`

현재의 글로벌 옵션을 보존하면서 `options`로 적당히 덮어 씁니다. `m42kup.cascade`나 `m42kup.set`을 한 번도 호출하지 않은 경우 `m42kup.set`과 효과가 같습니다.

**입력**
* `options` (`Object`): [렌더링 옵션](#렌더링-옵션)을 보세요.

**예시**
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

**입력**

* `options` (`Object`): [렌더링 옵션](#렌더링-옵션)을 보세요.

**예시**

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

**입력**

* `input` (`String`): M42kup 코드.
* `options` (`Object`): [렌더링 옵션](#렌더링-옵션)을 보세요. 글로벌 옵션을 cascade 합니다.

**출력**

렌더링 된 HTML(`String`)이 출력됩니다.

**예시**

```js
m42kup.render('[greet [**M42kup]]!', {
    tags: {
        greet: content => {
            // Converts content type to HTML
            content = m42kup.renderer.htmlFilter(content);
            return m42kup.renderer.html(`Hello ${content.html}`);
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
module.exports = m42kup => {
    options = {...};
    m42kup.set(options);
};
```

**적용 방법**
```js
require('/path/to/config/m42kup.config')(m42kup);
```

`m42kup.config.js`를 `require` 한 이후부터 글로벌 옵션이 적용됩니다.

### 클라이언트 사이드에서 글로벌 옵션을 설정해 주는 방법

#### 설정 파일을 만드는 방법

**`m42kup.config.js`**
```js
options = {...};
m42kup.set(options);
```

이후 다음과 같이 사용합니다.
```html
<script src="/path/to/m42kup/m42kup.js"></script>
<script src="/path/to/config/m42kup.config.js"></script>
```

`m42kup.config.js`는 `m42kup.js`가 해석된 이후 해석되어야 한다는 것에 주의하세요.

#### Webpack 하는 방법

**`entry.js`**
```js
const m42kup = require('m42kup');

options = {...};

m42kup.set(options);

module.exports = m42kup;
```

`library: "m42kup"`으로 `entry.js`를 `webpack` 해서 쓰면 될듯 (안해봄).

## License
[MIT](LICENSE)
