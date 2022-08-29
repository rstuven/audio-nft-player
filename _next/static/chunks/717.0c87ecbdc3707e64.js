(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[717],{7717:function(a,b,c){"use strict";c.r(b),c.d(b,{AlchemyWebSocketProvider:function(){return D},getAlchemyEventTag:function(){return Q}});var d=c(3188),e=c(6731),f=c(475),g=c(4178),h=c(6881),i=c(8783),j=c(1581),k=c(4216);let l=null;try{if(l=WebSocket,null==l)throw Error("inject please")}catch(m){let n=new j.Yd(k.i);l=function(){n.throwError("WebSockets not supported in this environment",j.Yd.errors.UNSUPPORTED_OPERATION,{operation:"new WebSocket()"})}}var o=function(a,b,c,d){return new(c||(c=Promise))(function(e,f){function g(a){try{i(d.next(a))}catch(b){f(b)}}function h(a){try{i(d.throw(a))}catch(b){f(b)}}function i(a){var b;a.done?e(a.value):((b=a.value)instanceof c?b:new c(function(a){a(b)})).then(g,h)}i((d=d.apply(a,b||[])).next())})};let p=new j.Yd(k.i),q=1;class r extends i.r{constructor(a,b){"any"===b&&p.throwError("WebSocketProvider does not support 'any' network yet",j.Yd.errors.UNSUPPORTED_OPERATION,{operation:"network:any"}),"string"==typeof a?super(a,b):super("_websocket",b),this._pollingInterval=-1,this._wsReady=!1,"string"==typeof a?(0,h.zG)(this,"_websocket",new l(this.connection.url)):(0,h.zG)(this,"_websocket",a),(0,h.zG)(this,"_requests",{}),(0,h.zG)(this,"_subs",{}),(0,h.zG)(this,"_subIds",{}),(0,h.zG)(this,"_detectNetwork",super.detectNetwork()),this.websocket.onopen=()=>{this._wsReady=!0,Object.keys(this._requests).forEach(a=>{this.websocket.send(this._requests[a].payload)})},this.websocket.onmessage=a=>{let b=a.data,c=JSON.parse(b);if(null!=c.id){let d=String(c.id),e=this._requests[d];if(delete this._requests[d],void 0!==c.result)e.callback(null,c.result),this.emit("debug",{action:"response",request:JSON.parse(e.payload),response:c.result,provider:this});else{let f=null;c.error?(f=Error(c.error.message||"unknown error"),(0,h.zG)(f,"code",c.error.code||null),(0,h.zG)(f,"response",b)):f=Error("unknown error"),e.callback(f,void 0),this.emit("debug",{action:"response",error:f,request:JSON.parse(e.payload),provider:this})}}else if("eth_subscription"===c.method){let g=this._subs[c.params.subscription];g&&g.processFunc(c.params.result)}else console.warn("this should not happen")};let c=setInterval(()=>{this.emit("poll")},1e3);c.unref&&c.unref()}get websocket(){return this._websocket}detectNetwork(){return this._detectNetwork}get pollingInterval(){return 0}resetEventsBlock(a){p.throwError("cannot reset events block on WebSocketProvider",j.Yd.errors.UNSUPPORTED_OPERATION,{operation:"resetEventBlock"})}set pollingInterval(a){p.throwError("cannot set polling interval on WebSocketProvider",j.Yd.errors.UNSUPPORTED_OPERATION,{operation:"setPollingInterval"})}poll(){return o(this,void 0,void 0,function*(){return null})}set polling(a){a&&p.throwError("cannot set polling on WebSocketProvider",j.Yd.errors.UNSUPPORTED_OPERATION,{operation:"setPolling"})}send(a,b){let c=q++;return new Promise((d,e)=>{let f=JSON.stringify({method:a,params:b,id:c,jsonrpc:"2.0"});this.emit("debug",{action:"request",request:JSON.parse(f),provider:this}),this._requests[String(c)]={callback:function(a,b){return a?e(a):d(b)},payload:f},this._wsReady&&this.websocket.send(f)})}static defaultUrl(){return"ws://localhost:8546"}_subscribe(a,b,c){return o(this,void 0,void 0,function*(){let d=this._subIds[a];null==d&&(d=Promise.all(b).then(a=>this.send("eth_subscribe",a)),this._subIds[a]=d);let e=yield d;this._subs[e]={tag:a,processFunc:c}})}_startEvent(a){switch(a.type){case"block":this._subscribe("block",["newHeads"],a=>{let b=e.O$.from(a.number).toNumber();this._emitted.block=b,this.emit("block",b)});break;case"pending":this._subscribe("pending",["newPendingTransactions"],a=>{this.emit("pending",a)});break;case"filter":this._subscribe(a.tag,["logs",this._getFilter(a.filter)],b=>{null==b.removed&&(b.removed=!1),this.emit(a.filter,this.formatter.filterLog(b))});break;case"tx":{let b=a=>{let b=a.hash;this.getTransactionReceipt(b).then(a=>{a&&this.emit(b,a)})};b(a),this._subscribe("tx",["newHeads"],a=>{this._events.filter(a=>"tx"===a.type).forEach(b)});break}case"debug":case"poll":case"willPoll":case"didPoll":case"error":break;default:console.log("unhandled:",a)}}_stopEvent(a){let b=a.tag;if("tx"===a.type){if(this._events.filter(a=>"tx"===a.type).length)return;b="tx"}else if(this.listenerCount(a.event))return;let c=this._subIds[b];c&&(delete this._subIds[b],c.then(a=>{this._subs[a]&&(delete this._subs[a],this.send("eth_unsubscribe",[a]))}))}destroy(){return o(this,void 0,void 0,function*(){this.websocket.readyState===l.CONNECTING&&(yield new Promise(a=>{this.websocket.onopen=function(){a(!0)},this.websocket.onerror=function(){a(!1)}})),this.websocket.close(1e3)})}}var s=c(5710);c(4359);var t=c(3454);function u(a){let b=Object.assign({},a);return delete b.totalDifficulty,delete b.transactions,delete b.uncles,b}function v(a,b){let c=new Set,d=[];return a.forEach(a=>{let e=b(a);c.has(e)||(c.add(e),d.push(a))}),d}let w=Error("Cancelled");function x(a){if(a())throw w}let y="alchemy-pending-transactions";class z{constructor(a,b,c){this.listener=b,this.tag=a,this.once=c,this._lastBlockNumber=-2,this._inflight=!1}get event(){switch(this.type){case"tx":return this.hash;case"filter":return this.filter;default:return this.tag}}get type(){return this.tag.split(":")[0]}get hash(){let a=this.tag.split(":");if("tx"!==a[0])throw Error("Not a transaction event");return a[1]}get filter(){let a=this.tag.split(":");if("filter"!==a[0])throw Error("Not a transaction event");let b=a[1],c=B(a[2]),d={};return c.length>0&&(d.topics=c),b&&"*"!==b&&(d.address=b),d}pollable(){return this.tag.indexOf(":")>=0||["block","network","pending","poll"].indexOf(this.tag)>=0}}class A extends z{get fromAddress(){let a=this.tag.split(":");return a[0]!==y?void 0:a[1]&&"*"!==a[1]?C(a[1]):void 0}get toAddress(){let a=this.tag.split(":");return a[0]!==y?void 0:a[2]&&"*"!==a[2]?C(a[2]):void 0}get hashesOnly(){let a=this.tag.split(":");return a[0]!==y?void 0:a[3]&&"*"!==a[3]?"true"===a[3]:void 0}}function B(a){return""===a?[]:a.split(/&/g).map(a=>{if(""===a)return[];let b=a.split("|").map(a=>"null"===a?null:a);return 1===b.length?b[0]:b})}function C(a){if(""===a)return;let b=a.split("|");return 1===b.length?b[0]:b}class D extends r{constructor(a,b){var e;let h=f.AlchemyProvider.getApiKey(a.apiKey),i=f.AlchemyProvider.getAlchemyNetwork(a.network),j=f.AlchemyProvider.getAlchemyConnectionInfo(i,h,"wss"),k=`alchemy-sdk-${d.V}`,l=new g.Z(null!==(e=a.url)&& void 0!==e?e:j.url,k,{wsConstructor:null!=b?b:E()?c(5840).w3cwebsocket:WebSocket}),m=d.E[i];super(l,m),this._events=[],this.virtualSubscriptionsById=new Map,this.virtualIdsByPhysicalId=new Map,this.handleMessage=a=>{let b=JSON.parse(a.data);if(!L(b))return;let c=b.params.subscription,d=this.virtualIdsByPhysicalId.get(c);if(!d)return;let e=this.virtualSubscriptionsById.get(d);if("eth_subscribe"===e.method)switch(e.params[0]){case"newHeads":{let f=e,g=b,{isBackfilling:h,backfillBuffer:i}=f,{result:j}=g.params;h?M(i,j):c!==d?this.emitAndRememberEvent(d,j,J):this.rememberEvent(d,j,J);break}case"logs":{let k=e,l=b,{isBackfilling:m,backfillBuffer:n}=k,{result:o}=l.params;m?N(n,o):d!==c?this.emitAndRememberEvent(d,o,K):this.rememberEvent(d,o,K)}}},this.handleReopen=()=>{this.virtualIdsByPhysicalId.clear();let{cancel:a,isCancelled:b}=F();for(let c of(this.cancelBackfill=a,this.virtualSubscriptionsById.values()))(0,d._)(this,void 0,void 0,function*(){try{yield this.resubscribeAndBackfill(b,c)}catch(a){b()||console.error(`Error while backfilling "${c.params[0]}" subscription. Some events may be missing.`,a)}});this.startHeartbeat()},this.stopHeartbeatAndBackfill=()=>{null!=this.heartbeatIntervalId&&(clearInterval(this.heartbeatIntervalId),this.heartbeatIntervalId=void 0),this.cancelBackfill()},this.apiKey=h,this.backfiller=new class{constructor(a){this.provider=a,this.maxBackfillBlocks=120}getNewHeadsBackfill(a,b,c){return(0,d._)(this,void 0,void 0,function*(){x(a);let e=yield this.getBlockNumber();if(x(a),0===b.length)return this.getHeadEventsInRange(Math.max(c,e-this.maxBackfillBlocks)+1,e+1);let f=(0,d.f)(b[b.length-1].number),g=e-this.maxBackfillBlocks+1;if(f<=g)return this.getHeadEventsInRange(g,e+1);let h=yield this.getReorgHeads(a,b);x(a);let i=yield this.getHeadEventsInRange(f+1,e+1);return x(a),[...h,...i]})}getLogsBackfill(a,b,c,e){return(0,d._)(this,void 0,void 0,function*(){x(a);let f=yield this.getBlockNumber();if(x(a),0===c.length)return this.getLogsInRange(b,Math.max(e,f-this.maxBackfillBlocks)+1,f+1);let g=(0,d.f)(c[c.length-1].blockNumber),h=f-this.maxBackfillBlocks+1;if(g<h)return this.getLogsInRange(b,h,f+1);let i=yield this.getCommonAncestor(a,c);x(a);let j=c.filter(a=>(0,d.f)(a.blockNumber)>i.blockNumber).map(a=>Object.assign(Object.assign({},a),{removed:!0})),k=i.blockNumber===Number.NEGATIVE_INFINITY?(0,d.f)(c[0].blockNumber):i.blockNumber,l=yield this.getLogsInRange(b,k,f+1);return l=l.filter(a=>a&&((0,d.f)(a.blockNumber)>i.blockNumber||(0,d.f)(a.logIndex)>i.logIndex)),x(a),[...j,...l]})}setMaxBackfillBlock(a){this.maxBackfillBlocks=a}getBlockNumber(){return(0,d._)(this,void 0,void 0,function*(){let a=yield this.provider.send("eth_blockNumber");return(0,d.f)(a)})}getHeadEventsInRange(a,b){return(0,d._)(this,void 0,void 0,function*(){if(a>=b)return[];let c=[];for(let e=a;e<b;e++)c.push({method:"eth_getBlockByNumber",params:[(0,d.t)(e),!1]});let f=yield this.provider.sendBatch(c),g=f.reduce((a,b)=>a.concat(b),[]);return g.map(u)})}getReorgHeads(a,b){return(0,d._)(this,void 0,void 0,function*(){let c=[];for(let e=b.length-1;e>=0;e--){let f=b[e],g=yield this.getBlockByNumber((0,d.f)(f.number));if(x(a),f.hash===g.hash)break;c.push(u(g))}return c.reverse()})}getBlockByNumber(a){return(0,d._)(this,void 0,void 0,function*(){return this.provider.send("eth_getBlockByNumber",[(0,d.t)(a),!1])})}getCommonAncestor(a,b){return(0,d._)(this,void 0,void 0,function*(){let c=yield this.getBlockByNumber((0,d.f)(b[b.length-1].blockNumber));x(a);for(let e=b.length-1;e>=0;e--){let f=b[e];if(f.blockNumber!==c.number&&(c=yield this.getBlockByNumber((0,d.f)(f.blockNumber))),f.blockHash===c.hash)return{blockNumber:(0,d.f)(f.blockNumber),logIndex:(0,d.f)(f.logIndex)}}return{blockNumber:Number.NEGATIVE_INFINITY,logIndex:Number.NEGATIVE_INFINITY}})}getLogsInRange(a,b,c){return(0,d._)(this,void 0,void 0,function*(){if(b>=c)return[];let e=Object.assign(Object.assign({},a),{fromBlock:(0,d.t)(b),toBlock:(0,d.t)(c-1)});return this.provider.send("eth_getLogs",[e])})}}(this),this.addSocketListeners(),this.startHeartbeat(),this.cancelBackfill=d.n}static getNetwork(a){return"string"==typeof a&&a in d.C?d.C[a]:(0,s.H)(a)}on(a,b){return this._addEventListener(a,b,!1)}once(a,b){return this._addEventListener(a,b,!0)}off(a,b){return P(a)?this._off(a,b):super.off(a,b)}removeAllListeners(a){return void 0!==a&&P(a)?this._removeAllListeners(a):super.removeAllListeners(a)}listenerCount(a){return void 0!==a&&P(a)?this._listenerCount(a):super.listenerCount(a)}listeners(a){return void 0!==a&&P(a)?this._listeners(a):super.listeners(a)}_addEventListener(a,b,c){if(!P(a))return super._addEventListener(a,b,c);{let d=new A(Q(a),b,c);return this._events.push(d),this._startEvent(d),this}}_startEvent(a){[y,"block","filter"].includes(a.type)?this.customStartEvent(a):super._startEvent(a)}_subscribe(a,b,c,e){return(0,d._)(this,void 0,void 0,function*(){let d=this._subIds[a],f=yield this.getBlockNumber();null==d&&(d=Promise.all(b).then(a=>this.send("eth_subscribe",a)),this._subIds[a]=d);let g=yield d,h=yield Promise.all(b);this.virtualSubscriptionsById.set(g,{event:e,method:"eth_subscribe",params:h,startingBlockNumber:f,virtualId:g,physicalId:g,sentEvents:[],isBackfilling:!1,backfillBuffer:[]}),this.virtualIdsByPhysicalId.set(g,g),this._subs[g]={tag:a,processFunc:c}})}emit(a,...b){if(!P(a))return super.emit(a,...b);{let c=!1,d=[],e=Q(a);return this._events=this._events.filter(a=>a.tag!==e||(setTimeout(()=>{a.listener.apply(this,b)},0),c=!0,!a.once||(d.push(a),!1))),d.forEach(a=>{this._stopEvent(a)}),c}}sendBatch(a){return(0,d._)(this,void 0,void 0,function*(){let b=0,c=a.map(({method:a,params:c})=>({method:a,params:c,jsonrpc:"2.0",id:`alchemy-sdk:${b++}`})),d=yield this.sendBatchConcurrently(c),e=d.find(a=>!!a.error);if(e)throw Error(e.error.message);return d.sort((a,b)=>a.id-b.id).map(a=>a.result)})}destroy(){return this.removeSocketListeners(),this.stopHeartbeatAndBackfill(),super.destroy()}isCommunityResource(){return this.apiKey===d.D}_stopEvent(a){let b=a.tag;if(a.type===y){if(this._events.filter(a=>a.type===y).length)return}else if("tx"===a.type){if(this._events.filter(a=>"tx"===a.type).length)return;b="tx"}else if(this.listenerCount(a.event))return;let c=this._subIds[b];c&&(delete this._subIds[b],c.then(a=>{this._subs[a]&&(delete this._subs[a],this.send("eth_unsubscribe",[a]))}))}addSocketListeners(){this._websocket.addEventListener("message",this.handleMessage),this._websocket.addEventListener("reopen",this.handleReopen),this._websocket.addEventListener("down",this.stopHeartbeatAndBackfill)}removeSocketListeners(){this._websocket.removeEventListener("message",this.handleMessage),this._websocket.removeEventListener("reopen",this.handleReopen),this._websocket.removeEventListener("down",this.stopHeartbeatAndBackfill)}resubscribeAndBackfill(a,b){return(0,d._)(this,void 0,void 0,function*(){let{virtualId:c,method:d,params:e,sentEvents:f,backfillBuffer:g,startingBlockNumber:h}=b;b.isBackfilling=!0,g.length=0;try{var i,j;let k=yield this.send(d,e);switch(x(a),b.physicalId=k,this.virtualIdsByPhysicalId.set(k,c),e[0]){case"newHeads":{let l=yield G(()=>I(this.backfiller.getNewHeadsBackfill(a,f,h),6e4),5,()=>!a());x(a);let m=(i=[...l,...g],v(i,a=>a.hash));m.forEach(a=>this.emitNewHeadsEvent(c,a));break}case"logs":{let n=e[1]||{},o=yield G(()=>I(this.backfiller.getLogsBackfill(a,n,f,h),6e4),5,()=>!a());x(a);let p=(j=[...o,...g],v(j,a=>`${a.blockHash}/${a.logIndex}`));p.forEach(a=>this.emitLogsEvent(c,a))}}}finally{b.isBackfilling=!1,g.length=0}})}emitNewHeadsEvent(a,b){this.emitAndRememberEvent(a,b,J)}emitLogsEvent(a,b){this.emitAndRememberEvent(a,b,K)}emitAndRememberEvent(a,b,c){this.rememberEvent(a,b,c);let d=this.virtualSubscriptionsById.get(a);d&&this.emitGenericEvent(d,b)}rememberEvent(a,b,c){let d=this.virtualSubscriptionsById.get(a);d&&O(d.sentEvents,Object.assign({},b),c)}emitGenericEvent(a,b){let c=this.emitProcessFn(a.event);c(b)}startHeartbeat(){null==this.heartbeatIntervalId&&(this.heartbeatIntervalId=setInterval(()=>(0,d._)(this,void 0,void 0,function*(){try{yield I(this.send("net_version"),1e4)}catch(a){this._websocket.reconnect()}}),3e4))}sendBatchConcurrently(a){return(0,d._)(this,void 0,void 0,function*(){return Promise.all(a.map(a=>this.send(a.method,a.params)))})}customStartEvent(a){if(a.type===y){let{fromAddress:b,toAddress:c,hashesOnly:d}=a;this._subscribe(a.tag,["alchemy_pendingTransactions",{fromAddress:b,toAddress:c,hashesOnly:d}],this.emitProcessFn(a),a)}else"block"===a.type?this._subscribe("block",["newHeads"],this.emitProcessFn(a),a):"filter"===a.type&&this._subscribe(a.tag,["logs",this._getFilter(a.filter)],this.emitProcessFn(a),a)}emitProcessFn(a){switch(a.type){case y:let{fromAddress:b,toAddress:c,hashesOnly:d}=a;return a=>this.emit({method:"alchemy_pendingTransactions",fromAddress:b,toAddress:c,hashesOnly:d},a);case"block":return a=>{let b=e.O$.from(a.number).toNumber();this._emitted.block=b,this.emit("block",b)};case"filter":return b=>{null==b.removed&&(b.removed=!1),this.emit(a.filter,this.formatter.filterLog(b))};default:throw Error("Invalid event type to `emitProcessFn()`")}}_off(a,b){if(null==b)return this.removeAllListeners(a);let c=[],d=!1,e=Q(a);return this._events=this._events.filter(a=>a.tag!==e||a.listener!=b||!!d||(d=!0,c.push(a),!1)),c.forEach(a=>{this._stopEvent(a)}),this}_removeAllListeners(a){let b=[];if(null==a)b=this._events,this._events=[];else{let c=Q(a);this._events=this._events.filter(a=>a.tag!==c||(b.push(a),!1))}return b.forEach(a=>{this._stopEvent(a)}),this}_listenerCount(a){if(!a)return this._events.length;let b=Q(a);return this._events.filter(a=>a.tag===b).length}_listeners(a){if(null==a)return this._events.map(a=>a.listener);let b=Q(a);return this._events.filter(a=>a.tag===b).map(a=>a.listener)}}function E(){return void 0!==t&&null!=t&&null!=t.versions&&null!=t.versions.node}function F(){let a=!1;return{cancel:()=>a=!0,isCancelled:()=>a}}function G(a,b,c=()=>!0){return(0,d._)(this,void 0,void 0,function*(){let d=0,e=0;for(;;)try{return yield a()}catch(f){if(++e>=b||!c(f)||(yield H(d),!c(f)))throw f;d=0===d?1e3:Math.min(3e4,2*d)}})}function H(a){return new Promise(b=>setTimeout(b,a))}function I(a,b){return Promise.race([a,new Promise((a,c)=>setTimeout(()=>c(Error("Timeout")),b))])}function J(a){return(0,d.f)(a.number)}function K(a){return(0,d.f)(a.blockNumber)}function L(a){var b;return!Array.isArray(b=a)&&("2.0"!==b.jsonrpc|| void 0===b.id)}function M(a,b){O(a,b,J)}function N(a,b){O(a,b,K)}function O(a,b,c){let d=c(b),e=a.findIndex(a=>c(a)>d-10);-1===e?a.length=0:a.splice(0,e),a.push(b)}function P(a){return"object"==typeof a&&"method"in a}function Q(a){if(!P(a))throw Error("Event tag requires AlchemyEventType");let b=R(a.fromAddress),c=R(a.toAddress),d=S(a.hashesOnly);return y+":"+b+":"+c+":"+d}function R(a){return void 0===a?"*":Array.isArray(a)?a.join("|"):a}function S(a){return void 0===a?"*":a.toString()}},284:function(a){var b=function(){if("object"==typeof self&&self)return self;if("object"==typeof window&&window)return window;throw Error("Unable to resolve global `this`")};a.exports=function(){if(this)return this;if("object"==typeof globalThis&&globalThis)return globalThis;try{Object.defineProperty(Object.prototype,"__global__",{get:function(){return this},configurable:!0})}catch(a){return b()}try{if(!__global__)return b();return __global__}finally{delete Object.prototype.__global__}}()},4178:function(a,b){"use strict";var c=function(){function a(b,c,e){if(void 0===e&&(e={}),this.url=b,this.onclose=null,this.onerror=null,this.onmessage=null,this.onopen=null,this.ondown=null,this.onreopen=null,this.CONNECTING=a.CONNECTING,this.OPEN=a.OPEN,this.CLOSING=a.CLOSING,this.CLOSED=a.CLOSED,this.hasBeenOpened=!1,this.isClosed=!1,this.messageBuffer=[],this.nextRetryTime=0,this.reconnectCount=0,this.lastKnownExtensions="",this.lastKnownProtocol="",this.listeners={},null==c||"string"==typeof c||Array.isArray(c)?this.protocols=c:e=c,this.options=d(e),!this.options.wsConstructor){if("undefined"!=typeof WebSocket)this.options.wsConstructor=WebSocket;else throw Error("WebSocket not present in global scope and no wsConstructor option was provided.")}this.openNewWebSocket()}return Object.defineProperty(a.prototype,"binaryType",{get:function(){return this.binaryTypeInternal||"blob"},set:function(a){this.binaryTypeInternal=a,this.ws&&(this.ws.binaryType=a)},enumerable:!0,configurable:!0}),Object.defineProperty(a.prototype,"bufferedAmount",{get:function(){var a=this.ws?this.ws.bufferedAmount:0,b=!1;return this.messageBuffer.forEach(function(c){var d=e(c);null!=d?a+=d:b=!0}),b&&this.debugLog("Some buffered data had unknown length. bufferedAmount() return value may be below the correct amount."),a},enumerable:!0,configurable:!0}),Object.defineProperty(a.prototype,"extensions",{get:function(){return this.ws?this.ws.extensions:this.lastKnownExtensions},enumerable:!0,configurable:!0}),Object.defineProperty(a.prototype,"protocol",{get:function(){return this.ws?this.ws.protocol:this.lastKnownProtocol},enumerable:!0,configurable:!0}),Object.defineProperty(a.prototype,"readyState",{get:function(){return this.isClosed?a.CLOSED:a.OPEN},enumerable:!0,configurable:!0}),a.prototype.close=function(a,b){this.disposeSocket(a,b),this.shutdown(),this.debugLog("WebSocket permanently closed by client.")},a.prototype.send=function(a){if(this.isClosed)throw Error("WebSocket is already in CLOSING or CLOSED state.");this.ws&&this.ws.readyState===this.OPEN?this.ws.send(a):this.messageBuffer.push(a)},a.prototype.reconnect=function(){if(this.isClosed)throw Error("Cannot call reconnect() on socket which is permanently closed.");this.disposeSocket(1e3,"Client requested reconnect."),this.handleClose(void 0)},a.prototype.addEventListener=function(a,b){this.listeners[a]||(this.listeners[a]=[]),this.listeners[a].push(b)},a.prototype.dispatchEvent=function(a){return this.dispatchEventOfType(a.type,a)},a.prototype.removeEventListener=function(a,b){this.listeners[a]&&(this.listeners[a]=this.listeners[a].filter(function(a){return a!==b}))},a.prototype.openNewWebSocket=function(){var a=this;if(!this.isClosed){var b=this.options,c=b.connectTimeout,d=b.wsConstructor;this.debugLog("Opening new WebSocket to "+this.url+".");var e=new d(this.url,this.protocols);e.onclose=function(b){return a.handleClose(b)},e.onerror=function(b){return a.handleError(b)},e.onmessage=function(b){return a.handleMessage(b)},e.onopen=function(b){return a.handleOpen(b)},this.connectTimeoutId=setTimeout(function(){a.clearConnectTimeout(),a.disposeSocket(),a.handleClose(void 0)},c),this.ws=e}},a.prototype.handleOpen=function(a){var b=this;if(this.ws&&!this.isClosed){var c=this.options.allClearResetTime;this.debugLog("WebSocket opened."),null!=this.binaryTypeInternal?this.ws.binaryType=this.binaryTypeInternal:this.binaryTypeInternal=this.ws.binaryType,this.clearConnectTimeout(),this.hasBeenOpened?this.dispatchEventOfType("reopen",a):(this.dispatchEventOfType("open",a),this.hasBeenOpened=!0),this.messageBuffer.forEach(function(a){return b.send(a)}),this.messageBuffer=[],this.allClearTimeoutId=setTimeout(function(){b.clearAllClearTimeout(),b.nextRetryTime=0,b.reconnectCount=0,b.debugLog("WebSocket remained open for "+(c/1e3|0)+" seconds. Resetting retry time and count.")},c)}},a.prototype.handleMessage=function(a){!this.isClosed&&this.dispatchEventOfType("message",a)},a.prototype.handleClose=function(a){var b=this;if(!this.isClosed){var c=this.options,d=c.maxReconnectAttempts,e=c.shouldReconnect;if(this.clearConnectTimeout(),this.clearAllClearTimeout(),this.ws&&(this.lastKnownExtensions=this.ws.extensions,this.lastKnownProtocol=this.ws.protocol,this.disposeSocket()),this.dispatchEventOfType("down",a),this.reconnectCount>=d){this.stopReconnecting(a,this.getTooManyFailedReconnectsMessage());return}var f=!a||e(a);"boolean"==typeof f?this.handleWillReconnect(f,a,"Provided shouldReconnect() returned false. Closing permanently."):f.then(function(c){!b.isClosed&&b.handleWillReconnect(c,a,"Provided shouldReconnect() resolved to false. Closing permanently.")})}},a.prototype.handleError=function(a){this.dispatchEventOfType("error",a),this.debugLog("WebSocket encountered an error.")},a.prototype.handleWillReconnect=function(a,b,c){a?this.reestablishConnection():this.stopReconnecting(b,c)},a.prototype.reestablishConnection=function(){var a=this,b=this.options,c=b.minReconnectDelay,d=b.maxReconnectDelay,e=b.reconnectBackoffFactor;this.reconnectCount++;var f=this.nextRetryTime;this.nextRetryTime=Math.max(c,Math.min(this.nextRetryTime*e,d)),setTimeout(function(){return a.openNewWebSocket()},f),this.debugLog("WebSocket was closed. Re-opening in "+(f/1e3|0)+" seconds.")},a.prototype.stopReconnecting=function(a,b){this.debugLog(b),this.shutdown(),a&&this.dispatchEventOfType("close",a)},a.prototype.shutdown=function(){this.isClosed=!0,this.clearAllTimeouts(),this.messageBuffer=[],this.disposeSocket()},a.prototype.disposeSocket=function(a,b){this.ws&&(this.ws.onerror=g,this.ws.onclose=g,this.ws.onmessage=g,this.ws.onopen=g,this.ws.close(a,b),this.ws=void 0)},a.prototype.clearAllTimeouts=function(){this.clearConnectTimeout(),this.clearAllClearTimeout()},a.prototype.clearConnectTimeout=function(){null!=this.connectTimeoutId&&(clearTimeout(this.connectTimeoutId),this.connectTimeoutId=void 0)},a.prototype.clearAllClearTimeout=function(){null!=this.allClearTimeoutId&&(clearTimeout(this.allClearTimeoutId),this.allClearTimeoutId=void 0)},a.prototype.dispatchEventOfType=function(a,b){var c=this;switch(a){case"close":this.onclose&&this.onclose(b);break;case"error":this.onerror&&this.onerror(b);break;case"message":this.onmessage&&this.onmessage(b);break;case"open":this.onopen&&this.onopen(b);break;case"down":this.ondown&&this.ondown(b);break;case"reopen":this.onreopen&&this.onreopen(b)}return a in this.listeners&&this.listeners[a].slice().forEach(function(a){return c.callListener(a,b)}),!b||!b.defaultPrevented},a.prototype.callListener=function(a,b){"function"==typeof a?a.call(this,b):a.handleEvent.call(this,b)},a.prototype.debugLog=function(a){this.options.debug&&console.log(a)},a.prototype.getTooManyFailedReconnectsMessage=function(){var a=this.options.maxReconnectAttempts;return"Failed to reconnect after "+a+" "+f("attempt",a)+". Closing permanently."},a.DEFAULT_OPTIONS={allClearResetTime:5e3,connectTimeout:5e3,debug:!1,minReconnectDelay:1e3,maxReconnectDelay:3e4,maxReconnectAttempts:Number.POSITIVE_INFINITY,reconnectBackoffFactor:1.5,shouldReconnect:function(){return!0},wsConstructor:void 0},a.CONNECTING=0,a.OPEN=1,a.CLOSING=2,a.CLOSED=3,a}();function d(a){var b={};return Object.keys(c.DEFAULT_OPTIONS).forEach(function(d){var e=a[d];b[d]=void 0===e?c.DEFAULT_OPTIONS[d]:e}),b}function e(a){return"string"==typeof a?2*a.length:a instanceof ArrayBuffer?a.byteLength:a instanceof Blob?a.size:void 0}function f(a,b){return 1===b?a:a+"s"}function g(){}b.Z=c},5840:function(a,b,c){if("object"==typeof globalThis)e=globalThis;else try{e=c(284)}catch(d){}finally{if(e||"undefined"==typeof window||(e=window),!e)throw Error("Could not determine global this")}var e,f=e.WebSocket||e.MozWebSocket,g=c(9387);function h(a,b){var c;return b?new f(a,b):new f(a)}f&&["CONNECTING","OPEN","CLOSING","CLOSED"].forEach(function(a){Object.defineProperty(h,a,{get:function(){return f[a]}})}),a.exports={w3cwebsocket:f?h:null,version:g}},9387:function(a,b,c){a.exports=c(9794).version},9794:function(a){"use strict";a.exports={version:"1.0.34"}}}])