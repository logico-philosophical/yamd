import escapeHtml from "./escapeHtml";
import Node from "./Node";

export default class ErrorNode extends Node {

	public readonly message: string;
	public readonly code: string;

	constructor ({message, code}) {
		super();

		if (typeof message != 'string')
			throw TypeError('message not string');

		if (typeof code != 'string')
			throw TypeError('code not string');

		this.message = message;
		this.code = code;
	}

	public toHtml() {
		return `<code class="yamd-error" title="Error: ${escapeHtml(this.message)}">${escapeHtml(this.code)}</code>`;
	};
	
	public toIndentedString(level: number) {
		var a = ['message', 'code'].map(k =>
			k + '=' + JSON.stringify(this[k])).join(' ');
		return `Error(${a})`;
	};
}