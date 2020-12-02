import { ElementDisplayType, isElementDisplayType } from "./Element";
import Node from "./Node";

/**
 * the data part of TextNode and HtmlNode instances are intentionally
 * labeled differently, in order to prevent mistakenly
 * using unescaped text data as HTML data, which is an XSS
 * vulnerability.
 */
export default class HtmlNode extends Node {

	public readonly html: string;
	public readonly display: ElementDisplayType;

	constructor ({html, display}) {
		super();

		if (typeof html != 'string')
			throw TypeError('html not string');

		if (!isElementDisplayType(display))
			throw TypeError('arg0.display should be one of "inline", "leaf-block", or "container-block".');

		this.html = html;
		this.display = display;
	}
	
	public toIndentedString(level: number) {
		var a = ['display'].map(k =>
			k + '=' + JSON.stringify(this[k])).join(' ');
		return `Html(${a}) {${JSON.stringify(this.html)}}`;
	};
}