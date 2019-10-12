``m42kup.renderer`` API
=========================

.. raw:: html

	<style>
		code {
			white-space: pre-wrap!important;
		}
	</style>

.. code-block :: js
	
    renderer: {
        ast2nt: <Function>,
        TextNode: <Function>,
        HtmlNode: <Function>,
        ErrorNode: <Function>,
        ElementClass: <Function>,
        Element: <Function>
    }

``ast2nt(ast, options)``
----------------------------------------------

AST로부터 노드의 트리를 만듭니다.

**Parameters**

* ``ast <Object>``: AST. 형식은 `입출력 형식 <formats.html#ast>`__ 참조.

* ``options <Object>``: 렌더링 옵션. 글로벌 옵션을 cascade 함. 가능한 옵션은 `렌더링 옵션 <options.html>`__ 참조.

**Returns**

``<Element>`` 노드 트리. 형식은 ``Element`` 참조.

``Node()``
----------------------------

노드 트리에서 사용되는 노드 클래스를 구현합니다. 딱히 하는 것은 없음.

**Inherited by**

* ``TextNode``
* ``HtmlNode``
* ``ErrorNode``
* ``Element``

``TextNode(text)``
---------------------

노드 트리에서 텍스트를 표현하는 클래스입니다. ``new`` 키워드와 함께 사용하세요.

.. note::

	``<ElementClass>.render``\ 의 반환값을 만들기 위해서는 ``Element.prototype.text``\ 를 쓰세요.

**Parameters**

* ``text <string>``: 텍스트.

**Inherits**

* ``Node``


``HtmlNode({html, display})``
----------------------------------

노드 트리에서 HTML을 표현하는 클래스입니다. ``new`` 키워드와 함께 사용하세요.

.. note::

	``<ElementClass>.render``\ 의 반환값을 만들기 위해서는 ``<Element>.html``\ 을 쓰세요.

**Inherits**

* ``Node``

``ErrorNode({message, code})``
------------------------------------

노드 트리에서 에러를 표현하는 클래스입니다. ``new`` 키워드와 함께 사용하세요.

.. note::

	``<ElementClass>.render``\ 의 반환값을 만들기 위해서는 ``<Element>.error``\ 를 쓰세요.

**Inherits**

* ``Node``

``ElementClass({name, display, render})``
------------------------------------------------------------

새로운 m42kup 요소 종류를 만듭니다. ``new`` 키워드와 함께 사용하세요.

**Parameters**

* ``arguments[0].name <string>``: 요소 이름.
* ``arguments[0].display <"inline" | "leaf-block" | "container-block">``: 요소의 디스플레이 타입.
* ``arguments[0].render <Function (element <Element>, options <Object>) => <TextNode | HtmlNode | ErrorNode>>``: 렌더링 함수. 렌더링 할 ``Element``\ (이름이 해당 ``ElementClass``\ 와 같음)와 렌더링 옵션을 입력받아 ``TextNode``, ``HtmlNode``, ``ErrorNode`` 중 하나를 반환합니다.

**Examples**

.. code-block:: js

	var i = new ElementClass({
	    name: 'i',
	    display: 'inline',
	    render: (el, options) => {
	        return el.html(`<i>${el.innerHtml}</i>`);
	    }
	});


``Element({name, display, render, code, children, options})``
--------------------------------------------------------------------------------

노드 트리에서 텍스트를 표현하는 클래스입니다. 이걸 직접 생성하는 것은 현재 지원하지 않고 내부적으로 ``ElementClass``\ 로부터 생성됩니다.

**Inherits**

* ``Node``

``Element.prototype.text(text)``
----------------------------------

``TextNode``\ 를 반환하고 싶을 때 사용합니다.

**Examples**

.. code-block:: js

	// asdf -> fdsa
	var reverse = new ElementClass({
	    name: 'reverse',
	    display: 'inline',
	    render: (el, options) => {
	        if (!el.innerIsText)
	            return el.error('Non-text input');

	        return el.text(el.innerText.split('').reverse().join());
	    }
	});

