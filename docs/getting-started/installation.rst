설치
======

npm으로 최신 버전 받기
-------------------------------

.. code-block:: bash
	
	~/my-project-dir $ npm install m42kup

이후

.. code-block:: js

	const m42kup = require('m42kup');

와 같이 ``require`` 하여 사옹하면 됩니다.

기여를 위해 최-신 버전 clone 하기
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