``m42kup.parser`` API
=======================

.. code-block :: js

    parser: {
        input2pt: <Function>,
        pt2ast: <Function>
    }

``input2pt(input)``
----------------------------------------

입력으로부터 파스 트리(parse tree)를 생성합니다.

**Parameters**

* ``input <string>``: 입력 문자열.

**Returns**

``<Object>`` 생성된 파스 트리. 형식은 `입출력 형식 <formats.html#parse-tree>`__ 참조.


``pt2ast(pt)``
----------------------------------

파스 트리로부터 AST(abstract syntax tree; 추상 구문 트리)를 생성합니다.

**Parameters**

* ``pt <Object>``: 파스 트리. 형식은 `입출력 형식 <formats.html#parse-tree>`__ 참조.

**Returns**

``<Object>`` 생성된 AST. 형식은 `입출력 형식 <formats.html#ast>`__ 참조.