# <img src="https://i.imgur.com/WiJuFSK.png" height="48" style="vertical-align: middle">.js

[![Documentation Status](https://readthedocs.org/projects/m42kup/badge/?version=latest)](https://m42kup.readthedocs.io/en/latest/?badge=latest)
[![GitHub](https://img.shields.io/github/license/logico-philosophical/m42kup)](https://github.com/logico-philosophical/m42kup/blob/master/LICENSE)

JavaScript로 미완성 마크업 언어인 [m42kup](https://github.com/logico-philosophical/m42kup/wiki)의 HTML 렌더러를 구현한 것입니다. API가 대단히 불안정하니 조심하세요.

* [Read the Docs](https://m42kup.readthedocs.io/en/latest/?badge=latest)
* [클라이언트 사이드 렌더러 테스트 페이지(bleeding edge)](https://logico-philosophical.github.io/m42kup/tests/client.html)

## 특징

* m42kup의 구문론적 특성상 새로운 태그를 도입하기가 쉽습니다. 옵션을 통해 원하는 태그를 추가해서 사용할 수 있습니다.
  * [`highlight.js`](https://github.com/highlightjs/highlight.js) 등을 써서 구문 강조(syntax highlighting)를 위한 태그를 만들 수 있습니다.
  * [`KaTeX`](https://github.com/KaTeX/KaTeX) 등을 써서 수식 렌더링을 위한 태그를 만들 수 있습니다.

## 설치

### 최-신 버전 clone 하기

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

### npm으로 최-신 버전 받기

이것도 git 저장소에서 가져오는데 `node_modules` 디렉터리로 들어간다는 점이 다릅니다.

```bash
~ $ cd my-project-dir/
~/my-project-dir $ npm install --save github:logico-philosophical/m42kup
```

역시 git이 설치되어 있어야 합니다. 이후

```js
const m42kup = require('m42kup');
```
하여 사용하면 됩니다.

## License
[MIT](LICENSE)