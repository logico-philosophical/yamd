var STATE_NORMAL = 0,
	STATE_ATTRIBUTE_NAME = 1,
	STATE_ATTRIBUTE_EQ = 2,
	STATE_ATTRIBUTE_VALUE = 3
	STATE_ATTRIBUTE_DQUOTE = 4,
	STATE_ATTRIBUTE_SQUOTE = 5;

module.exports = function addCodeMirrorMode(CodeMirror) {
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

		if (![STATE_ATTRIBUTE_DQUOTE, STATE_ATTRIBUTE_SQUOTE].includes(state.status)
				&& ['>', ']'].includes(c)) {
			var lbmLevel = state.levels[state.levels.length - 1] || 0;
			if (lbmLevel > 0) {
				var rbmString = '>'.repeat(lbmLevel - 1) + ']';
				if (stream.match(rbmString)) {
					state.levels.pop();
					state.status = STATE_NORMAL;
					return 'tag';
				}
			}
		}

		if (state.status != STATE_NORMAL) {
			if (stream.match(')')) {
				state.status = STATE_NORMAL;
				return 'tag';
			}

			if (state.status == STATE_ATTRIBUTE_NAME) {
				if (stream.match(/^[a-z0-9-]+/)) {
					state.status = STATE_ATTRIBUTE_EQ;
					return 'attribute';
				} else if (stream.match(/^[ \t\n\r]+/)) {
					return null;
				} else {
					stream.next();
					return 'error';
				}
			}

			if (state.status == STATE_ATTRIBUTE_EQ) {
				if (stream.match('=')) {
					state.status = STATE_ATTRIBUTE_VALUE;
					return null;
				} else {
					state.status = STATE_ATTRIBUTE_NAME;
					return null;
				}
			}

			if (state.status == STATE_ATTRIBUTE_VALUE) {
				if (stream.match('"')) {
					state.status = STATE_ATTRIBUTE_DQUOTE;
					return 'string';
				}

				if (stream.match("'")) {
					state.status = STATE_ATTRIBUTE_SQUOTE;
					return 'string';
				}

				stream.match(/^[^'"()\[\] \t\n\r]*/);
				state.status = STATE_ATTRIBUTE_NAME;
				return 'string';
			}

			if (state.status == STATE_ATTRIBUTE_DQUOTE) {
				if (stream.skipTo('"')) {
					stream.match('"');
					state.status = STATE_ATTRIBUTE_NAME;
				} else stream.skipToEnd();

				return 'string';
			}

			if (state.status == STATE_ATTRIBUTE_SQUOTE) {
				if (stream.skipTo("'")) {
					stream.match("'");
					state.status = STATE_ATTRIBUTE_NAME;
				} else stream.skipToEnd();

				return 'string';
			}
		}

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

			if (stream.match('(')) {
				state.status = STATE_ATTRIBUTE_NAME;
			} else {
				var separatorRegex = /^(?:[.]|)/i;
				stream.match(separatorRegex);
			}

			state.levels.push(level);

			return 'tag';
		} else if (c == '>' || c == ']') {
			var lbmLevel = state.levels[state.levels.length - 1] || 0;
			if (lbmLevel <= 0) {
				stream.next();
				return null;
			}

			var rbmString = '>'.repeat(lbmLevel - 1) + ']';
			if (stream.match(rbmString)) {
				state.levels.pop();
				return 'tag';
			} else {
				stream.next();
				return null;
			}
		}  else /* none of '[', ']', '`', '>' */ {
			// reduce text normalization overhead
			stream.match(/^[^\[\]`>]+/);
		}
	}

	CodeMirror.defineMode('m42kup', (config, parserConfig) => ({
		startState(baseColumn) {
			return {
				levels: [],
				status: STATE_NORMAL
			}
		},
		token
	}));
};