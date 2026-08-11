export type ThreatSource = 'MITRE ATT&CK Enterprise' | 'MITRE ATT&CK ICS' | 'MITRE EMB3D' | 'STRIDE' | 'PASTA' | 'LINDDUN' | 'Cyber Kill Chain' | 'CAPEC' | 'CWE' | 'NIST SP 800-82' | 'IEC 62443' | 'NIST CSF 2.0' | 'Cloud Security Alliance CCM';

export interface ComponentDefinition {
  id: string;
  name: string;
  category: 'IT' | 'Cloud' | 'OT' | 'Network' | 'Identity' | 'Data' | 'Application' | 'Security' | 'IoT';
  description: string;
  threats: string[];
  zone?: string;
}

export const componentCatalog: ComponentDefinition[] = [
  { id: 'user', name: 'User / Operator', category: 'Identity', description: 'Human user, operator or administrator.', threats: ['credential-theft', 'phishing', 'insider', 'privilege-abuse'] },
  { id: 'idp', name: 'Identity Provider', category: 'Identity', description: 'SSO, directory or federation service.', threats: ['credential-theft', 'token-theft', 'identity-forgery', 'privilege-escalation'] },
  { id: 'pam', name: 'PAM / Jump Server', category: 'Security', description: 'Privileged access gateway or OT jump host.', threats: ['credential-theft', 'session-hijacking', 'lateral-movement', 'remote-services'] },
  { id: 'firewall', name: 'Firewall', category: 'Network', description: 'Network security boundary or segmentation device.', threats: ['rule-tampering', 'policy-bypass', 'denial-of-service', 'lateral-movement'] },
  { id: 'router', name: 'Router', category: 'Network', description: 'Layer-3 routing infrastructure.', threats: ['route-manipulation', 'credential-theft', 'firmware-tampering', 'dos'] },
  { id: 'switch', name: 'Industrial / Enterprise Switch', category: 'Network', description: 'Managed Ethernet switching infrastructure.', threats: ['configuration-tampering', 'firmware-tampering', 'network-sniffing', 'dos'] },
  { id: 'vpn', name: 'VPN Gateway', category: 'Network', description: 'Remote access gateway.', threats: ['credential-theft', 'session-hijacking', 'exposed-service', 'policy-bypass'] },
  { id: 'web', name: 'Web Application', category: 'Application', description: 'Browser-accessible application or portal.', threats: ['injection', 'xss', 'csrf', 'auth-bypass', 'session-hijacking'] },
  { id: 'api', name: 'API Gateway / Service', category: 'Application', description: 'API ingress and service integration layer.', threats: ['injection', 'broken-auth', 'excessive-data-exposure', 'dos'] },
  { id: 'database', name: 'Database', category: 'Data', description: 'Relational or NoSQL data store.', threats: ['injection', 'data-exfiltration', 'ransomware', 'privilege-abuse'] },
  { id: 'object-store', name: 'Object Storage', category: 'Cloud', description: 'Cloud object storage such as buckets.', threats: ['public-exposure', 'credential-theft', 'data-exfiltration', 'ransomware'] },
  { id: 'container', name: 'Container', category: 'Cloud', description: 'Containerized workload.', threats: ['container-escape', 'image-tampering', 'secret-theft', 'supply-chain'] },
  { id: 'kubernetes', name: 'Kubernetes Cluster', category: 'Cloud', description: 'Container orchestration control plane and workloads.', threats: ['rbac-abuse', 'container-escape', 'api-abuse', 'secret-theft'] },
  { id: 'serverless', name: 'Serverless Function', category: 'Cloud', description: 'Event-driven serverless compute.', threats: ['injection', 'overprivilege', 'secret-theft', 'event-abuse'] },
  { id: 'cloud-vpc', name: 'Cloud VPC / VNet', category: 'Cloud', description: 'Cloud network boundary.', threats: ['misconfiguration', 'route-manipulation', 'lateral-movement', 'exposed-service'] },
  { id: 'siem', name: 'SIEM', category: 'Security', description: 'Centralized security telemetry and analytics.', threats: ['log-tampering', 'log-evasion', 'credential-theft'] },
  { id: 'edr', name: 'EDR / Endpoint Agent', category: 'Security', description: 'Endpoint detection and response sensor.', threats: ['defense-evasion', 'agent-tampering', 'credential-theft'] },
  { id: 'plc', name: 'PLC / RTU', category: 'OT', description: 'Industrial controller responsible for process logic.', threats: ['logic-manipulation', 'firmware-tampering', 'command-injection', 'dos'], zone: 'Purdue L1/L2' },
  { id: 'hmi', name: 'HMI', category: 'OT', description: 'Human-machine interface used by operators.', threats: ['credential-theft', 'screen-manipulation', 'remote-access', 'malware'], zone: 'Purdue L2' },
  { id: 'scada', name: 'SCADA Server', category: 'OT', description: 'Supervisory control and data acquisition server.', threats: ['credential-theft', 'command-injection', 'data-manipulation', 'ransomware'], zone: 'Purdue L2/L3' },
  { id: 'historian', name: 'Historian', category: 'OT', description: 'Industrial process historian.', threats: ['data-manipulation', 'data-exfiltration', 'credential-theft'], zone: 'Purdue L3' },
  { id: 'engineering', name: 'Engineering Workstation', category: 'OT', description: 'Engineering station used to configure controllers.', threats: ['malware', 'credential-theft', 'logic-manipulation', 'supply-chain'], zone: 'Purdue L2/L3' },
  { id: 'safety', name: 'Safety Instrumented System', category: 'OT', description: 'Safety controller and associated engineering environment.', threats: ['logic-manipulation', 'firmware-tampering', 'dos'], zone: 'Safety Zone' },
  { id: 'opcua', name: 'OPC UA Server', category: 'OT', description: 'Industrial interoperability and data exchange service.', threats: ['auth-bypass', 'command-injection', 'data-manipulation', 'dos'] },
  { id: 'modbus', name: 'Modbus Gateway', category: 'OT', description: 'Industrial protocol gateway.', threats: ['command-injection', 'replay', 'spoofing', 'dos'] },
  { id: 'rtu', name: 'Remote Terminal Unit', category: 'OT', description: 'Remote field controller.', threats: ['command-injection', 'firmware-tampering', 'spoofing', 'dos'] },
  { id: 'sensor', name: 'Industrial Sensor', category: 'IoT', description: 'Field sensor providing process measurements.', threats: ['measurement-spoofing', 'physical-tampering', 'firmware-tampering', 'replay'] },
  { id: 'actuator', name: 'Industrial Actuator', category: 'OT', description: 'Field device that changes the physical process.', threats: ['command-injection', 'physical-tampering', 'logic-manipulation', 'dos'] },
  { id: 'firmware', name: 'Firmware / Embedded Device', category: 'IoT', description: 'Embedded firmware image or device software.', threats: ['firmware-tampering', 'debug-port-abuse', 'code-extraction', 'side-channel'] },
];

