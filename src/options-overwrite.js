// deep copy an object
function clone(o) {
	var recurse = o => {
		if (o === null || typeof o != 'object') return o;
		
		var clone = o.constructor();

		for (var p in o) {
			if (o.hasOwnProperty(p)) {
				clone[p] = recurse(o[p]);
			}
		}

		return clone;
	}

	return recurse(o);
}

function overwrite(prior, later) {
	if (typeof prior != 'object'
			|| typeof later != 'object') {
		throw TypeError('One of the options provided is not an object');
	}

	// options.tags
	if (later.tags) {
		if (!prior.tags) {
			prior.tags = later.tags;
			return;
		}

		// overwrite options.tags to globalOptions.tags
		for (var k in later.tags) {
			// overwrite if function
			if (later.tags[k] instanceof Function) {
				prior.tags[k] = later.tags[k];
			}
			// delete if false
			else if (later.tags[k] === false) {
				delete prior.tags[k];
			}
			// throw error otherwise
			else {
				throw new TypeError(`Unsupported value: later.tags[${JSON.stringify(k)}] == ${JSON.stringify(later.tags[k])}`);
			}
		}
	}
}

module.exports = {
	overwrite,
	clone
};
