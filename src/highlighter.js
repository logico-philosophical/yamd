var escapeHtml = s => s.replace(/[&<>"']/g, m => ({
	'&': '&amp;', '<': '&lt;', '>': '&gt;',
	'"': '&quot;', "'": '&#39;'
})[m]);

function makeHtml(fragment) {
	return `<span class="m42kup-hl-${fragment.type}">${fragment.html || escapeHtml(fragment.text)}</span>`;
}

function pt2hl(pt) {
	var ret = '';
	for (var i = 0; i < pt.length; i++) {
		switch(pt[i].type) {
			case 'text':
				ret += makeHtml({
					type: 'tx',
					text: pt[i].data
				});
				break;
			case 'element':
				var tmp = makeHtml({
					type: 'lbm',
					text: pt[i].children[0].data
				})
					+ makeHtml({
					type: 'tn',
					text: pt[i].children[1].data
				})
					+ makeHtml({
					type: 'sp',
					text: pt[i].children[2].data
				})
					+ pt2hl(pt[i].children.slice(3, -1))
					+ makeHtml({
					type: 'rbm',
					text: pt[i].children[pt[i].children.length - 1].data
				});

				ret += makeHtml({
					type: 'elem',
					html: tmp
				});
				break;
			case 'verbatim':
				var tmp = makeHtml({
					type: 'lvm',
					text: pt[i].children[0].data
				})
					+ makeHtml({
					type: 'text',
					text: pt[i].children[1].data
				})
					+ makeHtml({
					type: 'rvm',
					text: pt[i].children[2].data
				});

				ret += makeHtml({
					type: 'verb',
					html: tmp
				});
				break;
			case 'mismatched right boundary marker':
				ret += makeHtml({
					type: 'mrbm',
					text: pt[i].data
				});
				break;
		}
	}

	return ret;
}

module.exports = {
	pt2hl
};