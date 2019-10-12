렌더링 옵션
================

``m42kup.render(input, options)``\ 나 ``m42kup.cascade(options)``\ 나 ``m42kup.set(options)``\ 에서 쓸 수 있는 옵션은 다음과 같습니다.

.. code-block:: js

	options = {
	    tags: {
	        <tag name>: <m42kup.renderer.ElementClass instance>,
	        ...
	    },
	    hljs: <highlight.js object>,
	    katex: <katex object>
	}

``options.tags``
---------------------

태그 이름과 ``m42kup.renderer.ElementClass`` 인스턴스의 키-값 쌍입니다. 커스텀 요소를 정의하기 위해 사용됩니다.

``options.hljs``
----------------------

`highlight.js <https://github.com/highlightjs/highlight.js>`_\ 의 ``hljs`` 객체를 넘기면 ``[highlight]``, ``[;;;]``\ 에서 highlight.js를 써서 syntax highlighting을 합니다.

.. note::

	highlight.js 이외의 highlighter를 사용하려면 ``options.tags``\ 를 통해 ``[highlight]``, ``[;;;]``\ 를 재정의해야 합니다.

``options.katex``
----------------------

`KaTeX <https://github.com/KaTeX/KaTeX>`_\ 의 ``katex`` 객체를 넘기면 ``[math]``, ``[$]``, ``[displaymath]``, ``[$$]``\ 에서 KaTeX을 써서 수식 렌더링을 합니다.

.. note::
	KaTeX 이외의 수식 렌더러를 사용하려면 ``options.tags``\ 를 통해 ``[math]``, ``[$]``, ``[displaymath]``, ``[$$]``\ 를 재정의해야 합니다.