import Element from "./Element";

interface ElementClassArgumentType {
	name: NonNullable<string>;
	display: 'inline' | 'leaf-block' | 'container-block';
	render: Function;
	split?: string | any[];
}

export default class ElementClass {

	public readonly name: string;
	public readonly display: 'inline' | 'leaf-block' | 'container-block';
	public readonly render: Function;
	public readonly split: string | any[];

	constructor ({name, display, render, split}: ElementClassArgumentType) {
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

	public instantiate({code, attributes, children, options}) {
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
}