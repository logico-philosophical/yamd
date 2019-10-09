m42kup 찍먹 해보기
==============================

m42kup이란?
---------------

**m42kup**\ (‘m42kup’을 `leet <http://en.wikipedia.org/wiki/Leet>`__\ 로 쓴 것으로 ‘마크업’이라고 읽음)은 `m42.kr <http://m42.kr>`__\ 의 곳곳에서 사용하기 위하여 만들고 있는 마크업 언어입니다.

m42kup의 간추린 사용법
------------------------

.. raw:: html
	
	<style>
		table.table-raw pre {
			border: 1px #ccc solid;
			background-color: #fff;
			padding: .5em;
		}
	</style>
	<table class="docutils align-default table-raw">
		<thead>
			<tr>
				<th class="head"><p>m42kup 코드</p></th>
				<th class="head"><p>결과</p></th>
			</tr>
		</thead>
		<tbody>
			<tr><td><pre>[===Heading 3]</pre></td><td><h3>Heading 3</h3></td></tr>
			<tr><td><pre>[*italic text]</pre></td><td><p><i>italic text</i></p></td></tr>
			<tr><td><pre>[**bold text]</pre></td><td><p><b>bold text</b></p></td></tr>
			<tr><td><pre>[***bolditalic text]</pre></td><td><p><i><b>bolditalic text</b></i></p></td></tr>
			<tr><td><pre>[~example.com]</pre></td><td><p><a href="http://example.com">http://example.com</a></p></td></tr>
			<tr><td><pre>[&rarr]</pre></td><td><p>&rarr;</p></td></tr>
			<tr><td><pre>`[*not italic]`</pre></td><td><p>[*not italic]</p></td></tr>
			<tr><td><pre>[;`[*not italic]`]</pre></td><td><p><code class="docutils literal notranslate">[*not italic]</code></p></td></tr>
			<tr><td><pre>[;;`
	var three = 3,
	    four = 4;
	`]</pre></td><td><pre>var three = 3,
	    four = 4;</pre></td></tr>
			<tr><td><pre>[;;;`
	var three = 3,
	    four = 4;
	`]</pre></td><td><pre><b>var</b> <i>three</i> = 3,
	    <i>four</i> = 4;
	</pre></td></tr>
			<tr><td><pre>[$\sum_{n=1}^4 e^{in\pi}=0]</pre></td><td><img src="https://math.now.sh/?from=\textstyle\sum_{n=1}^4 e^{in\pi}=0" style="max-width:999px"></td></tr>
			<tr><td><pre>[$$\sum_{n=1}^4 e^{in\pi}=0]</pre></td><td><img src="https://math.now.sh/?from=\displaystyle\sum_{n=1}^4 e^{in\pi}=0" style="max-width:999px"></td></tr>
		</tbody>
	</table>

단, ``[;;;]``, ``[$]``, ``[$$]``\ 를 사용하기 위해서는 추가적인 설정이 필요합니다.

요소 써보기
---------------

모든 요소는 ``[``\ 로 시작해서 ``]``\ 로 끝납니다. ``[`` 다음에 요소의 이름을 쓰고 ``]`` 이전에 요소의 내용을 쓰면 됩니다. 예를 들어 다음과 같습니다.

.. raw:: html
	
	<table class="docutils align-default table-raw">
		<thead>
			<tr>
				<th class="head"><p>m42kup 코드</p></th>
				<th class="head"><p>결과</p></th>
			</tr>
		</thead>
		<tbody>
			<tr><td><pre>[*italic text]</pre></td><td><p><i>italic text</i></p></td></tr>
			<tr><td><pre>[**bold text]</pre></td><td><p><b>bold text</b></p></td></tr>
			<tr><td><pre>[***bolditalic text]</pre></td><td><p><i><b>bolditalic text</b></i></p></td></tr>
		</tbody>
	</table>

위의 표에서 ``[*]``, ``[**]``, ``[***]``\ 가 요소의 이름이 되며 각각 이탤릭, 볼드, 볼드이탤릭을 만듭니다. Markdown에서 ``*italic text*``, ``**bold text**``, ``***bolditalic text***``\ 이라고 작성하는 것과 같은 효과입니다.

요소의 이름과 내용은 적당히 분리되어 인식됩니다. 안 되는 경우 ``.``\ 으로 구분하면 됩니다.

HTML ``<h1>``–``<h6>``\ 을 쓰려면 ``[=]``–``[======]``\ 를 쓰면 됩니다.

