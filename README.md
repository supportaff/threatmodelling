# ThreatForge

Interactive SaaS threat modeling for IT, OT/ICS and cloud environments.

## Product direction
ThreatForge is designed as a visual security-design workspace rather than a static checklist. It combines architecture diagrams, threat discovery, risk prioritization, controls and executive reporting.

### Methodologies
- STRIDE — application threat elicitation
- MITRE ATT&CK — adversary behavior and attack paths
- PASTA — risk-centric analysis
- LINDDUN — privacy threat analysis
- IEC 62443 — OT/ICS zones, conduits and security levels
- NIST SP 800-82 — ICS security architecture and threat analysis

The methodology selector is intentionally modular so additional models can be added later.

## MVP features
- IT & Cloud / OT-ICS workspace modes
- Interactive architecture/data-flow diagram
- Trust zones and component inspection
- Threat generation table with severity and scores
- Methodology switching
- Findings view
- Executive report view
- Responsive dashboard UI

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
