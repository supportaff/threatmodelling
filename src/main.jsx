import React,{useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Shield,Cloud,Factory,Boxes,LayoutDashboard,GitBranch,TriangleAlert,FileText,Settings,Search,Plus,Play,ChevronRight,CheckCircle2,CircleDot,Lock,Database,Server,Globe,Router,Radio,Workflow,Zap,Download,MoreHorizontal,ArrowRight,SlidersHorizontal} from 'lucide-react';
import './styles.css';

const models=[
 {id:'stride',name:'STRIDE',tag:'Application',desc:'Spoofing, Tampering, Repudiation, Information Disclosure, DoS and Elevation of Privilege.',color:'green'},
 {id:'attack',name:'MITRE ATT&CK',tag:'Adversary',desc:'Model attacker behavior with tactics, techniques and attack paths.',color:'purple'},
 {id:'pasta',name:'PASTA',tag:'Risk-centric',desc:'Seven-stage risk-centric threat modeling for business and technical teams.',color:'blue'},
 {id:'linddun',name:'LINDDUN',tag:'Privacy',desc:'Privacy threat analysis across linkability, identifiability and disclosure.',color:'amber'},
 {id:'iec',name:'IEC 62443',tag:'OT / ICS',desc:'Zones, conduits and security-level driven industrial threat analysis.',color:'red'},
 {id:'nist',name:'NIST 800-82',tag:'OT / ICS',desc:'Industrial control system security architecture and threat analysis.',color:'cyan'}
];
const initialNodes=[
 {id:'internet',label:'Internet',type:'external',x:7,y:46,icon:Globe},
 {id:'gateway',label:'API Gateway',type:'process',x:28,y:46,icon:Router},
 {id:'api',label:'Application',type:'process',x:51,y:29,icon:Server},
 {id:'db',label:'Customer DB',type:'data',x:75,y:29,icon:Database},
 {id:'queue',label:'Message Queue',type:'process',x:51,y:64,icon:Workflow},
 {id:'siem',label:'SIEM / SOC',type:'security',x:75,y:64,icon:Shield}
];
const threats=[
 {id:1,type:'Tampering',asset:'API Gateway → Application',severity:'Critical',score:9.2,model:'STRIDE',status:'Open'},
 {id:2,type:'Valid Accounts',asset:'Internet → API Gateway',severity:'High',score:8.4,model:'ATT&CK',status:'Open'},
 {id:3,type:'Information Disclosure',asset:'Application → Customer DB',severity:'High',score:7.8,model:'STRIDE',status:'Mitigating'},
 {id:4,type:'Lateral Movement',asset:'Message Queue → SIEM',severity:'Medium',score:5.6,model:'ATT&CK',status:'Open'},
 {id:5,type:'Denial of Service',asset:'API Gateway',severity:'Medium',score:5.1,model:'STRIDE',status:'Accepted'}
];
function App(){
 const [view,setView]=useState('workspace'); const [domain,setDomain]=useState('IT'); const [selected,setSelected]=useState('api'); const [model,setModel]=useState('stride'); const [showModels,setShowModels]=useState(false); const [running,setRunning]=useState(false); const [search,setSearch]=useState('');
 const activeModel=models.find(m=>m.id===model);
 const visibleThreats=threats.filter(t=>t.type.toLowerCase().includes(search.toLowerCase())||t.asset.toLowerCase().includes(search.toLowerCase()));
 const risk=useMemo(()=> domain==='OT'?82:74,[domain]);
 const nav=[['workspace','Workspace',LayoutDashboard],['models','Threat Models',GitBranch],['findings','Findings',TriangleAlert],['reports','Reports',FileText]];
 return <div className="app">
  <aside className="sidebar"><div className="brand"><div className="brandmark"><Shield size={20}/></div><div><b>ThreatForge</b><span>Security design platform</span></div></div>
   <div className="workspace-switch"><div className="avatar">A</div><div><strong>Afforal Security</strong><span>Workspace</span></div><ChevronRight size={15}/></div>
   <div className="navlabel">WORKSPACE</div>{nav.map(([id,label,I])=><button className={'navitem '+(view===id?'active':'')} onClick={()=>setView(id)} key={id}><I size={17}/><span>{label}</span>{id==='findings'&&<em>5</em>}</button>)}
   <div className="navlabel">TOOLS</div><button className="navitem" onClick={()=>setShowModels(true)}><Boxes size={17}/><span>Methodologies</span></button><button className="navitem"><Settings size={17}/><span>Settings</span></button>
   <div className="sidebar-bottom"><div className="upgrade"><Zap size={17}/><div><b>Pro workspace</b><span>Unlimited models & reports</span></div></div><div className="user"><div className="avatar">P</div><div><b>Prakash</b><span>Security Architect</span></div><MoreHorizontal size={17}/></div></div>
  </aside>
  <main className="main"><header className="topbar"><div><span className="eyebrow">THREAT MODEL</span><h1>Cloud Commerce Platform</h1></div><div className="top-actions"><div className="search"><Search size={16}/><input placeholder="Search threats, assets..." value={search} onChange={e=>setSearch(e.target.value)}/><kbd>⌘ K</kbd></div><button className="iconbtn"><SlidersHorizontal size={17}/></button><button className="export"><Download size={16}/> Export</button></div></header>
   <div className="content">
    {view==='workspace'&&<>
    <section className="hero-row"><div><div className="domain-tabs"><button className={domain==='IT'?'sel':''} onClick={()=>setDomain('IT')}><Cloud size={15}/> IT & Cloud</button><button className={domain==='OT'?'sel':''} onClick={()=>setDomain('OT')}><Factory size={15}/> OT / ICS</button></div><p className="sub">Design, analyze and continuously improve your security architecture.</p></div><button className="primary" onClick={()=>setShowModels(true)}><Plus size={17}/> New threat model</button></section>
    <section className="stats"><div className="stat"><span>Risk score</span><strong>{risk}<small>/100</small></strong><div className="meter"><i style={{width:risk+'%'}}/></div><small className="muted">↑ 8% from last review</small></div><div className="stat"><span>Threats identified</span><strong>18</strong><div className="mini"><i/> <i/> <i/> <i/> <i/></div><small className="muted">5 critical · 7 high · 6 medium</small></div><div className="stat"><span>Controls mapped</span><strong>31</strong><div className="controlbar"><b>24</b><span>7 gaps</span></div><small className="muted">78% coverage</small></div><div className="stat"><span>Model health</span><strong className="healthy"><CheckCircle2 size={22}/> Healthy</strong><small className="muted">Last analyzed 4 min ago</small></div></section>
    <div className="grid"><section className="panel diagram"><div className="panelhead"><div><b>Architecture diagram</b><span>Interactive data-flow model</span></div><div className="headtools"><button className="smallbtn" onClick={()=>setShowModels(true)}>{activeModel.name}<ChevronRight size={14}/></button><button className="smallbtn"><Plus size={14}/> Component</button></div></div>
      <div className="canvas"><div className="trust-zone zone-a"><span>TRUST ZONE · PUBLIC</span></div><div className="trust-zone zone-b"><span>TRUST ZONE · APPLICATION</span></div><div className="trust-zone zone-c"><span>TRUST ZONE · DATA</span></div>
       <svg className="edges" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><marker id="arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 z" fill="currentColor"/></marker></defs>{[[7,46,28,46],[28,46,51,29],[51,29,75,29],[28,46,51,64],[51,64,75,64],[75,29,75,64]].map((e,i)=><line key={i} x1={e[0]} y1={e[1]} x2={e[2]} y2={e[3]} markerEnd="url(#arrow)"/>)}</svg>
       {initialNodes.map(n=>{const I=n.icon;return <button key={n.id} className={'node '+n.type+' '+(selected===n.id?'selected':'')} style={{left:n.x+'%',top:n.y+'%'}} onClick={()=>setSelected(n.id)}><div className="node-icon"><I size={18}/></div><div><b>{n.label}</b><span>{n.type==='data'?'Data Store':n.type==='external'?'External Entity':n.type==='security'?'Security':'Process'}</span></div>{selected===n.id&&<div className="port p1"/>}</button>})}
       <div className="canvas-tip"><CircleDot size={13}/> Click a component to inspect threats</div>
      </div></section>
      <aside className="panel inspector"><div className="panelhead"><div><b>Component inspector</b><span>Security properties</span></div><button className="ghost"><MoreHorizontal size={17}/></button></div><div className="inspector-body"><div className="selected-card"><div className="node-icon"><Server size={18}/></div><div><b>{initialNodes.find(n=>n.id===selected)?.label}</b><span>Application component</span></div><CheckCircle2 size={17}/></div><div className="field"><label>Trust level</label><div className="select">Internal <ChevronRight size={14}/></div></div><div className="field"><label>Data classification</label><div className="select">Confidential <ChevronRight size={14}/></div></div><div className="field"><label>Authentication</label><div className="select">OAuth 2.0 + MFA <ChevronRight size={14}/></div></div><div className="riskbox"><div><span>Component risk</span><strong>High</strong></div><p>3 threats are associated with this component.</p><div className="riskline"><i style={{width:'72%'}}/></div></div><button className="fullbtn" onClick={()=>setView('findings')}>View component threats <ArrowRight size={15}/></button></div></aside>
    </div>
    <section className="panel threats"><div className="panelhead"><div><b>Threat analysis</b><span>Generated from {activeModel.name} + asset context</span></div><div className="headtools"><span className="pill">{visibleThreats.length} shown</span><button className={'analyze '+(running?'running':'')} onClick={()=>{setRunning(true);setTimeout(()=>setRunning(false),1300)}}>{running?<><span className="spinner"/> Analyzing...</>:<><Play size={14}/> Analyze model</>}</button></div></div><div className="table"><div className="tr th"><span>Threat</span><span>Attack surface</span><span>Method</span><span>Risk</span><span>Status</span><span/></div>{visibleThreats.map(t=><div className="tr" key={t.id}><span><i className={'sev '+t.severity.toLowerCase()}/><b>{t.type}</b></span><span>{t.asset}</span><span><span className="method">{t.model}</span></span><span><strong className={'score '+t.severity.toLowerCase()}>{t.score}</strong></span><span><span className={'status '+t.status.toLowerCase().replace(' ','-')}>{t.status}</span></span><button className="rowmore"><MoreHorizontal size={16}/></button></div>)}</div></section>
    </>}
    {view==='findings'&&<section className="fullpage panel"><div className="panelhead"><div><b>Findings</b><span>Prioritized security risks across your model</span></div><button className="primary" onClick={()=>setView('workspace')}>Back to workspace</button></div><div className="finding-grid">{threats.concat([{id:6,type:'Weak Segmentation',asset:'Public → Application',severity:'High',score:8.1,model:'IEC 62443',status:'Open'}]).map(t=><div className="finding-card"><div className="finding-top"><span className={'severity-badge '+t.severity.toLowerCase()}>{t.severity}</span><span>{t.model}</span></div><h3>{t.type}</h3><p>{t.asset}</p><div className="finding-bottom"><strong>{t.score}/10</strong><span>{t.status}</span><ArrowRight size={15}/></div></div>)}</div></section>}
    {view==='models'&&<section className="fullpage panel"><div className="panelhead"><div><b>Threat methodologies</b><span>Choose the lens that fits your system</span></div></div><div className="model-grid">{models.map(m=><button className={'model-card '+(model===m.id?'chosen':'')} onClick={()=>{setModel(m.id);setView('workspace')}}><div className={'model-icon '+m.color}><GitBranch size={20}/></div><span className="tag">{m.tag}</span><h3>{m.name}</h3><p>{m.desc}</p><div>Use methodology <ArrowRight size={14}/></div></button>)}</div></section>}
    {view==='reports'&&<section className="fullpage panel report-page"><div className="report-hero"><div><span className="eyebrow">SECURITY REPORT</span><h2>Cloud Commerce Platform</h2><p>Executive-ready threat model generated from your architecture and selected methodology.</p></div><button className="primary"><Download size={16}/> Generate PDF</button></div><div className="report-sections"><div><b>Executive summary</b><span>Risk is elevated by exposed API paths and insufficient segmentation.</span></div><div><b>Top remediation</b><span>Enforce strong authentication, API rate limiting and database isolation.</span></div><div><b>Coverage</b><span>31 controls mapped · 78% implemented · 7 gaps remaining.</span></div></div></section>}
   </div>
  </main>
  {showModels&&<div className="modal-backdrop" onClick={()=>setShowModels(false)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modalhead"><div><b>Choose methodology</b><span>ThreatForge combines established threat modeling approaches.</span></div><button className="ghost" onClick={()=>setShowModels(false)}>×</button></div><div className="modal-grid">{models.map(m=><button className={'modal-model '+(model===m.id?'chosen':'')} onClick={()=>{setModel(m.id);setShowModels(false)}}><div className={'model-icon '+m.color}><GitBranch size={18}/></div><div><b>{m.name}</b><span>{m.tag}</span></div>{model===m.id&&<CheckCircle2 size={17}/>}</button>)}</div></div></div>}
 </div>
}
createRoot(document.getElementById('root')).render(<App/>);
