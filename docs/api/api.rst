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

**Example**

.. code-block:: js

	m42kup.render('[greet [**M42kup]]!', {
	    tags: {
	        greet: content => {
	            // Converts content type to HTML
	            content = m42kup.renderer.htmlFilter(content);
	            return m42kup.renderer.html(`Hello ${content.html}`);
	        }
	    }
	});

.. code-block:: html

	Hello <b>M42kup</b>!

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

**Example**

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

**Example**

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