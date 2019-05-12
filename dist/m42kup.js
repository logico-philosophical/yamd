var m42kup =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var {\n\tgenerateParseTreeFromInput,\n\tgenerateASTFromParseTree\n} = __webpack_require__(/*! ./parser */ \"./src/parser.js\");\n\nvar {generateHTMLFromAST} = __webpack_require__(/*! ./renderer-html */ \"./src/renderer-html.js\");\n\nfunction render(input, options) {\n\tvar pipe = (...fns) => {\n\t\treturn arg => {\n\t\t\tfns.forEach(fn => arg = fn(arg));\n\t\t\treturn arg;\n\t\t}\n\t};\n\n\tvar ast = pipe(\n\t\tgenerateParseTreeFromInput,\n\t\tgenerateASTFromParseTree\n\t)(input);\n\n\treturn generateHTMLFromAST(ast, options);\n}\n\nvar m42kup = {\n\tgenerateParseTreeFromInput,\n\tgenerateASTFromParseTree,\n\tgenerateHTMLFromAST,\n\trender\n};\n\nmodule.exports = m42kup;\n\n\n//# sourceURL=webpack://m42kup/./src/index.js?");

/***/ }),

/***/ "./src/parser.js":
/*!***********************!*\
  !*** ./src/parser.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function generateParseTreeFromInput(text) {\n\tvar state = {\n\t\tlevels: [],\n\t\tstack: []\n\t};\n\t\n\tfunction push(fragment) {\n\t\t// normalize text\n\t\tif (fragment.type == 'text'\n\t\t\t\t&& state.stack.length\n\t\t\t\t&& state.stack[state.stack.length - 1].type == 'text') {\n\t\t\tvar prepend = state.stack.pop();\n\t\t\tfragment = {\n\t\t\t\ttype: 'text',\n\t\t\t\tstart: prepend.start,\n\t\t\t\tend: fragment.end,\n\t\t\t\tdata: prepend.data + fragment.data\n\t\t\t};\n\t\t}\n\n\t\tif (fragment.type == 'right boundary marker') {\n\t\t\tvar buf = [fragment], tmp;\n\t\t\twhile (true) {\n\t\t\t\ttmp = state.stack.pop();\n\t\t\t\tif (!tmp) throw new Error('No lbm found');\n\t\t\t\tbuf.unshift(tmp);\n\t\t\t\tif (tmp.type == 'left boundary marker' && tmp.level == fragment.level) break;\n\t\t\t}\n\t\t\t\n\t\t\tvar elementStart = buf[0].start,\n\t\t\t\telementEnd = buf[buf.length - 1].end;\n\n\t\t\tfragment = {\n\t\t\t\ttype: 'element',\n\t\t\t\tstart: elementStart,\n\t\t\t\tend: elementEnd,\n\t\t\t\tdata: text.substring(elementStart, elementEnd),\n\t\t\t\tchildren: buf\n\t\t\t};\n\t\t}\n\t\t\n\t\tif (fragment.type == 'right verbatim marker') {\n\t\t\tvar buf = [fragment], tmp;\n\t\t\twhile (true) {\n\t\t\t\ttmp = state.stack.pop();\n\t\t\t\tif (!tmp) throw new Error('No lvm found');\n\t\t\t\tbuf.unshift(tmp);\n\t\t\t\tif (tmp.type == 'left verbatim marker' && tmp.level == fragment.level) break;\n\t\t\t}\n\t\t\t\n\t\t\tvar verbatimStart = buf[0].start,\n\t\t\t\tverbatimEnd = buf[buf.length - 1].end;\n\n\t\t\tfragment = {\n\t\t\t\ttype: 'verbatim',\n\t\t\t\tstart: verbatimStart,\n\t\t\t\tend: verbatimEnd,\n\t\t\t\tdata: text.substring(verbatimStart, verbatimEnd),\n\t\t\t\tchildren: buf\n\t\t\t};\n\t\t}\n\n\t\tstate.stack.push(fragment);\n\t}\n\t\n\t// main loop\n\tfor (var cur = 0; cur < text.length;) {\n\t\tif (text[cur] == '`') {\n\t\t\tvar lvmStart = cur;\n\t\t\tfor (cur++; cur < text.length; cur++) {\n\t\t\t\tif (text[cur] != '`') break;\n\t\t\t}\n\t\t\tvar lvmEnd = cur;\n\n\t\t\tpush({\n\t\t\t\ttype: 'left verbatim marker',\n\t\t\t\tstart: lvmStart,\n\t\t\t\tend: lvmEnd,\n\t\t\t\tdata: text.substring(lvmStart, lvmEnd),\n\t\t\t\tlevel: lvmEnd - lvmStart\n\t\t\t});\n\n\t\t\tstate.levels.push(-(lvmEnd - lvmStart));\n\t\t\t\n\t\t\tvar rvmFound = false, rvmStart, rvmEnd;\n\t\t\tfor (cur++; cur < text.length; cur++) {\n\t\t\t\tif (text[cur] == '`') {\n\t\t\t\t\tvar _rvmStart = cur;\n\t\t\t\t\tfor (cur++; cur < text.length; cur++) {\n\t\t\t\t\t\tif (text[cur] != '`') break;\n\t\t\t\t\t}\n\t\t\t\t\tvar _rvmEnd = cur;\n\n\t\t\t\t\tif (_rvmEnd - _rvmStart == lvmEnd - lvmStart) {\n\t\t\t\t\t\trvmFound = true;\n\t\t\t\t\t\t[rvmStart, rvmEnd] = [_rvmStart, _rvmEnd];\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tvar textStart = lvmEnd,\n\t\t\t\ttextEnd = rvmFound ? rvmStart : cur;\n\n\t\t\tpush({\n\t\t\t\ttype: 'text',\n\t\t\t\tstart: textStart,\n\t\t\t\tend: textEnd,\n\t\t\t\tdata: text.substring(textStart, textEnd)\n\t\t\t});\n\n\t\t\tif (rvmFound) {\n\t\t\t\tpush({\n\t\t\t\t\ttype: 'right verbatim marker',\n\t\t\t\t\tstart: rvmStart,\n\t\t\t\t\tend: rvmEnd,\n\t\t\t\t\tdata: text.substring(rvmStart, rvmEnd),\n\t\t\t\t\tlevel: rvmEnd - rvmStart\n\t\t\t\t});\n\n\t\t\t\tstate.levels.pop();\n\t\t\t}\n\t\t} else if (text[cur] == '[') {\n\t\t\tvar lbmStart = cur;\n\t\t\tfor (cur++; cur < text.length; cur++) {\n\t\t\t\tif (text[cur] != '[') break;\n\t\t\t}\n\t\t\tvar lbmEnd = cur;\n\n\t\t\tvar currentLevel = state.levels[state.levels.length - 1] || 0;\n\t\t\tif (lbmEnd - lbmStart < currentLevel) {\n\t\t\t\tpush({\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\tstart: lbmStart,\n\t\t\t\t\tend: lbmEnd,\n\t\t\t\t\tdata: text.substring(lbmStart, lbmEnd)\n\t\t\t\t});\n\t\t\t\tcontinue;\n\t\t\t}\n\t\t\t\n\t\t\tstate.levels.push(lbmEnd - lbmStart);\n\t\t\tpush({\n\t\t\t\ttype: 'left boundary marker',\n\t\t\t\tstart: lbmStart,\n\t\t\t\tend: lbmEnd,\n\t\t\t\tdata: text.substring(lbmStart, lbmEnd),\n\t\t\t\tlevel: lbmEnd - lbmStart\n\t\t\t});\n\t\t\t\n\t\t\t// excludes: '(', ',', ':', '[', ']', '`', '|'\n\t\t\t// this regex always matches something\n\t\t\tvar tagNameRegex = /^(?:(?:\\*{1,3}|={1,6}|\\${1,2}|;{1,3}|[!\"#$%&')*+\\-.\\/;<=>?@\\\\^_{}~]|[a-z][a-z0-9]*)|)/i,\n\t\t\t\ttagNameStart = cur,\n\t\t\t\ttagNameEnd = tagNameStart + text.substring(tagNameStart)\n\t\t\t\t\t\t.match(tagNameRegex)[0].length;\n\t\t\t\n\t\t\tpush({\n\t\t\t\ttype: 'tag name',\n\t\t\t\tstart: tagNameStart,\n\t\t\t\tend: tagNameEnd,\n\t\t\t\tdata: text.substring(tagNameStart, tagNameEnd)\n\t\t\t});\n\n\t\t\tcur = tagNameEnd;\n\n\t\t\tvar separatorRegex = /^(?:[ \\t|]|)/i,\n\t\t\t\tseparatorStart = cur,\n\t\t\t\tseparatorEnd = separatorStart\n\t\t\t\t\t+ text.substring(separatorStart)\n\t\t\t\t\t\t.match(separatorRegex)[0].length;\n\t\t\t\n\t\t\tpush({\n\t\t\t\ttype: 'separator',\n\t\t\t\tstart: separatorStart,\n\t\t\t\tend: separatorEnd,\n\t\t\t\tdata: text.substring(separatorStart, separatorEnd)\n\t\t\t});\n\n\t\t\tcur = separatorEnd;\n\t\t} else if (text[cur] == ']') {\n\t\t\tvar currentLevel = state.levels[state.levels.length - 1] || 0;\n\t\t\t\n\t\t\tif (currentLevel == 0) {\n\t\t\t\tvar rbmAtRootStart = cur;\n\t\t\t\tfor (cur++; cur < text.length; cur++) {\n\t\t\t\t\tif (text[cur] != ']') break;\n\t\t\t\t}\n\t\t\t\tvar rbmAtRootEnd = cur;\n\n\t\t\t\tpush({\n\t\t\t\t\ttype: 'mismatched right boundary marker',\n\t\t\t\t\tstart: rbmAtRootStart,\n\t\t\t\t\tend: rbmAtRootEnd,\n\t\t\t\t\tdata: text.substring(rbmAtRootStart, rbmAtRootEnd)\n\t\t\t\t});\n\t\t\t\tcontinue;\n\t\t\t}\n\n\t\t\tvar rbmStart = cur;\n\t\t\tfor (cur++; cur - rbmStart < currentLevel\n\t\t\t\t\t&& cur < text.length; cur++) {\n\t\t\t\tif (text[cur] != ']') break;\n\t\t\t}\n\t\t\tvar rbmEnd = cur;\n\n\t\t\tif (rbmEnd - rbmStart < currentLevel) {\n\t\t\t\tpush({\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\tstart: rbmStart,\n\t\t\t\t\tend: rbmEnd,\n\t\t\t\t\tdata: text.substring(rbmStart, rbmEnd)\n\t\t\t\t});\n\n\t\t\t\tcontinue;\n\t\t\t}\n\n\t\t\tpush({\n\t\t\t\ttype: 'right boundary marker',\n\t\t\t\tstart: rbmStart,\n\t\t\t\tend: rbmEnd,\n\t\t\t\tdata: text.substring(rbmStart, rbmEnd),\n\t\t\t\tlevel: rbmEnd - rbmStart\n\t\t\t});\n\n\t\t\tstate.levels.pop();\n\t\t} else /* none of '[', ']', '`' */ {\n\t\t\t// reduce text normalization overhead\n\t\t\tvar textStart = cur;\n\t\t\tfor (cur++; cur < text.length; cur++) {\n\t\t\t\tif (['[', ']', '`'].includes(text[cur])) break;\n\t\t\t}\n\t\t\tvar textEnd = cur;\n\t\t\tpush({\n\t\t\t\ttype: 'text',\n\t\t\t\tstart: textStart,\n\t\t\t\tend: textEnd,\n\t\t\t\tdata: text.substring(textStart, textEnd)\n\t\t\t});\n\t\t}\n\t}\n\t\n\t// close the unclosed\n\tfor (var i = state.levels.length - 1; i >= 0; i--) {\n\t\tvar type = state.levels[i] > 0\n\t\t\t\t? 'right boundary marker'\n\t\t\t\t: 'right verbatim marker';\n\t\tvar absLevel = state.levels[i] > 0\n\t\t\t\t? state.levels[i] : -state.levels[i];\n\n\t\tpush({\n\t\t\ttype: type,\n\t\t\tstart: text.length,\n\t\t\tend: text.length,\n\t\t\tdata: '',\n\t\t\tlevel: absLevel\n\t\t});\n\t}\n\n\treturn state.stack;\n}\n\nfunction generateASTFromParseTree(pt) {\n\tfunction recurse(pt) {\n\t\tvar ast = pt.map(e => {\n\t\t\tswitch (e.type) {\n\t\t\t\tcase 'text':\n\t\t\t\t\treturn {\n\t\t\t\t\t\ttype: 'text',\n\t\t\t\t\t\ttext: e.data\n\t\t\t\t\t};\n\t\t\t\tcase 'verbatim':\n\t\t\t\t\treturn {\n\t\t\t\t\t\ttype: 'text',\n\t\t\t\t\t\ttext: e.children[1].data\n\t\t\t\t\t};\n\t\t\t\tcase 'element':\n\t\t\t\t\treturn {\n\t\t\t\t\t\ttype: 'element',\n\t\t\t\t\t\tname: e.children[1].data,\n\t\t\t\t\t\tcode: e.data,\n\t\t\t\t\t\tchildren: recurse(e.children.slice(3, -1))\n\t\t\t\t\t};\n\t\t\t\tcase 'mismatched right boundary marker':\n\t\t\t\t\treturn {\n\t\t\t\t\t\ttype: 'error',\n\t\t\t\t\t\ttext: e.data\n\t\t\t\t\t};\n\t\t\t\tdefault:\n\t\t\t\t\tthrow new TypeError(`Unknown type: ${e.type}`);\n\t\t\t}\n\t\t});\n\n\t\treturn ast;\n\t};\n\n\treturn recurse(pt);\n}\n\nmodule.exports = {\n\tgenerateParseTreeFromInput,\n\tgenerateASTFromParseTree\n};\n\n\n//# sourceURL=webpack://m42kup/./src/parser.js?");

/***/ }),

