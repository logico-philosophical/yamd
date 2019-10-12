``m42kup.highlighter`` API
=============================

.. code-block :: js

    highlighter: {
    	pt2hl: <Function>
    }

``pt2hl(pt)``
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

``<string>`` 구문 강조된 HTML.