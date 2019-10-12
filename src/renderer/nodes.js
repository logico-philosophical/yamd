'use strict';

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
}

TextNode.prototype.toIndentedString = function (level) {
	return '\t'.repeat(level) + `Text {${JSON.stringify(this.text)}}`;
}

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
}

HtmlNode.prototype.toIndentedString = function (level) {
	var a = ['display'].map(k =>
		k + '=' + JSON.stringify(this[k])).join(' ');
	return '\t'.repeat(level) + `Html(${a}) {${JSON.stringify(this.html)}}`;
}

function ErrorNode({message, code}) {
	if (typeof message != 'string')
		throw TypeError('message not string');

	if (typeof code != 'string')
		throw TypeError('code not string');

	this.message = message;
	this.code = code;
}

extendNode(ErrorNode);

ErrorNode.prototype.toString = function () {
	return this.toIndentedString(0);
}

ErrorNode.prototype.toIndentedString = function (level) {
	var a = ['message', 'code'].map(k =>
		k + '=' + JSON.stringify(this[k])).join(' ');
	return '\t'.repeat(level) + `Error(${a})`;
}

function ElementClass({name, display, render}) {
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
}

ElementClass.prototype.instantiate = function ({code, children, options}) {
	if (!(this instanceof ElementClass)) {
		throw Error('ElementClass.prototype.instantiate should be called as a method of an ElementClass instance');
	}

	return new Element({
		name: this.name,
		display: this.display,
		render: this.render,
		code,
		children,
		options
	});
}

function Element({name, display, render, code, children, options}) {
	if (!name) throw TypeError('You give arg0 a bad name');
	if (!['inline', 'leaf-block', 'container-block'].includes(display))
		throw TypeError('arg0.display should be one of "inline", "leaf-block", or "container-block".');
	if (!(render instanceof Function))
		throw TypeError('arg0.render should be a function');
	if (!code) throw TypeError('You give arg0 a bad code');
	if (!children.every(c => c instanceof Element
			|| c instanceof TextNode
			|| c instanceof ErrorNode))
		throw TypeError('All arg0.children should either be an Element, a TextNode, or an ErrorNode');

	[this.name, this.display, this.code, this.children]
		= [name, display, code, children];

	this.innerIsText = children.map(c => {
		if (c instanceof TextNode) return true;
		if (c instanceof ErrorNode) return false;
		return c.outerIsText;
	}).every(e => e);

	this.innerText = this.innerIsText
		? children.map(c => {
			if (c instanceof TextNode) return c.text;
			return c.outerText;
		}).join('')
		: null;

	// set this.innerHtml
	if (this.innerIsText) {
		if (this.innerText.trim() && this.display == 'container-block') {
			this.innerHtml = this.innerText
				// ?: is important
				.split(/(?:\r\n){2,}|\r{2,}|\n{2,}/)
				.filter(text => !!text.trim())
				.map(this.escapeHtml)
				.map(s => `<p>${s}</p>`).join('');
		} else this.innerHtml = this.escapeHtml(this.innerText);
	} else {
		if (this.display == 'container-block') {
			var paragraphs = [], p = [];

			var commit = () => {
				if (p.length) {
					paragraphs.push(p);
					p = [];
				}
			};

			var add = e => p.push(e);

			this.children.forEach(c => {
				if (c instanceof TextNode) {
					// ?: is important
					var split = c.text.split(/(?:\r\n){2,}|\r{2,}|\n{2,}/);
					if (split.length < 2) {
						if (c.text.trim()) add(c);
						return;
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

			this.innerHtml = paragraphs.map(p => {
				if (p instanceof Array) {
					return '<p>' + p.map(n => {
						if (n instanceof TextNode)
							return this.escapeHtml(n.text);
						if (n instanceof ErrorNode)
							return '<code class="m42kup-error">'
								+ this.escapeHtml(n.code) + '</code>';
						return n.outerHtml;
					}).join('') + '</p>';
				}
				// non-paragraphs
				return p.outerHtml;
			}).join('');
		} else {
			// join as HTML
			this.innerHtml = this.children.map(c => {
				if (c instanceof TextNode)
					return this.escapeHtml(c.text);
				if (c instanceof ErrorNode)
					return '<code class="m42kup-error">' + this.escapeHtml(c.code) + '</code>';
				return c.outerHtml;
			}).join('');
		}
	}

	var r = render(this, options);
	this.outerIsText = r instanceof TextNode;
	this.outerText = this.outerIsText ? r.text : null;
	this.errorMessage = r instanceof ErrorNode ? r.message : null;
	this.isError = r instanceof ErrorNode;

	if (this.outerIsText) {
		this.outerHtml = this.escapeHtml(this.outerText);
	} else if (r instanceof HtmlNode) {
		this.outerHtml = r.html;
	} else if (r instanceof ErrorNode) {
		this.outerHtml = '<code class="m42kup-error">'
			+ this.escapeHtml(r.code) + '</code>';
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
	return new ErrorNode({message, code: this.code});
};

Element.prototype.toString = function () {
	return this.toIndentedString(0);
};

Element.prototype.toIndentedString = function (level) {
	var a = ['display', 'code', 'isError', 'errorMessage', 'innerIsText', 'innerText', 'innerHtml', 'outerIsText', 'outerText', 'outerHtml'].map(k =>
		k + '=' + (typeof this[k] == 'string' ? JSON.stringify(this[k]) : this[k] + '')).join('\n' + '\t'.repeat(level + 1));
	var b = this.children.map(c => c.toIndentedString(level + 1)).join(',\n');
	return '\t'.repeat(level) + `Element[${JSON.stringify(this.name)}](\n${'\t'.repeat(level + 1)}${a}\n${'\t'.repeat(level)}) {\n${b}\n${'\t'.repeat(level)}}`;
};

Element.prototype.escapeHtml = s => (s + '').replace(/[&<>"']/g, m => ({
	'&': '&amp;', '<': '&lt;', '>': '&gt;',
	'"': '&quot;', "'": '&#39;'
})[m]);

module.exports = {
	Node,
	TextNode,
	HtmlNode,
	ErrorNode,
	ElementClass,
	Element
};