``Element.prototype.html(html)``
----------------------------------

``HtmlNode``\ 를 반환하고 싶을 때 사용합니다. ``<Element>.html(...)`` 형태로 사용하세요.

**Examples**

.. code-block:: js

	// <i>...</i>
	var i = new ElementClass({
	    name: 'i',
	    display: 'inline',
	    render: (el, options) => {
	        return el.html(`<i>${el.innerHtml}</i>`);
	    }
	});

``Element.prototype.error(message)``
--------------------------------------

``ErrorNode``\ 를 반환하고 싶을 때 사용합니다. ``<Element>.error(...)`` 형태로 사용하세요.

**Examples**

.. code-block:: js

	// asdf -> fdsa
	var reverse = new ElementClass({
	    name: 'reverse',
	    display: 'inline',
	    render: (el, options) => {
	        if (!el.innerIsText)
	            return el.error('Non-text input');

	        return el.text(el.innerText.split('').reverse().join());
	    }
	});

``Element.prototype.escapeHtml(string)``
-------------------------------------------

평범한 escapeHTML 함수입니다.

**Parameters**

* ``string <string>``: 이스케이프 할 문자열.

**Returns**

``<string>`` HTML 이스케이프 된 문자열.

``<Element>``\ 가 갖는 속성
-----------------------------

* ``<Element>.name <string>``: 요소의 이름.
* ``<Element>.children <Node[]>``: 요소의 자식 노드 리스트.
* ``<Element>.display <"inline" | "leaf-block" | "container-block">``: 요소의 디스플레이 타입.
* ``<Element>.code <string>``: 요소의 m42kup 코드.
* ``<Element>.isError <boolean>``: 렌더링 결과 에러가 났는지 여부.

	.. warning::

		렌더링 되기 위해 인자로 넘겨진 ``Element`` 인스턴스의 경우 렌더링 되기 전이므로 ``isError`` 속성을 사용할 수 없습니다.

* ``<Element>.errorMessage <string>``: 렌더링 결과 에러가 났을 경우 에러 메시지. 아니면 ``null``.

	.. warning::

		렌더링 되기 위해 인자로 넘겨진 ``Element`` 인스턴스의 경우 렌더링 되기 전이므로 ``errorMessage`` 속성을 사용할 수 없습니다.

* ``<Element>.innerIsText <boolean>``: 내부 컨텐트가 텍스트로 인식될 수 있는지 여부.
* ``<Element>.innerText <string>``: 텍스트 형태의 내부 컨텐트. ``<Element>.innerIsText == false``\ 일 경우 ``null``.
* ``<Element>.innerHtml <string>``: HTML 형태의 내부 컨텐트. 내부 컨텐트의 타입과 관련 없이 항상 제공됩니다.
* ``<Element>.outerIsText <boolean>``: 렌더링 결과가 텍스트로 인식될 수 있는지 여부.

	.. warning::

		렌더링 되기 위해 인자로 넘겨진 ``Element`` 인스턴스의 경우 렌더링 되기 전이므로 ``outerIsText`` 속성을 사용할 수 없습니다.

* ``<Element>.outerText <string>``: 텍스트 형태의 렌더링 결과. ``<Element>.outerIsText == false``\ 일 경우 ``null``.

	.. warning::

		렌더링 되기 위해 인자로 넘겨진 ``Element`` 인스턴스의 경우 렌더링 되기 전이므로 ``outerText`` 속성을 사용할 수 없습니다.

* ``<Element>.outerHtml <string>``: HTML 형태의 렌더링 결과. 렌더링 결과의 타입과 관련 없이 항상 제공됩니다.

	.. warning::

		렌더링 되기 위해 인자로 넘겨진 ``Element`` 인스턴스의 경우 렌더링 되기 전이므로 ``outerHtml`` 속성을 사용할 수 없습니다.