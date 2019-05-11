# M42kup

JavaScript로 [M42kup](https://github.com/logico-philosophical/m42kup/wiki)의 HTML 렌더러를 구현한 것입니다. 아직 만들고 있음.  
[클라이언트 사이드 렌더러 테스트 페이지(bleeding edge)](https://logico-philosophical.github.io/m42kup/tests/client.html)

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
> m42kup = require('./index')
> m42kup.render('[*hi]')
'<span class="m42kup"><i>hi</i></span>'
```

## API (불안정)

### `m42kup.render(input)`

#### 입력
* `input`(`String`): M42kup 코드.

#### 출력
렌더링 된 HTML(`String`)이 출력됩니다. `<span class="m42kup">`이랑 `</span>`으로 감싸져 있음.

#### 입출력 예시
```bash
> m42kup.render('[*hi]')
'<span class="m42kup"><i>hi</i></span>'
```

## License
[MIT](LICENSE)
