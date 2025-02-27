(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function o(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(r){if(r.ep)return;r.ep=!0;const i=o(r);fetch(r.href,i)}})();const z=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),_=__DEFINES__;Object.keys(_).forEach(t=>{const e=t.split(".");let o=z;for(let n=0;n<e.length;n++){const r=e[n];n===e.length-1?o[r]=_[t]:o=o[r]||(o[r]={})}});class Q{constructor(e,o,n){this.logger=e,this.transport=o,this.importUpdatedModule=n,this.hotModulesMap=new Map,this.disposeMap=new Map,this.pruneMap=new Map,this.dataMap=new Map,this.customListenersMap=new Map,this.ctxToListenersMap=new Map,this.updateQueue=[],this.pendingUpdateQueue=!1}async notifyListeners(e,o){const n=this.customListenersMap.get(e);n&&await Promise.allSettled(n.map(r=>r(o)))}send(e){this.transport.send(e).catch(o=>{this.logger.error(o)})}clear(){this.hotModulesMap.clear(),this.disposeMap.clear(),this.pruneMap.clear(),this.dataMap.clear(),this.customListenersMap.clear(),this.ctxToListenersMap.clear()}async prunePaths(e){await Promise.all(e.map(o=>{const n=this.disposeMap.get(o);if(n)return n(this.dataMap.get(o))})),e.forEach(o=>{const n=this.pruneMap.get(o);n&&n(this.dataMap.get(o))})}warnFailedUpdate(e,o){e.message.includes("fetch")||this.logger.error(e),this.logger.error(`Failed to reload ${o}. This could be due to syntax errors or importing non-existent modules. (see errors above)`)}async queueUpdate(e){if(this.updateQueue.push(this.fetchUpdate(e)),!this.pendingUpdateQueue){this.pendingUpdateQueue=!0,await Promise.resolve(),this.pendingUpdateQueue=!1;const o=[...this.updateQueue];this.updateQueue=[],(await Promise.all(o)).forEach(n=>n&&n())}}async fetchUpdate(e){const{path:o,acceptedPath:n}=e,r=this.hotModulesMap.get(o);if(!r)return;let i;const s=o===n,c=r.callbacks.filter(({deps:a})=>a.includes(n));if(s||c.length>0){const a=this.disposeMap.get(n);a&&await a(this.dataMap.get(n));try{i=await this.importUpdatedModule(e)}catch(l){this.warnFailedUpdate(l,n)}}return()=>{for(const{deps:l,fn:u}of c)u(l.map(p=>p===n?i:void 0));const a=s?o:`${n} via ${o}`;this.logger.debug(`hot updated: ${a}`)}}}let j="useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict",D=(t=21)=>{let e="",o=t|0;for(;o--;)e+=j[Math.random()*64|0];return e};typeof process<"u"&&process.platform;function J(){let t,e;return{promise:new Promise((n,r)=>{t=n,e=r}),resolve:t,reject:e}}function x(t){const e=new Error(t.message||"Unknown invoke error");return Object.assign(e,t,{runnerError:new Error("RunnerError")}),e}const B=t=>{if(t.invoke)return{...t,async invoke(o,n){const r=await t.invoke({type:"custom",event:"vite:invoke",data:{id:"send",name:o,data:n}});if("error"in r)throw x(r.error);return r.result}};if(!t.send||!t.connect)throw new Error("transport must implement send and connect when invoke is not implemented");const e=new Map;return{...t,connect({onMessage:o,onDisconnection:n}){return t.connect({onMessage(r){if(r.type==="custom"&&r.event==="vite:invoke"){const i=r.data;if(i.id.startsWith("response:")){const s=i.id.slice(9),c=e.get(s);if(!c)return;c.timeoutId&&clearTimeout(c.timeoutId),e.delete(s);const{e:a,r:l}=i.data;a?c.reject(a):c.resolve(l);return}}o(r)},onDisconnection:n})},disconnect(){var o;return e.forEach(n=>{n.reject(new Error(`transport was disconnected, cannot call ${JSON.stringify(n.name)}`))}),e.clear(),(o=t.disconnect)==null?void 0:o.call(t)},send(o){return t.send(o)},async invoke(o,n){var M;const r=D(),i={type:"custom",event:"vite:invoke",data:{name:o,id:`send:${r}`,data:n}},s=t.send(i),{promise:c,resolve:a,reject:l}=J(),u=t.timeout??6e4;let p;u>0&&(p=setTimeout(()=>{e.delete(r),l(new Error(`transport invoke timed out after ${u}ms (data: ${JSON.stringify(i)})`))},u),(M=p==null?void 0:p.unref)==null||M.call(p)),e.set(r,{resolve:a,reject:l,name:o,timeoutId:p}),s&&s.catch(g=>{clearTimeout(p),e.delete(r),l(g)});try{return await c}catch(g){throw x(g)}}}},V=t=>{const e=B(t);let o=!e.connect,n;return{...t,...e.connect?{async connect(r){if(o)return;if(n){await n;return}const i=e.connect({onMessage:r??(()=>{}),onDisconnection(){o=!1}});i&&(n=i,await n,n=void 0),o=!0}}:{},...e.disconnect?{async disconnect(){o&&(n&&await n,o=!1,await e.disconnect())}}:{},async send(r){if(e.send){if(!o)if(n)await n;else throw new Error("send was called before connect");await e.send(r)}},async invoke(r,i){if(!o)if(n)await n;else throw new Error("invoke was called before connect");return e.invoke(r,i)}}},S=t=>{const e=t.pingInterval??3e4;let o,n;return{async connect({onMessage:r,onDisconnection:i}){const s=t.createConnection();s.addEventListener("message",async({data:a})=>{r(JSON.parse(a))});let c=s.readyState===s.OPEN;c||await new Promise((a,l)=>{s.addEventListener("open",()=>{c=!0,a()},{once:!0}),s.addEventListener("close",async()=>{if(!c){l(new Error("WebSocket closed without opened."));return}r({type:"custom",event:"vite:ws:disconnect",data:{webSocket:s}}),i()})}),r({type:"custom",event:"vite:ws:connect",data:{webSocket:s}}),o=s,n=setInterval(()=>{s.readyState===s.OPEN&&s.send(JSON.stringify({type:"ping"}))},e)},disconnect(){clearInterval(n),o==null||o.close()},send(r){o.send(JSON.stringify(r))}}},G=__HMR_CONFIG_NAME__,Y=__BASE__||"/";function d(t,e={},...o){const n=document.createElement(t);for(const[r,i]of Object.entries(e))n.setAttribute(r,i);return n.append(...o),n}const K=`
:host {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  --monospace: 'SFMono-Regular', Consolas,
  'Liberation Mono', Menlo, Courier, monospace;
  --red: #ff5555;
  --yellow: #e2aa53;
  --purple: #cfa4ff;
  --cyan: #2dd9da;
  --dim: #c9c9c9;

  --window-background: #181818;
  --window-color: #d8d8d8;
}

.backdrop {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  margin: 0;
  background: rgba(0, 0, 0, 0.66);
}

.window {
  font-family: var(--monospace);
  line-height: 1.5;
  max-width: 80vw;
  color: var(--window-color);
  box-sizing: border-box;
  margin: 30px auto;
  padding: 2.5vh 4vw;
  position: relative;
  background: var(--window-background);
  border-radius: 6px 6px 8px 8px;
  box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
  overflow: hidden;
  border-top: 8px solid var(--red);
  direction: ltr;
  text-align: left;
}

pre {
  font-family: var(--monospace);
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 1em;
  overflow-x: scroll;
  scrollbar-width: none;
}

pre::-webkit-scrollbar {
  display: none;
}

pre.frame::-webkit-scrollbar {
  display: block;
  height: 5px;
}

pre.frame::-webkit-scrollbar-thumb {
  background: #999;
  border-radius: 5px;
}

pre.frame {
  scrollbar-width: thin;
}

.message {
  line-height: 1.3;
  font-weight: 600;
  white-space: pre-wrap;
}

.message-body {
  color: var(--red);
}

.plugin {
  color: var(--purple);
}

.file {
  color: var(--cyan);
  margin-bottom: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.frame {
  color: var(--yellow);
}

.stack {
  font-size: 13px;
  color: var(--dim);
}

.tip {
  font-size: 13px;
  color: #999;
  border-top: 1px dotted #999;
  padding-top: 13px;
  line-height: 1.8;
}

code {
  font-size: 13px;
  font-family: var(--monospace);
  color: var(--yellow);
}

.file-link {
  text-decoration: underline;
  cursor: pointer;
}

kbd {
  line-height: 1.5;
  font-family: ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.75rem;
  font-weight: 700;
  background-color: rgb(38, 40, 44);
  color: rgb(166, 167, 171);
  padding: 0.15rem 0.3rem;
  border-radius: 0.25rem;
  border-width: 0.0625rem 0.0625rem 0.1875rem;
  border-style: solid;
  border-color: rgb(54, 57, 64);
  border-image: initial;
}
`,Z=()=>d("div",{class:"backdrop",part:"backdrop"},d("div",{class:"window",part:"window"},d("pre",{class:"message",part:"message"},d("span",{class:"plugin",part:"plugin"}),d("span",{class:"message-body",part:"message-body"})),d("pre",{class:"file",part:"file"}),d("pre",{class:"frame",part:"frame"}),d("pre",{class:"stack",part:"stack"}),d("div",{class:"tip",part:"tip"},"Click outside, press ",d("kbd",{},"Esc")," key, or fix the code to dismiss.",d("br"),"You can also disable this overlay by setting ",d("code",{part:"config-option-name"},"server.hmr.overlay")," to ",d("code",{part:"config-option-value"},"false")," in ",d("code",{part:"config-file-name"},G),".")),d("style",{},K)),L=/(?:[a-zA-Z]:\\|\/).*?:\d+:\d+/g,w=/^(?:>?\s*\d+\s+\|.*|\s+\|\s*\^.*)\r?\n/gm,{HTMLElement:X=class{}}=globalThis;class ee extends X{constructor(e,o=!0){var s;super(),this.root=this.attachShadow({mode:"open"}),this.root.appendChild(Z()),w.lastIndex=0;const n=e.frame&&w.test(e.frame),r=n?e.message.replace(w,""):e.message;e.plugin&&this.text(".plugin",`[plugin:${e.plugin}] `),this.text(".message-body",r.trim());const[i]=(((s=e.loc)==null?void 0:s.file)||e.id||"unknown file").split("?");e.loc?this.text(".file",`${i}:${e.loc.line}:${e.loc.column}`,o):e.id&&this.text(".file",i),n&&this.text(".frame",e.frame.trim()),this.text(".stack",e.stack,o),this.root.querySelector(".window").addEventListener("click",c=>{c.stopPropagation()}),this.addEventListener("click",()=>{this.close()}),this.closeOnEsc=c=>{(c.key==="Escape"||c.code==="Escape")&&this.close()},document.addEventListener("keydown",this.closeOnEsc)}text(e,o,n=!1){const r=this.root.querySelector(e);if(!n)r.textContent=o;else{let i=0,s;for(L.lastIndex=0;s=L.exec(o);){const{0:c,index:a}=s,l=o.slice(i,a);r.appendChild(document.createTextNode(l));const u=document.createElement("a");u.textContent=c,u.className="file-link",u.onclick=()=>{fetch(new URL(`${Y}__open-in-editor?file=${encodeURIComponent(c)}`,import.meta.url))},r.appendChild(u),i+=l.length+c.length}}}close(){var e;(e=this.parentNode)==null||e.removeChild(this),document.removeEventListener("keydown",this.closeOnEsc)}}const h="vite-error-overlay",{customElements:v}=globalThis;v&&!v.get(h)&&v.define(h,ee);console.debug("[vite] connecting...");const b=new URL(import.meta.url),te=__SERVER_HOST__,T=__HMR_PROTOCOL__||(b.protocol==="https:"?"wss":"ws"),A=__HMR_PORT__,P=`${__HMR_HOSTNAME__||b.hostname}:${A||b.port}${__HMR_BASE__}`,$=__HMR_DIRECT_TARGET__,y=__BASE__||"/",O=__HMR_TIMEOUT__,W=V((()=>{let t=S({createConnection:()=>new WebSocket(`${T}://${P}`,"vite-hmr"),pingInterval:O});return{async connect(e){try{await t.connect(e)}catch(o){if(!A){t=S({createConnection:()=>new WebSocket(`${T}://${$}`,"vite-hmr"),pingInterval:O});try{await t.connect(e),console.info("[vite] Direct websocket connection fallback. Check out https://vite.dev/config/server-options.html#server-hmr to remove the previous connection error.")}catch(n){if(n instanceof Error&&n.message.includes("WebSocket closed without opened.")){const r=new URL(import.meta.url),i=r.host+r.pathname.replace(/@vite\/client$/,"");console.error(`[vite] failed to connect to websocket.
your current setup:
  (browser) ${i} <--[HTTP]--> ${te} (server)
  (browser) ${P} <--[WebSocket (failing)]--> ${$} (server)
Check out your Vite / network configuration and https://vite.dev/config/server-options.html#server-hmr .`)}}return}throw console.error(`[vite] failed to connect to websocket (${o}). `),o}},async disconnect(){await t.disconnect()},send(e){t.send(e)}}})());let F=!1;typeof window<"u"&&window.addEventListener("beforeunload",()=>{F=!0});function R(t){const e=new URL(t,"http://vite.dev");return e.searchParams.delete("direct"),e.pathname+e.search}let U=!0;const C=new WeakSet,oe=t=>{let e;return()=>{e&&(clearTimeout(e),e=null),e=setTimeout(()=>{location.reload()},t)}},k=oe(50),E=new Q({error:t=>console.error("[vite]",t),debug:(...t)=>console.debug("[vite]",...t)},W,async function({acceptedPath:e,timestamp:o,explicitImportRequired:n,isWithinCircularImport:r}){const[i,s]=e.split("?"),c=import(y+i.slice(1)+`?${n?"import&":""}t=${o}${s?`&${s}`:""}`);return r&&c.catch(()=>{console.info(`[hmr] ${e} failed to apply HMR as it's within a circular import. Reloading page to reset the execution order. To debug and break the circular import, you can run \`vite --debug hmr\` to log the circular dependency path if a file change triggered it.`),k()}),await c});W.connect(ne);async function ne(t){switch(t.type){case"connected":console.debug("[vite] connected.");break;case"update":if(f("vite:beforeUpdate",t),m)if(U&&ie()){location.reload();return}else I&&q(),U=!1;await Promise.all(t.updates.map(async e=>{if(e.type==="js-update")return E.queueUpdate(e);const{path:o,timestamp:n}=e,r=R(o),i=Array.from(document.querySelectorAll("link")).find(c=>!C.has(c)&&R(c.href).includes(r));if(!i)return;const s=`${y}${r.slice(1)}${r.includes("?")?"&":"?"}t=${n}`;return new Promise(c=>{const a=i.cloneNode();a.href=new URL(s,i.href).href;const l=()=>{i.remove(),console.debug(`[vite] css hot updated: ${r}`),c()};a.addEventListener("load",l),a.addEventListener("error",l),C.add(i),i.after(a)})})),f("vite:afterUpdate",t);break;case"custom":{if(f(t.event,t.data),t.event==="vite:ws:disconnect"&&m&&!F){console.log("[vite] server connection lost. Polling for restart...");const e=t.data.webSocket;await se(e.url),location.reload()}break}case"full-reload":if(f("vite:beforeFullReload",t),m)if(t.path&&t.path.endsWith(".html")){const e=decodeURI(location.pathname),o=y+t.path.slice(1);(e===o||t.path==="/index.html"||e.endsWith("/")&&e+"index.html"===o)&&k();return}else k();break;case"prune":f("vite:beforePrune",t),await E.prunePaths(t.paths);break;case"error":{if(f("vite:error",t),m){const e=t.err;I?re(e):console.error(`[vite] Internal Server Error
${e.message}
${e.stack}`)}break}case"ping":break;default:return t}}function f(t,e){E.notifyListeners(t,e)}const I=__HMR_ENABLE_OVERLAY__,m="document"in globalThis;function re(t){q();const{customElements:e}=globalThis;if(e){const o=e.get(h);document.body.appendChild(new o(t))}}function q(){document.querySelectorAll(h).forEach(t=>t.close())}function ie(){return document.querySelectorAll(h).length}async function se(t,e=1e3){async function o(){const n=new WebSocket(t,"vite-ping");return new Promise(r=>{function i(){r(!0),c()}function s(){r(!1),c()}function c(){n.removeEventListener("open",i),n.removeEventListener("error",s),n.close()}n.addEventListener("open",i),n.addEventListener("error",s)})}if(!await o())for(await N(e);;)if(document.visibilityState==="visible"){if(await o())break;await N(e)}else await ce()}function N(t){return new Promise(e=>setTimeout(e,t))}function ce(){return new Promise(t=>{const e=async()=>{document.visibilityState==="visible"&&(t(),document.removeEventListener("visibilitychange",e))};document.addEventListener("visibilitychange",e)})}const ae=new Map;"document"in globalThis&&document.querySelectorAll("style[data-vite-dev-id]").forEach(t=>{ae.set(t.getAttribute("data-vite-dev-id"),t)});var H;"document"in globalThis&&((H=document.querySelector("meta[property=csp-nonce]"))==null||H.nonce);
