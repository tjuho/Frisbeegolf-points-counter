(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{193:function(e,n,t){e.exports=t(384)},201:function(e,n){},203:function(e,n){},236:function(e,n){},237:function(e,n){},384:function(e,n,t){"use strict";t.r(n);var r=t(58),a=t(1),u=t.n(a),o=t(162),l=t.n(o),c=t(10),i=t.n(c),s=t(26),d=t(12),m=t(22),f=t(388),p=(t(60),function(e){if(!e.show)return null;if(e.meQuery.loading)return u.a.createElement("div",null,"loading...");if(e.meQuery.error)return console.log("error",e.meQuery.error),u.a.createElement("div",null,"error...");var n=function(n){e.setPage(n)},t=e.meQuery.data.me,r=e.currentRoundId;return u.a.createElement("div",{className:"ui secondary menu"},u.a.createElement("div",{className:"item pointer",onClick:function(){n("main")}},"main"),r?u.a.createElement("div",{className:"item pointer",onClick:function(){n("round")}},"continue round"):u.a.createElement("div",{className:"item pointer",onClick:function(){n("round")}},"new round"),u.a.createElement("div",{className:"item"},t.username," ",t.admin?"(admin) ":"","logged in"),u.a.createElement("div",{className:"item pointer",onClick:function(){n(null),e.doLogout()}},"logout"))}),b=function(e){if(!e.show)return null;if(!e.round)return null;if(e.allPointsQuery.loading)return u.a.createElement("div",null,"loading...");if(e.allPointsQuery.error)return console.log("error",e.allPointsQuery.error),u.a.createElement("div",null,"error...");var n=e.savedState,t=e.uploadingPoints,r=n||t,a=e.round.users,o=e.trackIndex,l=e.allPointsQuery.data.allPoints,c=e.round,i=a.slice(),s=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1,t=n;return e.forEach((function(e){t<e&&(t=e)})),t}(l.map((function(e){return e.trackIndex})),-1);if(-1===o&&s>-1)return e.changeTrack(s),null;var d=function(n){return function(){s+1===n&&e.addNewTrack(),e.changeTrack(n)}},m=function(n,t){return function(){n>-1&&e.updatePoint(n,t.id)}};i.sort((function(e,n){for(var t=function(t){var r=l.filter((function(e){return e.trackIndex===t})),a=r.filter((function(n){return n.user.id===e.id})),u=r.filter((function(e){return e.user.id===n.id}));if(0===a.length||0===u.length)return{v:0};var o=a[0].points,c=u[0].points;return o>c?{v:1}:o<c?{v:-1}:void 0},r=o;r>=0;r--){var a=t(r);if("object"===typeof a)return a.v}return 0}));for(var f=[],p=0;p<s+1;p++)f.push(u.a.createElement("th",{key:p},p+1));return u.a.createElement("div",{className:"App"},u.a.createElement("div",null,u.a.createElement("h3",null,c.location.name),u.a.createElement("h3",null,u.a.createElement("div",{className:"row"},u.a.createElement("div",{className:"ui centered grid"},u.a.createElement("button",{onClick:d(o-1)},"<"),"Track ",o+1,u.a.createElement("button",{onClick:d(o+1)},">")))),u.a.createElement("br",null),u.a.createElement("table",{className:"ui celled table"},u.a.createElement("thead",null,u.a.createElement("tr",null,u.a.createElement("th",null,"order"),u.a.createElement("th",null,u.a.createElement("div",{className:"center"},"player")),f,u.a.createElement("th",null,"total"))),u.a.createElement("tbody",null,a.map((function(e){var n=l.filter((function(n){return n.user.id===e.id}));if(n){n.sort((function(e,n){return e.trackIndex-n.trackIndex}));var t=0===n.length?0:n.map((function(e){return e.points})).reduce((function(e,n){return e+n}));return u.a.createElement("tr",{key:e.id},u.a.createElement("td",{key:"order"},function(e){for(var n=0;n<i.length;n++)if(e===i[n])return n+1+".";return"err"}(e)),u.a.createElement("td",{key:e.username},e.username),n.map((function(n){return n.trackIndex===o?u.a.createElement("td",{key:n.trackIndex+e.id},u.a.createElement("strong",null,u.a.createElement("button",{className:"ui button",onClick:m(n.points-1,n.user)},"-"),n.points,u.a.createElement("button",{className:"ui button",onClick:m(n.points+1,n.user)},"+"))):u.a.createElement("td",{key:n.trackIndex+e.id},n.points)})),u.a.createElement("td",null,t))}return u.a.createElement("tr",null,u.a.createElement("td",null,"no plays"))}))))),u.a.createElement("br",null),u.a.createElement("div",{className:"ui centered grid"},n&&u.a.createElement("div",null,"saved state"),!n&&u.a.createElement("div",{className:"error"},u.a.createElement("strong",null,"unsaved state"))),u.a.createElement("br",null),u.a.createElement("div",{className:"row"},u.a.createElement("button",{className:"ui button",text:"delete last track",onClick:function(){e.deleteLastTrack()}},"delete last track"),u.a.createElement("button",{className:"ui button",text:"finish round",onClick:function(){e.finishRound()}},"finnish round"),!r&&u.a.createElement("button",{className:"ui button",disabled:r,onClick:function(){e.uploadPoints()}},"upload points")))},v=function(e){var n=Object(a.useState)(""),t=Object(d.a)(n,2),r=t[0],o=t[1];if(!e.show)return null;return u.a.createElement("div",null,u.a.createElement("div",null,u.a.createElement("input",{value:r,onChange:function(e){var n=e.target;return o(n.value)}})),u.a.createElement("button",{className:"ui button",onClick:function(){e.addNewLocation(r),o("")}},"add new location"))},E=function(e){if(!e.show)return null;var n=e.allLocationsQuery.data.allLocations,t=e.allUsersQuery.data.allUsers,r=e.currentLocation,a=e.currentPlayers;return e.allLocationsQuery.loading||e.allUsersQuery.loading?u.a.createElement("div",null,"loading..."):e.allLocationsQuery.error||e.allUsersQuery.error?u.a.createElement("div",null,"error..."):r?u.a.createElement("div",null,u.a.createElement("h3",null,"New round"),u.a.createElement("div",{className:"ui button",onClick:e.handleLocationClick(r)},r.name),u.a.createElement("div",null,u.a.createElement("table",{className:"ui celled table"},u.a.createElement("thead",null,u.a.createElement("tr",{key:"header"},u.a.createElement("th",null,"selected players"))),u.a.createElement("tbody",null,u.a.createElement("tr",null,a.map((function(n){return u.a.createElement("td",{className:"ui button",key:n.id,onClick:e.handleUserClick(n)},n.username)})))))),a.length>0&&r&&u.a.createElement("div",null,u.a.createElement("form",{onSubmit:function(n){n.preventDefault(),e.startNewRound()}},u.a.createElement("button",{className:"ui button",type:"submit"},"start"))),u.a.createElement("div",null,u.a.createElement("table",{className:"ui celled table"},u.a.createElement("thead",null,u.a.createElement("tr",null,u.a.createElement("th",null,"all players"))),u.a.createElement("tbody",null,t.map((function(n){return u.a.createElement("tr",{key:n.id},u.a.createElement("td",{className:"ui button",onClick:e.handleUserClick(n)},n.username))})))))):u.a.createElement("div",null,u.a.createElement("h3",null,"Select location"),u.a.createElement("div",null,u.a.createElement("table",{className:"ui celled table"},u.a.createElement("thead",null,u.a.createElement("tr",{key:"header"},u.a.createElement("th",null,"locations"))),u.a.createElement("tbody",null,n.map((function(n){return u.a.createElement("tr",{key:n.id},u.a.createElement("td",{className:"ui button",onClick:e.handleLocationClick(n)},n.name))}))))),u.a.createElement(v,{show:!0,addNewLocation:e.addNewLocation}))},h=function(e){if(!e.show)return null;if(e.allRoundsQuery.loading)return u.a.createElement("div",null,"loading...");if(e.allRoundsQuery.error)return console.log("error",e.allRoundsQuery.error),u.a.createElement("div",null,"error...");var n=function(n){return function(){e.setRound(n)}},t=e.allRoundsQuery.data.allRounds;return t.sort((function(e,n){return n.date-e.date})),t?u.a.createElement("div",null,u.a.createElement("table",{className:"ui celled table"},u.a.createElement("thead",null,u.a.createElement("tr",{key:"header"},u.a.createElement("th",null,"location"),u.a.createElement("th",null,"date"),u.a.createElement("th",null,"players"),u.a.createElement("th",null,"delete"))),u.a.createElement("tbody",null,t.map((function(t){for(var r=new Date(t.date),a=r.getDate()+"."+(r.getMonth()+1)+"."+r.getFullYear()+" "+r.getHours()+":"+r.getMinutes()+":"+r.getSeconds(),o=[],l=0;l<t.users.length;l++){var c=t.users[l],i=t.totals?t.totals[l]:null;o.push(c.username.toString()+(i?":"+i.toString():""))}var s=o.join("\n");return u.a.createElement("tr",{key:t.id},u.a.createElement("td",{className:"pointer",onClick:n(t)},t.location.name),u.a.createElement("td",null,a),u.a.createElement("td",null,u.a.createElement("span",null,s)),u.a.createElement("td",null,u.a.createElement("button",{className:"ui button",onClick:function(){window.confirm("Are you sure you wish to delete this round?")&&function(n){e.deleteRound(n)}(t)}},"X")))}))))):null},y=function(e){var n=Object(a.useState)(""),t=Object(d.a)(n,2),r=t[0],o=t[1],l=Object(a.useState)(""),c=Object(d.a)(l,2),m=c[0],f=c[1];if(!e.show)return null;var p=function(){var n=Object(s.a)(i.a.mark((function n(t){return i.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:t.preventDefault(),e.doLogin(r,m);case 2:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}();return u.a.createElement("div",{className:"login"},u.a.createElement("h2",null,"Login to application"),u.a.createElement("form",{onSubmit:p,className:"ui form"},u.a.createElement("div",{className:"field"},u.a.createElement("label",null,"Username"),u.a.createElement("input",{id:"username",type:"text",placeholder:"username",value:r,onChange:function(e){o(e.target.value)}})),u.a.createElement("div",{className:"field"},u.a.createElement("label",null,"Password"),u.a.createElement("input",{id:"password",type:"password",placeholder:"password",value:m,onChange:function(e){f(e.target.value)}})),u.a.createElement("button",{className:"ui button",type:"submit"},"login")))},g=t(163),k=t.n(g),I=t(20),w=t(21),j=t.n(w);function O(){var e=Object(I.a)(["\nsubscription($roundId: ID!){\n  pointAdded(roundId: $roundId) {\n    trackIndex,\n    user{id},\n    round{id},\n    points,\n    id\n  }\n}\n"]);return O=function(){return e},e}function x(){var e=Object(I.a)(["\n  mutation addCachedPoints($roundId: ID!, $pointIds: [ID!]!, $userIds: [ID!]!, $trackIndexes:[Int!]!, $points: [Int!]!){\n    addCachedPoints(\n      roundId: $roundId,\n      pointIds: $pointIds,\n      userIds: $userIds,\n      trackIndexes: $trackIndexes,\n      points: $points\n    ){\n      trackIndex,\n      user{id},\n      round{id},\n      points,\n      id\n    }\n  }\n"]);return x=function(){return e},e}function N(){var e=Object(I.a)(["\n  mutation createPlay($roundId: ID!, $playNumber:Int!){\n    addPlay(\n      roundId: $roundId,\n      playNumber: $playNumber\n    ){\n      id\n    }\n  }\n"]);return N=function(){return e},e}function S(){var e=Object(I.a)(["\n  mutation removeRound($roundId: ID!){\n    deleteRound(\n      roundId: $roundId\n    ){\n      id\n    }\n  }\n"]);return S=function(){return e},e}function Q(){var e=Object(I.a)(["\n  mutation createRound($locationId: ID!, $userIds: [ID!]!){\n    addRound(\n      locationId: $locationId\n      userIds: $userIds\n    ){\n      location{\n        name\n        id\n      }\n      users{\n        username\n        id\n      }\n      date\n      id\n      totals\n    }\n  }\n"]);return Q=function(){return e},e}function P(){var e=Object(I.a)(["\n  mutation createLocation($name: String!){\n    addLocation(\n      name: $name\n    ){\n      id, name\n    }\n  }\n"]);return P=function(){return e},e}function R(){var e=Object(I.a)(["\nquery{\n  me{\n    admin\n    username\n    id\n  }\n}\n"]);return R=function(){return e},e}function C(){var e=Object(I.a)(["\nquery {\n  allUsers{\n    username,\n    id\n  }\n}\n"]);return C=function(){return e},e}function L(){var e=Object(I.a)(["\n  query ($roundId: ID!) {\n    allPoints(\n      roundId: $roundId\n    ){\n    trackIndex,\n    user{id},\n    round{id},\n    points,\n    id\n    }\n  }\n"]);return L=function(){return e},e}function $(){var e=Object(I.a)(["\n{\n  allRounds {\n    users{username, id}\n    location{name, id}\n    date\n    id\n    totals\n  }\n}\n"]);return $=function(){return e},e}function q(){var e=Object(I.a)(["\n{\n  allLocations {\n    name\n    id\n  }\n}  \n"]);return q=function(){return e},e}function D(){var e=Object(I.a)(["\n{\n  me {\n    username\n    id\n    friends{username, id}\n  }\n}\n"]);return D=function(){return e},e}function T(){var e=Object(I.a)(["\nmutation login($username: String!, $password: String! ){\n  login(username: $username, password: $password){\n    token\n    username\n  }\n  \n}\n"]);return T=function(){return e},e}var U=j()(T()),_=(j()(D()),j()(q())),A=j()($()),J=j()(L()),B=j()(C()),F=j()(R()),M=j()(P()),Y=j()(Q()),z=j()(S()),H=(j()(N()),j()(x())),X=(j()(O()),function(e){var n,t=function(){console.log("You have been logged out"),e()},r=function(){n=setTimeout(t,36e5)};Object(a.useEffect)((function(){var e=["load","mousedown","click","scroll","keypress"],t=function(){n&&clearTimeout(n),r()};for(var a in e)window.addEventListener(e[a],t);r()}))}),G=function(e){var n=Object(a.useState)(null),t=Object(d.a)(n,2),o=t[0],l=t[1],c=Object(a.useState)(null),v=Object(d.a)(c,2),g=v[0],I=v[1],w=Object(a.useState)([]),j=Object(d.a)(w,2),O=j[0],x=j[1],N=Object(a.useState)(null),S=Object(d.a)(N,2),Q=S[0],P=S[1],R=Object(a.useState)(null),C=Object(d.a)(R,2),L=C[0],$=C[1],q=Object(a.useState)(0),D=Object(d.a)(q,2),T=D[0],G=D[1],K=Object(a.useState)(null),V=Object(d.a)(K,2),W=V[0],Z=V[1],ee=Object(a.useState)("main"),ne=Object(d.a)(ee,2),te=ne[0],re=ne[1],ae=Object(m.a)(),ue=Object(a.useState)(!0),oe=Object(d.a)(ue,2),le=oe[0],ce=oe[1],ie=Object(a.useState)(!1),se=Object(d.a)(ie,2),de=se[0],me=se[1];Object(a.useEffect)((function(){var e=localStorage.getItem("token");Z(e)}),[]);var fe=function(){var e=Object(s.a)(i.a.mark((function e(n,t){var r,a,u;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Oe({variables:{username:n,password:t}});case 2:if(!(r=e.sent)){e.next=14;break}if(a=r.data.login.token,u=r.data.login.username,!a){e.next=14;break}return e.next=9,ae.resetStore();case 9:localStorage.setItem("token",a),localStorage.setItem("username",u),Z(a),re("main"),$(null);case 14:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}(),pe=function(){var e=Object(s.a)(i.a.mark((function e(){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return Z(null),localStorage.clear(),e.next=4,ae.resetStore();case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();X(pe),e.sessionTimeout&&(console.log("session timed out"),pe());var be=function(e){if(console.log("error",e),e.graphQLErrors.length>0)$(e.graphQLErrors[0].message),setTimeout((function(){$(null)}),7e3);else if(e.networkError){var n=e.networkError.result.errors;n&&n.length>0&&($(n[0].message),setTimeout((function(){$(null)}),7e3))}},ve=Object(m.b)(H,{onError:be,update:function(e,n){var t=n.data.addCachedPoints,a=e.readQuery({query:J,variables:{roundId:o}}).allPoints,u=!0;if(ce(!0),t.length!==a.length)u=!1;else if(t.forEach((function(e){var n=!1;a.forEach((function(t){e.round.id!==t.round.id||e.user.id!==t.user.id||e.trackIndex!==t.trackIndex||e.points!==t.points||(n=!0)})),n||(u=!1)})),u&&t.length>0){var l=t[0].round.id,c=e.readQuery({query:A}),i=function(e,n){var t=e.id,r=e.users,a=[],u=n.filter((function(e){return e.round.id.toString()===t.toString()}));return r.forEach((function(e){var n=u.filter((function(n){return n.user.id.toString()===e.id.toString()})).map((function(e){return e.points})).reduce((function(e,n){return e+n}),0);a.push(n)})),a}(g,t),s=c.allRounds.filter((function(e){return e.id.toString()===l.toString()}))[0],d=Object(r.a)({},s,{totals:i}),m=c.allRounds.filter((function(e){return e.id.toString()!==l.toString()}));e.writeQuery({query:A,data:{allRounds:m.concat(d)}})}ce(u)}}),Ee=Object(d.a)(ve,1)[0],he=Object(m.b)(Y,{onError:be,update:function(e,n){var t=e.readQuery({query:A}),r=n.data.addRound,a=t.allRounds.filter((function(e){return e.id!==r.id})).concat(r);ae.writeQuery({query:A,data:{allRounds:a}})}}),ye=Object(d.a)(he,1)[0],ge=Object(m.b)(M,{onError:be,update:function(e,n){var t=e.readQuery({query:_}),r=n.data.addLocation,a=t.allLocations.filter((function(e){return e.id!==r.id})).concat(r);ae.writeQuery({query:_,data:{allLocations:a}})}}),ke=Object(d.a)(ge,1)[0],Ie=Object(m.b)(z,{onError:be,update:function(e,n){var t=e.readQuery({query:A}),r=n.data.deleteRound,a=t.allRounds.filter((function(e){return e.id!==r.id}));ae.writeQuery({query:A,data:{allRounds:a}})}}),we=Object(d.a)(Ie,1)[0],je=Object(m.b)(U,{onError:be,update:function(e,n){}}),Oe=Object(d.a)(je,1)[0],xe=function(e,n,t,a){var u=ae.readQuery({query:J,variables:{roundId:e}}),o=u.allPoints.filter((function(e){return e.user.id===n&&e.trackIndex===t}));if(o.length>0){var l=o[0];ae.writeQuery({query:J,variables:{roundId:e},data:{allPoints:u.allPoints.filter((function(e){return e.id!==l.id})).concat(Object(r.a)({},l,{points:a}))}})}else{var c={round:{id:e,__typename:"Round"},user:{id:n,__typename:"User"},trackIndex:t,points:a,id:k.a.randomBytes(16).toString("hex"),__typename:"Point"};ae.writeQuery({query:J,variables:{roundId:e},data:{allPoints:u.allPoints.concat(c)}})}ce(!1)},Ne=function(e){var n=ae.readQuery({query:J,variables:{roundId:e}});if(0!==n.allPoints.length){var t=n.allPoints.map((function(e){return e.trackIndex})).sort((function(e,n){return n-e}))[0];ae.writeQuery({query:J,variables:{roundId:e},data:{allPoints:n.allPoints.filter((function(e){return e.trackIndex!==t}))}}),ce(!1),T>=t&&G(t-1)}},Se=function(){var e=Object(s.a)(i.a.mark((function e(){var n,t;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(0!==(n=ae.readQuery({query:J,variables:{roundId:o}})).allPoints.length){e.next=3;break}return e.abrupt("return");case 3:return t=n.allPoints,e.prev=4,e.next=7,me(!0);case 7:return e.next=9,Ee({variables:{roundId:o,pointIds:t.map((function(e){return e.id.toString()})),userIds:t.map((function(e){return e.user.id.toString()})),trackIndexes:t.map((function(e){return e.trackIndex})),points:t.map((function(e){return e.points}))}});case 9:me(!1),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(4),be(e.t0);case 15:case"end":return e.stop()}}),e,null,[[4,12]])})));return function(){return e.apply(this,arguments)}}(),Qe=function(){var e=Object(s.a)(i.a.mark((function e(){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:Ne(o);case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),Pe=function(){var e=Object(s.a)(i.a.mark((function e(n,t){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:xe(o,t,T,n);case 1:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}(),Re=Object(m.c)(_,{skip:!W}),Ce=Object(m.c)(B,{skip:!W}),Le=Object(m.c)(J,{skip:!o||!W,variables:{roundId:o}}),$e=Object(m.c)(A,{skip:!W}),qe=function(){var e=Object(s.a)(i.a.mark((function e(n){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ke({variables:{name:n}});case 2:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),De=function(){var e=Object(s.a)(i.a.mark((function e(n){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,we({variables:{roundId:n.id}});case 2:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),Te=function(){var e=Object(s.a)(i.a.mark((function e(){var n;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ye({variables:{userIds:O.map((function(e){return e.id})),locationId:Q.id}});case 2:n=e.sent,I(n.data.addRound),l(n.data.addRound.id);case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),Ue=function(){var e=Object(s.a)(i.a.mark((function e(){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Se();case 2:I(null),l(null),x([]),P(null),re("main");case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),_e=Object(m.c)(F,{skip:!W});return u.a.createElement(f.a,null,W&&u.a.createElement(p,{show:!0,doLogout:pe,setPage:re,meQuery:_e,currentRoundId:o}),L&&u.a.createElement("div",{className:"error"},L),!W&&u.a.createElement(y,{doLogin:fe,show:!0,handleError:be}),W&&!o&&u.a.createElement(E,{addNewLocation:qe,allLocationsQuery:Re,allUsersQuery:Ce,handleLocationClick:function(e){return function(){P(e===Q?null:e)}},handleUserClick:function(e){return function(){O.includes(e)?x(O.filter((function(n){return n!==e}))):x(O.concat(e))}},currentLocation:Q,currentPlayers:O,startNewRound:Te,show:"round"===te}),W&&u.a.createElement(h,{allRoundsQuery:$e,setRound:function(e){I(e),l(e.id),G(-1),re("round")},deleteRound:De,show:"main"===te}),W&&o&&u.a.createElement(b,{allPointsQuery:Le,round:g,addNewTrack:function(){var e=ae.readQuery({query:J,variables:{roundId:o}}).allPoints,n=-1;e.forEach((function(e){e.trackIndex>n&&(n=e.trackIndex)})),g.users.forEach((function(e){xe(o,e.id,n+1,3)}))},updatePoint:Pe,deleteLastTrack:Qe,changeTrack:function(e){G(e)},trackIndex:T,finishRound:Ue,uploadPoints:Se,show:"round"===te,savedState:le,uploadingPoints:de}),u.a.createElement("div",null,u.a.createElement("br",null),u.a.createElement("em",null,"Frisbeegolf app, copyright 2020 Juho Taipale")))},K=t(15),V=t(389),W=t(181),Z=t(179),ee=t(170),ne=t(18),te=t(169),re=t(3),ae=window.location.origin.replace(/^http/,"ws"),ue="".concat(ae,"/graphql");console.log("websocket uri",ue),console.log("http uri","/graphql");var oe=new te.a({uri:ue}),le=Object(W.a)({uri:"/graphql"}),ce=Object(ee.a)((function(e,n){var t=n.headers,a=localStorage.getItem("token");return{headers:Object(r.a)({},t,{authorization:a?"bearer ".concat(a):null})}})),ie=Object(ne.d)((function(e){var n=e.query,t=Object(re.l)(n),r=t.kind,a=t.operation;return"OperationDefinition"===r&&"subscription"===a}),oe,ce.concat(le)),se=new V.a({link:ie,cache:new Z.a});l.a.render(u.a.createElement(K.a,{client:se},u.a.createElement(K.a,{client:se},u.a.createElement(G,null))),document.getElementById("root"))},60:function(e,n,t){}},[[193,1,2]]]);
//# sourceMappingURL=main.2a9c29e5.chunk.js.map