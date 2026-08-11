import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, 'public', 'data');
await fs.mkdir(out, { recursive: true });

const sources = {
  'attack-enterprise': 'https://raw.githubusercontent.com/mitre-attack/attack-stix-data/master/enterprise-attack/enterprise-attack.json',
  'attack-ics': 'https://raw.githubusercontent.com/mitre-attack/attack-stix-data/master/ics-attack/ics-attack.json',
};

function normalize(bundle, source) {
  const objects = Array.isArray(bundle.objects) ? bundle.objects : [];
  return objects
    .filter(o => !o.revoked && !o.x_mitre_deprecated)
    .filter(o => ['attack-pattern', 'course-of-action', 'intrusion-set', 'malware', 'tool', 'relationship', 'campaign'].includes(o.type))
    .map(o => ({
      id: o.id,
      type: o.type,
      source,
      name: o.name,
      description: o.description,
      external_references: o.external_references,
      kill_chain_phases: o.kill_chain_phases,
      platforms: o.x_mitre_platforms,
      tactic: o.kill_chain_phases?.map(p => p.phase_name),
      source_ref: o.source_ref,
      target_ref: o.target_ref,
      relationship_type: o.relationship_type,
      created: o.created,
      modified: o.modified,
    }));
}

for (const [name, url] of Object.entries(sources)) {
  console.log(`Downloading ${name}...`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${name}: ${response.status} ${response.statusText}`);
  const bundle = await response.json();
  const normalized = normalize(bundle, name);
  await fs.writeFile(path.join(out, `${name}.json`), JSON.stringify({ source: name, generatedAt: new Date().toISOString(), objects: normalized }));
  console.log(`${name}: ${normalized.length} objects`);
}

// EMB3D publishes a STIX 2.1 representation. Keep its upstream URL configurable
// because MITRE may change the repository path without changing the model.
const emb3dUrl = process.env.EMB3D_STIX_URL;
if (emb3dUrl) {
  console.log('Downloading EMB3D from configured MITRE STIX URL...');
  const response = await fetch(emb3dUrl);
  if (!response.ok) throw new Error(`emb3d: ${response.status} ${response.statusText}`);
  const bundle = await response.json();
  const normalized = normalize(bundle, 'emb3d');
  await fs.writeFile(path.join(out, 'emb3d.json'), JSON.stringify({ source: 'emb3d', generatedAt: new Date().toISOString(), objects: normalized }));
  console.log(`emb3d: ${normalized.length} objects`);
} else {
  console.log('EMB3D_STIX_URL not set; ATT&CK datasets synced. Set EMB3D_STIX_URL to the current MITRE EMB3D STIX 2.1 bundle before production sync.');
}

const manifest = {
  schemaVersion: '1.0.0',
  generatedAt: new Date().toISOString(),
  sources: [
    { id: 'attack-enterprise', name: 'MITRE ATT&CK Enterprise', url: sources['attack-enterprise'] },
    { id: 'attack-ics', name: 'MITRE ATT&CK for ICS', url: sources['attack-ics'] },
    { id: 'emb3d', name: 'MITRE EMB3D', url: emb3dUrl ?? 'configure EMB3D_STIX_URL' },
  ],
  policy: 'Upstream MITRE content is synchronized from official machine-readable sources. Do not hand-copy or invent technique records.',
};
await fs.writeFile(path.join(out, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('Threat intelligence sync complete.');
