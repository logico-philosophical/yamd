꿀팁
========

Node.js에서 글로벌 옵션을 설정해 주는 방법
----------------------------------------------------

**m42kup.config.js**

.. code-block:: js

	module.exports = m42kup => {
	    options = {...};
	    m42kup.set(options);
	};

**적용 방법**

.. code-block:: js

	require('/path/to/config/m42kup.config')(m42kup);

``m42kup.config.js``\ 를 ``require`` 한 이후부터 글로벌 옵션이 적용됩니다.

클라이언트 사이드에서 글로벌 옵션을 설정해 주는 방법
---------------------------------------------------------------

설정 파일을 만드는 방법
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**m42kup.config.js**

.. code-block:: js

	options = {...};
	m42kup.set(options);

이후 다음과 같이 사용합니다.

.. code-block:: html

	<script src="/path/to/m42kup/m42kup.js"></script>
	<script src="/path/to/config/m42kup.config.js"></script>

``m42kup.config.js``\ 는 ``m42kup.js``\ 가 해석된 이후 해석되어야 한다는 것에 주의하세요.

Webpack 하는 방법
~~~~~~~~~~~~~~~~~~~~~~~~

**entry.js**

.. code-block:: js

	const m42kup = require('m42kup');

	options = {...};

	m42kup.set(options);

	module.exports = m42kup;

``library: "m42kup"``\ 으로 ``entry.js``\ 를 ``webpack`` 해서 쓰면 될듯 (안해봄).