렌더링 옵션
================

``m42kup.render(input, options)``\ 나 ``m42kup.cascade(options)``\ 나 ``m42kup.set(options)``\ 에서 쓸 수 있는 옵션은 다음과 같습니다.

.. code-block:: js

	options = {
	    tags: {
	        (tag_name): content => {
	            // return text or html, or throw error
	        },
	        ...
	    }
	}

이때 ``options.tags[(tag_name)]``\ 은 ``text`` 또는 ``html`` 타입의 인자 하나를 받아 ``text`` 또는 ``html``\ 을 반환하거나 ``Error``\ 를 ``throw`` 해야 합니다.

* ``text`` 타입은 다음과 같이 생겼습니다.

	.. code-block:: js

		{
		    type: 'text',
		    text: (text)
		}

* ``html`` 타입은 다음과 같이 생겼습니다.

	.. code-block:: js
		
		{
			type: 'html',
			html: (html)
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


``text`` 값을 ``html`` 값으로 잘못 사용하면 XSS 위협에 노출될 수 있습니다. 예를 들어

.. code-block:: js

	{
	    type: 'text',
	    text: '<script>alert(1337)</script>'
	}


위와 같은 데이터를 ``[*]`` 요소가 ``htmlFilter`` 없이 사용한다면

.. code-block:: js

	{
	    type: 'html',
	    html: '<i><script>alert(1337)</script></i>'
	}


위와 같은 출력이 발생하여 악의적 스크립트가 실행될 수 있습니다. 이를 예방하기 위하여 ``text``\ 와 ``html``\ 의 데이터 부는 ``text``\ 와 ``html``\ 로 다르게 레이블 되어 있습니다.

옵션의 예시
~~~~~~~~~~~~~~~~~~~

.. code-block:: js

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
