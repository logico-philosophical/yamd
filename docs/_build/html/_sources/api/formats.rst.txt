입출력 형식
================

parse tree의 형식
----------------------

근본 없는 언어로 써 봤는데 알아볼 수 있을 거라 생각합니다.

.. code-block:: js

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

애들이 공통적으로 ``start``\ , ``end``\ , ``data`` 프로퍼티를 가집니다.

* ``start``: 입력 문자열에서의 시작 index (inclusive)
* ``end``: 입력 문자열에서의 끝 index (exclusive)
* ``data``: ``input.substring(start, end)``

AST의 형식
----------------

근본 없는 언어로 써 봤는데 알아볼 수 있을 거라 생각합니다.

.. code-block:: js

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

``verbatim``\ 이 ``text``\ 가 되고(marker들은 없어짐) ``mismatched-rbm``\ 이 ``error``\ 가 됩니다. ``element.name``\ 이 요소 이름이고 ``element.code``\ 가 m42kup 코드.