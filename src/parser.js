function input2pt(input) {
	var levels = [],
		stack = [];
	
	function push(fragment) {
		// normalize text
		if (fragment.type == 'text'
				&& stack.length
				&& stack[stack.length - 1].type == 'text') {
			var prepend = stack.pop();
			fragment = {
				type: 'text',
				start: prepend.start,
				end: fragment.end,
				data: prepend.data + fragment.data
			};
		}

		if (fragment.type == 'right boundary marker') {
			var buf = [fragment], tmp;
			while (true) {
				tmp = stack.pop();
				if (!tmp) throw new Error('No lbm found');
				buf.unshift(tmp);
				if (tmp.type == 'left boundary marker' && tmp.level == fragment.level) break;
			}
			
			var elementStart = buf[0].start,
				elementEnd = buf[buf.length - 1].end;

			fragment = {
				type: 'element',
				start: elementStart,
				end: elementEnd,
				data: input.substring(elementStart, elementEnd),
				children: buf
			};
		}
		
		if (fragment.type == 'right verbatim marker') {
			var buf = [fragment], tmp;
			while (true) {
				tmp = stack.pop();
				if (!tmp) throw new Error('No lvm found');
				buf.unshift(tmp);
				if (tmp.type == 'left verbatim marker' && tmp.level == fragment.level) break;
			}
			
			var verbatimStart = buf[0].start,
				verbatimEnd = buf[buf.length - 1].end;

			fragment = {
				type: 'verbatim',
				start: verbatimStart,
				end: verbatimEnd,
				data: input.substring(verbatimStart, verbatimEnd),
				children: buf
			};
		}

		stack.push(fragment);
	}
	
	// main loop
	for (var cur = 0; cur < input.length;) {
		if (input[cur] == '`') {
			var lvmStart = cur;
			for (cur++; cur < input.length; cur++) {
				if (input[cur] != '<') break;
			}

			var lvmLevel = cur - lvmStart;

			if (cur < input.length - 1
					&& input[cur] == ';'
					&& input[cur + 1] == '<') {
				cur++;
			}

			var lvmEnd = cur;

			push({
				type: 'left verbatim marker',
				start: lvmStart,
				end: lvmEnd,
				data: input.substring(lvmStart, lvmEnd),
				level: lvmLevel
			});

			levels.push(-lvmLevel);
			
			var rvmString = '>'.repeat(lvmLevel - 1) + '`';
			var rvmIndex = input.indexOf(rvmString, cur);
			var rvmFound = rvmIndex >= 0, rvmStart, rvmEnd;
			if (rvmFound)
				[rvmStart, rvmEnd] = [rvmIndex, rvmIndex + rvmString.length];
			cur = rvmFound ? rvmEnd : input.length;
			
			var textStart = lvmEnd,
				textEnd = rvmFound ? rvmStart : cur;

			push({
				type: 'text',
				start: textStart,
				end: textEnd,
				data: input.substring(textStart, textEnd)
			});

			if (rvmFound) {
				push({
					type: 'right verbatim marker',
					start: rvmStart,
					end: rvmEnd,
					data: input.substring(rvmStart, rvmEnd),
					level: rvmEnd - rvmStart
				});

				levels.pop();
			}
		} else if (input[cur] == '[') {
			var lbmStart = cur;
			for (cur++; cur < input.length; cur++) {
				if (input[cur] != '<') break;
			}
			var lbmEnd = cur;

			var currentLevel = levels[levels.length - 1] || 0;
			if (lbmEnd - lbmStart < currentLevel) {
				push({
					type: 'text',
					start: lbmStart,
					end: lbmEnd,
					data: input.substring(lbmStart, lbmEnd)
				});
				continue;
			}
			
			levels.push(lbmEnd - lbmStart);
			push({
				type: 'left boundary marker',
				start: lbmStart,
				end: lbmEnd,
				data: input.substring(lbmStart, lbmEnd),
				level: lbmEnd - lbmStart
			});
			
			// excludes: '(', ':', '[', ']', '|', '<', '`'
			// this regex always matches something
			var tagNameRegex = /^(?:(?:\*{1,3}|={1,6}|\${1,2}|;{1,3}|[!"#$%&')*+,\-.\/;=>?@\\^_{}~]|[a-z][a-z0-9]*)|)/i,
				tagNameStart = cur,
				tagNameEnd = tagNameStart + input.substring(tagNameStart)
						.match(tagNameRegex)[0].length;
			
			push({
				type: 'tag name',
				start: tagNameStart,
				end: tagNameEnd,
				data: input.substring(tagNameStart, tagNameEnd)
			});

			cur = tagNameEnd;

			var separatorRegex = /^(?:[ \t|]|)/i,
				separatorStart = cur,
				separatorEnd = separatorStart
					+ input.substring(separatorStart)
						.match(separatorRegex)[0].length;
			
			push({
				type: 'separator',
				start: separatorStart,
				end: separatorEnd,
				data: input.substring(separatorStart, separatorEnd)
			});

			cur = separatorEnd;
		} else if (input[cur] == '>' || input[cur] == ']') {
			var currentLevel = levels[levels.length - 1] || 0;

			var gtStart = cur;

			for (; cur < input.length; cur++) {
				if (input[cur] != '>') break;
			}

			var gtEnd = cur;
			
			// >>... does not end with a ]
			if (gtEnd == input.length || input[gtEnd] != ']') {
				push({
					type: 'text',
					start: gtStart,
					end: gtEnd,
					data: input.substring(gtStart, gtEnd)
				});
				continue;
			}

			// invalid ]
			if (currentLevel == 0) {
				push({
					type: 'text',
					start: gtStart,
					end: gtEnd,
					data: input.substring(gtStart, gtEnd)
				});

				var rbmAtRootStart = cur;
				var rbmAtRootEnd = ++cur;

				push({
					type: 'mismatched right boundary marker',
					start: rbmAtRootStart,
					end: rbmAtRootEnd,
					data: input.substring(rbmAtRootStart, rbmAtRootEnd)
				});

				continue;
			}

			cur++;
			
			// not enough level
			if (cur - gtStart < currentLevel) {
				push({
					type: 'text',
					start: gtStart,
					end: cur,
					data: input.substring(gtStart, cur)
				});
				continue;
			}
			
			// too much >
			if (cur - gtStart > currentLevel) {
				push({
					type: 'text',
					start: gtStart,
					end: cur - currentLevel,
					data: input.substring(gtStart, cur - currentLevel)
				});
			}

			var rbmStart = cur - currentLevel,
				rbmEnd = cur;

			push({
				type: 'right boundary marker',
				start: rbmStart,
				end: rbmEnd,
				data: input.substring(rbmStart, rbmEnd),
				level: rbmEnd - rbmStart
			});

			levels.pop();
		} else /* none of '[', ']', '`', '>' */ {
			// reduce text normalization overhead
			var textStart = cur;
			for (cur++; cur < input.length; cur++) {
				if (['[', ']', '`', '>'].includes(input[cur])) break;
			}
			var textEnd = cur;
			push({
				type: 'text',
				start: textStart,
				end: textEnd,
				data: input.substring(textStart, textEnd)
			});
		}
	}
	
	// close the unclosed
	for (var i = levels.length - 1; i >= 0; i--) {
		var type = levels[i] > 0
				? 'right boundary marker'
				: 'right verbatim marker';
		var absLevel = levels[i] > 0
				? levels[i] : -levels[i];

		push({
			type: type,
			start: input.length,
			end: input.length,
			data: '',
			level: absLevel
		});
	}

	return stack;
}

function pt2ast(pt) {
	function recurse(pt) {
		var ast = pt.map(e => {
			switch (e.type) {
				case 'text':
					return {
						type: 'text',
						text: e.data
					};
				case 'verbatim':
					return {
						type: 'text',
						text: e.children[1].data
					};
				case 'element':
					return {
						type: 'element',
						name: e.children[1].data,
						code: e.data,
						children: recurse(e.children.slice(3, -1))
					};
				case 'mismatched right boundary marker':
					return {
						type: 'error',
						text: e.data
					};
				default:
					throw new TypeError(`Unknown type: ${e.type}`);
			}
		});

		return ast;
	};

	return recurse(pt);
}

module.exports = {
	input2pt,
	pt2ast
};
