{
	var bstack = [], vlevel;
}

start =
	children:things
	{
		return {
			root: {
				type: 'root',
				children,
				location: location()
			}
		}
	}

things =
	a:thing*

thing =
	element
	/ verbatim
	/ text

element =
	lbm:lbm_push name:tag_name attributes:attributes children:things rbm:rbm_pop
	{
		return {
			type: 'element',
			lbm,
			name,
			attributes,
			children,
			rbm,
			location: location()
		}
	}

lbm =
	a:'[' b:$('<'*)
	&{return (bstack[bstack.length - 1] || 0) <= b.length + 1}
	{
		return a + b;
	}

lbm_push =
	a:lbm
	{
		bstack.push(a.length);
		return a;
	}

tag_name =
	$(
		// excludes: '(', '.', ':', '[', ']', '<', '`'
		'!'+ / '"'+ / '#'+ / '$'+ / '%'+
		/ '&'+ / "'"+ / ')'+ / '*'+ / '+'+
		/ ','+ / '-'+ / '/'+ / ';'+ / '='+
		/ '>'+ / '?'+ / '@'+ / '\\'+ / '^'+
		/ '_'+ / '{'+ / '|'+ / '}'+ / '~'+
	)
	/ a:[a-z] b:$[a-z0-9]* c:$(':' d:[a-z] e:[a-z0-9]* {return ':' + d + e.join('')})*
	{
		return a + b + c;
	}
	/ ''

attributes =
	left:'('
		content:(
			name:$[a-z0-9-]+
			value:(
				a:'=' b:'"' c:$(!'"' .)* d:('"' / EOF {return ''})
				{
					return [a, b, c, d];
				}
				/ a:'=' b:"'" c:$(!"'" .)* d:("'" / EOF {return ''})
				{
					return [a, b, c, d];
				}
				/ a:'=' c:$(!['"()\[\] \t\n\r] .)*
				{
					return [a, '', c, ''];
				}
				/ ''
				{
					return ['', '', '', ''];
				}
			)
			{
				return {
					_type: 'attribute',
					attribute: [name].concat(value)
				};
			}
			/ a:__
			{
				return {
					_type: 'whitespace',
					whitespace: a
				}
			}
			/ a:$(!')' !rbm .)
			{
				return {
					_type: 'error',
					error: a
				}
			}
		)*
	right:(')' / &rbm {return ''})
	{
		return {
			_type: 'parenthesis',
			left,
			content,
			right
		}
	}
	/ a:('.' / '')
	{
		return {
			_type: 'separator',
			separator: a
		}
	}

rbm =
	a:$('>'*) b:']'
	&{return (bstack[bstack.length - 1] || 0) == a.length + 1}
	{return a + b}
	/ EOF
	{return ''}

rbm_pop =
	a:rbm
	{
		bstack.pop();
		return a;
	}

EOF =
	!.

text =
	a:(!lbm !rbm !'`' b:. {return b})+
	{
		return {
			type: 'text',
			text: a.join(''),
			location: location()
		}
	}

verbatim =
	lvm:lvm separator:verbatim_separator child:verbatim_text rvm:rvm
	{
		return {
			type: 'verbatim',
			lvm,
			separator,
			child,
			rvm,
			location: location()
		}
	}

lvm =
	a:'`' b:'<'*
	{
		vlevel = b.length + 1;
		return a + b.join('');
	}

verbatim_separator =
	'.' / ''

rvm =
	a:'>'* b:'`'
		&{return vlevel == a.length + 1}
		{return a.join('') + b}
	/ EOF
	{return ''}

verbatim_text =
	a:(!rvm b:. {return b})*
	{
		return {
			type: 'text',
			text: a.join(''),
			location: location()
		}
	}

// optional whitespace
_ = $[ \t\n\r]*

// mandatory whitespace
__ = $[ \t\n\r]+