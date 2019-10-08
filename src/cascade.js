function shallow(o) {
	var o2 = {};

	for (var k in o) o2[k] = o[k];

	return o2;
}

function copyOptions(o) {
	var o2 = {};
	if (o.tags) o2.tags = shallow(o.tags);
	if (o.hljs) o2.hljs = o.hljs;
	if (o.katex) o2.katex = o.katex;
	return o2;
}

function tags(o1, o2) {
	o1 = shallow(o1);
	
	for (var k in o2) {
		o1[k] = o2[k];
	}

	return o1;
}

function options(o1, o2) {
	if (typeof o1 != 'object'
			|| typeof o2 != 'object') {
		throw TypeError('One of the options provided is not an object');
	}

	o1 = copyOptions(o1);
	
	if (o2.tags) {
		if (!o1.tags) {
			o1.tags = {};
		}
		
		o1.tags = tags(o1.tags, o2.tags);
	}

	if (o2.hljs) o1.hljs = o2.hljs;
	if (o2.katex) o1.katex = o2.katex;

	return o1;
}

module.exports = {
	copyOptions,
	tags,
	options
};
