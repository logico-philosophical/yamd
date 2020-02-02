'use strict';

const escapeHtml = s => (s + '').replace(/[&<>"']/g, m => ({
	'&': '&amp;', '<': '&lt;', '>': '&gt;',
	'"': '&quot;', '\'': '&#39;'
})[m]);

function Node() {
}

function extendNode(C) {
	C.prototype = Object.create(Node.prototype);
	Object.defineProperty(C.prototype, 'constructor', {
		value: C,
		enumerable: false,
		writable: true
	});
}

/*
 * the data part of TextNode and HtmlNode instances are intentionally
 * labeled differently, in order to prevent mistakenly
 * using unescaped text data as HTML data, which is an XSS
 * vulnerability.
 */
function TextNode(text) {
	if (typeof text != 'string')
		throw TypeError('text not string');

	this.text = text;
}

extendNode(TextNode);

TextNode.prototype.toString = function () {
	return this.toIndentedString(0);
};

TextNode.prototype.toIndentedString = function (level) {
	return '\t'.repeat(level) + `Text {${JSON.stringify(this.text)}}`;
};

function HtmlNode({html, display}) {
	if (typeof html != 'string')
		throw TypeError('html not string');

	if (!['inline', 'leaf-block', 'container-block'].includes(display))
		throw TypeError('arg0.display should be one of "inline", "leaf-block", or "container-block".');

	this.html = html;
	this.display = display;
}

extendNode(HtmlNode);

HtmlNode.prototype.toString = function () {
	return this.toIndentedString(0);
};

HtmlNode.prototype.toIndentedString = function (level) {
	var a = ['display'].map(k =>
		k + '=' + JSON.stringify(this[k])).join(' ');
	return '\t'.repeat(level) + `Html(${a}) {${JSON.stringify(this.html)}}`;
};

function ErrorNode({message, code}) {
	if (typeof message != 'string')
		throw TypeError('message not string');

	if (typeof code != 'string')
		throw TypeError('code not string');

	this.message = message;
	this.code = code;
}

extendNode(ErrorNode);

ErrorNode.prototype.toHtml = function () {
	return `<code class="m42kup-error" title="Error: ${escapeHtml(this.message)}">${escapeHtml(this.code)}</code>`;
};

ErrorNode.prototype.toString = function () {
	return this.toIndentedString(0);
};

ErrorNode.prototype.toIndentedString = function (level) {
	var a = ['message', 'code'].map(k =>
		k + '=' + JSON.stringify(this[k])).join(' ');
	return '\t'.repeat(level) + `Error(${a})`;
};

function ElementClass({name, display, render, split}) {
	if (!name) throw TypeError('You give arg0 a bad name');
	if (!['inline', 'leaf-block', 'container-block'].includes(display))
		throw TypeError('arg0.display should be one of "inline", "leaf-block", or "container-block".');
	if (!(render instanceof Function))
		throw TypeError('arg0.render should be a function');

	[this.name, this.display] = [name, display];

	this.render = (el, options) => {
		if (!(el instanceof Element))
			throw TypeError('arg0 should be an instance of m42kup.renderer.Element');
		return render(el, options);
	};

	if (typeof split != 'undefined') {
		if (typeof split == 'string') split = [split];

		if (!(split instanceof Array))
			throw TypeError('arg0.split should be either undefined, a string, or an array');

		if (!split.length)
			throw TypeError('arg0.split.length == 0');

		this.split = split;
	}
}

ElementClass.prototype.instantiate = function ({code, attributes, children, options}) {
	if (!(this instanceof ElementClass)) {
		throw Error('ElementClass.prototype.instantiate should be called as a method of an ElementClass instance');
	}

	return new Element({
		name: this.name,
		display: this.display,
		render: this.render,
		code,
		attributes,
		children,
		split: this.split,
		options
	});
};

