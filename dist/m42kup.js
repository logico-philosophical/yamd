var m42kup=function(t){var e={};function r(n){if(e[n])return e[n].exports;var a=e[n]={i:n,l:!1,exports:{}};return t[n].call(a.exports,a,a.exports,r),a.l=!0,a.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)r.d(n,a,function(e){return t[e]}.bind(null,a));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=1)}([function(t,e){function r(t){var e={};for(var r in t)e[r]=t[r];return e}function n(t){var e={};return t.tags&&(e.tags=r(t.tags)),e}function a(t,e){for(var n in t=r(t),e)t[n]=e[n];return t}t.exports={copyOptions:n,tags:a,options:function(t,e){if("object"!=typeof t||"object"!=typeof e)throw TypeError("One of the options provided is not an object");return t=n(t),e.tags&&(t.tags||(t.tags={}),t.tags=a(t.tags,e.tags)),t}}},function(t,e,r){var n=r(2),a=r(3),o=r(0),i={};var l={parser:n,converter:a,render:function(t,e){t+="",e||(e={}),e.tags||(e.tags={}),e=o.options(i,e);var r=n.generateParseTreeFromInput(t),l=n.generateASTFromParseTree(r);return a.convert(l,e)},cascade:function(t){if("object"!=typeof t)throw TypeError("typeof options != 'object'");i=o.options(i,t)},set:function(t){if("object"!=typeof t)throw TypeError("typeof options != 'object'");i=t}};t.exports=l},function(t,e){t.exports={generateParseTreeFromInput:function(t){var e={levels:[],stack:[]};function r(r){if("text"==r.type&&e.stack.length&&"text"==e.stack[e.stack.length-1].type){var n=e.stack.pop();r={type:"text",start:n.start,end:r.end,data:n.data+r.data}}if("right boundary marker"==r.type){for(var a=[r];;){if(!(l=e.stack.pop()))throw new Error("No lbm found");if(a.unshift(l),"left boundary marker"==l.type&&l.level==r.level)break}var o=a[0].start,i=a[a.length-1].end;r={type:"element",start:o,end:i,data:t.substring(o,i),children:a}}if("right verbatim marker"==r.type){var l;for(a=[r];;){if(!(l=e.stack.pop()))throw new Error("No lvm found");if(a.unshift(l),"left verbatim marker"==l.type&&l.level==r.level)break}var s=a[0].start,u=a[a.length-1].end;r={type:"verbatim",start:s,end:u,data:t.substring(s,u),children:a}}e.stack.push(r)}for(var n=0;n<t.length;)if("`"==t[n]){var a=n;for(n++;n<t.length&&"`"==t[n];n++);var o=n;r({type:"left verbatim marker",start:a,end:o,data:t.substring(a,o),level:o-a}),e.levels.push(-(o-a));var i,l,s=!1;for(n++;n<t.length;n++)if("`"==t[n]){var u=n;for(n++;n<t.length&&"`"==t[n];n++);var p=n;if(p-u==o-a){s=!0,[i,l]=[u,p];break}}r({type:"text",start:w=o,end:$=s?i:n,data:t.substring(w,$)}),s&&(r({type:"right verbatim marker",start:i,end:l,data:t.substring(i,l),level:l-i}),e.levels.pop())}else if("["==t[n]){var h=n;for(n++;n<t.length&&"["==t[n];n++);var c=n;if(c-h<(y=e.levels[e.levels.length-1]||0)){r({type:"text",start:h,end:c,data:t.substring(h,c)});continue}e.levels.push(c-h),r({type:"left boundary marker",start:h,end:c,data:t.substring(h,c),level:c-h});var f=n,d=f+t.substring(f).match(/^(?:(?:\*{1,3}|={1,6}|\${1,2}|;{1,3}|[!"#$%&')*+,\-.\/;<=>?@\\^_`{}~]|[a-z][a-z0-9]*)|)/i)[0].length;r({type:"tag name",start:f,end:d,data:t.substring(f,d)});var m=n=d,v=m+t.substring(m).match(/^(?:[ \t|]|)/i)[0].length;r({type:"separator",start:m,end:v,data:t.substring(m,v)}),n=v}else if("]"==t[n]){var y;if(0==(y=e.levels[e.levels.length-1]||0)){var g=n;for(n++;n<t.length&&"]"==t[n];n++);var b=n;r({type:"mismatched right boundary marker",start:g,end:b,data:t.substring(g,b)});continue}var x=n;for(n++;n-x<y&&n<t.length&&"]"==t[n];n++);var k=n;if(k-x<y){r({type:"text",start:x,end:k,data:t.substring(x,k)});continue}r({type:"right boundary marker",start:x,end:k,data:t.substring(x,k),level:k-x}),e.levels.pop()}else{var $,w=n;for(n++;n<t.length&&!["[","]","`"].includes(t[n]);n++);r({type:"text",start:w,end:$=n,data:t.substring(w,$)})}for(var E=e.levels.length-1;E>=0;E--){var j=e.levels[E]>0?"right boundary marker":"right verbatim marker",T=e.levels[E]>0?e.levels[E]:-e.levels[E];r({type:j,start:t.length,end:t.length,data:"",level:T})}return e.stack},generateASTFromParseTree:function(t){return function t(e){return e.map(e=>{switch(e.type){case"text":return{type:"text",text:e.data};case"verbatim":return{type:"text",text:e.children[1].data};case"element":return{type:"element",name:e.children[1].data,code:e.data,children:t(e.children.slice(3,-1))};case"mismatched right boundary marker":return{type:"error",text:e.data};default:throw new TypeError(`Unknown type: ${e.type}`)}})}(t)}}},function(t,e,r){var n=t=>({type:"text",text:t}),a=t=>({type:"html",html:t}),o=t=>`<code class="m42kup-error">${i(t)}</code>`,i=t=>t.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),l=t=>{if("html"==t.type)return t;if("text"==t.type)return a(i(t.text));if("error"==t.type)return a(o(t.text));throw new TypeError(`Cannot convert type ${t.type} to HTML`)},s=(...t)=>e=>(t.forEach(t=>e=t(e)),e),u={lbrack:t=>{if(t.text||t.html)throw new Error("Input to void element");return n("[")},rbrack:t=>{if(t.text||t.html)throw new Error("Input to void element");return n("]")},grave:t=>{if(t.text||t.html)throw new Error("Input to void element");return n("`")},comment:t=>n(""),entity:t=>{if("text"!=t.type)throw new TypeError("Non-text input");if(!/^([a-z]{1,50}|#[0-9]{1,10}|#x[0-9a-f]{1,10})$/i.test(t.text))throw new SyntaxError("Invalid value");return a(`&${t.text};`)}};["b","blockquote","code","i","u","h1","h2","h3","h4","h5","h6","p","sup","sub"].forEach(t=>u[t]=s(l,e=>a(`<${t}>${e.html}</${t}>`))),u.blockcode=s(l,t=>a(`<pre><code>${t.html}</code></pre>`)),u.bi=s(u.b,u.i),["br","hr"].forEach(t=>u[t]=s(l,e=>a(`<${t}>${e.html}`))),u.link=(t=>{if("text"!=t.type)throw new TypeError("Non-text input");return/^(http:\/\/|https:\/\/)/.test(t.text)||(t.text="http://"+t.text),t=l(t),a(`<a href="${t.html}">${t.html}</a>`)}),["ol","ul","li"].forEach(t=>u[t]=s(l,e=>a(`<${t}>${e.html}</${t}>`))),["table","tr","td","th"].forEach(t=>u[t]=s(l,e=>a(`<${t}>${e.html}</${t}>`))),["squote","dquote"].forEach(t=>u[t]=s(l,e=>{var r={squote:["‘","’"],dquote:["“","”"]};return a(`${r[t][0]}${e.html}${r[t][1]}`)})),["highlight","math","displaymath"].forEach(t=>u[t]=(t=>{throw Error("Element not implemented")}));var p={'"':"dquote",$:"math",$$:"displaymath","%":"comment","&":"entity","'":"squote","*":"i","**":"b","***":"bi",";":"code",";;":"blockcode",";;;":"highlight","=":"h1","==":"h2","===":"h3","====":"h4","=====":"h5","======":"h6",">":"blockquote","\\":"br","^":"sup",_:"sub","`":"grave","{":"lbrack","}":"rbrack","~":"link"};for(var h in p){if(!u[p[h]])throw new TypeError(`aliases[${JSON.stringify(h)}] aliases non-existing function ${JSON.stringify(p[h])}`);u[h]=u[p[h]]}t.exports={convert:function(t,e){e||(e={}),e.tags||(e.tags={});var n=r(0).tags(u,e.tags);for(var i in n)!1===n[i]&&delete n[i];for(var s=t=>{var e;try{if(!(t.name in n)){if(!t.name)throw Error("No tag name");throw Error("Undefined tag name")}t.children=t.children.map(t=>"element"==t.type?s(t):t),t.children.every(t=>"text"==t.type)?t.render={type:"text",text:t.children.map(t=>t.text).join("")}:t.render={type:"html",html:t.children.map(l).map(t=>t.html).join("")},e=n[t.name](t.render)}catch(r){e=a(o(`[${t.name}]: ${r.message}: ${t.code}`))}finally{return e}},p=0;p<t.length;p++)"element"==t[p].type&&(t[p]=s(t[p]));return t.map(l).map(t=>t.html).join("")},text:n,html:a,escapeHtml:i,htmlFilter:l}}]);