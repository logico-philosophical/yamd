const cascade = require('../src/cascade');

var o1 = {tags: {'=': false}};
var o2 = {tags: {'==': false}};

console.log('o1, o2 before');
console.log(o1, o2);
console.log('cascade.options');
var o3 = cascade.options(o1, o2);
console.log(o1, o2, o3);
console.log('modify cascaded');
o3.tags['==='] = false;
console.log(o1, o2, o3);
console.log('modify o1');
o1.tags['===='] = false;
console.log(o1, o2, o3);
console.log('modify o2');
o2.tags['====='] = false;
console.log(o1, o2, o3);
