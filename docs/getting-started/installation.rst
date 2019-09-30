설치
======

npm에서 받기
----------------

npm에 올릴 예정입니다(`이슈 #2 <https://github.com/logico-philosophical/m42kup/issues/2>`_).

release에서 받기
------------------------

아직 릴리즈가 없습니다.

clone으로 최-신 버전 받기
----------------------------------

.. code-block:: bash

	~ $ git clone https://github.com/logico-philosophical/m42kup.git
	~ $ cd m42kup
	~/m42kup $ npm install

git이 설치되어 있어야 합니다.

테스트
~~~~~~

.. code-block:: bash

	~/m42kup $ node
	> m42kup = require('.')
	> m42kup.render('[*hi]')
	'<i>hi</i>'

npm으로 최-신 버전 받기
-------------------------------

이것도 git 저장소에서 가져오는데 ``node_modules`` 디렉터리로 들어간다는 점이 다릅니다.

.. code-block:: bash

	~ $ cd my-project-dir/
	~/my-project-dir $ npm install --save logico-philosophical/m42kup

역시 git이 설치되어 있어야 합니다. 이후

.. code-block:: js

	const m42kup = require('m42kup');

하여 사용하면 됩니다.