import Node from "./Node";

/**
 * the data part of TextNode and HtmlNode instances are intentionally
 * labeled differently, in order to prevent mistakenly
 * using unescaped text data as HTML data, which is an XSS
 * vulnerability.
 */
export default class TextNode extends Node {
	public readonly text: string;

	constructor (text: string) {
		super();

		if (typeof text != 'string')
			throw TypeError('text not string');

		this.text = text;
	}

	public toIndentedString(level: number) {
		return `Text {${JSON.stringify(this.text)}}`;
	}
}