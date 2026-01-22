const c=window.location.hostname==="localhost"?"http://localhost:8080":"https://api.getnexo.com.br";let p={},s={};document.addEventListener("DOMContentLoaded",function(){d(),b(),h(),l(),setInterval(d,3e4),setInterval(l,3e4)});async function d(){try{const t=await(await fetch(`${c}/api/ai/analytics`)).json();p=t,m(t),y(t)}catch{}}function m(e){const t=e.savings||{};document.getElementById("savings-today").textContent=`R$ ${t.savings?.toFixed(2)||"0,00"}`;let n="-",o=1/0;Object.entries(e.providers||{}).forEach(([u,i])=>{i.avgLatency>0&&i.avgLatency<o&&(o=i.avgLatency,n=`${u}: ${Math.round(i.avgLatency)}ms`)}),document.getElementById("fastest-provider").textContent=n;const a=e.total?.requests||0,r=e.total?.errors||0,g=a>0?Math.round((a-r)/a*100):0;document.getElementById("success-rate").textContent=`${g}%`,document.getElementById("fallbacks-today").textContent=e.routing?.maxRetries||0}function y(e){const t=document.getElementById("usage-chart").getContext("2d"),n={labels:Object.keys(e.providers||{}),datasets:[{label:"Requests Hoje",data:Object.values(e.providers||{}).map(r=>r.requests||0),backgroundColor:["#00ff9d","#3b82f6","#a855f7","#ef4444","#f59e0b","#10b981"],borderWidth:1}]};s.usage&&s.usage.destroy(),s.usage=new Chart(t,{type:"bar",data:n,options:{responsive:!0,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,grid:{color:"#334155"},ticks:{color:"#e5e7eb"}},x:{grid:{color:"#334155"},ticks:{color:"#e5e7eb"}}}}});const o=document.getElementById("latency-chart").getContext("2d"),a={labels:Object.keys(e.providers||{}),datasets:[{label:"Latência Média (ms)",data:Object.values(e.providers||{}).map(r=>Math.round(r.avgLatency||0)),backgroundColor:["#00ff9d","#3b82f6","#a855f7","#ef4444","#f59e0b","#10b981"],borderWidth:1}]};s.latency&&s.latency.destroy(),s.latency=new Chart(o,{type:"bar",data:a,options:{responsive:!0,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,grid:{color:"#334155"},ticks:{color:"#e5e7eb"}},x:{grid:{color:"#334155"},ticks:{color:"#e5e7eb"}}}}})}async function b(){try{const t=await(await fetch(`${c}/api/config/ai`)).json(),n=document.getElementById("providers-list");n.innerHTML="",t.config?.providers&&Object.entries(t.config.providers).forEach(([o,a])=>{const r=f(o,a);n.appendChild(r)})}catch{}}function f(e,t){const n=document.createElement("div");n.className="provider-card",n.style.cssText=`
      background: rgba(15, 23, 42, 0.8);
      padding: 1.5rem;
      border-radius: 12px;
      border: 1px solid #334155;
      display: grid;
      grid-template-columns: 1fr auto auto;
      align-items: center;
      gap: 1rem;
    `;const o=Object.values(t.models||{})[0]||{},a=((o.costPer1kInput||0)+(o.costPer1kOutput||0))/2;return n.innerHTML=`
      <div>
        <h4 style="color:#00ff9d; margin:0; text-transform:capitalize;">${e}</h4>
        <p style="color:#94a3b8; margin:0.25rem 0; font-size:0.8rem;">
          Prioridade: ${t.priority} | Custo: $${a.toFixed(6)}/1k tokens
        </p>
      </div>

      <label class="toggle" style="margin:0;">
        <input type="checkbox" ${t.enabled?"checked":""} onchange="toggleProvider('${e}', this.checked)">
        <span class="toggle-slider"></span>
      </label>

      <input type="number" value="${t.priority}" min="1" max="6" style="width:60px; padding:0.3rem; background:#1e293b; color:white; border:1px solid #334155; border-radius:4px; text-align:center;" onchange="updateProviderPriority('${e}', this.value)">
    `,n}async function h(){try{const t=await(await fetch(`${c}/api/config/ai`)).json();if(t.config?.routing){const n=t.config.routing;document.getElementById("economic-mode").checked=n.economicMode,document.getElementById("fallback-enabled").checked=n.fallbackEnabled,document.getElementById("max-retries").value=n.maxRetries,document.getElementById("timeout-ms").value=n.timeoutMs}}catch{}}async function l(){try{const t=await(await fetch(`${c}/api/training/status`)).json();document.getElementById("training-mode").checked=t.enabled||!1;const o=await(await fetch(`${c}/api/training/reports?period=7d`)).json();document.getElementById("training-tickets").textContent=o.summary?.trainingTickets||0,document.getElementById("avg-rating").textContent=(o.summary?.averageRating||0).toFixed(1),document.getElementById("scenarios-count").textContent=Object.keys(o.scenarios||{}).length}catch{}}
