(() => {
  const questions = [
    {id:'name',title:'What are you threat modelling?',help:'Give the system, application, product, plant or environment name.',type:'text',required:true,placeholder:'e.g. Customer API, SCADA network, AWS payment platform'},
    {id:'domain',title:'What type of environment is this?',help:'Choose the environment that best represents the system.',type:'choice',options:['IT / Enterprise','Cloud','OT / ICS','IoT / Embedded','Hybrid IT + OT'],required:true},
    {id:'purpose',title:'What does the system do?',help:'Describe its business or operational purpose in a few sentences.',type:'textarea',required:true,placeholder:'What process does it support? What would happen if it stopped working?'},
    {id:'assets',title:'What are the important assets?',help:'List applications, servers, databases, PLCs, HMIs, credentials, data, safety systems or other critical assets.',type:'textarea',required:true,placeholder:'e.g. API, PostgreSQL, AD, PLC, HMI, historian, customer PII'},
    {id:'users',title:'Who can access it?',help:'Include employees, administrators, vendors, customers, operators and remote users.',type:'textarea',required:true,placeholder:'e.g. customers, SOC, engineers, vendors via VPN'},
    {id:'entry',title:'How can an attacker or unauthorized user reach it?',help:'Describe internet exposure, VPN, remote access, APIs, physical access, wireless, vendor access or other entry points.',type:'textarea',required:true,placeholder:'e.g. public API + vendor VPN + engineering workstation'},
    {id:'flows',title:'How does data or control flow?',help:'Describe the main connections between components. Use arrows if useful.',type:'textarea',required:true,placeholder:'Internet → API Gateway → App → DB; Engineering WS → PLC'},
    {id:'boundaries',title:'Where are the trust boundaries?',help:'Identify network zones, VLANs, DMZs, cloud accounts, Purdue levels, security zones or privileged boundaries.',type:'textarea',required:false,placeholder:'e.g. Internet / DMZ / corporate / OT Level 3 / Level 2'},
    {id:'protocols',title:'Which protocols and technologies are used?',help:'Include HTTP, TLS, SSH, RDP, SMB, OPC UA, Modbus, DNP3, MQTT, APIs, Kubernetes, IAM and similar technologies.',type:'textarea',required:false,placeholder:'e.g. HTTPS, RDP, OPC UA, Modbus TCP, MQTT'},
    {id:'security',title:'What security controls already exist?',help:'Mention MFA, PAM, firewalls, EDR, segmentation, allowlisting, encryption, backups, monitoring and other controls.',type:'textarea',required:false,placeholder:'e.g. MFA, firewall, EDR, jump server, network segmentation'},
    {id:'impact',title:'What is the worst realistic impact?',help:'Consider confidentiality, integrity, availability, safety, financial loss, production outage, regulatory impact and reputation.',type:'textarea',required:true,placeholder:'e.g. production shutdown, unsafe process state, PII disclosure'},
    {id:'constraints',title:'Are there any special constraints?',help:'Include legacy systems, unsupported firmware, safety requirements, air-gapped networks, availability requirements or compliance obligations.',type:'textarea',required:false,placeholder:'e.g. 24/7 production, legacy PLCs, IEC 62443 requirements'}
  ];
  let answers={}, step=0, overlay;
  const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  function open(){if(overlay)return; answers={};step=0;render();}
  function close(){overlay?.remove();overlay=null;}
  function render(){
    if(!overlay){overlay=document.createElement('div');overlay.id='tf-questionnaire';document.body.appendChild(overlay);}
    const q=questions[step], progress=Math.round(((step)/questions.length)*100);
    const val=answers[q.id]||'';
    overlay.innerHTML=`<div class="tfq-backdrop"><section class="tfq-modal"><header><div><span class="tfq-kicker">AI THREAT MODEL BUILDER</span><h2>${step===0?'Let’s build your threat model':'Build your threat model'}</h2><p>Answer the questions. ThreatForge will turn your answers into an architecture, threats, attack paths, risk scores and mitigations.</p></div><button class="tfq-close" data-close>×</button></header><div class="tfq-progress"><i style="width:${progress}%"></i></div><div class="tfq-step"><span class="tfq-count">QUESTION ${step+1} OF ${questions.length}</span><h3>${esc(q.title)}</h3><p>${esc(q.help)}</p>${q.type==='choice'?`<div class="tfq-choices">${q.options.map(o=>`<button class="tfq-choice ${val===o?'selected':''}" data-choice="${esc(o)}">${esc(o)}</button>`).join('')}</div>`:q.type==='textarea'?`<textarea id="tfq-input" placeholder="${esc(q.placeholder)}">${esc(val)}</textarea>`:`<input id="tfq-input" placeholder="${esc(q.placeholder)}" value="${esc(val)}"/>`}</div><footer><span>${step>0?'Your answers are saved as you go.':'This guided interview is required before AI analysis.'}</span><div><button class="tfq-back" ${step===0?'disabled':''} data-back>Back</button><button class="tfq-next" data-next>${step===questions.length-1?'Generate threat model':'Continue'} <span>→</span></button></div></footer></section></div>`;
    overlay.querySelector('[data-close]').onclick=close;
    overlay.querySelector('[data-back]').onclick=()=>{save();if(step>0){step--;render();}};
    overlay.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{answers[q.id]=b.dataset.choice;render();});
    overlay.querySelector('[data-next]').onclick=async()=>{save();if(q.required&&!String(answers[q.id]||'').trim()){showError('Please answer this question before continuing.');return;}if(step<questions.length-1){step++;render();}else await generate();};
  }
  function save(){const el=overlay?.querySelector('#tfq-input');if(el)answers[questions[step].id]=el.value;}
  function showError(msg){const p=overlay.querySelector('.tfq-step');const e=document.createElement('div');e.className='tfq-error';e.textContent=msg;p.appendChild(e);}
  async function generate(){
    const btn=overlay.querySelector('.tfq-next');btn.disabled=true;btn.innerHTML='<span class="tfq-spinner"></span> Building threat model…';
    const architecture={name:answers.name,domain:answers.domain,purpose:answers.purpose,assets:answers.assets,users:answers.users,entryPoints:answers.entry,flows:answers.flows,trustBoundaries:answers.boundaries,protocols:answers.protocols,existingControls:answers.security,impact:answers.impact,constraints:answers.constraints};
    try{
      const r=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({domain:answers.domain,methodology:'MITRE ATT&CK + ATT&CK for ICS + EMB3D + STRIDE + IEC 62443 + NIST SP 800-82',architecture,threats:[]})});
      const data=await r.json();if(!r.ok)throw new Error(data.error||'AI analysis failed');showResult(data.analysis,architecture);
    }catch(e){btn.disabled=false;btn.textContent='Generate threat model →';showError(e.message||'Unable to analyze the model.');}
  }
  function showResult(a,architecture){
    const findings=(a.criticalFindings||[]).map(f=>`<article class="tfq-result-card"><div><b>${esc(f.title)}</b><span class="tfq-sev ${String(f.severity||'Medium').toLowerCase()}">${esc(f.severity)}</span></div><p>${esc(f.rationale)}</p><small>${esc(f.framework||'Threat framework')} ${f.techniqueId?`· ${esc(f.techniqueId)}`:''}</small><strong>Mitigation</strong><p>${esc(f.mitigation)}</p></article>`).join('');
    const paths=(a.attackPaths||[]).map(p=>`<div class="tfq-path"><span class="tfq-sev ${String(p.severity||'High').toLowerCase()}">${esc(p.severity)}</span><b>${esc(p.title)}</b><p>${(p.steps||[]).map(esc).join(' → ')}</p></div>`).join('');
    overlay.innerHTML=`<div class="tfq-backdrop"><section class="tfq-modal tfq-results"><header><div><span class="tfq-kicker">THREAT MODEL GENERATED</span><h2>${esc(architecture.name)}</h2><p>${esc(a.summary||'AI-generated threat model based on your interview answers.')}</p></div><button class="tfq-close" data-close>×</button></header><div class="tfq-score"><div><span>RISK SCORE</span><strong>${Number(a.riskScore||0)}/100</strong></div><div><span>DOMAIN</span><b>${esc(architecture.domain)}</b></div><div><span>METHODS</span><b>ATT&CK · EMB3D · STRIDE · IEC 62443</b></div></div><div class="tfq-result-section"><h3>Priority threats</h3>${findings||'<p>No findings were returned. Review the architecture and run the analysis again.</p>'}</div><div class="tfq-result-section"><h3>Attack paths</h3>${paths||'<p>No attack paths identified.</p>'}</div><div class="tfq-actions"><button data-close class="tfq-back">Close</button><button class="tfq-next" data-open-dashboard>Open threat workspace →</button></div></section></div>`;
    overlay.querySelectorAll('[data-close]').forEach(b=>b.onclick=close);
    overlay.querySelector('[data-open-dashboard]').onclick=()=>{close();window.dispatchEvent(new CustomEvent('threatforge:analysis-complete',{detail:{architecture,analysis:a}}));};
  }
  function install(){
    if(document.getElementById('tfq-launch'))return;
    const b=document.createElement('button');b.id='tfq-launch';b.innerHTML='✦ <span>Build with AI</span>';b.onclick=open;document.body.appendChild(b);
    window.addEventListener('threatforge:open-questionnaire',open);
  }
  const observer=new MutationObserver(install);observer.observe(document.body,{childList:true,subtree:true});setTimeout(install,800);
})();
