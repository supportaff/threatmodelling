(() => {
  if (window.__threatForgeAIChat) return;
  window.__threatForgeAIChat = true;

  const style = document.createElement('style');
  style.textContent = `
    .tf-ai-launch{position:fixed;right:24px;bottom:24px;z-index:9998;border:0;border-radius:16px;padding:13px 17px;background:#0b8f68;color:#fff;font:700 14px Inter,system-ui;box-shadow:0 14px 40px #06261c55;cursor:pointer;display:flex;gap:9px;align-items:center}.tf-ai-launch:hover{transform:translateY(-2px)}
    .tf-ai-window{position:fixed;right:24px;bottom:82px;width:min(430px,calc(100vw - 28px));height:min(650px,calc(100vh - 110px));z-index:9999;background:#fff;border:1px solid #dfe9e5;border-radius:22px;box-shadow:0 24px 80px #06261c2b;display:none;overflow:hidden;font:14px Inter,system-ui;color:#12221c}.tf-ai-window.open{display:flex;flex-direction:column}
    .tf-ai-head{padding:16px 18px;border-bottom:1px solid #e7efec;display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#f7fffc,#eef9f5)}.tf-ai-title{display:flex;gap:10px;align-items:center}.tf-ai-orb{width:34px;height:34px;border-radius:11px;background:#0b8f68;color:#fff;display:grid;place-items:center;font-weight:800}.tf-ai-head b{display:block}.tf-ai-head span{display:block;color:#6b7d75;font-size:11px;margin-top:2px}.tf-ai-close{border:0;background:transparent;color:#65766f;font-size:22px;cursor:pointer}.tf-ai-messages{flex:1;overflow:auto;padding:18px;background:#fbfdfc}.tf-ai-msg{max-width:88%;padding:11px 13px;border-radius:14px;margin:0 0 12px;line-height:1.55;white-space:pre-wrap}.tf-ai-msg.user{margin-left:auto;background:#0b8f68;color:#fff;border-bottom-right-radius:5px}.tf-ai-msg.ai{background:#fff;border:1px solid #e4ece8;border-bottom-left-radius:5px}.tf-ai-suggestions{padding:0 14px 10px;display:flex;gap:7px;overflow:auto}.tf-ai-suggestions button{white-space:nowrap;border:1px solid #dce8e3;background:#fff;border-radius:999px;padding:7px 10px;color:#36564a;cursor:pointer;font-size:11px}.tf-ai-form{border-top:1px solid #e7efec;padding:12px;display:flex;gap:8px;background:#fff}.tf-ai-input{flex:1;resize:none;border:1px solid #d7e4df;border-radius:13px;padding:11px 12px;min-height:42px;max-height:120px;outline:none;font:14px inherit}.tf-ai-input:focus{border-color:#0b8f68;box-shadow:0 0 0 3px #0b8f6814}.tf-ai-send{width:44px;border:0;border-radius:13px;background:#0b8f68;color:#fff;cursor:pointer;font-weight:800}.tf-ai-send:disabled{opacity:.5}.tf-ai-status{padding:0 14px 8px;color:#71827b;font-size:11px;display:none}.tf-ai-status.show{display:block}
  `;
  document.head.appendChild(style);

  const launch = document.createElement('button');
  launch.className = 'tf-ai-launch';
  launch.innerHTML = '✦ Ask ThreatForge AI';
  document.body.appendChild(launch);

  const win = document.createElement('section');
  win.className = 'tf-ai-window';
  win.innerHTML = `<header class="tf-ai-head"><div class="tf-ai-title"><div class="tf-ai-orb">AI</div><div><b>ThreatForge AI</b><span>DeepSeek V4 Pro · private server connection</span></div></div><button class="tf-ai-close" aria-label="Close">×</button></header><div class="tf-ai-messages"><div class="tf-ai-msg ai">Ask me anything about your threat model, architecture, attack paths, MITRE mappings, OT security, cloud risks or mitigations.</div></div><div class="tf-ai-suggestions"><button>Analyze this architecture</button><button>Find critical attack paths</button><button>Map to MITRE ATT&CK</button></div><div class="tf-ai-status">Thinking…</div><form class="tf-ai-form"><textarea class="tf-ai-input" placeholder="Ask a security question…" rows="1"></textarea><button class="tf-ai-send" type="submit">↑</button></form></section>`;
  document.body.appendChild(win);

  const messages = win.querySelector('.tf-ai-messages');
  const input = win.querySelector('.tf-ai-input');
  const send = win.querySelector('.tf-ai-send');
  const status = win.querySelector('.tf-ai-status');
  const context = () => ({ url: location.href, pageTitle: document.title, selectedText: String(window.getSelection?.() || '').slice(0, 2000) });
  const add = (text, role) => { const el = document.createElement('div'); el.className = `tf-ai-msg ${role}`; el.textContent = text; messages.appendChild(el); messages.scrollTop = messages.scrollHeight; return el; };
  const ask = async (question) => {
    question = String(question || '').trim(); if (!question || send.disabled) return;
    add(question, 'user'); input.value = ''; send.disabled = true; status.classList.add('show');
    try {
      const r = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ question, context:context() }) });
      const data = await r.json(); if (!r.ok) throw new Error(data.error || 'Request failed');
      add(data.answer, 'ai');
    } catch (e) { add(`AI request failed: ${e.message}`, 'ai'); }
    finally { send.disabled = false; status.classList.remove('show'); input.focus(); }
  };
  launch.onclick = () => { win.classList.toggle('open'); if (win.classList.contains('open')) input.focus(); };
  win.querySelector('.tf-ai-close').onclick = () => win.classList.remove('open');
  win.querySelectorAll('.tf-ai-suggestions button').forEach(b => b.onclick = () => ask(b.textContent));
  win.querySelector('.tf-ai-form').onsubmit = e => { e.preventDefault(); ask(input.value); };
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input.value); } });
})();
