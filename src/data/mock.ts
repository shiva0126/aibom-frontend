/* ─── Overview ─── */
export const overviewStats = [
  { label: 'Total AI Systems',  value: 128, delta: '+12', trend: 'up',   icon: 'systems'   },
  { label: 'Active Models',     value: 246, delta: '+18', trend: 'up',   icon: 'models'    },
  { label: 'Agents',            value: 37,  delta: '+5',  trend: 'up',   icon: 'agents'    },
  { label: 'MCP Tools',         value: 82,  delta: '+14', trend: 'up',   icon: 'tools'     },
  { label: 'Critical Findings', value: 23,  delta: '+6',  trend: 'down', icon: 'findings'  },
  { label: 'AI-BOM Snapshots',  value: 56,  delta: '+9',  trend: 'up',   icon: 'snapshots' },
];

export const postureTrend = [
  { date: 'May 11', score: 58 },
  { date: 'May 12', score: 61 },
  { date: 'May 13', score: 59 },
  { date: 'May 14', score: 64 },
  { date: 'May 15', score: 67 },
  { date: 'May 16', score: 65 },
  { date: 'May 17', score: 70 },
  { date: 'May 18', score: 72 },
];

export const postureBreakdown = [
  { name: 'Secure',   value: 34, color: 'var(--success)' },
  { name: 'Watch',    value: 26, color: 'var(--warning)'  },
  { name: 'At Risk',  value: 24, color: 'var(--orange)'   },
  { name: 'Critical', value: 16, color: 'var(--danger)'   },
];

export const recentFindings = [
  { id: 'F-0041', finding: 'Unapproved Model Drift',                  system: 'Fraud Detection Service', severity: 'Critical', firstDetected: 'May 18, 2025 09:14', status: 'New'         },
  { id: 'F-0040', finding: 'Public AI Endpoint to Sensitive RAG Data', system: 'Customer Support Bot',    severity: 'Critical', firstDetected: 'May 18, 2025 08:47', status: 'New'         },
  { id: 'F-0039', finding: 'Agent Tool with Excessive Privilege',       system: 'Finance Agent',           severity: 'High',     firstDetected: 'May 17, 2025 16:22', status: 'In Progress' },
  { id: 'F-0038', finding: 'Missing Guardrail',                        system: 'Code Assistant',          severity: 'High',     firstDetected: 'May 17, 2025 11:03', status: 'In Progress' },
  { id: 'F-0037', finding: 'Untrusted Model Artifact',                 system: 'Risk Scoring Model',      severity: 'Critical', firstDetected: 'May 16, 2025 21:36', status: 'Open'        },
];

export const attackPathNodes = [
  { label: 'Public Endpoint', risk: 'High'     },
  { label: 'Lambda Runtime',  risk: 'High'     },
  { label: 'Agent Role',      risk: 'High'     },
  { label: 'Knowledge Base',  risk: 'Medium'   },
  { label: 'Vector Index',    risk: 'High'     },
  { label: 'Sensitive Dataset', risk: 'Critical' },
];

export const aibomSnapshot = {
  model:       { name: 'GPT-4o',           version: 'v1.2.3' },
  agent:       { name: 'Support Agent',    version: 'v2.1.0' },
  mcp:         { name: 'Search Server',    version: 'v1.4.2' },
  kb:          { name: 'Support KB',       version: 'v3.0.1' },
  vectorIndex: { name: 'Pinecone Index',   version: 'v2.5.0' },
  tool:        { name: 'Web Search',       version: 'v1.3.0' },
  dataset:     { name: 'Customer Tickets', version: 'v1.0.0' },
};

export const supplyChainSteps = [
  { label: 'Source Repo',        sub: 'GitHub',        status: 'ok'   },
  { label: 'CI/CD',              sub: 'GitHub Actions', status: 'ok'   },
  { label: 'Container Image',    sub: 'ECR',           status: 'ok'   },
  { label: 'Model Artifact',     sub: 'model.onnx',    status: 'ok'   },
  { label: 'Registry',           sub: 'Hugging Face',  status: 'fail' },
  { label: 'Production',         sub: 'Endpoint',      status: 'ok'   },
];

