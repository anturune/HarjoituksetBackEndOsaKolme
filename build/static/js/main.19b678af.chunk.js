(this.webpackJsonposat3_9eteenpain=this.webpackJsonposat3_9eteenpain||[]).push([[0],{38:function(e,n,t){},39:function(e,n,t){"use strict";t.r(n);var o=t(0),c=t(2),a=t(14),r=t.n(a),u=t(3),l=t(4),s=t.n(l),i="http://localhost:3001/api/persons",d=function(){return s.a.get(i).then((function(e){return e.data}))},j=function(e){return s.a.post(i,e).then((function(e){return e.data}))},b=function(e){s.a.delete("".concat(i,"/").concat(e))},m=function(e,n){var t=s.a.put("".concat(i,"/").concat(e),n);return console.log("TULIKO SERVICEEN UUSI OBJECTI",n.number),t.then((function(e){return e.data}))},f=(t(38),function(e){var n=e.value,t=e.onChange;return Object(o.jsxs)("div",{children:["filter shown with: ",Object(o.jsx)("input",{value:n,onChange:t})]})}),O=function(e){var n=e.person,t=e.onClick;return Object(o.jsx)("div",{children:Object(o.jsx)(h,{person:n,onClick:t})})},h=function(e){var n=e.person,t=e.onClick;return Object(o.jsxs)("div",{children:[Object(o.jsx)("br",{}),Object(o.jsxs)(o.Fragment,{children:[n.name," ",n.number]}),Object(o.jsx)("button",{onClick:t,children:"Delete"},n.id)]})},g=function(e){var n=e.valueName,t=e.onChangeName,c=e.valueNumber,a=e.onChangeNumber,r=e.onSubmit;return Object(o.jsx)("div",{children:Object(o.jsxs)("form",{onSubmit:r,children:[Object(o.jsxs)("div",{children:["Name: ",Object(o.jsx)("input",{value:n,onChange:t})]}),Object(o.jsxs)("div",{children:["Number: ",Object(o.jsx)("input",{value:c,onChange:a})]}),Object(o.jsx)("div",{children:Object(o.jsx)("button",{type:"submit",children:"add"})})]})})},v=function(e){var n=e.message;return null===n?null:Object(o.jsx)("div",{className:"error",children:n})},x=function(e){var n=e.message;return null===n?null:Object(o.jsx)("div",{className:"added",children:n})},I=function(){var e=Object(c.useState)([]),n=Object(u.a)(e,2),t=n[0],a=n[1],r=Object(c.useState)(""),l=Object(u.a)(r,2),s=l[0],i=l[1],h=Object(c.useState)(""),I=Object(u.a)(h,2),p=I[0],N=I[1],E=Object(c.useState)(""),T=Object(u.a)(E,2),S=T[0],C=T[1],A=Object(c.useState)(null),w=Object(u.a)(A,2),R=w[0],k=w[1],V=Object(c.useState)(null),y=Object(u.a)(V,2),P=y[0],U=y[1];Object(c.useEffect)((function(){d().then((function(e){a(e)}))}),[]);return Object(o.jsxs)("div",{children:[Object(o.jsx)("h2",{children:"Phonebook"}),Object(o.jsx)(f,{value:S,onChange:function(e){console.log(e.target.value.toLowerCase()),C(e.target.value.toLowerCase())}}),Object(o.jsx)("h2",{children:"Add a new"}),Object(o.jsx)(v,{message:R}),Object(o.jsx)(x,{message:P}),Object(o.jsx)(g,{valueName:s,onChangeName:function(e){console.log(e.target.value),i(e.target.value)},valueNumber:p,onChangeNumber:function(e){console.log(e.target.value),N(e.target.value)},onSubmit:function(e){e.preventDefault();t.find((function(e){return console.log(e.name,e.id,typeof e.name,s,typeof s,e.name===s),e.name===s}));var n=t.findIndex((function(e){return e.name===s}));if(console.log("l\xf6ydetyn indeksinumero",n),-1!==n&&window.confirm("".concat(s," is already added to phonebook, replace the old number with a new one?"))){var o={name:s,number:p};m(t[n].id,o).then((function(e){console.log("MIK\xc4 ARVO TULEE TAKAISIN",e.id),a(t.map((function(o){return o.id!==t[n].id?o:e}))),i(""),N(""),console.log("Success!"),console.log("T\xc4M\xc4 ID P\xc4IVITET\xc4\xc4N",t[n].id),console.log("VAIHTUIKO ID VAI ONKO SAMA",e.id),console.log("T\xc4M\xc4 NUMERO P\xc4IVITET\xc4\xc4N",t[n].number),console.log("T\xc4KSI NUMEROKSI",e.number),U("Person "+"".concat(o.name)+" succefully changed"),setTimeout((function(){U(null)}),5e3)})).catch((function(e){k("Information of "+"".concat(o.name)+" has already been removed from server"),setTimeout((function(){k(null)}),5e3),console.log("Person update failed")}))}if(-1===n){console.log("Uuden luominen, koska ei ollut kannassa");var c={name:s,number:p},r=!1;j(c).then((function(e){a(t.concat(e)),i(""),N(""),console.log("addName function",e)})).catch((function(e){"Error"===e.name&&(r=!0,k(e.response.data.error),console.log("VIRHEVIESTI",e.response.data),console.log("VIRHEVIESTI NAME",e.name),console.log("1. ONKO ERRORIA TRUE VAI FALSE",r),setTimeout((function(){k(null)}),5e3))})),console.log("2. ONKO ERRORIA TRUE VAI FALSE",r),!1===r&&(U("Person "+"".concat(c.name)+" succesfully added"),console.log(c.name),setTimeout((function(){U(null)}),5e3))}}}),Object(o.jsx)("h2",{children:"Numbers"}),Object(o.jsx)(o.Fragment,{children:t.filter((function(e){return e.name.toLocaleLowerCase().includes("".concat(S))})).map((function(e){return Object(o.jsx)(O,{person:e,onClick:function(){return function(e){var n=e.filteredPerson;window.confirm("Delete "+"".concat(n.name)+"?")&&(b(n.id),console.log("removePerson",n.id),a(t.filter((function(e){return e.name!==n.name}))),k("Person "+"".concat(n.name)+" succesfully removed"),setTimeout((function(){k(null)}),5e3))}({filteredPerson:e})}},e.id)}))}),"...",Object(o.jsxs)("div",{children:["debugNameField: ",s]}),"...",Object(o.jsxs)("div",{children:["debugFilterField: ",S]})]})};r.a.render(Object(o.jsx)(I,{}),document.getElementById("root"))}},[[39,1,2]]]);
//# sourceMappingURL=main.19b678af.chunk.js.map