export const methodologyCatalog = [
  { id: 'stride', name: 'STRIDE', scope: 'Software / architecture', description: 'Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service and Elevation of Privilege.' },
  { id: 'attack-enterprise', name: 'MITRE ATT&CK Enterprise', scope: 'IT / cloud', description: 'Adversary tactics, techniques and sub-techniques based on real-world observations.' },
  { id: 'attack-ics', name: 'MITRE ATT&CK for ICS', scope: 'OT / ICS', description: 'Adversary behavior targeting industrial control systems.' },
  { id: 'emb3d', name: 'MITRE EMB3D', scope: 'Embedded / OT / IoT', description: 'Threats, device properties and mitigations for embedded devices.' },
  { id: 'pasta', name: 'PASTA', scope: 'Risk / application', description: 'Seven-stage risk-centric threat modeling process.' },
  { id: 'linddun', name: 'LINDDUN', scope: 'Privacy', description: 'Privacy threat analysis across linkability, identifiability, non-repudiation, detectability, disclosure, unawareness and non-compliance.' },
  { id: 'kill-chain', name: 'Cyber Kill Chain', scope: 'Adversary lifecycle', description: 'Reconnaissance through actions on objectives.' },
  { id: 'capec', name: 'CAPEC', scope: 'Attack patterns', description: 'Structured catalog of common attack patterns.' },
  { id: 'cwe', name: 'CWE', scope: 'Weaknesses', description: 'Common software and hardware weakness taxonomy.' },
  { id: 'iec62443', name: 'IEC 62443', scope: 'OT / IACS', description: 'Industrial automation and control system security zones, conduits and security levels.' },
  { id: 'nist80082', name: 'NIST SP 800-82', scope: 'OT / ICS', description: 'Guidance for securing operational technology and control systems.' },
  { id: 'nistcsf', name: 'NIST CSF 2.0', scope: 'Enterprise', description: 'Govern, Identify, Protect, Detect, Respond and Recover.' },
  { id: 'csa-ccm', name: 'CSA Cloud Controls Matrix', scope: 'Cloud', description: 'Cloud security and privacy control domains for architecture and assurance.' },
];

export const sourceCatalog: ThreatSource[] = [
  'MITRE ATT&CK Enterprise', 'MITRE ATT&CK ICS', 'MITRE EMB3D', 'STRIDE', 'PASTA', 'LINDDUN',
  'Cyber Kill Chain', 'CAPEC', 'CWE', 'NIST SP 800-82', 'IEC 62443', 'NIST CSF 2.0', 'Cloud Security Alliance CCM'
];