export const supplyChainChecks = [
  { label: 'SAST',          status: 'Passed' },
  { label: 'Secret Scan',   status: 'Passed' },
  { label: 'License Check', status: 'Passed' },
  { label: 'Vuln Scan',     status: 'Passed' },
  { label: 'Provenance',    status: 'Failed' },
  { label: 'Policy Check',  status: 'Passed' },
];

export const overviewAgents = [
  { name: 'Support Agent',  version: 'v2.1.0', status: 'Healthy', tools: 6, mcpServers: 2 },
  { name: 'Finance Agent',  version: 'v1.3.2', status: 'Healthy', tools: 4, mcpServers: 1 },
];

export const ragLineageNodes = [
  { label: 'Source Dataset',     detail: 's3://acme-data/tickets/', type: 'source'    },
  { label: 'Ingestion Pipeline', detail: 'Glue Job: tickets_ingest', type: 'pipeline'  },
  { label: 'Embeddings Model',   detail: 'text-embedding-3-large',  type: 'model'     },
  { label: 'Vector Index',       detail: 'Pinecone: support-index', type: 'index'     },
  { label: 'Consumed By',        detail: 'Support Agent',           type: 'consumer'  },
];

export const coverageEvidence = [
  { label: 'Discovered', value: 246, max: 246 },
  { label: 'Declared',   value: 212, max: 246 },
  { label: 'Attested',   value: 178, max: 246 },
  { label: 'Observed',   value: 162, max: 246 },
  { label: 'Validated',  value: 138, max: 246 },
  { label: 'Simulated',  value: 94,  max: 246 },
  { label: 'Inferred',   value: 67,  max: 246 },
];

/* ─── AI Systems ─── */
export const aiSystems = [
  { id: 'sys-001', name: 'Customer Support Bot',    type: 'RAG Agent',       env: 'Production', status: 'At Risk',  models: 2, findings: 3, lastScanned: '2h ago',   owner: 'Platform Team'   },
  { id: 'sys-002', name: 'Fraud Detection Service', type: 'Classification',  env: 'Production', status: 'Critical', models: 1, findings: 5, lastScanned: '4h ago',   owner: 'Security Team'   },
  { id: 'sys-003', name: 'Code Assistant',          type: 'Completion LLM',  env: 'Production', status: 'Watch',    models: 1, findings: 2, lastScanned: '1d ago',   owner: 'Engineering'     },
  { id: 'sys-004', name: 'Finance Agent',           type: 'Agentic',         env: 'Production', status: 'Secure',   models: 2, findings: 0, lastScanned: '6h ago',   owner: 'Finance Team'    },
  { id: 'sys-005', name: 'HR Policy Chatbot',       type: 'RAG Agent',       env: 'Staging',    status: 'Watch',    models: 1, findings: 1, lastScanned: '12h ago',  owner: 'HR Platform'     },
  { id: 'sys-006', name: 'Risk Scoring Model',      type: 'Classification',  env: 'Production', status: 'Critical', models: 1, findings: 4, lastScanned: '3h ago',   owner: 'Risk Team'       },
  { id: 'sys-007', name: 'Content Moderation AI',   type: 'Classification',  env: 'Production', status: 'Secure',   models: 1, findings: 0, lastScanned: '8h ago',   owner: 'Trust & Safety'  },
  { id: 'sys-008', name: 'Recommendation Engine',   type: 'Embedding Model', env: 'Production', status: 'Secure',   models: 3, findings: 0, lastScanned: '6h ago',   owner: 'Growth Team'     },
  { id: 'sys-009', name: 'Legal Doc Analyzer',      type: 'RAG Agent',       env: 'Staging',    status: 'Watch',    models: 2, findings: 2, lastScanned: '2d ago',   owner: 'Legal Ops'       },
  { id: 'sys-010', name: 'Image Classifier',        type: 'Vision Model',    env: 'Production', status: 'Secure',   models: 1, findings: 0, lastScanned: '10h ago',  owner: 'Product Team'    },
];

