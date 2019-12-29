var escapeHtml = s => (s + '').replace(/[&<>"']/g, m => ({
	'&': '&amp;', '<': '&lt;', '>': '&gt;',
	'"': '&quot;', "'": '&#39;'
})[m]);

function makeHtml(fragment) {
	return `<span class="m42kup-hl-${fragment.type}">${fragment.html || escapeHtml(fragment.text)}</span>`;
}

function pt2hl(pt) {
	return (function recurse(pt) {
		var ret = '';

		for (var i = 0; i < pt.length; i++) {
			switch(pt[i].type) {
				case 'text':
					ret += makeHtml({
						type: 'tx',
						text: pt[i].text
					});
					break;
				case 'element':
					var tmp = makeHtml({
						type: 'lbm',
						text: pt[i].lbm
					})
						+ makeHtml({
						type: 'tn',
						text: pt[i].name
					})
						+ makeHtml({
						type: 'sp',
						text: pt[i].separator
					})
						+ recurse(pt[i].children)
						+ makeHtml({
						type: 'rbm',
						text: pt[i].rbm
					});

					ret += makeHtml({
						type: 'elem',
						html: tmp
					});
					break;
				case 'verbatim':
					var tmp = makeHtml({
						type: 'lvm',
						text: pt[i].lvm + pt[i].separator
					})
						+ makeHtml({
						type: 'text',
						text: pt[i].child.text
					})
						+ makeHtml({
						type: 'rvm',
						text: pt[i].rvm
					});

					ret += makeHtml({
						type: 'verb',
						html: tmp
					});
					break;
				default:
					throw new TypeError(`Unknown type: ${pt[i].type}`);
			}
		}

		return ret;
	})(pt.root.children);
}

module.exports = {
	pt2hl
};