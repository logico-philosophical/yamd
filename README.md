<h1 align="center">yamd</h1>
<p align="center">yet another markdown alternative</p>
<p align="center">
  <a href="https://logico-philosophical.github.io/yamd/docs/build/index.html">docs</a> ·
  <a href="https://logico-philosophical.github.io/yamd/web/demo.html">demo</a>
</p>

[![npm](https://img.shields.io/npm/v/yamd)](https://www.npmjs.com/package/yamd)
[![Node.js CI](https://github.com/logico-philosophical/yamd/actions/workflows/test-and-build.yml/badge.svg)](https://github.com/logico-philosophical/yamd/actions/workflows/test-and-build.yml)
[![jsDelivr](https://data.jsdelivr.com/v1/package/npm/yamd/badge?style=rounded)](https://www.jsdelivr.com/package/npm/yamd)
[![GitHub](https://img.shields.io/github/license/logico-philosophical/yamd)](https://github.com/logico-philosophical/yamd/blob/master/LICENSE)

One problem of markdown is that it has all kinds of delimiters that conflict with each other, making it difficult to correctly apply complex formatting, so you just end up embedding the raw HTML. In order to mitigate this problem yamd introduces only two kinds of delimiters:

* **Brackets**: used to create all kinds of tags
  * `[*italic text]` becomes `<i>italic text</i>` in HTML, much like `*italic text*` in markdown
  * `[**bold text]` becomes `<b>bold text</b>` in HTML, much like `**bold text**` in markdown
* **Backticks**: used to prevent plain text from being formatted
  * `` `[*italic text]` `` becomes `[*italic text]` in HTML

yamd also allows you to easily create your own tags. Refer to the [documentation](https://logico-philosophical.github.io/yamd/docs/build/index.html) for more information. You can also try yamd on the [demo page](https://logico-philosophical.github.io/yamd/web/demo.html).

## Server-side usage

```bash
npm install yamd
```

```js
const yamd = require('yamd');

yamd.render('[*italic text]'); // <p><i>italic text</i></p>
```

## Client-side usage

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yamd@latest/web/yamd.default.css">
<script src="https://cdn.jsdelivr.net/npm/yamd@latest/dist/yamd.min.js"></script>
```

```html
<script>
    yamd.render('[*italic text]'); // <p><i>italic text</i></p>
</script>
```