/* ─── AI-BOM Snapshots ─── */
export const aibomSnapshots = [
  { id: 'bom-056', system: 'Customer Support Bot',    version: 'v56', components: 14, completeness: 92, trust: 87, drift: 'Minor',    created: 'May 18, 2025',  status: 'Valid'    },
  { id: 'bom-055', system: 'Fraud Detection Service', version: 'v55', components: 9,  completeness: 78, trust: 65, drift: 'Major',    created: 'May 17, 2025',  status: 'Drifted'  },
  { id: 'bom-054', system: 'Finance Agent',           version: 'v54', components: 18, completeness: 97, trust: 94, drift: 'None',     created: 'May 17, 2025',  status: 'Valid'    },
  { id: 'bom-053', system: 'Code Assistant',          version: 'v53', components: 7,  completeness: 85, trust: 80, drift: 'Minor',    created: 'May 16, 2025',  status: 'Valid'    },
  { id: 'bom-052', system: 'Risk Scoring Model',      version: 'v52', components: 6,  completeness: 60, trust: 45, drift: 'Critical', created: 'May 15, 2025',  status: 'Invalid'  },
  { id: 'bom-051', system: 'HR Policy Chatbot',       version: 'v51', components: 11, completeness: 88, trust: 82, drift: 'None',     created: 'May 14, 2025',  status: 'Valid'    },
];

/* ─── Full Findings ─── */
export const allFindings = [
  { id: 'F-0041', title: 'Unapproved Model Drift',                  system: 'Fraud Detection Service', category: 'Model Security',   severity: 'Critical', status: 'New',         age: '4h',  cve: null         },
  { id: 'F-0040', title: 'Public AI Endpoint to Sensitive RAG Data', system: 'Customer Support Bot',    category: 'Data Exposure',    severity: 'Critical', status: 'New',         age: '5h',  cve: null         },
  { id: 'F-0039', title: 'Agent Tool with Excessive Privilege',       system: 'Finance Agent',           category: 'Agent Security',   severity: 'High',     status: 'In Progress', age: '22h', cve: null         },
  { id: 'F-0038', title: 'Missing Guardrail',                        system: 'Code Assistant',          category: 'AI Posture',       severity: 'High',     status: 'In Progress', age: '1d',  cve: null         },
  { id: 'F-0037', title: 'Untrusted Model Artifact',                 system: 'Risk Scoring Model',      category: 'Supply Chain',     severity: 'Critical', status: 'Open',        age: '2d',  cve: 'CVE-2024-1234' },
  { id: 'F-0036', title: 'Exposed API Key in Model Config',          system: 'Customer Support Bot',    category: 'Secrets',          severity: 'Critical', status: 'Open',        age: '3d',  cve: null         },
  { id: 'F-0035', title: 'RAG Data Leakage via Prompt Injection',    system: 'HR Policy Chatbot',       category: 'Data Exposure',    severity: 'High',     status: 'Open',        age: '4d',  cve: null         },
  { id: 'F-0034', title: 'Model Without Provenance Record',          system: 'Risk Scoring Model',      category: 'Supply Chain',     severity: 'Medium',   status: 'Open',        age: '5d',  cve: null         },
  { id: 'F-0033', title: 'Overprivileged IAM Role for Bedrock',      system: 'Legal Doc Analyzer',      category: 'Access Control',   severity: 'High',     status: 'Open',        age: '6d',  cve: null         },
  { id: 'F-0032', title: 'Stale Vector Index — ROT Data Risk',       system: 'HR Policy Chatbot',       category: 'DSPM',             severity: 'Medium',   status: 'Resolved',    age: '7d',  cve: null         },
  { id: 'F-0031', title: 'SageMaker Endpoint Public Access',         system: 'Image Classifier',        category: 'Access Control',   severity: 'High',     status: 'Resolved',    age: '8d',  cve: null         },
  { id: 'F-0030', title: 'Training Data Without Classification',     system: 'Recommendation Engine',   category: 'DSPM',             severity: 'Medium',   status: 'Open',        age: '9d',  cve: null         },
];