function Element({name, display, render, code, attributes, children, split, options}) {
	if (!name) throw TypeError('You give arg0 a bad name');
	if (!['inline', 'leaf-block', 'container-block'].includes(display))
		throw TypeError('arg0.display should be one of "inline", "leaf-block", or "container-block".');
	if (!(render instanceof Function))
		throw TypeError('arg0.render should be a function');
	if (typeof code != 'string') throw TypeError('You give arg0 a bad code');
	if (!(attributes instanceof Array)) throw TypeError('attributes should be an array');

	(() => {
		var foo = c => c instanceof Element
			|| c instanceof TextNode
			|| c instanceof ErrorNode
			|| ((c instanceof Array) && c.every(foo));

		if (!children.every(foo))
			throw TypeError('All arg0.children should either be an Element, a TextNode, or an ErrorNode');
	})();

	if (typeof split != 'undefined') {
		if (typeof split == 'string') split = [split];

		if (!(split instanceof Array))
			throw TypeError('arg0.split should be either undefined, a string, or an array');

		if (!split.length)
			throw TypeError('arg0.split.length == 0');

		this.split = split;
	}

	[this.name, this.display, this.code, this.attributes, this.children]
		= [name, display, code, attributes, children];

	this.innerIsText = (() => {
		var len = split ? split.length : 0;

		var foo = (li, le) => {
			if (le > 0)
				return li.map(l => foo(l, le - 1));
			
			return li.map(c => {
				if (c instanceof TextNode) return true;
				if (c instanceof ErrorNode) return false;
				return c.outerIsText;
			}).every(e => e);
		};

		return foo(children, len);
	})();

	this.innerText = (() => {
		var len = split ? split.length : 0;

		var foo = (li, le, iit) => {
			if (le > 0)
				return li.map((l, i) => foo(l, le - 1, iit[i]));
			
			return iit
				? li.map(c => {
					if (c instanceof TextNode) return c.text;
					return c.outerText;
				}).join('')
				: null;
		};

		return foo(children, len, this.innerIsText);
	})();

	this.innerHtml = (() => {
		var len = split ? split.length : 0;

		var foo = (li, le, iit, it) => {
			if (le > 0)
				return li.map((l, i) => foo(l, le - 1, iit[i], it[i]));

			if (iit) {
				if (it.trim() && this.display == 'container-block') {
					return it
						// ?: is important
						.split(/(?:\r\n[ \t]*){2,}|(?:\r[ \t]*){2,}|(?:\n[ \t]*){2,}/)
						.filter(text => !!text.trim())
						.map(escapeHtml)
						.map(s => `<p>${s}</p>`).join('');
				}

				return escapeHtml(it);
			}

			if (this.display != 'container-block') {
				// join as HTML
				return li.map(c => {
					if (c instanceof TextNode)
						return escapeHtml(c.text);
					if (c instanceof ErrorNode)
						return c.toHtml();
					return c.outerHtml;
				}).join('');
			}

			var paragraphs = [], p = [];

			var commit = () => {
				if (p.length) {
					paragraphs.push(p);
					p = [];
				}
			};

			var add = e => p.push(e);

			li.forEach(c => {
				if (c instanceof TextNode) {
					// ?: is important
					var split = c.text.split(/(?:\r\n[ \t]*){2,}|(?:\r[ \t]*){2,}|(?:\n[ \t]*){2,}/);
					if (split.length < 2) {
						return add(c);
					}

					split.forEach((s, i) => {
						if (s.trim()) add(this.text(s));

						if (i < split.length - 1) commit();
					});
				} else if (c instanceof ErrorNode) {
					// treat errors like inlines
					add(c);
				} else {
					// blocks interrupt paragraphs
					if (c.display != 'inline') {
						commit();
						// direct push to list differentiates non-paragraphs
						paragraphs.push(c);
						commit();
					}
					// inlines do not interrupt paragraphs
					else {
						add(c);
					}
				}
			});

			commit();

			return paragraphs.map(p => {
				if (p instanceof Array) {
					return '<p>' + p.map(n => {
						if (n instanceof TextNode)
							return escapeHtml(n.text);
						if (n instanceof ErrorNode)
							return n.toHtml();
						return n.outerHtml;
					}).join('') + '</p>';
				}
				// non-paragraphs
				return p.outerHtml;
			}).join('');
		};

		return foo(children, len, this.innerIsText, this.innerText);
	})();

	var r = render(this, options);
	this.outerIsText = r instanceof TextNode;
	this.outerText = this.outerIsText ? r.text : null;
	this.isError = r instanceof ErrorNode;
	this.errorMessage = r instanceof ErrorNode ? r.message : null;

	if (this.outerIsText) {
		this.outerHtml = escapeHtml(this.outerText);
	} else if (r instanceof HtmlNode) {
		this.outerHtml = r.html;
	} else if (r instanceof ErrorNode) {
		this.outerHtml = r.toHtml();
	} else {
		throw TypeError('Render output should be one of TextNode, HtmlNode, or ErrorNode');
	}
}

extendNode(Element);

Element.prototype.text = function (text) {
	return new TextNode(text);
};

Element.prototype.html = function (html) {
	return new HtmlNode({html, display: this.display});
};

Element.prototype.error = function (message) {
	return new ErrorNode({
		message: `[${this.name}]: ${message}`,
		code: this.code
	});
};

Element.prototype.getAttribute = function (name) {
	for (var i = 0; i < this.attributes.length; i++) {
		if (this.attributes[i].name == name)
			return this.attributes[i].value;
	}

	return null;
};

Element.prototype.toString = function () {
	return this.toIndentedString(0);
};

Element.prototype.toIndentedString = function (level) {
	var a = [
		'display', 'code', 'attributes', 'split', 'isError', 'errorMessage',
		'innerIsText', 'innerText', 'innerHtml', 'outerIsText', 'outerText',
		'outerHtml'
	].map(k => k + '=' + (typeof this[k] == 'string' || this[k] instanceof Array ? JSON.stringify(this[k]) : this[k] + '')).join('\n' + '\t'.repeat(level + 1));

	var b;
	(() => {
		var foo = (c, lev) => {
			if (c instanceof Array)
				return c.map(foo).join(',\n');
			else
				return c.toIndentedString(level + 1);
		};

		b = this.children.map(foo).join(',\n');
	})();

	return '\t'.repeat(level) + `Element[${JSON.stringify(this.name)}](\n${'\t'.repeat(level + 1)}${a}\n${'\t'.repeat(level)}) {\n${b}\n${'\t'.repeat(level)}}`;
};

Element.prototype.escapeHtml = escapeHtml;

module.exports = {
	Node,
	TextNode,
	HtmlNode,
	ErrorNode,
	ElementClass,
	Element
};