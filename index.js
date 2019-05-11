(() => {

var katex, hljs;

if (typeof require != 'undefined') {
	katex = require('katex');
	hljs = require('highlight.js');
} else {
	katex = window.katex;
	hljs = window.hljs;
}

function generateParseTreeFromInput(text) {
	var state = {
		levels: [],
		stack: []
	};
	
	function push(fragment) {
		// normalize text
		if (fragment.type == 'text'
				&& state.stack.length
				&& state.stack[state.stack.length - 1].type == 'text') {
			var prepend = state.stack.pop();
			fragment = {
				type: 'text',
				start: prepend.start,
				end: fragment.end,
				data: prepend.data + fragment.data
			};
		}

		if (fragment.type == 'right boundary marker') {
			var buf = [fragment], tmp;
			while (true) {
				tmp = state.stack.pop();
				if (!tmp) throw new Error('No lbm found');
				buf.unshift(tmp);
				if (tmp.type == 'left boundary marker' && tmp.level == fragment.level) break;
			}
			
			var elementStart = buf[0].start,
				elementEnd = buf[buf.length - 1].end;

			fragment = {
				type: 'element',
				start: elementStart,
				end: elementEnd,
				data: text.substring(elementStart, elementEnd),
				children: buf
			};
		}
		
		if (fragment.type == 'right verbatim marker') {
			var buf = [fragment], tmp;
			while (true) {
				tmp = state.stack.pop();
				if (!tmp) throw new Error('No lvm found');
				buf.unshift(tmp);
				if (tmp.type == 'left verbatim marker' && tmp.level == fragment.level) break;
			}
			
			var verbatimStart = buf[0].start,
				verbatimEnd = buf[buf.length - 1].end;

			fragment = {
				type: 'verbatim',
				start: verbatimStart,
				end: verbatimEnd,
				data: text.substring(verbatimStart, verbatimEnd),
				children: buf
			};
		}

		state.stack.push(fragment);
	}
	
	// main loop
	for (var cur = 0; cur < text.length;) {
		if (text[cur] == '`') {
			var lvmStart = cur;
			for (cur++; cur < text.length; cur++) {
				if (text[cur] != '`') break;
			}
			var lvmEnd = cur;

			push({
				type: 'left verbatim marker',
				start: lvmStart,
				end: lvmEnd,
				data: text.substring(lvmStart, lvmEnd),
				level: lvmEnd - lvmStart
			});

			state.levels.push(-(lvmEnd - lvmStart));
			
			var rvmFound = false, rvmStart, rvmEnd;
			for (cur++; cur < text.length; cur++) {
				if (text[cur] == '`') {
					var _rvmStart = cur;
					for (cur++; cur < text.length; cur++) {
						if (text[cur] != '`') break;
					}
					var _rvmEnd = cur;

					if (_rvmEnd - _rvmStart == lvmEnd - lvmStart) {
						rvmFound = true;
						[rvmStart, rvmEnd] = [_rvmStart, _rvmEnd];
						break;
					}
				}
			}

			var textStart = lvmEnd,
				textEnd = rvmFound ? rvmStart : cur;

			push({
				type: 'text',
				start: textStart,
				end: textEnd,
				data: text.substring(textStart, textEnd)
			});

			if (rvmFound) {
				push({
					type: 'right verbatim marker',
					start: rvmStart,
					end: rvmEnd,
					data: text.substring(rvmStart, rvmEnd),
					level: rvmEnd - rvmStart
				});

				state.levels.pop();
			}
		} else if (text[cur] == '[') {
			var lbmStart = cur;
			for (cur++; cur < text.length; cur++) {
				if (text[cur] != '[') break;
			}
			var lbmEnd = cur;

			var currentLevel = state.levels[state.levels.length - 1] || 0;
			if (lbmEnd - lbmStart < currentLevel) {
				push({
					type: 'text',
					start: lbmStart,
					end: lbmEnd,
					data: text.substring(lbmStart, lbmEnd)
				});
				continue;
			}
			
			state.levels.push(lbmEnd - lbmStart);
			push({
				type: 'left boundary marker',
				start: lbmStart,
				end: lbmEnd,
				data: text.substring(lbmStart, lbmEnd),
				level: lbmEnd - lbmStart
			});
			
			// excludes: '(', ',', ':', '[', ']', '`', '|'
			// this regex always matches something
			var tagNameRegex = /^(?:(?:\*{1,3}|={1,6}|\${1,2}|;{1,3}|[!"#$%&')*+\-.\/;<=>?@\\^_{}~]|[a-z][a-z0-9]*)|)/i,
				tagNameStart = cur,
				tagNameEnd = tagNameStart + text.substring(tagNameStart)
						.match(tagNameRegex)[0].length;
			
			push({
				type: 'tag name',
				start: tagNameStart,
				end: tagNameEnd,
				data: text.substring(tagNameStart, tagNameEnd)
			});

			cur = tagNameEnd;

			var separatorRegex = /^(?:[ \t|]|)/i,
				separatorStart = cur,
				separatorEnd = separatorStart
					+ text.substring(separatorStart)
						.match(separatorRegex)[0].length;
			
			push({
				type: 'separator',
				start: separatorStart,
				end: separatorEnd,
				data: text.substring(separatorStart, separatorEnd)
			});

			cur = separatorEnd;
		} else if (text[cur] == ']') {
			var currentLevel = state.levels[state.levels.length - 1] || 0;
			
			if (currentLevel == 0) {
				var rbmAtRootStart = cur;
				for (cur++; cur < text.length; cur++) {
					if (text[cur] != ']') break;
				}
				var rbmAtRootEnd = cur;

				push({
					type: 'mismatched right boundary marker',
					start: rbmAtRootStart,
					end: rbmAtRootEnd,
					data: text.substring(rbmAtRootStart, rbmAtRootEnd)
				});
				continue;
			}

			var rbmStart = cur;
			for (cur++; cur - rbmStart < currentLevel
					&& cur < text.length; cur++) {
				if (text[cur] != ']') break;
			}
			var rbmEnd = cur;

			if (rbmEnd - rbmStart < currentLevel) {
				push({
					type: 'text',
					start: rbmStart,
					end: rbmEnd,
					data: text.substring(rbmStart, rbmEnd)
				});

				continue;
			}

			push({
				type: 'right boundary marker',
				start: rbmStart,
				end: rbmEnd,
				data: text.substring(rbmStart, rbmEnd),
				level: rbmEnd - rbmStart
			});

			state.levels.pop();
		} else /* none of '[', ']', '`' */ {
			// reduce text normalization overhead
			var textStart = cur;
			for (cur++; cur < text.length; cur++) {
				if (['[', ']', '`'].includes(text[cur])) break;
			}
			var textEnd = cur;
			push({
				type: 'text',
				start: textStart,
				end: textEnd,
				data: text.substring(textStart, textEnd)
			});
		}
	}
	
	// close the unclosed
	for (var i = state.levels.length - 1; i >= 0; i--) {
		var type = state.levels[i] > 0
				? 'right boundary marker'
				: 'right verbatim marker';
		var absLevel = state.levels[i] > 0
				? state.levels[i] : -state.levels[i];

		push({
			type: type,
			start: text.length,
			end: text.length,
			data: '',
			level: absLevel
		});
	}

	return state.stack;
};

function generateASTFromParseTree(pt) {
	function recurse(pt) {
		var ast = pt.map(e => {
			switch (e.type) {
				case 'text':
					return {
						type: 'text',
						text: e.data
					};
				case 'verbatim':
					return {
						type: 'text',
						text: e.children[1].data
					};
				case 'element':
					return {
						type: 'element',
						name: e.children[1].data,
						code: e.data,
						children: recurse(e.children.slice(3, -1))
					};
				case 'mismatched right boundary marker':
					return {
						type: 'error',
						text: e.data
					};
				default:
					throw new TypeError(`Unknown type: ${e.type}`);
			}
		});

		return ast;
	};

	return recurse(pt);
};

function generateHTMLFromAST(ast) {
	// the data part of text and HTML objects are intentionally
	// labeled differently, in order to prevent mistakenly
	// using unescaped text data as HTML data, causing an XSS
	// vulnerability.
	var text = s => ({type: 'text', text: s});
	var html = s => ({type: 'html', html: s});
	var error = e => `<code class="error">${escapeHtml(e)}</code>`;
	var escapeHtml = s => s.replace(/[&<>"']/g, m => ({
		'&': '&amp;', '<': '&lt;', '>': '&gt;',
		'"': '&quot;', "'": '&#39;'
	})[m]);
	var htmlFilter = e => {
		if (e.type == 'html') return e;
		if (e.type == 'text') return html(escapeHtml(e.text));
		if (e.type == 'error') return html(error(e.text));
		
		throw new TypeError(`Cannot convert type ${e.type} to HTML`);
	};
	var pipe = (...fns) => {
		return arg => {
			fns.forEach(fn => arg = fn(arg));
			return arg;
		}
	};

	var rf = {};

	rf['comment'] = r => text('');

	rf['entity'] = r => {
		if (r.type != 'text') {
			throw new TypeError('entity: Non-text input');
		}

		if(!/^([a-z]{1,50}|#[0-9]{1,10}|#x[0-9a-f]{1,10})$/i.test(r.text)) {
			throw new SyntaxError('entity: invalid value');
		}

		return html(`&${r.text};`);
	};

	rf['highlight'] = r => {
		if (r.type != 'text') {
			throw new TypeError('highlight: Non-text input');
		}

		var commonLangs = [
			'apache', 'bash', 'coffeescript', 'cpp', 'cs', 'css', 'diff', 'http', 'ini', 'java', 'javascript', 'json', 'makefile', 'xml', 'markdown', 'nginx', 'objectivec', 'perl', 'php', 'python', 'ruby', 'sql'
		];
		
		return pipe(
			r => text(r.text.replace(/(^[ \t]*\n)|(\n[ \t]*$)/g, '')),
			r => html(hljs.highlightAuto(r.text, commonLangs).value),
			r => html(`<pre class="hljs"><code>${r.html}\n</code></pre>`)
		)(r);
	};

	['displaymath', 'math'].forEach(name => rf[name] = r => {
		if (r.type != 'text') {
			throw new TypeError(`${name}: Non-text input`);
		}
		return html(katex.renderToString(r.text, {
			throwOnError: false,
			displayMode: name == 'displaymath',
			strict: 'error'
		}));
	});

	[
		'b', 'blockquote', 'code', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'sup', 'sub'
	].forEach(name => rf[name] = pipe(htmlFilter, r => {
		return html(`<${name}>${r.html}</${name}>`);
	}));

	rf['blockcode'] = pipe(htmlFilter, r => {
		return html(`<pre><code>${r.html}</code></pre>`);
	});
	
	rf['bi'] = pipe(rf['b'], rf['i']);

	[
		'br', 'hr'
	].forEach(name => rf[name] = pipe(htmlFilter, r => {
		return html(`<${name}>${r.html}`);
	}));

	rf['link'] = r => {
		if (r.type != 'text') {
			throw new TypeError('link: Non-text input');
		}
		if (!/^(http:\/\/|https:\/\/)/.test(r.text)) {
			r.text = 'http://' + r.text;
		}

		r = htmlFilter(r);
		return html(`<a href="${r.html}">${r.html}</a>`);
	};

	[
		'ol', 'ul', 'li'
	].forEach(name => rf[name] = pipe(htmlFilter, r => {
		return html(`<${name}>${r.html}</${name}>`);
	}));

	[
		'table', 'tr', 'td', 'th'
	].forEach(name => rf[name] = pipe(htmlFilter, r => {
		return html(`<${name}>${r.html}</${name}>`);
	}));

	[
		'squote', 'dquote'
	].forEach(name => rf[name] = pipe(htmlFilter, r => {
		var quotes = {
			'squote': ['\u2018', '\u2019'],
			'dquote': ['\u201c', '\u201d']
		};

		return html(`${quotes[name][0]}${r.html}${quotes[name][1]}`);
	}));
	
	var rfAliases = {
		'"': 'dquote',
		'$': 'math',
		'$$': 'displaymath',
		'%': 'comment',
		'&': 'entity',
		"'": 'squote',
		'*': 'i',
		'**': 'b',
		'***': 'bi',
		';': 'code',
		';;': 'blockcode',
		';;;': 'highlight',
		'=': 'h1',
		'==': 'h2',
		'===': 'h3',
		'====': 'h4',
		'=====': 'h5',
		'======': 'h6',
		'>': 'blockquote',
		'\\': 'br',
		'^': 'sup',
		'_': 'sub',
		'~': 'link'
	};
	
	for (var rfAliasName in rfAliases) {
		rf[rfAliasName] = rf[rfAliases[rfAliasName]];
	}

	// recurse top-down, render bottom-up
	var recurse = el => {
		var ret;
		
		try {
			if (!(el.name in rf)) {
				throw new TypeError(`undefined tag name "${el.name}"`);
			}

			el.children = el.children.map(c =>
				c.type == 'element' ? recurse(c) : c);

			if (el.children.every(c => c.type == 'text')) {
				// join as text
				el.render = {
					type: 'text',
					text: el.children.map(c => c.text).join('')
				};
			} else {
				// join as HTML
				el.render = {
					type: 'html',
					html: el.children.map(htmlFilter)
							.map(c => c.html).join('')
				};
			}

			ret = rf[el.name](el.render);
		} catch (err) {
			ret = html(error(`${err.message}: ${el.code}`));
		} finally {
			return ret;
		}
	};

	for (var i = 0; i < ast.length; i++) {
		if (ast[i].type == 'element') {
			ast[i] = recurse(ast[i]);
		}
	}

	return [
		'<span class="m42kup">',
		ast
			.map(htmlFilter)
			.map(c => c.html)
			.join(''),
		'</span>'
	].join('');
}

function render(input) {
	var pipe = (...fns) => {
		return arg => {
			fns.forEach(fn => arg = fn(arg));
			return arg;
		}
	};

	return pipe(
		generateParseTreeFromInput,
		generateASTFromParseTree,
		generateHTMLFromAST
	)(input);
}

var m42kup = {
	generateParseTreeFromInput,
	generateASTFromParseTree,
	generateHTMLFromAST,
	render
};

if (typeof module != 'undefined' && module.exports) {
	module.exports = m42kup;
} else if (typeof window != 'undefined') {
	window.m42kup = m42kup;
}

})();