.. raw:: html
	
	<table class="docutils align-default table-raw">
		<thead>
			<tr>
				<th class="head"><p>m42kup 코드</p></th>
				<th class="head"><p>결과</p></th>
			</tr>
		</thead>
		<tbody>
			<tr><td><pre>[=Heading 1]</pre></td><td><h1>Heading 1</h1></td></tr>
			<tr><td><pre>[==Heading 2]</pre></td><td><h2>Heading 2</h2></td></tr>
			<tr><td><pre>[===Heading 3]</pre></td><td><h3>Heading 3</h3></td></tr>
			<tr><td><pre>[====Heading 4]</pre></td><td><h4>Heading 4</h4></td></tr>
			<tr><td><pre>[=====Heading 5]</pre></td><td><h5>Heading 5</h5></td></tr>
			<tr><td><pre>[======Heading 6]</pre></td><td><h6>Heading 6</h6></td></tr>
		</tbody>
	</table>

TeX 문법을 써서 수식을 작성할 수도 있습니다.

.. raw:: html
	
	<table class="docutils align-default table-raw">
		<thead>
			<tr>
				<th class="head"><p>m42kup 코드</p></th>
				<th class="head"><p>결과</p></th>
			</tr>
		</thead>
		<tbody>
			<tr><td><pre>[$\sum_{n=1}^4 e^{in\pi}=0]</pre></td><td><img src="https://math.now.sh/?from=\textstyle\sum_{n=1}^4 e^{in\pi}=0" style="max-width:999px"></td></tr>
			<tr><td><pre>[$$\sum_{n=1}^4 e^{in\pi}=0]</pre></td><td><img src="https://math.now.sh/?from=\displaystyle\sum_{n=1}^4 e^{in\pi}=0" style="max-width:999px"></td></tr>
		</tbody>
	</table>

``[$]``\ 는 textstyle 수식, ``[$$]``\ 는 displaystyle 수식을 만듭니다.

코드 블록을 만들 수도 있습니다.

.. raw:: html
	
	<table class="docutils align-default table-raw">
		<thead>
			<tr>
				<th class="head"><p>m42kup 코드</p></th>
				<th class="head"><p>결과</p></th>
			</tr>
		</thead>
		<tbody>
			<tr><td><pre>[;;;
	var three = 3,
	    four = 4;
	]</pre></td><td><pre><b>var</b> <i>three</i> = 3,
	    <i>four</i> = 4;
	</pre></td></tr>
		</tbody>
	</table>

직역문 써보기
------------------

어떤 부분을 코드로 인식되지 않게 하려면 `````\ 로 감싸면 됩니다.

.. raw:: html
	
	<table class="docutils align-default table-raw">
		<thead>
			<tr>
				<th class="head"><p>m42kup 코드</p></th>
				<th class="head"><p>결과</p></th>
			</tr>
		</thead>
		<tbody>
			<tr><td><pre>`[*not italic]`</pre></td><td><p>[*not italic]</p></td></tr>
		</tbody>
	</table>

이는 코드 블록을 작성할 때 유용하게 사용할 수 있습니다.

.. raw:: html
	
	<table class="docutils align-default table-raw">
		<thead>
			<tr>
				<th class="head"><p>m42kup 코드</p></th>
				<th class="head"><p>결과</p></th>
			</tr>
		</thead>
		<tbody>
			<tr><td><pre>[;;;`
	var [three, four] = [3, 4];
	`]</pre></td><td><pre><b>var</b> [<i>three</i>, <i>four</i>] = [3, 4];
	</pre></td></tr>
		</tbody>
	</table>

내용에 `````\ 가 포함된 경우 ```<``\ 와 ``>```\ 로 감싸면 됩니다. 내용에 ``>```\ 가 포함된 경우 ```<<``\ 와 ``>>```\ 로 감싸면 됩니다. ``<``\ 랑 ``>``\ 를 늘릴 수 있습니다. 내용을 ``<``\ 로 시작하려면 ``.<``\ 로 시작하면 됩니다.

.. raw:: html
	
	<table class="docutils align-default table-raw">
		<thead>
			<tr>
				<th class="head"><p>m42kup 코드</p></th>
				<th class="head"><p>결과</p></th>
			</tr>
		</thead>
		<tbody>
			<tr><td><pre>`<`>`</pre></td><td><p>`</p></td></tr>
			<tr><td><pre>`<<`<`>`>>`</pre></td><td><p>`<`>`</p></td></tr>
			<tr><td><pre>`.&lt;script&gt;`</pre></td><td><p>&lt;script&gt;</p></td></tr>
			<tr><td><pre>`.script`</pre></td><td><p>.script</p></td></tr>
		</tbody>
	</table>