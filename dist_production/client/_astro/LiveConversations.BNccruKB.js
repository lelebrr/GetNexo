import{j as e}from"../assets/jsx-runtime-B7cIiniC.js";import{r as n}from"../assets/index-DCEVbkbO.js";import{o as s}from"../assets/index-o5pKOp1Y.js";import"../assets/_commonjsHelpers-CqkleIqs.js";const i=({score:t,sentiment:m,category:r,confidence:u,showBadge:o=!0,showTooltip:l=!0,size:f="medium"})=>{const[x,p]=n.useState(!1),[g,c]=n.useState(!1);n.useEffect(()=>{const y=setTimeout(()=>p(!0),100);return()=>clearTimeout(y)},[]);const b=()=>t<=2?"😡":t<=4?"😠":t<=6?"😐":t<=8?"😊":"🤩",a=()=>t<=2?"#ef4444":t<=4?"#f97316":t<=6?"#eab308":t<=8?"#22c55e":"#10b981",h=()=>{switch(f){case"small":return"w-6 h-6 text-sm";case"large":return"w-12 h-12 text-2xl";default:return"w-8 h-8 text-lg"}},d=()=>t<=2?"Muito Negativo":t<=4?"Negativo":t<=6?"Neutro":t<=8?"Positivo":"Muito Positivo",v=()=>{switch(r){case"raiva":return"Raiva";case"frustracao":return"Frustração";case"neutro":return"Neutro";case"satisfacao":return"Satisfação";case"empolgação":return"Empolgação";default:return"Desconhecido"}},j=()=>t<=2||t>=9;return e.jsxs("div",{className:`relative inline-flex items-center ${x?"animate-fade-in":"opacity-0"}`,children:[e.jsx("div",{className:`${h()} flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 hover:scale-110`,style:{backgroundColor:o?`${a()}15`:"transparent",border:o?`2px solid ${a()}`:"none"},onMouseEnter:()=>c(!0),onMouseLeave:()=>c(!1),title:l?`${d()} (${t}/10)`:"",children:e.jsx("span",{className:"select-none",children:b()})}),j()&&e.jsx("div",{className:"absolute -top-1 -right-1",children:e.jsx("div",{className:`w-3 h-3 rounded-full animate-pulse ${t<=2?"bg-red-500":"bg-green-500"}`})}),l&&g&&e.jsxs("div",{className:"absolute z-50 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg border border-gray-700 min-w-max -top-16 left-1/2 transform -translate-x-1/2",children:[e.jsx("div",{className:"absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"}),e.jsxs("div",{className:"space-y-1",children:[e.jsxs("div",{className:"font-semibold text-center",children:[d()," (",t,"/10)"]}),e.jsxs("div",{className:"text-xs text-gray-300 text-center",children:["Categoria: ",v()]}),e.jsxs("div",{className:"text-xs text-gray-400 text-center",children:["Confiança: ",Math.round(u*100),"%"]}),e.jsx("div",{className:"w-full bg-gray-700 rounded-full h-2 mt-2",children:e.jsx("div",{className:"h-2 rounded-full transition-all duration-500",style:{width:`${t*10}%`,backgroundColor:a()}})})]})]}),o&&e.jsx("span",{className:"ml-1 px-1.5 py-0.5 text-xs font-semibold rounded-full",style:{backgroundColor:a(),color:"white"},children:t})]})};i.propTypes={score:s.number.isRequired,sentiment:s.string,category:s.string,confidence:s.number,showBadge:s.bool,showTooltip:s.bool,size:s.oneOf(["small","medium","large"])};i.defaultProps={score:5,sentiment:"neutral",category:"neutro",confidence:.8,showBadge:!0,showTooltip:!0,size:"medium"};const C=()=>{const[t,m]=n.useState([{id:1,user:"+55 11 99999-0001",lastMsg:"Gostaria de saber o preço do plano Pro",time:"14:20",score:8,category:"satisfacao",confidence:.92},{id:2,user:"+55 21 98888-1111",lastMsg:"O bot não está carregando o boleto!",time:"14:22",score:2,category:"raiva",confidence:.98},{id:3,user:"+55 31 97777-2222",lastMsg:"Muito obrigado pela ajuda!",time:"14:25",score:10,category:"empolgação",confidence:.88},{id:4,user:"+55 41 96666-3333",lastMsg:"Quanto tempo demora a entrega?",time:"14:28",score:5,category:"neutro",confidence:.75}]);return e.jsxs("div",{className:"conversations-wrapper",children:[e.jsxs("div",{className:"conv-header",children:[e.jsx("h3",{children:"Live Terminal"}),e.jsx("div",{className:"status-badge",children:"4 Online"})]}),e.jsx("div",{className:"conv-list",children:t.map(r=>e.jsxs("div",{className:"conv-item cyber-card",children:[e.jsxs("div",{className:"conv-user",children:[e.jsx("span",{className:"user-id",children:r.user}),e.jsx("span",{className:"time",children:r.time})]}),e.jsx("div",{className:"conv-msg",children:e.jsx("p",{children:r.lastMsg})}),e.jsxs("div",{className:"conv-footer",children:[e.jsxs("div",{className:"sentiment-box",children:[e.jsx("span",{className:"label",children:"Sentimento IA:"}),e.jsx(i,{score:r.score,category:r.category,confidence:r.confidence,size:"small"})]}),e.jsx("button",{className:"btn-terminal",children:"Entrar"})]})]},r.id))}),e.jsx("style",{jsx:!0,children:`
                .conversations-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .conv-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .conv-header h3 {
                    font-size: 0.9rem;
                    color: #ffc400;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }
                .status-badge {
                    font-size: 0.6rem;
                    background: rgba(0, 247, 255, 0.1);
                    color: #00f7ff;
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-weight: 800;
                }
                .conv-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .conv-item {
                    padding: 1.2rem !important;
                }
                .conv-user {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.8rem;
                }
                .user-id {
                    font-size: 0.8rem;
                    color: #fff;
                    font-family: 'JetBrains Mono', monospace;
                }
                .time {
                    font-size: 0.7rem;
                    color: #555;
                }
                .conv-msg p {
                    font-size: 0.85rem;
                    color: #aaa;
                    margin: 0;
                    margin-bottom: 1rem;
                    line-height: 1.4;
                }
                .conv-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1px solid #1a1a1a;
                    padding-top: 0.8rem;
                }
                .sentiment-box {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                }
                .sentiment-box .label {
                    font-size: 0.65rem;
                    color: #666;
                    text-transform: uppercase;
                    font-weight: 800;
                }
                .btn-terminal {
                    background: none;
                    border: 1px solid #333;
                    color: #888;
                    font-size: 0.7rem;
                    padding: 0.3rem 0.8rem;
                    border-radius: 4px;
                    cursor: pointer;
                    text-transform: uppercase;
                    font-weight: 700;
                    transition: 0.3s;
                }
                .btn-terminal:hover {
                    border-color: #00f7ff;
                    color: #00f7ff;
                    box-shadow: 0 0 10px rgba(0, 247, 255, 0.2);
                }
            `})]})};export{C as default};
