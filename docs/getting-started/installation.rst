설치
======

npm으로 최-신 버전 받기
-------------------------------

m42kup을 git 저장소에서 받아서 node.js 프로젝트의 ``node_modules`` 디렉터리에 저장합니다.

.. code-block:: bash

	~ $ cd my-project-dir/
	~/my-project-dir $ npm install --save logico-philosophical/m42kup

단 git이 설치되어 있어야 합니다. 이후

.. code-block:: js

	const m42kup = require('m42kup');

하여 사용하면 됩니다.

.. warning::

	이 프로젝트는 npm에 올려지지 않았으며 초기 개발 버전입니다(버전이 0.1.0으로 고정되어 있음). 공개 API가 안정되어 있지 않으므로 업데이트를 했더니 어느 날 갑자기 작동 방식이 바뀌거나 고장날 수 있습니다.

최-신 버전 clone 하기
----------------------------------

.. code-block:: bash

	~ $ git clone https://github.com/logico-philosophical/m42kup.git
	~ $ cd m42kup
	~/m42kup $ npm install

git이 설치되어 있어야 합니다. 아니면 GitHub에서 ZIP 파일 다운로드 옵션을 제공하므로 웹으로 다운로드 해도 됩니다. clone 후 ``npm install`` 을 해줘야 합니다.

**테스트**

.. code-block:: bash

	~/m42kup $ node
	> m42kup = require('.')
	> m42kup.render('[*hi]')
	'<i>hi</i>'