/***/ "./src/renderer-html.js":
/*!******************************!*\
  !*** ./src/renderer-html.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * the data part of text and HTML objects are intentionally\n * labeled differently, in order to prevent mistakenly\n * using unescaped text data as HTML data, causing an XSS\n * vulnerability. */\nvar text = s => ({type: 'text', text: s}),\n\thtml = s => ({type: 'html', html: s});\n\nvar error = e => `<code class=\"error\">${escapeHtml(e)}</code>`;\n\nvar escapeHtml = s => s.replace(/[&<>\"']/g, m => ({\n\t'&': '&amp;', '<': '&lt;', '>': '&gt;',\n\t'\"': '&quot;', \"'\": '&#39;'\n})[m]);\n\nvar htmlFilter = e => {\n\tif (e.type == 'html') return e;\n\tif (e.type == 'text') return html(escapeHtml(e.text));\n\tif (e.type == 'error') return html(error(e.text));\n\t\n\tthrow new TypeError(`Cannot convert type ${e.type} to HTML`);\n};\n\nvar pipe = (...fns) => {\n\treturn arg => {\n\t\tfns.forEach(fn => arg = fn(arg));\n\t\treturn arg;\n\t}\n};\n\n/* default renderer functions */\nvar rf = {};\n\nrf['comment'] = r => text('');\n\nrf['entity'] = r => {\n\tif (r.type != 'text') {\n\t\tthrow new TypeError('Non-text input');\n\t}\n\n\tif(!/^([a-z]{1,50}|#[0-9]{1,10}|#x[0-9a-f]{1,10})$/i.test(r.text)) {\n\t\tthrow new SyntaxError('Invalid value');\n\t}\n\n\treturn html(`&${r.text};`);\n};\n\n\n[\n\t'b', 'blockquote', 'code', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'sup', 'sub'\n].forEach(name => rf[name] = pipe(htmlFilter, r => {\n\treturn html(`<${name}>${r.html}</${name}>`);\n}));\n\nrf['blockcode'] = pipe(htmlFilter, r => {\n\treturn html(`<pre><code>${r.html}</code></pre>`);\n});\n\nrf['bi'] = pipe(rf['b'], rf['i']);\n\n[\n\t'br', 'hr'\n].forEach(name => rf[name] = pipe(htmlFilter, r => {\n\treturn html(`<${name}>${r.html}`);\n}));\n\nrf['link'] = r => {\n\tif (r.type != 'text') {\n\t\tthrow new TypeError('Non-text input');\n\t}\n\tif (!/^(http:\\/\\/|https:\\/\\/)/.test(r.text)) {\n\t\tr.text = 'http://' + r.text;\n\t}\n\n\tr = htmlFilter(r);\n\treturn html(`<a href=\"${r.html}\">${r.html}</a>`);\n};\n\n[\n\t'ol', 'ul', 'li'\n].forEach(name => rf[name] = pipe(htmlFilter, r => {\n\treturn html(`<${name}>${r.html}</${name}>`);\n}));\n\n[\n\t'table', 'tr', 'td', 'th'\n].forEach(name => rf[name] = pipe(htmlFilter, r => {\n\treturn html(`<${name}>${r.html}</${name}>`);\n}));\n\n[\n\t'squote', 'dquote'\n].forEach(name => rf[name] = pipe(htmlFilter, r => {\n\tvar quotes = {\n\t\t'squote': ['\\u2018', '\\u2019'],\n\t\t'dquote': ['\\u201c', '\\u201d']\n\t};\n\n\treturn html(`${quotes[name][0]}${r.html}${quotes[name][1]}`);\n}));\n\nvar rfAliases = {\n\t'\"': 'dquote',\n\t'%': 'comment',\n\t'&': 'entity',\n\t\"'\": 'squote',\n\t'*': 'i',\n\t'**': 'b',\n\t'***': 'bi',\n\t';': 'code',\n\t';;': 'blockcode',\n\t'=': 'h1',\n\t'==': 'h2',\n\t'===': 'h3',\n\t'====': 'h4',\n\t'=====': 'h5',\n\t'======': 'h6',\n\t'>': 'blockquote',\n\t'\\\\': 'br',\n\t'^': 'sup',\n\t'_': 'sub',\n\t'~': 'link'\n};\n\nfor (var rfAliasName in rfAliases) {\n\tif (!rf[rfAliases[rfAliasName]]) {\n\t\tthrow new TypeError(`rfAliases[${JSON.stringify(rfAliasName)}] aliases non-existing function ${rfAliases[rfAliasName]}`);\n\t}\n\trf[rfAliasName] = rf[rfAliases[rfAliasName]];\n}\n\nfunction generateHTMLFromAST(ast, options) {\n\tif (!options) options = {};\n\t\n\n\t// shallow copy rf2\n\tvar rf2 = {};\n\tfor (var k in rf) rf2[k] = rf[k];\n\n\t// merge options.rf to rf2\n\tif (options.rf) {\n\t\tfor (var k in options.rf) {\n\t\t\t// overwrite if function\n\t\t\tif (options.rf[k] instanceof Function) {\n\t\t\t\trf2[k] = options.rf[k];\n\t\t\t}\n\t\t\t// delete if false\n\t\t\telse if (options.rf[k] === false) {\n\t\t\t\tdelete rf2[k];\n\t\t\t}\n\t\t\t// throw error otherwise\n\t\t\telse {\n\t\t\t\tthrow new TypeError(`Unsupported value: options.rf[${JSON.stringify(k)}] == ${options.rf[k]}`);\n\t\t\t}\n\t\t}\n\t}\n\n\trf = rf2;\n\n\t// recurse top-down, render bottom-up\n\tvar recurse = el => {\n\t\tvar ret;\n\t\t\n\t\ttry {\n\t\t\tif (!(el.name in rf)) {\n\t\t\t\tthrow new TypeError('Undefined tag name');\n\t\t\t}\n\n\t\t\tel.children = el.children.map(c =>\n\t\t\t\tc.type == 'element' ? recurse(c) : c);\n\n\t\t\tif (el.children.every(c => c.type == 'text')) {\n\t\t\t\t// join as text\n\t\t\t\tel.render = {\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: el.children.map(c => c.text).join('')\n\t\t\t\t};\n\t\t\t} else {\n\t\t\t\t// join as HTML\n\t\t\t\tel.render = {\n\t\t\t\t\ttype: 'html',\n\t\t\t\t\thtml: el.children.map(htmlFilter)\n\t\t\t\t\t\t\t.map(c => c.html).join('')\n\t\t\t\t};\n\t\t\t}\n\n\t\t\tret = rf[el.name](el.render);\n\t\t} catch (err) {\n\t\t\tret = html(error(`[${el.name}]: ${err.message}: ${el.code}`));\n\t\t} finally {\n\t\t\treturn ret;\n\t\t}\n\t};\n\n\tfor (var i = 0; i < ast.length; i++) {\n\t\tif (ast[i].type == 'element') {\n\t\t\tast[i] = recurse(ast[i]);\n\t\t}\n\t}\n\n\treturn [\n\t\t'<span class=\"m42kup\">',\n\t\tast\n\t\t\t.map(htmlFilter)\n\t\t\t.map(c => c.html)\n\t\t\t.join(''),\n\t\t'</span>'\n\t].join('');\n}\n\nmodule.exports = {\n\tgenerateHTMLFromAST\n};\n\n\n//# sourceURL=webpack://m42kup/./src/renderer-html.js?");

/***/ })

/******/ });