(CodeMirror => {
	function token(stream, state) {
		if ((state.levels[state.levels.length - 1] || 0) < 0) {
			var lvmLevel = -state.levels[state.levels.length - 1];
			var rvmString = '>'.repeat(lvmLevel - 1) + '`';
			if (stream.skipTo(rvmString)) {
				stream.match(rvmString);
				state.levels.pop();
			} else stream.skipToEnd();

			return 'comment';
		}

		var c = stream.peek();

		if (c == '`') {
			stream.next();

			var level = 1;
			while (c = stream.next()) {
				if (c != '<') {
					stream.backUp(1);
					break;
				}
				level++;
			}

			state.levels.push(-level);

			return 'comment';
		} else if (c == '[') {
			stream.next();

			var level = 1;
			while (c = stream.next()) {
				if (c != '<') {
					stream.backUp(1);
					break;
				}
				level++;
			}

			var currentLevel = state.levels[state.levels.length - 1] || 0;
			if (level < currentLevel) {
				return null;
			}

			var tagNameRegex = /^(?:\!+|\"+|\#+|\$+|\%+|\&+|\'+|\)+|\*+|\++|\,+|\-+|\/+|\;+|\=+|\>+|\?+|\@+|\\+|\^+|\_+|\{+|\|+|\}+|\~+|[a-z][a-z0-9]*(?:\:[a-z][a-z0-9]*)*|)/;

			stream.match(tagNameRegex);

			var separatorRegex = /^(?:[.]|)/i;

			stream.match(separatorRegex);

			state.levels.push(level);

			return 'tag';
		} else if (c == '>' || c == ']') {
			var lbmLevel = state.levels[state.levels.length - 1] || 0;
			if (lbmLevel <= 0) return stream.next();

			var rbmString = '>'.repeat(lbmLevel - 1) + ']';
			if (stream.match(rbmString)) {
				state.levels.pop();
				return 'tag';
			} else stream.next();
		}  else /* none of '[', ']', '`', '>' */ {
			// reduce text normalization overhead
			stream.match(/^[^\[\]`>]+/);
		}
	}

	CodeMirror.defineMode('m42kup', (config, parserConfig) => ({
		startState(baseColumn) {
			return {
				levels: []
			}
		},
		token
	}));
})(CodeMirror);