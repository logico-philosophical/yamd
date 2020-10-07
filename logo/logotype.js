var glyphs = [
	[
		{d: 'M0 0v12 h12v-12l-6 6Z'},
		{d: 'M0 12l12 -12l0 12Z'}
	],
	[
		{d: 'M12 0v8 h-8Z'},
		{d: 'M0 12h12v-12Z'}
	],
	[
		{d: 'M0 0h8a4 4 0 0 1 0 8h-8Z'},
		{d: 'M0 0l12 12h-12Z'}
	],
	[
		{d: 'M0 0h12l-12 12Z'},
		{d: 'M0 0l12 12h-12Z'}
	],
	[
		{d: 'M0 0v6a6 6 0 0 0 12 0v-6Z'}
	],
	[
		{d: 'M0 0h8a4 4 0 0 1 0 8h-8Z'},
		{d: 'M0 0h6v12h-6Z'}
	]
];

var glyphSize = 12,
	spacing = 2;

var width = glyphSize * glyphs.length + spacing * (glyphs.length + 1),
	height = glyphSize + spacing * 2;

var svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="${512 / width * height}" viewBox="${-spacing} ${-spacing} ${width} ${height}">`;

var fills = ['#F44336', '#FF9800', '#3F51B5', '#03A9F4', '#009688', '#607D8B'];

for (var i = 0; i < glyphs.length; i++) {
	var x = glyphSize * i + spacing * i;

	for(var j = 0; j < glyphs[i].length; j++) {
		var d = glyphs[i][j].d.replace(/M([0-9-]+) ([0-9-]+)/g, (m, g1, g2) => {
			return `M${g1 * 1 + x} ${g2}`;
		});

		svg += `<path d="${d}" fill="${fills[i]}" opacity="60%"/>`;
	}
}

svg += '</svg>';

console.log(svg);