/* ─── Attack Paths ─── */
export const attackPaths = [
  {
    id: 'AP-007',
    title: 'Public Endpoint → Sensitive Customer Dataset',
    severity: 'Critical',
    hops: 6,
    systems: ['Customer Support Bot'],
    path: ['Public Endpoint', 'Lambda Runtime', 'Agent Role', 'Knowledge Base', 'Vector Index', 'Customer Dataset'],
    status: 'Active',
  },
  {
    id: 'AP-006',
    title: 'Compromised Model Registry → Production Fraud Model',
    severity: 'Critical',
    hops: 4,
    systems: ['Fraud Detection Service'],
    path: ['CI Pipeline', 'Hugging Face Registry', 'ECR Image', 'SageMaker Endpoint'],
    status: 'Active',
  },
  {
    id: 'AP-005',
    title: 'Finance Agent → Excessive Tool Scope → Payment API',
    severity: 'High',
    hops: 3,
    systems: ['Finance Agent'],
    path: ['Finance Agent', 'MCP Tool: payment-write', 'Payment Processing API'],
    status: 'Active',
  },
  {
    id: 'AP-004',
    title: 'Overprivileged IAM → RAG Knowledge Base',
    severity: 'High',
    hops: 4,
    systems: ['Legal Doc Analyzer'],
    path: ['Lambda Function', 'IAM Role lex-bedrock-role', 'Bedrock Knowledge Base', 'Legal Documents S3'],
    status: 'Investigating',
  },
  {
    id: 'AP-003',
    title: 'Unauthenticated Inference → Customer PII',
    severity: 'High',
    hops: 3,
    systems: ['HR Policy Chatbot'],
    path: ['Public ALB', 'Unauth Bedrock Endpoint', 'HR Employee Dataset'],
    status: 'Mitigated',
  },
];

/* ─── Agents & MCP ─── */
export const allAgents = [
  { id: 'agt-001', name: 'Support Agent',   version: 'v2.1.0', system: 'Customer Support Bot',    status: 'Healthy',  tools: 6,  mcpServers: 2, frameworks: ['LangChain'],  findings: 1 },
  { id: 'agt-002', name: 'Finance Agent',   version: 'v1.3.2', system: 'Finance Agent',            status: 'Healthy',  tools: 4,  mcpServers: 1, frameworks: ['AutoGen'],    findings: 2 },
  { id: 'agt-003', name: 'Legal Reviewer',  version: 'v1.0.1', system: 'Legal Doc Analyzer',       status: 'Warning',  tools: 3,  mcpServers: 1, frameworks: ['LlamaIndex'], findings: 3 },
  { id: 'agt-004', name: 'Code Reviewer',   version: 'v3.0.0', system: 'Code Assistant',           status: 'Healthy',  tools: 8,  mcpServers: 3, frameworks: ['LangGraph'],  findings: 0 },
  { id: 'agt-005', name: 'Risk Assessor',   version: 'v2.2.0', system: 'Risk Scoring Model',       status: 'Critical', tools: 2,  mcpServers: 0, frameworks: ['Custom'],     findings: 4 },
];

export const mcpServers = [
  { id: 'mcp-001', name: 'Search Server',     version: 'v1.4.2', type: 'Tool Server',   agent: 'Support Agent',  tools: 3, permissions: 'read-only',  status: 'ok'      },
  { id: 'mcp-002', name: 'Database MCP',      version: 'v2.1.0', type: 'Data Server',   agent: 'Finance Agent',  tools: 5, permissions: 'read-write', status: 'warning' },
  { id: 'mcp-003', name: 'Payment MCP',       version: 'v1.0.0', type: 'Action Server', agent: 'Finance Agent',  tools: 2, permissions: 'execute',    status: 'critical' },
  { id: 'mcp-004', name: 'Code Exec Server',  version: 'v1.2.0', type: 'Exec Server',   agent: 'Code Reviewer',  tools: 4, permissions: 'sandboxed',  status: 'ok'      },
];

