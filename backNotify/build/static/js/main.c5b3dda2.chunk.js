(this.webpackJsonpnotify=this.webpackJsonpnotify||[]).push([[0],{42:function(e,t,a){e.exports=a(76)},47:function(e,t,a){},69:function(e,t,a){},76:function(e,t,a){"use strict";a.r(t);var n=a(1),r=a.n(n),l=a(10),o=a.n(l),c=(a(47),a(40)),i=a(3),s=a(11),u=a.n(s),m=a(16),d=a(6),p=a(24),E=a(23),b=a(12),f=a.n(b),v=a(15),g=a(38),O=(a(69),a(18));var h=function(e){var t=Object(n.useState)([]),a=Object(d.a)(t,2),l=a[0],o=a[1],c=Object(n.useState)([]),i=Object(d.a)(c,2),s=i[0],b=i[1],h=Object(n.useState)(!1),N=Object(d.a)(h,2),S=N[0],I=N[1],C=Object(n.useState)(0),y=Object(d.a)(C,2),j=y[0],T=y[1],A=Object(n.useState)(0),M=Object(d.a)(A,2),D=M[0],_=M[1],L=Object(n.useState)(""),k=Object(d.a)(L,2),w=k[0],F=k[1],x=Object(n.useState)(0),U=Object(d.a)(x,2),R=U[0],q=U[1],P=Object(n.useState)(0),V=Object(d.a)(P,2),z=V[0],B=V[1],H=Object(n.useState)(""),J=Object(d.a)(H,2),Y=J[0],X=J[1],Q=Object(n.useState)(""),$=Object(d.a)(Q,2),G=$[0],K=$[1],W=Object(n.useState)(0),Z=Object(d.a)(W,2),ee=Z[0],te=Z[1],ae=Object(n.useState)(""),ne=Object(d.a)(ae,2),re=ne[0],le=ne[1],oe=Object(n.useState)(""),ce=Object(d.a)(oe,2),ie=ce[0],se=ce[1],ue=Object(n.useState)(""),me=Object(d.a)(ue,2),de=me[0],pe=me[1],Ee=Object(O.c)((function(e){return e.sensorList})),be=Ee.sensors,fe=(Ee.loading,Ee.error,Object(O.b)());function ve(){return(ve=Object(m.a)(u.a.mark((function e(t){var a,n,r,l;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f.a.get("notify-get-sensors/".concat(t.target.value));case 2:a=e.sent,n=JSON.stringify(a.data),r=JSON.parse(n),l=r.map((function(e){return e.TYPE})),o(l),_(a.data[0].ID),F(a.data[0].NAME),se(a.data[0].UNIT),X("");case 11:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function ge(){return(ge=Object(m.a)(u.a.mark((function e(t){var a,n,r,l;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f.a.get("notify-get-sensors/".concat(t));case 2:a=e.sent,n=JSON.stringify(a.data),r=JSON.parse(n),l=r.map((function(e){return e.TYPE})),o(l),_(a.data[0].ID),F(a.data[0].NAME),se(a.data[0].UNIT);case 10:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function Oe(e){o([]),_(0),F(""),q(0),X(""),K("0"),te(0),B(""),le(""),I(!0),function(e){ge.apply(this,arguments)}(e.ID_SENSOR),F(e.NAME),q(e.VALUE),K(e.COND),te(e.TIME/60),T(e.ID),le(e.EMAIL),X(e.UNIT),B(e.POSITION)}function he(e){e.preventDefault(),f.a.get("/search?name=".concat(de)).then((function(e){return b(e.data)}))}return Object(n.useEffect)((function(){fe(function(){var e=Object(m.a)(u.a.mark((function e(t){var a,n;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t({type:"SENSOR_LIST_REQUEST"}),e.next=4,f.a.get("notify-get-sensors");case 4:a=e.sent,n=a.data,t({type:"SENSOR_LIST_SUCESS",payload:n}),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(0),t({type:"SENSOR_LIST_FAIL",payload:e.t0.message});case 12:case"end":return e.stop()}}),e,null,[[0,9]])})));return function(t){return e.apply(this,arguments)}}())}),[]),Object(n.useEffect)((function(){function e(){return(e=Object(m.a)(u.a.mark((function e(){var t,a;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f.a.get("notify-sensors-alert");case 2:t=e.sent,a=t.data,b(a.data);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}!function(){e.apply(this,arguments)}()}),[]),r.a.createElement("div",{className:"container"},r.a.createElement("main",null,r.a.createElement("div",{className:"monitSelect",id:"form"},S?r.a.createElement("form",{onSubmit:function(e){e.preventDefault();var t={ID_SENSOR:D,VALUE:Number(R),NAME:w,POSITION:Number(z),UNIT:Y,COND:G,TIME:Number(ee),EMAIL:re};f.a.put("/notify-put-sensor-alert/".concat(j),t).then((function(e){return b(e.data.data)})).catch((function(e){v.b.error("Opa colega, deu error a\xed",{position:"top-left",autoClose:2e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!1,draggable:!0,progress:void 0})})).then((function(e){o([]),_(0),F(""),q(0),X(""),K("0"),te(0),le(""),I(!1)}))}},r.a.createElement("fieldset",null,r.a.createElement("h1",{id:"titleForm"},"Editar Alarme"),r.a.createElement("br",null),r.a.createElement("div",{className:"input-group"},r.a.createElement("label",{htmlFor:"selectModel"},"Nome do sensor:"),r.a.createElement("input",{type:"text",value:w,disabled:!0})),r.a.createElement("div",{className:"input-group"},r.a.createElement("label",{htmlFor:"selectMeasures"},"Medi\xe7\xe3o:"),r.a.createElement("select",{id:"selectMeasures",onChange:function(e){B(e.target.selectedIndex),X(e.target.selectedOptions[0].id)},value:z>0?z-1:0,title:"Medida do sensor",required:!0},l.map((function(e){return e.map((function(e,t){return r.a.createElement("option",{value:t,key:t,data:e.UNIT,id:ie[t]},e)}))})))),r.a.createElement("div",{className:"input-group"},r.a.createElement("label",{htmlFor:"selectUnit"},"Valor: ",ie[z]),r.a.createElement("input",{type:"number",id:"ValueInput",value:R,onChange:function(e){return q(e.target.value)},required:!0})),r.a.createElement("div",{className:"input-group"},r.a.createElement("label",{htmlFor:"condition"},"Condi\xe7\xe3o:"),r.a.createElement("select",{onChange:function(e){K(e.target.value)},title:"Condi\xe7\xe3o para alarmar",value:G,required:!0},r.a.createElement("option",{value:"ACIMA"},"Acima"),r.a.createElement("option",{value:"ABAIXO"},"Abaixo"))),r.a.createElement("div",{className:"input-group"},r.a.createElement("label",{htmlFor:"selectTime",title:"Tempo em minutos"},"Tempo (minutos):"),r.a.createElement("input",{id:"selectTime",type:"number",value:ee,placeholder:"Selecione o tempo",min:0,max:59,onChange:function(e){return te(e.target.value)},required:!0})),r.a.createElement("div",{className:"input-group"},r.a.createElement("label",{htmlFor:"selectDest",title:"Destinat\xe1rio"},"Destinat\xe1rio:"),r.a.createElement("input",{id:"selectDest",type:"email",value:re,placeholder:"Selecione o destinat\xe1rio",onChange:function(e){return le(e.target.value)},required:!0})),r.a.createElement("div",{className:"buttons-container"},r.a.createElement("button",{type:"submit"},"Atualizar alerta"),r.a.createElement("button",{type:"button",onClick:function(e){return o([]),_(0),F(""),q(0),X(""),K("0"),te(0),B(0),le(""),void I(!1)}},"Voltar")))):r.a.createElement("form",{onSubmit:function(e){e.preventDefault();var t={ID_SENSOR:D,VALUE:Number(R),NAME:w,POSITION:Number(z),UNIT:Y,COND:G,TIME:Number(ee),EMAIL:re};f.a.post("notify-post-sensor-alert",t).then((function(e){b(e.data.data)})).then((function(e){v.b.success("Alarme criado com sucesso!",{position:"top-left",autoClose:2e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!1,draggable:!0,progress:void 0}),o([]),_(0),F(""),q(0),X(""),K(""),te(0),B(0),le(""),I(!1)})).catch((function(e){v.b.error("".concat(e.response.data),{position:"top-left",autoClose:3e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!1,draggable:!0,progress:void 0}),console.log("ERROR= ",e.response.data)}))}},r.a.createElement("fieldset",null,r.a.createElement("h1",{id:"titleForm"},"Criar Alarme"),r.a.createElement("br",null),r.a.createElement("div",{className:"input-group"},r.a.createElement("label",{htmlFor:"selectModel"},"Nome do sensor:"),r.a.createElement("select",{id:"selectModel",onChange:function(e){return ve.apply(this,arguments)},value:w?D:"1",required:!0,title:"Nome do sensor"},r.a.createElement("option",{value:"1",disabled:!0},"Selecione"),be.map((function(e,t){return r.a.createElement("option",{value:e.ID,key:t},e.NAME)})))),r.a.createElement("div",{className:"input-group"},r.a.createElement("label",{htmlFor:"selectMeasures"},"Medi\xe7\xe3o:"),r.a.createElement("select",{id:"selectMeasures",disabled:0===l.length,onChange:function(e){B(e.target.value),X(e.target.selectedOptions[0].id)},defaultValue:Y,title:"Medida do sensor",required:!0},r.a.createElement("option",{value:"",selected:!0},"Selecione"),l.map((function(e){return e.map((function(e,t){return r.a.createElement("option",{value:"".concat(t),key:t,id:ie[t],required:!0},e)}))})))),r.a.createElement("div",{className:"input-group"},r.a.createElement("label",{htmlFor:"selectUnit"},"Valor: ","1"===Y?"":Y),r.a.createElement("input",{type:"number",min:0,id:"ValueInput",onChange:function(e){return q(e.target.value)},value:R,disabled:0===l.length})),r.a.createElement("div",{className:"input-group"},r.a.createElement("label",{htmlFor:"condition"},"Condi\xe7\xe3o:"),r.a.createElement("select",{disabled:0===l.length,onChange:function(e){K(e.target.value)},title:"Condi\xe7\xe3o para alarmar",value:G||"0",required:!0},r.a.createElement("option",{value:"0",disabled:!0},"Selecione"),r.a.createElement("option",{value:"ACIMA"},"Acima"),r.a.createElement("option",{value:"ABAIXO"},"Abaixo"))),r.a.createElement("div",{className:"input-group"},r.a.createElement("label",{htmlFor:"selectTime",title:"Tempo em minutos"},"Tempo (minutos):"),r.a.createElement("input",{id:"selectTime",type:"number",placeholder:"Selecione o tempo",value:ee,min:0,max:59,disabled:0===l.length,onChange:function(e){return te(e.target.value)},required:!0})),r.a.createElement("div",{className:"input-group"},r.a.createElement("label",{htmlFor:"selectDest",title:"Destinat\xe1rio"},"Destinat\xe1rio:"),r.a.createElement("input",{id:"selectDest",type:"email",value:re,placeholder:"Selecione o destinat\xe1rio",pattern:"[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$",disabled:0===l.length,onChange:function(e){return le(e.target.value)},required:!0})),r.a.createElement("div",{className:"buttons-container"},r.a.createElement("button",{type:"submit",disabled:0===l.length},"Criar Alerta"))))),r.a.createElement("div",{className:"cards-container"},r.a.createElement("form",{onSubmit:he,className:"search-input-container"},r.a.createElement("input",{type:"text",placeholder:"Pesquisar alerta",value:de,onChange:function(e){return pe(e.target.value)}}),r.a.createElement("p",{onClick:he},r.a.createElement(E.b,{size:24}))),r.a.createElement("div",{className:"mySchedule"},r.a.createElement("ul",{className:"list-cards"},s&&0!==s.length?s.map((function(e,t){return r.a.createElement("li",{className:"card",key:e.ID},r.a.createElement("div",{className:"head-card"},r.a.createElement("h1",null,e.NAME)),r.a.createElement("div",{className:"content-card"},r.a.createElement("p",null,"Condi\xe7\xe3o: ",e.COND.toLowerCase()," de ",e.VALUE," ",e.UNIT," ",e.MEDITION),r.a.createElement("p",null,"Tempo para enviar alerta: ",e.TIME/60," min")),r.a.createElement("div",{id:"footer-Container"},r.a.createElement("p",{className:"date-detail"},"Alerta criado em"," ",g.tz(e.created_at,"America/Fortaleza").format("DD/MM/YYYY  HH:mm:ss").toLocaleLowerCase("pt-br")),r.a.createElement("div",{id:"buttons-Container"},r.a.createElement("a",{href:"#form",className:"edit-button",onClick:function(){return Oe(e)}},r.a.createElement(p.a,{color:"white"})),r.a.createElement("button",{className:"delete-button",onClick:function(t){return a=e.ID,void(window.confirm("Tem certeza que deseja deletar o alarme?")&&f.a.delete("notify-delete-sensor-alert/".concat(a)).then((function(e){v.b.success("Alarme deletado com sucesso!",{position:"top-left",autoClose:2e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!1,draggable:!0,progress:void 0}),b(e.data.data)})).then((function(e){o([]),_(0),F(""),q(0),X(""),K("0"),te(0),le(""),I(!1)})));var a}},r.a.createElement(p.b,{color:"white"})))))})):r.a.createElement("div",{id:"not-found"}," ",r.a.createElement(E.a,{size:60})," Nenhum alerta registrado"))))))};var N=function(){return r.a.createElement(c.a,null,r.a.createElement(i.c,null,r.a.createElement(i.a,{path:"/",component:h,exact:!0})))};a(75);var S=function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement(N,null),r.a.createElement(v.a,{autoClose:2e3},'position="top-right" autoClose=',2e3,"hideProgressBar=",!1,"newestOnTop=",!1,"closeOnClick rtl=",!1,"pauseOnFocusLoss draggable pauseOnHover"))},I=a(14),C=a(41);var y=Object(I.c)({sensorList:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{sensors:[]},t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"SENSOR_LIST_REQUEST":return{loading:!0,sensors:[]};case"SENSOR_LIST_SUCESS":return{loading:!1,sensors:t.payload};case"SENSOR_LIST_FAIL":return{loading:!1,error:t.payload};default:return e}}}),j=window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__||I.d,T=Object(I.e)(y,{},j(Object(I.a)(C.a)));o.a.render(r.a.createElement(O.a,{store:T},r.a.createElement(S,null)),document.getElementById("root"))}},[[42,1,2]]]);
//# sourceMappingURL=main.c5b3dda2.chunk.js.map