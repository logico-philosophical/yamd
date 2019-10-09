API
================

``m42kup.parser.input2pt(input)``
----------------------------------------

입력으로부터 파스 트리(parse tree)를 생성합니다.

**Parameters**

* ``input <String>``: 입력 문자열.

**Returns**

``<Object>`` 생성된 파스 트리. 형식은 `입출력 형식 <formats.html#parse-tree>`__ 참조.


``m42kup.parser.pt2ast(pt)``
----------------------------------

파스 트리로부터 AST(abstract syntax tree; 추상 구문 트리)를 생성합니다.

**Parameters**

* ``pt <Object>``: 파스 트리. 형식은 `입출력 형식 <formats.html#parse-tree>`__ 참조.

**Returns**

``<Object>`` 생성된 AST. 형식은 `입출력 형식 <formats.html#ast>`__ 참조.

``m42kup.renderer.ast2html(ast, options)``
----------------------------------------------

AST로부터 HTML을 렌더링 합니다.

**Parameters**

* ``ast <Object>``: AST. 형식은 `입출력 형식 <formats.html#ast>`__ 참조.

* ``options <Object>``: 렌더링 옵션. 글로벌 옵션을 cascade 함. 가능한 옵션은 `렌더링 옵션 <options.html>`__ 참조.

**Returns**

``<String>`` 렌더링 된 HTML.

``m42kup.renderer.escapeHtml(string)``
------------------------------------------------

평범한 escapeHTML 함수입니다.

.. code-block:: js

	var escapeHtml = s => s.replace(/[&<>"']/g, m => ({
		'&': '&amp;', '<': '&lt;', '>': '&gt;',
		'"': '&quot;', "'": '&#39;'
	})[m]);

**Parameters**

* ``string <String>``: 이스케이프 할 문자열.

**Returns**

``<String>`` HTML 이스케이프 된 문자열.

``m42kup.renderer.Element({name, display, render})``
-------------------------------------------------------

m42kup 요소 인스턴스를 생성합니다. ``new`` 키워드와 함께 사용하세요.

**Parameters**

* ``arguments[0].name <String>``: 요소 이름.

* ``arguments[0].display <"inline" | "leaf-block" | "container-block">``: 요소의 디스플레이 타입.

* ``arguments[0].render <Function>``: 렌더링 함수. ``text`` 또는 ``html`` 타입의 인자 하나와 렌더링 옵션을 받아 ``text`` 또는 ``html``\ 을 반환하거나 ``Error``\ 를 ``throw`` 해야 합니다.

	* ``text`` 타입은 다음과 같이 생겼습니다.

		.. code-block:: js

			{
			    type: 'text',
			    text: <String>
			}

	* ``html`` 타입은 다음과 같이 생겼습니다.

		.. code-block:: js
			
			{
				type: 'html',
				html: <String>
			}

	* ``throw``\ 된 것은 ``Error``\ 의 인스턴스여야 합니다.

	m42kup 코드 ``[*a < 3]``\ 을 예로 들어 보자면, 먼저

	.. code-block:: js

		{
		    type: 'text',
		    text: 'a < 3'
		}

	이 ``[*]``\ 에게 입력되는데, ``m42kup.renderer.htmlFilter``\ 가 적용되어서 타입이 ``html``\ 로 바뀝니다.

	.. code-block:: js

		{
		    type: 'html',
		    html: 'a &lt; 3'
		}


	이후 ``<i>``\ 와 ``</i>``\ 로 둘러싸인 값이 반환됩니다.

	.. code-block:: js

		{
		    type: 'html',
		    html: '<i>a &lt; 3</i>'
		}


	.. warning::

		``text`` 값을 ``html`` 값으로 잘못 사용하면 XSS 위협에 노출될 수 있습니다. 예를 들어

		.. code-block:: js

			{
			    type: 'text',
			    text: '<script>alert(1337)</script>'
			}


		위와 같은 데이터를 ``[*]`` 요소가 ``htmlFilter`` 없이 사용하여 ``html`` 타입으로 변환한다면

		.. code-block:: js

			{
			    type: 'html',
			    html: '<i><script>alert(1337)</script></i>'
			}


		위와 같은 출력이 발생하여 악의적 스크립트가 실행될 수 있습니다. 이를 예방하기 위하여 ``text``\ 와 ``html``\ 의 데이터 부는 ``text``\ 와 ``html``\ 로 다르게 레이블 되어 있습니다.

