import ErrorNode from "./ErrorNode";
import escapeHtml from "./escapeHtml";
import HtmlNode from "./HtmlNode";
import Node from "./Node";
import TextNode from "./TextNode";

export default class Element extends Node {

	public readonly name: string;
	public readonly display: 'inline' | 'leaf-block' | 'container-block';
	public readonly code: string;
	public readonly attributes: any[];
	public readonly children: any[];
	public readonly split: string | any[];
	public readonly innerIsText: boolean;
	public readonly innerText: string;
	public readonly innerHtml: string;
	public readonly outerIsText: boolean;
	public readonly outerText: string;
	public readonly isError: boolean;
	public readonly errorMessage: string;
	public readonly outerHtml: string;

	constructor ({name, display, render, code, attributes, children, split, options}) {
		super();

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
					? li.map((c: any) => {
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

	public text(text: string) {
		return new TextNode(text);
	};
	
	public html(html: string) {
		return new HtmlNode({html, display: this.display});
	};
	
	public error(message: string) {
		return new ErrorNode({
			message: `[${this.name}]: ${message}`,
			code: this.code
		});
	};
	
	public getAttribute(name: string) {
		for (var i = 0; i < this.attributes.length; i++) {
			if (this.attributes[i].name == name)
				return this.attributes[i].value;
		}
	
		return null;
	};
	
	public toIndentedString(level: number) {
		var a = [
			'display', 'code', 'attributes', 'split', 'isError', 'errorMessage',
			'innerIsText', 'innerText', 'innerHtml', 'outerIsText', 'outerText',
			'outerHtml'
		].map(k => k + '='
			+ (typeof this[k] == 'string' || this[k] instanceof Array
				? JSON.stringify(this[k])
				: this[k] + '')
		).join('\n' + '\t'.repeat(level + 1));
	
		var b = (function r(children) {
			return children.map(c => c.toIndentedString(level + 1)).join(',\n');
		})(this.children);
	
		return '\t'.repeat(level) + `Element[${JSON.stringify(this.name)}](\n`
				+ `${'\t'.repeat(level + 1)}${a}\n`
			+ `${'\t'.repeat(level)}) {\n`
			+ `${b}\n`
			+ `${'\t'.repeat(level)}}`;
	};

	public escapeHtml(s: string) {
		return this.escapeHtml(s);
	}
}