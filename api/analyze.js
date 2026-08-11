const MODEL = 'deepseek-v4-pro';
const ENDPOINT = 'https://opencode.ai/zen/go/v1/chat/completions';

function jsonFromText(text) {
  try { return JSON.parse(text); } catch {}
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    try { return JSON.parse(fenced[1]); } catch {}
  }
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start >= 0 && end > start) {
    try { return JSON.parse(text.slice(start, end + 1)); } catch {}
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENCODE_GO_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'AI provider is not configured on the server.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { domain = 'IT', methodology = 'MITRE ATT&CK', architecture = {}, threats = [] } = body;

    const system = `You are ThreatForge, an expert threat-modeling engine for enterprise IT, cloud, OT/ICS and embedded systems. Analyze architecture defensively. Use established terminology from MITRE ATT&CK/ATT&CK for ICS, EMB3D, STRIDE and IEC 62443 when relevant. Do not invent technique IDs. If an exact ID is uncertain, leave it null. Return ONLY valid JSON.`;
    const user = {
      task: 'Analyze this threat model and identify prioritized threats, attack paths, trust-boundary crossings, mitigations and control gaps.',
      domain,
      methodology,
      architecture,
      existingThreats: threats,
      outputSchema: {
        summary: 'string',
        riskScore: 'number 0-100',
        criticalFindings: [{ title: 'string', severity: 'Critical|High|Medium|Low', rationale: 'string', componentIds: ['string'], techniqueId: 'string|null', framework: 'string', mitigation: 'string' }],
        attackPaths: [{ title: 'string', steps: ['string'], severity: 'Critical|High|Medium|Low', techniques: ['string'], mitigations: ['string'] }],
        trustBoundaryRisks: [{ boundary: 'string', risk: 'string', recommendation: 'string' }],
        controlGaps: [{ control: 'string', framework: 'string', gap: 'string', priority: 'Critical|High|Medium|Low' }]
      }
    };

    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.1,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: JSON.stringify(user) }
        ]
      })
    });

    const raw = await response.text();
    if (!response.ok) {
      return res.status(response.status).json({ error: 'AI provider request failed.' });
    }

    const payload = JSON.parse(raw);
    const content = payload?.choices?.[0]?.message?.content || '';
    const analysis = jsonFromText(content);
    if (!analysis) return res.status(502).json({ error: 'AI returned an invalid analysis format.' });

    return res.status(200).json({ model: MODEL, analysis });
  } catch (error) {
    console.error('ThreatForge AI analysis error:', error?.message || error);
    return res.status(500).json({ error: 'Unable to complete threat analysis.' });
  }
}
