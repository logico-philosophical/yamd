import { TagArgumentType, TagInstantiateArgumentType } from "./Tag";
import ErrorNode from "./ErrorNode";
import escapeHtml from "./escapeHtml";
import HtmlNode from "./HtmlNode";
import Node from "./Node";
import TextNode from "./TextNode";

interface ElementArgumentType
	extends TagArgumentType, TagInstantiateArgumentType {
}

export type Nested<T> = T | Nested<T>[];

export type ElementDisplayType = 'inline' | 'leaf-block' | 'container-block';

export function isElementDisplayType(obj: string): obj is ElementDisplayType {
	return ['inline', 'leaf-block', 'container-block'].includes(obj);
}

export default class Element extends Node {

	public readonly name: NonNullable<string>;
	public readonly display: ElementDisplayType;
	private readonly renderer: (el: Element, options) => Node;
	public readonly split: string[];

	public readonly code: string;
	public readonly attributes: any[];
	public readonly children: Nested<Node>[];
	public readonly options: any;

	private innerIsRendered = false;
	#innerIsText: Nested<boolean>;
	#innerText: Nested<string>;
	#innerHtml: Nested<string>;

	private outerIsRendered = false;
	#rendered: Node;
	#outerIsText: boolean;
	#outerText: string;
	#isError: boolean;
	#errorMessage: string;
	#outerHtml: string;

	constructor ({name, display, renderer, split, code, attributes, children, options}: ElementArgumentType) {
		super();

		if (!name) throw TypeError('You give arg0 a bad name');
		if (!isElementDisplayType(display))
			throw TypeError('arg0.display should be one of "inline", "leaf-block", or "container-block".');
		if (!(renderer instanceof Function))
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
	
		if (!split) split = [];
		if (typeof split == 'string') split = [split];

		if (!(split instanceof Array))
			throw TypeError('arg0.split should be either undefined, a string, or an array');

		this.name = name;
		this.display = display;
		this.renderer = renderer;
		this.split = split;
		this.code = code;
		this.attributes = attributes;
		this.children = children;
		this.options = options;
	}

	private renderInner() {
		if (this.innerIsRendered) return;

		// Render children first
		(() => {
			var len = this.split ? this.split.length : 0;

			(function recurse(children: Nested<Node>, len: number) {
				if (len > 0) {
					return (children as Nested<Node>[]).forEach(grandchildren => {
						recurse(grandchildren, len - 1);
					});
				}

				(children as Node[]).forEach(child => {
					if (child instanceof Element) {
						child.render();
					}
				})
			})(this.children, len);
		})();

		this.#innerIsText = (() => {
			var len = this.split ? this.split.length : 0;
	
			var foo = (li: Nested<Node>, le: number) => {
				if (le > 0)
					return (li as Nested<Node>[]).map(l => foo(l, le - 1));
				
				return (li as Node[]).map(c => {
					if (c instanceof TextNode) return true;
					if (c instanceof ErrorNode) return false;
					if (c instanceof Element) return c.outerIsText;
					throw Error('wut');
				}).every(e => e);
			};
	
			return foo(this.children, len);
		})();
	
		this.#innerText = (() => {
			var len = this.split ? this.split.length : 0;
	
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
	
			return foo(this.children, len, this.#innerIsText);
		})();
	
		this.#innerHtml = (() => {
			var len = this.split ? this.split.length : 0;
	
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
	
			return foo(this.children, len, this.#innerIsText, this.#innerText);
		})();

		this.innerIsRendered = true;
	}

	public get innerIsText() {
		if (!this.innerIsRendered) {
			throw Error('Cannot access Element#innerIsText before it is initialized');
		}

		return this.#innerIsText;
	}

	public get innerText() {
		if (!this.innerIsRendered) {
			throw Error('Cannot access Element#innerText before it is initialized');
		}

		return this.#innerText;
	}

	public get innerHtml() {
		if (!this.innerIsRendered) {
			throw Error('Cannot access Element#innerHtml before it is initialized');
		}

		return this.#innerHtml;
	}

	public render(): Node {
		if (this.outerIsRendered) return this.#rendered;

		this.renderInner();
		var r = this.renderer(this, this.options);

		this.#rendered = r;
		this.#outerIsText = r instanceof TextNode;
		this.#outerText = r instanceof TextNode ? r.text : null;
		this.#isError = r instanceof ErrorNode;
		this.#errorMessage = r instanceof ErrorNode ? r.message : null;
	
		if (this.#outerIsText) {
			this.#outerHtml = escapeHtml(this.#outerText);
		} else if (r instanceof HtmlNode) {
			this.#outerHtml = r.html;
		} else if (r instanceof ErrorNode) {
			this.#outerHtml = r.toHtml();
		} else {
			throw TypeError('Render output should be one of TextNode, HtmlNode, or ErrorNode');
		}

		this.outerIsRendered = true;
	}

	public get outerIsText() {
		if (!this.outerIsRendered) {
			throw Error('Cannot access Element#outerIsText before it is initialized');
		}

		return this.#outerIsText;
	}

	public get outerText() {
		if (!this.outerIsRendered) {
			throw Error('Cannot access Element#outerText before it is initialized');
		}

		return this.#outerText;
	}

	public get outerHtml() {
		if (!this.outerIsRendered) {
			throw Error('Cannot access Element#outerHtml before it is initialized');
		}

		return this.#outerHtml;
	}

	public get isError() {
		if (!this.outerIsRendered) {
			throw Error('Cannot access Element#isError before it is initialized');
		}

		return this.#isError;
	}

	public get errorMessage() {
		if (!this.outerIsRendered) {
			throw Error('Cannot access Element#errorMessage before it is initialized');
		}

		return this.#errorMessage;
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
			'display', 'split',
			'code', 'attributes',
			// inner
			'innerIsText', 'innerText', 'innerHtml',
			// outer
			'outerIsText', 'outerText', 'outerHtml',
			'isError', 'errorMessage'
		].map(k => k + '='
			+ (typeof this[k] == 'string' || this[k] instanceof Array
				? JSON.stringify(this[k])
				: this[k] + '')
		).join('\n' + '\t'.repeat(level + 1));
	
		var b = (function recurse(children, level) {
			return children.map(c => {
				if (c instanceof Array) {
					return [
						'[',
						'\t' + recurse(c, level + 1),
						']'
					].join('\n' + '\t'.repeat(level));
				}

				return c.toIndentedString(level);
			}).join(',\n' + '\t'.repeat(level));
		})(this.children, level + 1);
	
		return `Element[${JSON.stringify(this.name)}](\n`
				+ `${'\t'.repeat(level + 1)}${a}\n`
			+ `${'\t'.repeat(level)}) {\n`
			+ '\t'.repeat(level + 1) + `${b}\n`
			+ `${'\t'.repeat(level)}}`;
	};

	public escapeHtml(s: string) {
		return escapeHtml(s);
	}
}