/* ─── RAG Lineage ─── */
export const ragLineages = [
  {
    id: 'rag-001',
    name: 'Customer Support Pipeline',
    system: 'Customer Support Bot',
    source: 's3://acme-data/tickets/',
    pipeline: 'Glue Job: tickets_ingest',
    embedding: 'text-embedding-3-large',
    index: 'Pinecone: support-index',
    consumer: 'Support Agent',
    dataClass: 'PII',
    status: 'Active',
  },
  {
    id: 'rag-002',
    name: 'Legal Document Pipeline',
    system: 'Legal Doc Analyzer',
    source: 's3://acme-legal/contracts/',
    pipeline: 'Lambda: legal_embed',
    embedding: 'text-embedding-ada-002',
    index: 'OpenSearch: legal-index',
    consumer: 'Legal Reviewer',
    dataClass: 'Confidential',
    status: 'Active',
  },
  {
    id: 'rag-003',
    name: 'HR Policy Pipeline',
    system: 'HR Policy Chatbot',
    source: 's3://acme-hr/policies/',
    pipeline: 'Glue Job: hr_ingest',
    embedding: 'text-embedding-3-small',
    index: 'Pinecone: hr-index',
    consumer: 'HR Bot',
    dataClass: 'Internal',
    status: 'Stale',
  },
];

/* ─── Integrations ─── */
export const integrations = [
  { id: 'int-001', name: 'Amazon Web Services',  category: 'Cloud',     logo: 'aws',      status: 'Connected', account: '123456789012',  lastSync: '2h ago',  services: ['Bedrock', 'SageMaker', 'S3', 'IAM', 'Lambda'] },
  { id: 'int-002', name: 'GitHub',               category: 'VCS',       logo: 'github',   status: 'Connected', account: 'acme-corp',     lastSync: '1h ago',  services: ['Actions', 'Repos', 'Secret Scanning'] },
  { id: 'int-003', name: 'Pinecone',             category: 'Vector DB', logo: 'pinecone', status: 'Connected', account: 'acme-prod',     lastSync: '30m ago', services: ['Indexes', 'Namespaces'] },
  { id: 'int-004', name: 'Hugging Face',         category: 'Registry',  logo: 'hf',       status: 'Warning',   account: 'acme-ai',      lastSync: '4h ago',  services: ['Model Hub', 'Inference'] },
  { id: 'int-005', name: 'Microsoft Azure',      category: 'Cloud',     logo: 'azure',    status: 'Available', account: null,            lastSync: null,      services: ['Azure OpenAI', 'AI Studio', 'Blob Storage'] },
  { id: 'int-006', name: 'Google Cloud',         category: 'Cloud',     logo: 'gcp',      status: 'Available', account: null,            lastSync: null,      services: ['Vertex AI', 'BigQuery', 'GCS'] },
  { id: 'int-007', name: 'Okta',                 category: 'Identity',  logo: 'okta',     status: 'Available', account: null,            lastSync: null,      services: ['SSO', 'OAuth', 'SCIM'] },
  { id: 'int-008', name: 'Jira',                 category: 'Ticketing', logo: 'jira',     status: 'Available', account: null,            lastSync: null,      services: ['Issues', 'Webhooks'] },
];

/* ─── Roadmap / Next Phase ─── */
export const roadmapPhases = [
  {
    sprint: 'S5',
    title: 'Model Supply-Chain Security',
    week: 'Week 8',
    status: 'upcoming',
    items: ['Model provenance & digest verification', 'SBOM integration', 'Evaluation pipeline tracking', 'Deployment findings'],
  },
  {
    sprint: 'S6',
    title: 'AgentCore, Agents & MCP Security',
    week: 'Week 9',
    status: 'upcoming',
    items: ['Agent identity graph', 'Tool scope analysis', 'MCP permission blast-radius', 'Excessive-agency findings'],
  },
  {
    sprint: 'S7',
    title: 'RAG Lineage & Typed Attack Paths',
    week: 'Week 10',
    status: 'upcoming',
    items: ['Source-to-vector-to-agent lineage', 'Three mandatory path families', 'Data principal count on paths', 'DPDP §8(4) evidence'],
  },
  {
    sprint: 'S8',
    title: 'Backend Deployment',
    week: 'Week 11',
    status: 'current',
    items: ['FastAPI control plane', 'PostgreSQL risk graph', 'AWS collector (Bedrock, IAM, S3)', 'Real scan ingestion'],
  },
  {
    sprint: 'S9',
    title: 'Pilot Hardening & Design Partner',
    week: 'Week 12',
    status: 'future',
    items: ['Repeatable onboarding', 'Security tests', 'Recovery procedures', 'First pilot review'],
  },
];
