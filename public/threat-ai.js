(() => {
  const style = document.createElement('style');
  style.textContent = `
    #tf-ai-launch{position:fixed;right:22px;bottom:22px;z-index:9998;border:1px solid rgba(120,255,194,.25);background:linear-gradient(135deg,#10241d,#0b1713);color:#dfffee;border-radius:16px;padding:12px 16px;display:flex;gap:9px;align-items:center;font:600 13px Inter,system-ui;box-shadow:0 16px 45px rgba(0,0,0,.3);cursor:pointer}
    #tf-ai-launch .dot{width:8px;height:8px;border-radius:50%;background:#5ff2ad;box-shadow:0 0 14px #5ff2ad}
    #tf-ai-panel{position:fixed;right:22px;bottom:78px;width:min(430px,calc(100vw - 28px));max-height:70vh;z-index:9999;background:#0b1511;color:#e8fff3;border:1px solid rgba(120,255,194,.16);border-radius:20px;box-shadow:0 24px 80px rgba(0,0,0,.5);display:none;overflow:hidden;font:13px Inter,system-ui}
    #tf-ai-panel.open{display:block}.tf-ai-head{padding:18px 18px 14px;border-bottom:1px solid rgba(255,255,255,.08);display:flex;justify-content:space-between}.tf-ai-head b{font-size:15px}.tf-ai-head span{display:block;color:#81978d;font-size:11px;margin-top:4px}.tf-ai-close{background:none;border:0;color:#9bb0a6;font-size:20px;cursor:pointer}.tf-ai-body{padding:16px;overflow:auto;max-height:58vh}.tf-ai-action{width:100%;border:0;border-radius:12px;padding:12px;background:#64efad;color:#06130d;font-weight:800;cursor:pointer}.tf-ai-action:disabled{opacity:.55}.tf-ai-meta{display:flex;gap:6px;flex-wrap:wrap;margin:12px 0}.tf-ai-chip{padding:5px 8px;border-radius:999px;background:#12251d;color:#9cefc6;font-size:10px}.tf-ai-summary{padding:12px;border:1px solid rgba(255,255,255,.07);border-radius:12px;background:#0f1c17;margin-bottom:10px;line-height:1.5}.tf-ai-finding{padding:12px;border:1px solid rgba(255,255,255,.07);border-radius:12px;margin:8px 0;background:#0e1915}.tf-ai-finding strong{display:block;margin-bottom:5px}.tf-ai-finding small{color:#91a79d;line-height:1.45}.tf-ai-sev{float:right;font-size:9px;padding:4px 6px;border-radius:999px;background:#2b1717;color:#ffaaa8}.tf-ai-error{color:#ffaaa8;padding:10px 0}.tf-ai-loading{color:#9cefc6;padding:12px 0}
  `;
  document.head.appendChild(style);

  const launch = document.createElement('button');
  launch.id = 'tf-ai-launch';
  launch.innerHTML = '<span class="dot"></span> AI Threat Analyst';
  document.body.appendChild(launch);

  const panel = document.createElement('div');
  panel.id = 'tf-ai-panel';
  panel.innerHTML = `<div class="tf-ai-head"><div><b>DeepSeek V4 Pro</b><span>Server-side OpenCode Go · ThreatForge analysis engine</span></div><button class="tf-ai-close">×</button></div><div class="tf-ai-body"><div class="tf-ai-meta"><span class="tf-ai-chip">MITRE ATT&CK</span><span class="tf-ai-chip">ATT&CK ICS</span><span class="tf-ai-chip">EMB3D</span><span class="tf-ai-chip">IEC 62443</span></div><button class="tf-ai-action">Analyze current model</button><div class="tf-ai-output"></div></div>`;
  document.body.appendChild(panel);

  launch.onclick = () => panel.classList.toggle('open');
  panel.querySelector('.tf-ai-close').onclick = () => panel.classList.remove('open');
  const action = panel.querySelector('.tf-ai-action');
  const output = panel.querySelector('.tf-ai-output');

  action.onclick = async () => {
    action.disabled = true;
    output.innerHTML = '<div class="tf-ai-loading">Analyzing architecture, trust boundaries and attack paths…</div>';
    const architecture = {
      assets: [
        {id:'internet',name:'Internet',type:'external'},
        {id:'gateway',name:'API Gateway',type:'network'},
        {id:'app',name:'Commerce API',type:'compute'},
        {id:'db',name:'Customer DB',type:'data'},
        {id:'queue',name:'Message Queue',type:'data'},
        {id:'siem',name:'SIEM / SOC',type:'security'},
        {id:'eng',name:'Engineering Workstation',type:'ot'},
        {id:'plc',name:'PLC / Controller',type:'ot'}
      ],
      flows: [
        ['internet','gateway'],['gateway','app'],['app','db'],['gateway','queue'],['queue','siem'],['eng','plc'],['plc','siem']
      ],
      trustBoundaries: ['Public / IT','Application','Data / OT']
    };
    try {
      const response = await fetch('/api/analyze', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({domain:'IT + OT + Cloud',methodology:'MITRE ATT&CK + ATT&CK ICS + EMB3D + IEC 62443',architecture})});
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Analysis failed');
      const a = result.analysis || {};
      const findings = (a.criticalFindings || []).slice(0,6).map(f => `<div class="tf-ai-finding"><span class="tf-ai-sev">${f.severity || 'Risk'}</span><strong>${escapeHtml(f.title || 'Finding')}</strong><small>${escapeHtml(f.rationale || '')}<br><br><b>Mitigation:</b> ${escapeHtml(f.mitigation || 'Review applicable controls.')}</small></div>`).join('');
      output.innerHTML = `<div class="tf-ai-summary"><b>Risk score: ${Number(a.riskScore || 0)}/100</b><br>${escapeHtml(a.summary || 'Analysis completed.')}</div>${findings || '<div class="tf-ai-summary">No prioritized findings were returned.</div>'}`;
    } catch (e) {
      output.innerHTML = `<div class="tf-ai-error">${escapeHtml(e.message || 'AI analysis unavailable.')}</div>`;
    } finally { action.disabled = false; }
  };

  function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
})();