**Examples**

.. code-block:: js

	options.tags.greet = new m42kup.renderer.Element({
	    name: 'greet',
	    display: 'inline',
	    render: (content, options) => {
	        // Converts content type to HTML
	        content = m42kup.renderer.htmlFilter(content);
	        return {
	            type: 'html',
	            html: `Hello ${content.html}`
	        };
	    }
	});

``[greet.[*world]]``\ 라고 치면 Hello *world*\ 가 나옵니다.


``m42kup.renderer.htmlFilter(content)``
------------------------------------------------

``content``\ 의 타입을 ``html``\ 로 만들어 주는 함수입니다.

**Parameters**

* ``content <Object>``: HTML 렌더링 과정에서 생성되는 ``html``, ``text``, 또는 ``error`` 타입의 객체. `렌더링 옵션 <options.html>`__\ 에 설명이 있습니다.

**Throws**

* ``TypeError``: ``html``, ``text``, 또는 ``error`` 타입이 아닐 경우

**Returns**

``<Object>`` ``html`` 타입으로 변환된 객체.

``m42kup.highlighter.pt2hl(pt)``
------------------------------------------------

파스 트리로부터 구문 강조된 HTML을 생성합니다. 파스 트리 상의 특정 타입을 특정 클래스를 가지는 ``<span>``\ 으로 감싸는데 그 목록은 다음과 같습니다.

========================================= ==================================
타입                                          클래스
========================================= ==================================
``text``                                   ``m42kup-hl-tx``
``element``                                ``m42kup-hl-elem``
``left boundary marker``                   ``m42kup-hl-lbm``
``tag-name``                               ``m42kup-hl-tn``
``separator``                              ``m42kup-hl-sp``
``right boundary marker``                  ``m42kup-hl-rbm``
``verbatim``                               ``m42kup-hl-verb``
``left verbatim marker``                   ``m42kup-hl-lvm``
``right verbatim marker``                  ``m42kup-hl-rvm``
``mismatched right verbatim marker``       ``m42kup-hl-mrbm``
========================================= ==================================

스타일링 예시를 보려면 ``tests/client.html``\ 을 참고하세요.

**Parameters**

* ``pt <Object>``: 파스 트리. 형식은 `입출력 형식 <formats.html#parse-tree>`__ 참조.

**Returns**

``<String>`` 구문 강조된 HTML.


``m42kup.render(input, options)``
-----------------------------------

입력으로부터 HTML을 렌더링 합니다.

**Parameters**

* ``input <String>``: 입력 문자열.
* ``options <Object>``: 렌더링 옵션. 글로벌 옵션을 cascade 함. 가능한 옵션은 `렌더링 옵션 <options.html>`__ 참조.

**Returns**

``<String>`` 렌더링 된 HTML.

``m42kup.highlight(input)``
--------------------------------

입력 문자열로부터 구문 강조된 HTML을 생성합니다. 자세한 생성 방식은 |m42kup.highlighter.pt2hl|_ 참조.

.. |m42kup.highlighter.pt2hl| replace:: ``m42kup.highlighter.pt2hl(pt)``
.. _m42kup.highlighter.pt2hl: #m42kup-highlighter-pt2hl-pt

**Parameters**

* ``input <String>``: 입력 문자열.

**Returns**

``<String>`` 구문 강조된 HTML.

``m42kup.cascade(options)``
--------------------------------

현재의 글로벌 옵션을 보존하면서 ``options``\ 로 적당히 덮어 씁니다. ``m42kup.cascade``\ 나 ``m42kup.set``\ 을 한 번도 호출하지 않은 경우 ``m42kup.set``\ 과 효과가 같습니다.

**Parameters**

* ``options <Object>``: 가능한 옵션은 `렌더링 옵션 <options.html>`__ 참조.

**Returns**

undefined

**Examples**

.. code-block:: js

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

``m42kup.set(options)``
---------------------------

현재의 글로벌 옵션을 버리고 ``options``\ 로 설정합니다. ``m42kup.cascade``\ 나 ``m42kup.set``\ 을 한 번도 호출하지 않은 경우 ``m42kup.cascade``\ 와 효과가 같습니다.

``m42kup.set({})``\ 으로 글로벌 옵션을 없애버릴 수 있습니다.

**Parameters**

* ``options <Object>``: 가능한 옵션은 `렌더링 옵션 <options.html>`__ 참조.

**Returns**

undefined

**Examples**

.. code-block:: js

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