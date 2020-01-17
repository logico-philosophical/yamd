{
	var bstack = [], vlevel;
}

start
	= children:things {
		return {
			root: {
				type: 'root',
				children,
				location: location()
			}
		}
	}

things
	= a:thing*
	/* don't {
		// join text nodes
		return a.reduce((l, r) => {
			if (r.type == 'text') {
				if (!r.text) return l;

				if (l[l.length - 1] && l[l.length - 1].type == 'text') {
					console.log('join')
					l[l.length - 1].text += r.text;
					return l;
				}
			}

			l.push(r);
			return l;
		}, []);
	} */

thing
	= element
	/ verbatim
	/ text

element
	= lbm:lbm_push name:tag_name properties:properties children:things rbm:rbm_pop
	{
		return {
			type: 'element',
			lbm,
			name,
			properties,
			children,
			rbm,
			location: location()
		}
	}

lbm
	= a:'[' b:'<'*
	&{return (bstack[bstack.length - 1] || 0) <= b.length + 1}
	{return a + b.join('')}

lbm_push
	= a:lbm
	{bstack.push(a.length); return a}

tag_name
	= t:(
		// excludes: '(', '.', ':', '[', ']', '<', '`'
		'!'+ / '"'+ / '#'+ / '$'+ / '%'+
		/ '&'+ / "'"+ / ')'+ / '*'+ / '+'+
		/ ','+ / '-'+ / '/'+ / ';'+ / '='+
		/ '>'+ / '?'+ / '@'+ / '\\'+ / '^'+
		/ '_'+ / '{'+ / '|'+ / '}'+ / '~'+
	) {return t.join('')}
	/ a:[a-z] b:[a-z0-9]* c:(':' d:[a-z] e:[a-z0-9]* {return ':' + d + e.join('')})*
		{return a + b.join('') + c.join('')}
	/ ''

properties
	= left:'('
		d:(
			b:[a-z0-9-]+
			c:(
				'=' '"' a:(!'"' .)* '"'
				{return [
					'=',
					'"',
					a.map(e => e[1]).join(''),
					'"'
				]}
				/ '=' "'" a:(!"'" .)* "'"
				{return [
					'=',
					"'",
					a.map(e => e[1]).join(''),
					"'"
				]}
				/ '=' a:(!['") \t\n\r] .)*
				{return [
					'=',
					'',
					a.map(e => e[1]).join(''),
					''
				]}
				/ ''
				{return [
					'', '', '', ''
				]}
			)
			{return {
				_type: 'property',
				property: [b.join('')].concat(c)
			}}
			/ a:__
			{return {
				_type: 'whitespace',
				whitespace: a
			}}
		)*
	right:')'
	{return {
		_type: 'parenthesis',
		left,
		content: d,
		right
	}}
	/ a:('.' / '')
	{return {
		_type: 'separator',
		separator: a
	}}

rbm
	= a:'>'* b:']'
		&{return (bstack[bstack.length - 1] || 0) == a.length + 1}
		{return a.join('') + b}
	/ EOF
		{return ''}

rbm_pop
	= a:rbm
		{bstack.pop(); return a}

EOF
	= !.

text
	= a:(!lbm !rbm !'`' b:. {return b})+ {return {
		type: 'text',
		text: a.join(''),
		location: location()
	}}

verbatim
	= lvm:lvm separator:verbatim_separator child:verbatim_text rvm:rvm
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

lvm
	= a:'`' b:'<'*
		{vlevel = b.length + 1; return a + b.join('')}

verbatim_separator
	= '.' / ''

rvm
	= a:'>'* b:'`'
		&{return vlevel == a.length + 1}
		{return a.join('') + b}
	/ EOF
		{return ''}

verbatim_text
	= a:(!rvm b:. {return b})*
	{
		return {
			type: 'text',
			text: a.join(''),
			location: location()
		}
	}

// optional whitespace
_ = a:[ \t\n\r]* {return a.join('')}

// mandatory whitespace
__ = a:[ \t\n\r]+ {return a.join('')}