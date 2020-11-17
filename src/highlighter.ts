var escapeHtml = s => (s + '').replace(/[&<>"']/g, m => ({
	'&': '&amp;', '<': '&lt;', '>': '&gt;',
	'"': '&quot;', '\'': '&#39;'
})[m]);

function makeHtml(fragment) {
	return `<span class="m42hl-${fragment.type}">${fragment.html || escapeHtml(fragment.text)}</span>`;
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
						+ (p => {
						switch (p._type) {
							case 'parenthesis':
								return makeHtml({
									type: 'lpm',
									text: p.left
								})
								+ p.content.map(q => {
									switch (q._type) {
										case 'attribute':
											return makeHtml({
												type: 'pk',
												text: q.attribute[0]
											})
											+ makeHtml({
												type: 'eq',
												text: q.attribute[1]
											})
											+ makeHtml({
												type: 'lqm',
												text: q.attribute[2]
											})
											+ makeHtml({
												type: 'pv',
												text: q.attribute[3]
											})
											+ makeHtml({
												type: 'rqm',
												text: q.attribute[4]
											});
										case 'whitespace':
											return makeHtml({
												type: 'tx',
												text: q.whitespace
											});
										case 'error':
											return makeHtml({
												type: 'err',
												text: q.error
											})
										default:
											throw Error('Unknown type');
									}
								}).join('')
								+ makeHtml({
									type: 'rpm',
									text: p.right
								});
							case 'separator':
								return makeHtml({
									type: 'sp',
									text: p.separator
								});
							default:
								throw Error('Unknown type');
						}
					})(pt[i].attributes)
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
					var tmp2 = makeHtml({
						type: 'lvm',
						text: pt[i].lvm + pt[i].separator
					})
						+ makeHtml({
						type: 'tx',
						text: pt[i].child.text
					})
						+ makeHtml({
						type: 'rvm',
						text: pt[i].rvm
					});

					ret += makeHtml({
						type: 'verb',
						html: tmp2
					});
					break;
				default:
					throw new TypeError(`Unknown type: ${pt[i].type}`);
			}
		}

		return ret;
	})(pt.root.children);
}

export default {
	pt2hl
};