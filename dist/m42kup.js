var m42kup=function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=2)}([function(t,e,r){"use strict";function n(){}function o(t){t.prototype=Object.create(n.prototype),Object.defineProperty(t.prototype,"constructor",{value:t,enumerable:!1,writable:!0})}function i(t){if("string"!=typeof t)throw TypeError("text not string");this.text=t}function a({html:t,display:e}){if("string"!=typeof t)throw TypeError("html not string");if(!["inline","leaf-block","container-block"].includes(e))throw TypeError('arg0.display should be one of "inline", "leaf-block", or "container-block".');this.html=t,this.display=e}function s({message:t,code:e}){if("string"!=typeof t)throw TypeError("message not string");if("string"!=typeof e)throw TypeError("code not string");this.message=t,this.code=e}function c({name:t,display:e,render:r,split:n}){if(!t)throw TypeError("You give arg0 a bad name");if(!["inline","leaf-block","container-block"].includes(e))throw TypeError('arg0.display should be one of "inline", "leaf-block", or "container-block".');if(!(r instanceof Function))throw TypeError("arg0.render should be a function");if([this.name,this.display]=[t,e],this.render=(t,e)=>{if(!(t instanceof l))throw TypeError("arg0 should be an instance of m42kup.renderer.Element");return r(t,e)},void 0!==n){if("string"==typeof n&&(n=[n]),!(n instanceof Array))throw TypeError("arg0.split should be either undefined, a string, or an array");if(!n.length)throw TypeError("arg0.split.length == 0");this.split=n}}function l({name:t,display:e,render:r,code:n,properties:o,children:c,split:p,options:h}){if(!t)throw TypeError("You give arg0 a bad name");if(!["inline","leaf-block","container-block"].includes(e))throw TypeError('arg0.display should be one of "inline", "leaf-block", or "container-block".');if(!(r instanceof Function))throw TypeError("arg0.render should be a function");if("string"!=typeof n)throw TypeError("You give arg0 a bad code");if(!(o instanceof Array))throw TypeError("Properties should be an array");if((()=>{var t=e=>e instanceof l||e instanceof i||e instanceof s||e instanceof Array&&e.every(t);if(!c.every(t))throw TypeError("All arg0.children should either be an Element, a TextNode, or an ErrorNode")})(),void 0!==p){if("string"==typeof p&&(p=[p]),!(p instanceof Array))throw TypeError("arg0.split should be either undefined, a string, or an array");if(!p.length)throw TypeError("arg0.split.length == 0");this.split=p}var u,f;[this.name,this.display,this.code,this.properties,this.children]=[t,e,n,o,c],this.innerIsText=(u=p?p.length:0,(f=(t,e)=>e>0?t.map(t=>f(t,e-1)):t.map(t=>t instanceof i||!(t instanceof s)&&t.outerIsText).every(t=>t))(c,u)),this.innerText=(()=>{var t=p?p.length:0,e=(t,r,n)=>r>0?t.map((t,o)=>e(t,r-1,n[o])):n?t.map(t=>t instanceof i?t.text:t.outerText).join(""):null;return e(c,t,this.innerIsText)})(),this.innerHtml=(()=>{var t=p?p.length:0,e=(t,r,n,o)=>{if(r>0)return t.map((t,i)=>e(t,r-1,n[i],o[i]));if(n)return o.trim()&&"container-block"==this.display?o.split(/(?:\r\n[ \t]*){2,}|(?:\r[ \t]*){2,}|(?:\n[ \t]*){2,}/).filter(t=>!!t.trim()).map(this.escapeHtml).map(t=>`<p>${t}</p>`).join(""):this.escapeHtml(o);if("container-block"!=this.display)return t.map(t=>t instanceof i?this.escapeHtml(t.text):t instanceof s?'<code class="m42kup-error">'+this.escapeHtml(t.code)+"</code>":t.outerHtml).join("");var a=[],c=[],l=()=>{c.length&&(a.push(c),c=[])},p=t=>c.push(t);return t.forEach(t=>{if(t instanceof i){var e=t.text.split(/(?:\r\n[ \t]*){2,}|(?:\r[ \t]*){2,}|(?:\n[ \t]*){2,}/);if(e.length<2)return p(t);e.forEach((t,r)=>{t.trim()&&p(this.text(t)),r<e.length-1&&l()})}else t instanceof s?p(t):"inline"!=t.display?(l(),a.push(t),l()):p(t)}),l(),a.map(t=>t instanceof Array?"<p>"+t.map(t=>t instanceof i?this.escapeHtml(t.text):t instanceof s?'<code class="m42kup-error">'+this.escapeHtml(t.code)+"</code>":t.outerHtml).join("")+"</p>":t.outerHtml).join("")};return e(c,t,this.innerIsText,this.innerText)})();var d=r(this,h);if(this.outerIsText=d instanceof i,this.outerText=this.outerIsText?d.text:null,this.isError=d instanceof s,this.errorMessage=d instanceof s?d.message:null,this.outerIsText)this.outerHtml=this.escapeHtml(this.outerText);else if(d instanceof a)this.outerHtml=d.html;else{if(!(d instanceof s))throw TypeError("Render output should be one of TextNode, HtmlNode, or ErrorNode");this.outerHtml=`<code class="m42kup-error" title="[${this.escapeHtml(this.name)}]: Error: ${this.escapeHtml(d.message)}">${this.escapeHtml(d.code)}</code>`}}o(i),i.prototype.toString=function(){return this.toIndentedString(0)},i.prototype.toIndentedString=function(t){return"\t".repeat(t)+`Text {${JSON.stringify(this.text)}}`},o(a),a.prototype.toString=function(){return this.toIndentedString(0)},a.prototype.toIndentedString=function(t){var e=["display"].map(t=>t+"="+JSON.stringify(this[t])).join(" ");return"\t".repeat(t)+`Html(${e}) {${JSON.stringify(this.html)}}`},o(s),s.prototype.toString=function(){return this.toIndentedString(0)},s.prototype.toIndentedString=function(t){var e=["message","code"].map(t=>t+"="+JSON.stringify(this[t])).join(" ");return"\t".repeat(t)+`Error(${e})`},c.prototype.instantiate=function({code:t,properties:e,children:r,options:n}){if(!(this instanceof c))throw Error("ElementClass.prototype.instantiate should be called as a method of an ElementClass instance");return new l({name:this.name,display:this.display,render:this.render,code:t,properties:e,children:r,split:this.split,options:n})},o(l),l.prototype.text=function(t){return new i(t)},l.prototype.html=function(t){return new a({html:t,display:this.display})},l.prototype.error=function(t){return new s({message:t,code:this.code})},l.prototype.getProperty=function(t){for(var e=0;e<this.properties.length;e++)if(this.properties[e].name==t)return this.properties[e].value;return null},l.prototype.toString=function(){return this.toIndentedString(0)},l.prototype.toIndentedString=function(t){var e,r=["display","code","properties","split","isError","errorMessage","innerIsText","innerText","innerHtml","outerIsText","outerText","outerHtml"].map(t=>t+"="+("string"==typeof this[t]||this[t]instanceof Array?JSON.stringify(this[t]):this[t]+"")).join("\n"+"\t".repeat(t+1));return(()=>{var r=(e,n)=>e instanceof Array?e.map(r).join(",\n"):e.toIndentedString(t+1);e=this.children.map(r).join(",\n")})(),"\t".repeat(t)+`Element[${JSON.stringify(this.name)}](\n${"\t".repeat(t+1)}${r}\n${"\t".repeat(t)}) {\n${e}\n${"\t".repeat(t)}}`},l.prototype.escapeHtml=t=>(t+"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),t.exports={Node:n,TextNode:i,HtmlNode:a,ErrorNode:s,ElementClass:c,Element:l}},function(t,e){function r(t){var e={};for(var r in t)e[r]=t[r];return e}function n(t){var e={};return t.tags&&(e.tags=r(t.tags)),t.hljs&&(e.hljs=t.hljs),t.katex&&(e.katex=t.katex),e}function o(t,e){for(var n in t=r(t),e)t[n]=e[n];return t}t.exports={copyOptions:n,tags:o,options:function(t,e){if("object"!=typeof t||"object"!=typeof e)throw TypeError("One of the options provided is not an object");return t=n(t),e.tags&&(t.tags||(t.tags={}),t.tags=o(t.tags,e.tags)),e.hljs&&(t.hljs=e.hljs),e.katex&&(t.katex=e.katex),t}}},function(t,e,r){var n=r(3),o=r(5),i=r(7),a=r(1),s={};var c={parser:n,renderer:o,highlighter:i,ast2nt:function(t,e){return e||(e={}),e.tags||(e.tags={}),e=a.options(s,e),o.ast2nt(t,e)},render:function(t,e){t+="",e||(e={}),e.tags||(e.tags={}),e=a.options(s,e);var r=n.input2pt(t),i=n.pt2ast(r);return o.ast2nt(i,e).outerHtml},highlight:function(t){t+="";var e=n.input2pt(t);return i.pt2hl(e)},cascade:function(t){if("object"!=typeof t)throw TypeError("typeof options != 'object'");s=a.options(s,t)},set:function(t){if("object"!=typeof t)throw TypeError("typeof options != 'object'");s=t}};t.exports=c},function(t,e,r){var n=r(4);t.exports={input2pt:function(t){var e=n.parse(t);return e.input=t,e},pt2ast:function(t){var e=t.input,r=function t(r){return r.map(r=>{switch(r.type){case"text":return{type:"text",text:r.text};case"verbatim":return{type:"text",text:r.child.text};case"element":var n="parenthesis"!=r.properties._type?[]:r.properties.content.filter(({_type:t})=>"property").map(({property:t})=>({name:t[0],value:t[3]}));return{type:"element",name:r.name,properties:n,code:e.substring(r.location.start.offset,r.location.end.offset),children:t(r.children)};default:throw new TypeError(`Unknown type: ${r.type}`)}}).reduce((t,e,r)=>{if("text"==e.type){if(!e.text)return t;if(r>0&&"text"==t[t.length-1].type)return t[t.length-1].text+=e.text,t}return t.push(e),t},[])}(t.root.children);return{input:t.input,root:{type:"root",children:r,code:e.substring(t.root.location.start.offset,t.root.location.end.offset),location:t.root.location}}}}},function(t,e,r){"use strict";function n(t,e,r,o){this.message=t,this.expected=e,this.found=r,this.location=o,this.name="SyntaxError","function"==typeof Error.captureStackTrace&&Error.captureStackTrace(this,n)}!function(t,e){function r(){this.constructor=t}r.prototype=e.prototype,t.prototype=new r}(n,Error),n.buildMessage=function(t,e){var r={literal:function(t){return'"'+o(t.text)+'"'},class:function(t){var e,r="";for(e=0;e<t.parts.length;e++)r+=t.parts[e]instanceof Array?i(t.parts[e][0])+"-"+i(t.parts[e][1]):i(t.parts[e]);return"["+(t.inverted?"^":"")+r+"]"},any:function(t){return"any character"},end:function(t){return"end of input"},other:function(t){return t.description}};function n(t){return t.charCodeAt(0).toString(16).toUpperCase()}function o(t){return t.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,(function(t){return"\\x0"+n(t)})).replace(/[\x10-\x1F\x7F-\x9F]/g,(function(t){return"\\x"+n(t)}))}function i(t){return t.replace(/\\/g,"\\\\").replace(/\]/g,"\\]").replace(/\^/g,"\\^").replace(/-/g,"\\-").replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,(function(t){return"\\x0"+n(t)})).replace(/[\x10-\x1F\x7F-\x9F]/g,(function(t){return"\\x"+n(t)}))}return"Expected "+function(t){var e,n,o,i=new Array(t.length);for(e=0;e<t.length;e++)i[e]=(o=t[e],r[o.type](o));if(i.sort(),i.length>0){for(e=1,n=1;e<i.length;e++)i[e-1]!==i[e]&&(i[n]=i[e],n++);i.length=n}switch(i.length){case 1:return i[0];case 2:return i[0]+" or "+i[1];default:return i.slice(0,-1).join(", ")+", or "+i[i.length-1]}}(t)+" but "+function(t){return t?'"'+o(t)+'"':"end of input"}(e)+" found."},t.exports={SyntaxError:n,parse:function(t,e){e=void 0!==e?e:{};var r,o={},i={start:me},a=me,s=function(t){return{root:{type:"root",children:t,location:ce()}}},c=function(t,e,r,n,o){return{type:"element",lbm:t,name:e,properties:r,children:n,rbm:o,location:ce()}},l="[",p=le("[",!1),h="<",u=le("<",!1),f=function(t,e){return(Ee[Ee.length-1]||0)<=e.length+1},d=function(t,e){return t+e.join("")},m=function(t){return Ee.push(t.length),t},y="!",g=le("!",!1),A='"',x=le('"',!1),v="#",b=le("#",!1),C="$",w=le("$",!1),E="%",T=le("%",!1),k="&",$=le("&",!1),j="'",H=le("'",!1),N=")",S=le(")",!1),I="*",O=le("*",!1),_="+",q=le("+",!1),M=",",z=le(",",!1),F="-",R=le("-",!1),P="/",U=le("/",!1),J=";",L=le(";",!1),Y="=",B=le("=",!1),D=">",G=le(">",!1),K="?",Q=le("?",!1),V="@",W=le("@",!1),X="\\",Z=le("\\",!1),tt="^",et=le("^",!1),rt="_",nt=le("_",!1),ot="{",it=le("{",!1),at="|",st=le("|",!1),ct="}",lt=le("}",!1),pt="~",ht=le("~",!1),ut=function(t){return t.join("")},ft=/^[a-z]/,dt=pe([["a","z"]],!1,!1),mt=/^[a-z0-9]/,yt=pe([["a","z"],["0","9"]],!1,!1),gt=":",At=le(":",!1),xt=function(t,e,r,n){return":"+r+n.join("")},vt=function(t,e,r){return t+e.join("")+r.join("")},bt="",Ct="(",wt=le("(",!1),Et=/^[a-z0-9\-]/,Tt=pe([["a","z"],["0","9"],"-"],!1,!1),kt={type:"any"},$t=function(t,e,r){return["=",'"',r.map(t=>t[1]).join(""),'"']},jt=function(t,e,r){return["=","'",r.map(t=>t[1]).join(""),"'"]},Ht=/^['") \t\n\r]/,Nt=pe(["'",'"',")"," ","\t","\n","\r"],!1,!1),St=function(t,e,r){return["=","",r.map(t=>t[1]).join(""),""]},It=function(t,e){return["","","",""]},Ot=function(t,e,r){return{_type:"property",property:[e.join("")].concat(r)}},_t=function(t,e){return{_type:"whitespace",whitespace:e}},qt=function(t,e,r){return{_type:"parenthesis",left:t,content:e,right:r}},Mt=".",zt=le(".",!1),Ft=function(t){return{_type:"separator",separator:t}},Rt="]",Pt=le("]",!1),Ut=function(t,e){return(Ee[Ee.length-1]||0)==t.length+1},Jt=function(t,e){return t.join("")+e},Lt=function(){return""},Yt=function(t){return Ee.pop(),t},Bt="`",Dt=le("`",!1),Gt=function(t){return t},Kt=function(t){return{type:"text",text:t.join(""),location:ce()}},Qt=function(t,e,r,n){return{type:"verbatim",lvm:t,separator:e,child:r,rvm:n,location:ce()}},Vt=function(t,e){return we=e.length+1,t+e.join("")},Wt=function(t,e){return we==t.length+1},Xt=function(t){return{type:"text",text:t.join(""),location:ce()}},Zt=/^[ \t\n\r]/,te=pe([" ","\t","\n","\r"],!1,!1),ee=function(t){return t.join("")},re=0,ne=0,oe=[{line:1,column:1}],ie=0,ae=[],se=0;if("startRule"in e){if(!(e.startRule in i))throw new Error("Can't start parsing from rule \""+e.startRule+'".');a=i[e.startRule]}function ce(){return ue(ne,re)}function le(t,e){return{type:"literal",text:t,ignoreCase:e}}function pe(t,e,r){return{type:"class",parts:t,inverted:e,ignoreCase:r}}function he(e){var r,n=oe[e];if(n)return n;for(r=e-1;!oe[r];)r--;for(n={line:(n=oe[r]).line,column:n.column};r<e;)10===t.charCodeAt(r)?(n.line++,n.column=1):n.column++,r++;return oe[e]=n,n}function ue(t,e){var r=he(t),n=he(e);return{start:{offset:t,line:r.line,column:r.column},end:{offset:e,line:n.line,column:n.column}}}function fe(t){re<ie||(re>ie&&(ie=re,ae=[]),ae.push(t))}function de(t,e,r){return new n(n.buildMessage(t,e),t,e,r)}function me(){var t,e;return t=re,(e=ye())!==o&&(ne=t,e=s(e)),t=e}function ye(){var t,e;for(t=[],e=ge();e!==o;)t.push(e),e=ge();return t}function ge(){var e;return(e=function(){var e,r,n,i,a,s;e=re,(r=function(){var t,e;t=re,(e=Ae())!==o&&(ne=t,e=m(e));return t=e}())!==o&&(n=function(){var e,r,n,i,a,s,c,l,p;e=re,r=[],33===t.charCodeAt(re)?(n=y,re++):(n=o,0===se&&fe(g));if(n!==o)for(;n!==o;)r.push(n),33===t.charCodeAt(re)?(n=y,re++):(n=o,0===se&&fe(g));else r=o;if(r===o){if(r=[],34===t.charCodeAt(re)?(n=A,re++):(n=o,0===se&&fe(x)),n!==o)for(;n!==o;)r.push(n),34===t.charCodeAt(re)?(n=A,re++):(n=o,0===se&&fe(x));else r=o;if(r===o){if(r=[],35===t.charCodeAt(re)?(n=v,re++):(n=o,0===se&&fe(b)),n!==o)for(;n!==o;)r.push(n),35===t.charCodeAt(re)?(n=v,re++):(n=o,0===se&&fe(b));else r=o;if(r===o){if(r=[],36===t.charCodeAt(re)?(n=C,re++):(n=o,0===se&&fe(w)),n!==o)for(;n!==o;)r.push(n),36===t.charCodeAt(re)?(n=C,re++):(n=o,0===se&&fe(w));else r=o;if(r===o){if(r=[],37===t.charCodeAt(re)?(n=E,re++):(n=o,0===se&&fe(T)),n!==o)for(;n!==o;)r.push(n),37===t.charCodeAt(re)?(n=E,re++):(n=o,0===se&&fe(T));else r=o;if(r===o){if(r=[],38===t.charCodeAt(re)?(n=k,re++):(n=o,0===se&&fe($)),n!==o)for(;n!==o;)r.push(n),38===t.charCodeAt(re)?(n=k,re++):(n=o,0===se&&fe($));else r=o;if(r===o){if(r=[],39===t.charCodeAt(re)?(n=j,re++):(n=o,0===se&&fe(H)),n!==o)for(;n!==o;)r.push(n),39===t.charCodeAt(re)?(n=j,re++):(n=o,0===se&&fe(H));else r=o;if(r===o){if(r=[],41===t.charCodeAt(re)?(n=N,re++):(n=o,0===se&&fe(S)),n!==o)for(;n!==o;)r.push(n),41===t.charCodeAt(re)?(n=N,re++):(n=o,0===se&&fe(S));else r=o;if(r===o){if(r=[],42===t.charCodeAt(re)?(n=I,re++):(n=o,0===se&&fe(O)),n!==o)for(;n!==o;)r.push(n),42===t.charCodeAt(re)?(n=I,re++):(n=o,0===se&&fe(O));else r=o;if(r===o){if(r=[],43===t.charCodeAt(re)?(n=_,re++):(n=o,0===se&&fe(q)),n!==o)for(;n!==o;)r.push(n),43===t.charCodeAt(re)?(n=_,re++):(n=o,0===se&&fe(q));else r=o;if(r===o){if(r=[],44===t.charCodeAt(re)?(n=M,re++):(n=o,0===se&&fe(z)),n!==o)for(;n!==o;)r.push(n),44===t.charCodeAt(re)?(n=M,re++):(n=o,0===se&&fe(z));else r=o;if(r===o){if(r=[],45===t.charCodeAt(re)?(n=F,re++):(n=o,0===se&&fe(R)),n!==o)for(;n!==o;)r.push(n),45===t.charCodeAt(re)?(n=F,re++):(n=o,0===se&&fe(R));else r=o;if(r===o){if(r=[],47===t.charCodeAt(re)?(n=P,re++):(n=o,0===se&&fe(U)),n!==o)for(;n!==o;)r.push(n),47===t.charCodeAt(re)?(n=P,re++):(n=o,0===se&&fe(U));else r=o;if(r===o){if(r=[],59===t.charCodeAt(re)?(n=J,re++):(n=o,0===se&&fe(L)),n!==o)for(;n!==o;)r.push(n),59===t.charCodeAt(re)?(n=J,re++):(n=o,0===se&&fe(L));else r=o;if(r===o){if(r=[],61===t.charCodeAt(re)?(n=Y,re++):(n=o,0===se&&fe(B)),n!==o)for(;n!==o;)r.push(n),61===t.charCodeAt(re)?(n=Y,re++):(n=o,0===se&&fe(B));else r=o;if(r===o){if(r=[],62===t.charCodeAt(re)?(n=D,re++):(n=o,0===se&&fe(G)),n!==o)for(;n!==o;)r.push(n),62===t.charCodeAt(re)?(n=D,re++):(n=o,0===se&&fe(G));else r=o;if(r===o){if(r=[],63===t.charCodeAt(re)?(n=K,re++):(n=o,0===se&&fe(Q)),n!==o)for(;n!==o;)r.push(n),63===t.charCodeAt(re)?(n=K,re++):(n=o,0===se&&fe(Q));else r=o;if(r===o){if(r=[],64===t.charCodeAt(re)?(n=V,re++):(n=o,0===se&&fe(W)),n!==o)for(;n!==o;)r.push(n),64===t.charCodeAt(re)?(n=V,re++):(n=o,0===se&&fe(W));else r=o;if(r===o){if(r=[],92===t.charCodeAt(re)?(n=X,re++):(n=o,0===se&&fe(Z)),n!==o)for(;n!==o;)r.push(n),92===t.charCodeAt(re)?(n=X,re++):(n=o,0===se&&fe(Z));else r=o;if(r===o){if(r=[],94===t.charCodeAt(re)?(n=tt,re++):(n=o,0===se&&fe(et)),n!==o)for(;n!==o;)r.push(n),94===t.charCodeAt(re)?(n=tt,re++):(n=o,0===se&&fe(et));else r=o;if(r===o){if(r=[],95===t.charCodeAt(re)?(n=rt,re++):(n=o,0===se&&fe(nt)),n!==o)for(;n!==o;)r.push(n),95===t.charCodeAt(re)?(n=rt,re++):(n=o,0===se&&fe(nt));else r=o;if(r===o){if(r=[],123===t.charCodeAt(re)?(n=ot,re++):(n=o,0===se&&fe(it)),n!==o)for(;n!==o;)r.push(n),123===t.charCodeAt(re)?(n=ot,re++):(n=o,0===se&&fe(it));else r=o;if(r===o){if(r=[],124===t.charCodeAt(re)?(n=at,re++):(n=o,0===se&&fe(st)),n!==o)for(;n!==o;)r.push(n),124===t.charCodeAt(re)?(n=at,re++):(n=o,0===se&&fe(st));else r=o;if(r===o){if(r=[],125===t.charCodeAt(re)?(n=ct,re++):(n=o,0===se&&fe(lt)),n!==o)for(;n!==o;)r.push(n),125===t.charCodeAt(re)?(n=ct,re++):(n=o,0===se&&fe(lt));else r=o;if(r===o)if(r=[],126===t.charCodeAt(re)?(n=pt,re++):(n=o,0===se&&fe(ht)),n!==o)for(;n!==o;)r.push(n),126===t.charCodeAt(re)?(n=pt,re++):(n=o,0===se&&fe(ht));else r=o}}}}}}}}}}}}}}}}}}}}}}}r!==o&&(ne=e,r=ut(r));if((e=r)===o){if(e=re,ft.test(t.charAt(re))?(r=t.charAt(re),re++):(r=o,0===se&&fe(dt)),r!==o){for(n=[],mt.test(t.charAt(re))?(i=t.charAt(re),re++):(i=o,0===se&&fe(yt));i!==o;)n.push(i),mt.test(t.charAt(re))?(i=t.charAt(re),re++):(i=o,0===se&&fe(yt));if(n!==o){if(i=[],a=re,58===t.charCodeAt(re)?(s=gt,re++):(s=o,0===se&&fe(At)),s!==o)if(ft.test(t.charAt(re))?(c=t.charAt(re),re++):(c=o,0===se&&fe(dt)),c!==o){for(l=[],mt.test(t.charAt(re))?(p=t.charAt(re),re++):(p=o,0===se&&fe(yt));p!==o;)l.push(p),mt.test(t.charAt(re))?(p=t.charAt(re),re++):(p=o,0===se&&fe(yt));l!==o?(ne=a,s=xt(r,n,c,l),a=s):(re=a,a=o)}else re=a,a=o;else re=a,a=o;for(;a!==o;)if(i.push(a),a=re,58===t.charCodeAt(re)?(s=gt,re++):(s=o,0===se&&fe(At)),s!==o)if(ft.test(t.charAt(re))?(c=t.charAt(re),re++):(c=o,0===se&&fe(dt)),c!==o){for(l=[],mt.test(t.charAt(re))?(p=t.charAt(re),re++):(p=o,0===se&&fe(yt));p!==o;)l.push(p),mt.test(t.charAt(re))?(p=t.charAt(re),re++):(p=o,0===se&&fe(yt));l!==o?(ne=a,s=xt(r,n,c,l),a=s):(re=a,a=o)}else re=a,a=o;else re=a,a=o;i!==o?(ne=e,r=vt(r,n,i),e=r):(re=e,e=o)}else re=e,e=o}else re=e,e=o;e===o&&(e=bt)}return e}())!==o&&(i=function(){var e,r,n,i,a,s,c,l,p,h,u,f;e=re,40===t.charCodeAt(re)?(r=Ct,re++):(r=o,0===se&&fe(wt));if(r!==o){if(n=[],i=re,a=[],Et.test(t.charAt(re))?(s=t.charAt(re),re++):(s=o,0===se&&fe(Tt)),s!==o)for(;s!==o;)a.push(s),Et.test(t.charAt(re))?(s=t.charAt(re),re++):(s=o,0===se&&fe(Tt));else a=o;if(a!==o){if(s=re,61===t.charCodeAt(re)?(c=Y,re++):(c=o,0===se&&fe(B)),c!==o)if(34===t.charCodeAt(re)?(l=A,re++):(l=o,0===se&&fe(x)),l!==o){for(p=[],h=re,u=re,se++,34===t.charCodeAt(re)?(f=A,re++):(f=o,0===se&&fe(x)),se--,f===o?u=void 0:(re=u,u=o),u!==o?(t.length>re?(f=t.charAt(re),re++):(f=o,0===se&&fe(kt)),f!==o?h=u=[u,f]:(re=h,h=o)):(re=h,h=o);h!==o;)p.push(h),h=re,u=re,se++,34===t.charCodeAt(re)?(f=A,re++):(f=o,0===se&&fe(x)),se--,f===o?u=void 0:(re=u,u=o),u!==o?(t.length>re?(f=t.charAt(re),re++):(f=o,0===se&&fe(kt)),f!==o?h=u=[u,f]:(re=h,h=o)):(re=h,h=o);p!==o?(34===t.charCodeAt(re)?(h=A,re++):(h=o,0===se&&fe(x)),h!==o?(ne=s,c=$t(r,a,p),s=c):(re=s,s=o)):(re=s,s=o)}else re=s,s=o;else re=s,s=o;if(s===o){if(s=re,61===t.charCodeAt(re)?(c=Y,re++):(c=o,0===se&&fe(B)),c!==o)if(39===t.charCodeAt(re)?(l=j,re++):(l=o,0===se&&fe(H)),l!==o){for(p=[],h=re,u=re,se++,39===t.charCodeAt(re)?(f=j,re++):(f=o,0===se&&fe(H)),se--,f===o?u=void 0:(re=u,u=o),u!==o?(t.length>re?(f=t.charAt(re),re++):(f=o,0===se&&fe(kt)),f!==o?h=u=[u,f]:(re=h,h=o)):(re=h,h=o);h!==o;)p.push(h),h=re,u=re,se++,39===t.charCodeAt(re)?(f=j,re++):(f=o,0===se&&fe(H)),se--,f===o?u=void 0:(re=u,u=o),u!==o?(t.length>re?(f=t.charAt(re),re++):(f=o,0===se&&fe(kt)),f!==o?h=u=[u,f]:(re=h,h=o)):(re=h,h=o);p!==o?(39===t.charCodeAt(re)?(h=j,re++):(h=o,0===se&&fe(H)),h!==o?(ne=s,c=jt(r,a,p),s=c):(re=s,s=o)):(re=s,s=o)}else re=s,s=o;else re=s,s=o;if(s===o){if(s=re,61===t.charCodeAt(re)?(c=Y,re++):(c=o,0===se&&fe(B)),c!==o){for(l=[],p=re,h=re,se++,Ht.test(t.charAt(re))?(u=t.charAt(re),re++):(u=o,0===se&&fe(Nt)),se--,u===o?h=void 0:(re=h,h=o),h!==o?(t.length>re?(u=t.charAt(re),re++):(u=o,0===se&&fe(kt)),u!==o?p=h=[h,u]:(re=p,p=o)):(re=p,p=o);p!==o;)l.push(p),p=re,h=re,se++,Ht.test(t.charAt(re))?(u=t.charAt(re),re++):(u=o,0===se&&fe(Nt)),se--,u===o?h=void 0:(re=h,h=o),h!==o?(t.length>re?(u=t.charAt(re),re++):(u=o,0===se&&fe(kt)),u!==o?p=h=[h,u]:(re=p,p=o)):(re=p,p=o);l!==o?(ne=s,c=St(r,a,l),s=c):(re=s,s=o)}else re=s,s=o;s===o&&(s=re,(c=bt)!==o&&(ne=s,c=It(r,a)),s=c)}}s!==o?(ne=i,a=Ot(r,a,s),i=a):(re=i,i=o)}else re=i,i=o;for(i===o&&(i=re,(a=Ce())!==o&&(ne=i,a=_t(r,a)),i=a);i!==o;){if(n.push(i),i=re,a=[],Et.test(t.charAt(re))?(s=t.charAt(re),re++):(s=o,0===se&&fe(Tt)),s!==o)for(;s!==o;)a.push(s),Et.test(t.charAt(re))?(s=t.charAt(re),re++):(s=o,0===se&&fe(Tt));else a=o;if(a!==o){if(s=re,61===t.charCodeAt(re)?(c=Y,re++):(c=o,0===se&&fe(B)),c!==o)if(34===t.charCodeAt(re)?(l=A,re++):(l=o,0===se&&fe(x)),l!==o){for(p=[],h=re,u=re,se++,34===t.charCodeAt(re)?(f=A,re++):(f=o,0===se&&fe(x)),se--,f===o?u=void 0:(re=u,u=o),u!==o?(t.length>re?(f=t.charAt(re),re++):(f=o,0===se&&fe(kt)),f!==o?h=u=[u,f]:(re=h,h=o)):(re=h,h=o);h!==o;)p.push(h),h=re,u=re,se++,34===t.charCodeAt(re)?(f=A,re++):(f=o,0===se&&fe(x)),se--,f===o?u=void 0:(re=u,u=o),u!==o?(t.length>re?(f=t.charAt(re),re++):(f=o,0===se&&fe(kt)),f!==o?h=u=[u,f]:(re=h,h=o)):(re=h,h=o);p!==o?(34===t.charCodeAt(re)?(h=A,re++):(h=o,0===se&&fe(x)),h!==o?(ne=s,c=$t(r,a,p),s=c):(re=s,s=o)):(re=s,s=o)}else re=s,s=o;else re=s,s=o;if(s===o){if(s=re,61===t.charCodeAt(re)?(c=Y,re++):(c=o,0===se&&fe(B)),c!==o)if(39===t.charCodeAt(re)?(l=j,re++):(l=o,0===se&&fe(H)),l!==o){for(p=[],h=re,u=re,se++,39===t.charCodeAt(re)?(f=j,re++):(f=o,0===se&&fe(H)),se--,f===o?u=void 0:(re=u,u=o),u!==o?(t.length>re?(f=t.charAt(re),re++):(f=o,0===se&&fe(kt)),f!==o?h=u=[u,f]:(re=h,h=o)):(re=h,h=o);h!==o;)p.push(h),h=re,u=re,se++,39===t.charCodeAt(re)?(f=j,re++):(f=o,0===se&&fe(H)),se--,f===o?u=void 0:(re=u,u=o),u!==o?(t.length>re?(f=t.charAt(re),re++):(f=o,0===se&&fe(kt)),f!==o?h=u=[u,f]:(re=h,h=o)):(re=h,h=o);p!==o?(39===t.charCodeAt(re)?(h=j,re++):(h=o,0===se&&fe(H)),h!==o?(ne=s,c=jt(r,a,p),s=c):(re=s,s=o)):(re=s,s=o)}else re=s,s=o;else re=s,s=o;if(s===o){if(s=re,61===t.charCodeAt(re)?(c=Y,re++):(c=o,0===se&&fe(B)),c!==o){for(l=[],p=re,h=re,se++,Ht.test(t.charAt(re))?(u=t.charAt(re),re++):(u=o,0===se&&fe(Nt)),se--,u===o?h=void 0:(re=h,h=o),h!==o?(t.length>re?(u=t.charAt(re),re++):(u=o,0===se&&fe(kt)),u!==o?p=h=[h,u]:(re=p,p=o)):(re=p,p=o);p!==o;)l.push(p),p=re,h=re,se++,Ht.test(t.charAt(re))?(u=t.charAt(re),re++):(u=o,0===se&&fe(Nt)),se--,u===o?h=void 0:(re=h,h=o),h!==o?(t.length>re?(u=t.charAt(re),re++):(u=o,0===se&&fe(kt)),u!==o?p=h=[h,u]:(re=p,p=o)):(re=p,p=o);l!==o?(ne=s,c=St(r,a,l),s=c):(re=s,s=o)}else re=s,s=o;s===o&&(s=re,(c=bt)!==o&&(ne=s,c=It(r,a)),s=c)}}s!==o?(ne=i,a=Ot(r,a,s),i=a):(re=i,i=o)}else re=i,i=o;i===o&&(i=re,(a=Ce())!==o&&(ne=i,a=_t(r,a)),i=a)}n!==o?(41===t.charCodeAt(re)?(i=N,re++):(i=o,0===se&&fe(S)),i!==o?(ne=e,r=qt(r,n,i),e=r):(re=e,e=o)):(re=e,e=o)}else re=e,e=o;e===o&&(e=re,46===t.charCodeAt(re)?(r=Mt,re++):(r=o,0===se&&fe(zt)),r===o&&(r=bt),r!==o&&(ne=e,r=Ft(r)),e=r);return e}())!==o&&(a=ye())!==o&&(s=function(){var t,e;t=re,(e=xe())!==o&&(ne=t,e=Yt(e));return t=e}())!==o?(ne=e,r=c(r,n,i,a,s),e=r):(re=e,e=o);return e}())===o&&(e=function(){var e,r,n,i,a;e=re,(r=function(){var e,r,n,i;e=re,96===t.charCodeAt(re)?(r=Bt,re++):(r=o,0===se&&fe(Dt));if(r!==o){for(n=[],60===t.charCodeAt(re)?(i=h,re++):(i=o,0===se&&fe(u));i!==o;)n.push(i),60===t.charCodeAt(re)?(i=h,re++):(i=o,0===se&&fe(u));n!==o?(ne=e,r=Vt(r,n),e=r):(re=e,e=o)}else re=e,e=o;return e}())!==o&&(n=function(){var e;46===t.charCodeAt(re)?(e=Mt,re++):(e=o,0===se&&fe(zt));e===o&&(e=bt);return e}())!==o&&(i=function(){var e,r,n,i,a;e=re,r=[],n=re,i=re,se++,a=be(),se--,a===o?i=void 0:(re=i,i=o);i!==o?(t.length>re?(a=t.charAt(re),re++):(a=o,0===se&&fe(kt)),a!==o?(ne=n,i=Gt(a),n=i):(re=n,n=o)):(re=n,n=o);for(;n!==o;)r.push(n),n=re,i=re,se++,a=be(),se--,a===o?i=void 0:(re=i,i=o),i!==o?(t.length>re?(a=t.charAt(re),re++):(a=o,0===se&&fe(kt)),a!==o?(ne=n,i=Gt(a),n=i):(re=n,n=o)):(re=n,n=o);r!==o&&(ne=e,r=Xt(r));return e=r}())!==o&&(a=be())!==o?(ne=e,r=Qt(r,n,i,a),e=r):(re=e,e=o);return e}())===o&&(e=function(){var e,r,n,i,a,s,c;e=re,r=[],n=re,i=re,se++,a=Ae(),se--,a===o?i=void 0:(re=i,i=o);i!==o?(a=re,se++,s=xe(),se--,s===o?a=void 0:(re=a,a=o),a!==o?(s=re,se++,96===t.charCodeAt(re)?(c=Bt,re++):(c=o,0===se&&fe(Dt)),se--,c===o?s=void 0:(re=s,s=o),s!==o?(t.length>re?(c=t.charAt(re),re++):(c=o,0===se&&fe(kt)),c!==o?(ne=n,i=Gt(c),n=i):(re=n,n=o)):(re=n,n=o)):(re=n,n=o)):(re=n,n=o);if(n!==o)for(;n!==o;)r.push(n),n=re,i=re,se++,a=Ae(),se--,a===o?i=void 0:(re=i,i=o),i!==o?(a=re,se++,s=xe(),se--,s===o?a=void 0:(re=a,a=o),a!==o?(s=re,se++,96===t.charCodeAt(re)?(c=Bt,re++):(c=o,0===se&&fe(Dt)),se--,c===o?s=void 0:(re=s,s=o),s!==o?(t.length>re?(c=t.charAt(re),re++):(c=o,0===se&&fe(kt)),c!==o?(ne=n,i=Gt(c),n=i):(re=n,n=o)):(re=n,n=o)):(re=n,n=o)):(re=n,n=o);else r=o;r!==o&&(ne=e,r=Kt(r));return e=r}()),e}function Ae(){var e,r,n,i;if(e=re,91===t.charCodeAt(re)?(r=l,re++):(r=o,0===se&&fe(p)),r!==o){for(n=[],60===t.charCodeAt(re)?(i=h,re++):(i=o,0===se&&fe(u));i!==o;)n.push(i),60===t.charCodeAt(re)?(i=h,re++):(i=o,0===se&&fe(u));n!==o?(ne=re,(i=(i=f(r,n))?void 0:o)!==o?(ne=e,e=r=d(r,n)):(re=e,e=o)):(re=e,e=o)}else re=e,e=o;return e}function xe(){var e,r,n;for(e=re,r=[],62===t.charCodeAt(re)?(n=D,re++):(n=o,0===se&&fe(G));n!==o;)r.push(n),62===t.charCodeAt(re)?(n=D,re++):(n=o,0===se&&fe(G));return r!==o?(93===t.charCodeAt(re)?(n=Rt,re++):(n=o,0===se&&fe(Pt)),n!==o?(ne=re,(Ut(r,n)?void 0:o)!==o?(ne=e,e=r=Jt(r,n)):(re=e,e=o)):(re=e,e=o)):(re=e,e=o),e===o&&(e=re,(r=ve())!==o&&(ne=e,r=Lt()),e=r),e}function ve(){var e,r;return e=re,se++,t.length>re?(r=t.charAt(re),re++):(r=o,0===se&&fe(kt)),se--,r===o?e=void 0:(re=e,e=o),e}function be(){var e,r,n;for(e=re,r=[],62===t.charCodeAt(re)?(n=D,re++):(n=o,0===se&&fe(G));n!==o;)r.push(n),62===t.charCodeAt(re)?(n=D,re++):(n=o,0===se&&fe(G));return r!==o?(96===t.charCodeAt(re)?(n=Bt,re++):(n=o,0===se&&fe(Dt)),n!==o?(ne=re,(Wt(r,n)?void 0:o)!==o?(ne=e,e=r=Jt(r,n)):(re=e,e=o)):(re=e,e=o)):(re=e,e=o),e===o&&(e=re,(r=ve())!==o&&(ne=e,r=Lt()),e=r),e}function Ce(){var e,r,n;if(e=re,r=[],Zt.test(t.charAt(re))?(n=t.charAt(re),re++):(n=o,0===se&&fe(te)),n!==o)for(;n!==o;)r.push(n),Zt.test(t.charAt(re))?(n=t.charAt(re),re++):(n=o,0===se&&fe(te));else r=o;return r!==o&&(ne=e,r=ee(r)),e=r}var we,Ee=[];if((r=a())!==o&&re===t.length)return r;throw r!==o&&re<t.length&&fe({type:"end"}),de(ae,ie<t.length?t.charAt(ie):null,ie<t.length?ue(ie,ie+1):ue(ie,ie))}}},function(t,e,r){var{Node:n,TextNode:o,HtmlNode:i,ErrorNode:a,ElementClass:s,Element:c}=r(0),{Root:l,classMap:p}=r(6),h=r(1);t.exports={ast2nt:function(t,e){e||(e={}),e.tags||(e.tags={});var r=h.tags(p,e.tags);for(var n in r)!1===r[n]&&delete r[n];var i=(t,n)=>{if("root"==t.type)return l.instantiate({code:t.code,properties:[],children:t.children.map(t=>i(t,!1)),options:e});if("text"==t.type)return new o(t.text);if("error"==t.type)return new a({message:"[error]",code:t.text});if("element"==t.type){if(t.name in r){if(r[t.name].split){var s=(t,e)=>{if(0==e.length)return t.map(t=>i(t,!1));var r,n=e[e.length-1],o=[];(t=t.map(t=>"element"!=t.type||t.name!=n||t.children.length?t:{type:"delimiter"})).length&&"text"==t[0].type&&!t[0].text.trim()&&(t=t.slice(1)),t.length&&"delimiter"==t[0].type||t.unshift({type:"delimiter"});for(var a=0;a<t.length;a++)"delimiter"==t[a].type?(r&&o.push(r),r=[]):r.push(t[a]);return o.push(r),o.map(t=>s(t,e.slice(0,-1)))};return r[t.name].instantiate({code:t.code,properties:t.properties,children:s(t.children,r[t.name].split),options:e})}return r[t.name].instantiate({code:t.code,properties:t.properties,children:t.children.map(t=>i(t,!1)),options:e})}return new a({message:t.name?"Undefined tag name":"No tag name",code:t.code})}throw TypeError(t.type)};return i(t.root,!0)},Node:n,TextNode:o,HtmlNode:i,ErrorNode:a,ElementClass:s,Element:c}},function(t,e,r){var{TextNode:n,HtmlNode:o,ErrorNode:i,ElementClass:a,Element:s}=r(0),c=new a({name:"[root]",display:"container-block",render:t=>t.html(t.innerHtml)}),l={};function p(t){return t=t.trim(),/^\#/.test(t)?!!/^\#[^\s]*$/.test(t)&&t:/^(\/|\.\/|\.\.\/)/.test(t)?!!/^(\/|\.\/|\.\.\/)[^\s]*$/.test(t)&&t:(/^(http:\/\/|https:\/\/|ftp:\/\/)/.test(t)||(t="http://"+t),!!/^(http:\/\/|https:\/\/|ftp:\/\/)[a-z0-9]+(-+[a-z0-9]+)*(\.[a-z0-9]+(-+[a-z0-9]+)*)+\.?(:[0-9]{1,5})?(\/[^\s]*)?$/.test(t)&&t)}l.comment=new a({name:"comment",display:"inline",render:t=>t.text("")}),l.entity=new a({name:"entity",display:"inline",render:t=>t.innerIsText?/^([a-z]{1,50}|#[0-9]{1,10}|#x[0-9a-f]{1,10})$/i.test(t.innerText)?t.html(`&${t.innerText};`):t.error("Invalid value"):t.error("Non-text input")}),["b","code","i","u","sup","sub"].forEach(t=>l[t]=new a({name:t,display:"inline",render:e=>e.html(`<${t}>${e.innerHtml}</${t}>`)})),["h1","h2","h3","h4","h5","h6","p"].forEach(t=>l[t]=new a({name:t,display:"leaf-block",render:e=>e.html(`<${t}>${e.innerHtml}</${t}>`)})),["blockquote"].forEach(t=>l[t]=new a({name:t,display:"container-block",render:e=>e.html(`<${t}>${e.innerHtml}</${t}>`)})),["br"].forEach(t=>l[t]=new a({name:t,display:"inline",render:e=>e.html(`<${t}>${e.innerHtml}`)})),["hr"].forEach(t=>l[t]=new a({name:t,display:"leaf-block",render:e=>e.html(`<${t}>${e.innerHtml}`)})),["ul","ol"].forEach(t=>{l[t]=new a({name:t,display:"container-block",split:"*",render:e=>e.html(`<${t}>`+e.innerHtml.map(t=>`<li>${t}</li>`).join("")+`</${t}>`)})}),l.table=new a({name:"table",display:"container-block",split:["*","**"],render:t=>{var e=t.innerHtml.map(t=>t.length).reduce((t,e)=>t<e?e:t);return t.html("<table>"+t.innerHtml.map(t=>`<tr>${t.concat(Array(e-t.length).fill("")).map(t=>`<td>${t}</td>`).join("")}</tr>`).join("")+"</table>")}}),l.blockcode=new a({name:"blockcode",display:"leaf-block",render:t=>{var e=t.innerHtml.replace(/(^[ \t]*(\r\n|\r|\n))|((\r\n|\r|\n)[ \t]*$)/g,"");return t.html(`<pre><code>${e}\n</code></pre>`)}}),l.bi=new a({name:"bi",display:"inline",render:t=>t.html(`<i><b>${t.innerHtml}</b></i>`)}),l.link=new a({name:"link",display:"inline",render:t=>{var e=t.getProperty("href");if(null==e){if(!t.innerIsText)return t.error("Non-text input");var r;if(!(r=p(t.innerText)))return t.error("Invalid URL");var n=t.escapeHtml(r);return t.html(`<a href="${n}" title="${n}">${n}</a>`)}if(!(r=p(e)))return t.error("Invalid URL");n=t.escapeHtml(r);return t.html(`<a href="${n}" title="${n}">${t.innerHtml}</a>`)}}),l.img=new a({name:"img",display:"leaf-block",render:t=>{if(!t.innerIsText)return t.error("Non-text input");var e=p(t.innerText);if(!e)return t.error("Invalid URL");var r=t.escapeHtml(e);return t.html(`<div class="m42kup-img-block"><img src="${r}"></div>`)}}),["squote","dquote"].forEach(t=>l[t]=new a({name:t,display:"inline",render:e=>{var r={squote:["‘","’"],dquote:["“","”"]};return e.html(`${r[t][0]}${e.innerHtml}${r[t][1]}`)}})),l.highlight=new a({name:"highlight",display:"leaf-block",render:(t,e)=>{if(!e.hljs)return t.error("Element not implemented (options.highlight not given)");if(!t.innerIsText)return t.error("Non-text input");var r=t.innerText.replace(/(^[ \t]*(\r\n|\r|\n))|((\r\n|\r|\n)[ \t]*$)/g,""),n=e.hljs.highlightAuto(r,["apache","bash","coffeescript","cpp","cs","css","diff","http","ini","java","javascript","json","makefile","xml","markdown","nginx","objectivec","perl","php","python","ruby","sql"]).value;return t.html(`<pre class="hljs"><code>${n}\n</code></pre>`)}}),l.math=new a({name:"math",display:"inline",render:(t,e)=>{if(!e.katex)return t.error("Element not implemented (options.katex not given)");if(!t.innerIsText)return t.error("Non-text input");var r=e.katex.renderToString(t.innerText,{throwOnError:!1,displayMode:!1,strict:"error"});return t.html(r)}}),l.displaymath=new a({name:"displaymath",display:"leaf-block",render:(t,e)=>{if(!e.katex)return t.error("Element not implemented (options.katex not given)");if(!t.innerIsText)return t.error("Non-text input");var r=e.katex.renderToString(t.innerText,{throwOnError:!1,displayMode:!0,strict:"error"});return t.html(r)}});var h={'"':"dquote",$:"math",$$:"displaymath","%":"comment","&":"entity","'":"squote","*":"i","**":"b","***":"bi",";":"code",";;":"blockcode",";;;":"highlight","=":"h1","==":"h2","===":"h3","====":"h4","=====":"h5","======":"h6",">":"blockquote","\\":"br","^":"sup",_:"sub","~":"link","~~":"img"};for(var u in h){if(!l[h[u]])throw TypeError("aliasing failed");l[u]=l[h[u]]}t.exports={Root:c,classMap:l}},function(t,e){var r=t=>(t+"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]);function n(t){return`<span class="m42kup-hl-${t.type}">${t.html||r(t.text)}</span>`}t.exports={pt2hl:function(t){return function t(e){for(var r="",o=0;o<e.length;o++)switch(e[o].type){case"text":r+=n({type:"tx",text:e[o].text});break;case"element":var i=n({type:"lbm",text:e[o].lbm})+n({type:"tn",text:e[o].name})+(t=>{switch(t._type){case"parenthesis":return n({type:"lpm",text:t.left})+t.content.map(t=>{switch(t._type){case"property":return n({type:"pk",text:t.property[0]})+n({type:"eq",text:t.property[1]})+n({type:"lqm",text:t.property[2]})+n({type:"pv",text:t.property[3]})+n({type:"rqm",text:t.property[4]});case"whitespace":return n({type:"tx",text:t.whitespace});default:throw Error("Unknown type")}}).join("")+n({type:"rpm",text:t.right});case"separator":return n({type:"sp",text:t.separator});default:throw Error("Unknown type")}})(e[o].properties)+t(e[o].children)+n({type:"rbm",text:e[o].rbm});r+=n({type:"elem",html:i});break;case"verbatim":i=n({type:"lvm",text:e[o].lvm+e[o].separator})+n({type:"text",text:e[o].child.text})+n({type:"rvm",text:e[o].rvm});r+=n({type:"verb",html:i});break;default:throw new TypeError(`Unknown type: ${e[o].type}`)}return r}(t.root.children)}}}]);