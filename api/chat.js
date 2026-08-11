const MODEL = 'deepseek-v4-pro';
const ENDPOINT = 'https://opencode.ai/zen/go/v1/chat/completions';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENCODE_GO_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'AI provider is not configured on the server.' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const question = String(body.question || '').trim();
    const context = body.context || {};
    if (!question) return res.status(400).json({ error: 'Question is required.' });
    if (question.length > 12000) return res.status(413).json({ error: 'Question is too long.' });

    const system = `You are ThreatForge AI, an expert defensive threat-modeling analyst for enterprise IT, cloud, OT/ICS and embedded systems. Answer the user's question directly and practically. Use MITRE ATT&CK Enterprise/ICS, MITRE EMB3D, STRIDE, IEC 62443, NIST SP 800-82, CAPEC and CWE when relevant. Never invent identifiers; only provide IDs when confident. Clearly distinguish facts, assumptions and recommendations. For architecture questions, reason about assets, trust boundaries, attack paths, impact, likelihood and mitigations. Do not provide instructions for unauthorized exploitation. Return concise Markdown suitable for a security SaaS chat panel.`;

    const user = `User question:\n${question}\n\nCurrent ThreatForge context:\n${JSON.stringify(context).slice(0, 30000)}`;
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, temperature: 0.2, messages: [{ role: 'system', content: system }, { role: 'user', content: user }] })
    });
    const raw = await response.text();
    if (!response.ok) return res.status(response.status).json({ error: 'AI provider request failed.' });
    const payload = JSON.parse(raw);
    const answer = payload?.choices?.[0]?.message?.content || '';
    if (!answer) return res.status(502).json({ error: 'AI returned an empty response.' });
    return res.status(200).json({ model: MODEL, answer });
  } catch (error) {
    console.error('ThreatForge AI chat error:', error?.message || error);
    return res.status(500).json({ error: 'Unable to complete the AI response.' });
  }
}
