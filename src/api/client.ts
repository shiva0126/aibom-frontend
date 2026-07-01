const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8001';
const TENANT = import.meta.env.VITE_TENANT_ID ?? '10000000-0000-0000-0000-000000000001';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'X-Tenant-ID': TENANT },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'X-Tenant-ID': TENANT, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

async function del(path: string): Promise<void> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'DELETE',
    headers: { 'X-Tenant-ID': TENANT },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
}

export interface PlatformStats {
  ai_systems: number;
  open_findings: number;
  critical_findings: number;
  attack_paths: number;
  total_observations: number;
}

export interface Finding {
  id: string;
  system_id: string;
  snapshot_id: string;
  finding_type: string;
  severity: string;
  title: string;
  description: string;
  entity_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  owasp_llm_id?: string | null;
  atlas_technique?: string | null;
  nist_rmf_function?: string | null;
  evidence_json?: Record<string, unknown> | null;
}

export interface AISystem {
  id: string;
  canonical_id: string;
  name: string;
  system_type: string;
  status: string;
  created_at: string;
}

export interface Snapshot {
  id: string;
  system_id: string;
  version: number;
  status: string;
  completeness_score: number;
  trust_score: number;
  evidence_cutoff_at: string;
}

export interface AttackPath {
  id: string;
  system_id: string;
  snapshot_id: string;
  path_type: string;
  severity: string;
  title: string;
  description: string;
  path_json: Record<string, unknown>;
  status: string;
  created_at: string;
}

export interface ComplianceRequirement {
  id: string;
  article: string;
  requirement: string;
  concerns?: string[];
  auto?: boolean;
}

export interface EuAiActRequirement extends ComplianceRequirement {}

export interface FrameworkResult {
  framework_id: string;
  name: string;
  full_name: string;
  authority: string;
  country: string;
  region: string;
  effective: string;
  scope: string;
  penalty: string;
  compliance_score: number;
  total: number;
  satisfied_count: number;
  partial_count: number;
  gaps_count: number;
  satisfied: ComplianceRequirement[];
  partial: ComplianceRequirement[];
  gaps: ComplianceRequirement[];
}

export interface GlobalCompliance {
  system_id: string;
  system_name: string;
  assessed_at: string;
  global_score: number;
  region_scores: Record<string, number>;
  frameworks_count: number;
  open_findings_count: number;
  severity_breakdown: Record<string, number>;
  snapshot_version: number | null;
  frameworks: FrameworkResult[];
}

export interface EuAiActCompliance {
  framework: string;
  system_id: string;
  system_name: string;
  assessed_at: string;
  compliance_score: number;
  snapshot_version: number | null;
  snapshot_id: string | null;
  satisfied: EuAiActRequirement[];
  partial: EuAiActRequirement[];
  gaps: EuAiActRequirement[];
  open_findings_count: number;
  critical_findings: { id: string; type: string; title: string }[];
  audit_trail_entries: number;
  notes: string[];
}

export interface NistRmfFunctionDetail {
  description: string;
  status: 'SATISFACTORY' | 'RISK_IDENTIFIED' | 'INCOMPLETE';
  evidence: Record<string, unknown>;
}

export interface NistRmfCompliance {
  framework: string;
  system_id: string;
  system_name: string;
  assessed_at: string;
  functions: {
    GOVERN: NistRmfFunctionDetail;
    MAP: NistRmfFunctionDetail;
    MEASURE: NistRmfFunctionDetail;
    MANAGE: NistRmfFunctionDetail;
  };
  overall_risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  event_types: string[];
  is_active: boolean;
  created_at: string;
}

export interface WebhookCreate {
  name: string;
  url: string;
  secret: string;
  event_types: string[];
}

export const api = {
  stats: () => get<PlatformStats>('/api/v1/stats'),
  findings: () => get<Finding[]>('/api/v1/findings'),
  systemFindings: (id: string) => get<Finding[]>(`/api/v1/systems/${id}/findings`),
  systems: () => get<AISystem[]>('/api/v1/systems'),
  system: (id: string) => get<AISystem>(`/api/v1/systems/${id}`),
  snapshots: (systemId: string) => get<Snapshot[]>(`/api/v1/systems/${systemId}/snapshots`),
  attackPaths: () => get<AttackPath[]>('/api/v1/attack-paths'),
  systemAttackPaths: (id: string) => get<AttackPath[]>(`/api/v1/systems/${id}/attack-paths`),
  ragFindings: () => get<Finding[]>('/api/v1/rag/findings'),
  supplyChainFindings: () => get<Finding[]>('/api/v1/supply-chain/findings'),
  euAiAct: (systemId: string) => get<EuAiActCompliance>(`/api/v1/systems/${systemId}/compliance/eu-ai-act`),
  nistRmf: (systemId: string) => get<NistRmfCompliance>(`/api/v1/systems/${systemId}/compliance/nist-ai-rmf`),
  globalCompliance: (systemId: string) => get<GlobalCompliance>(`/api/v1/systems/${systemId}/compliance/global`),
  webhooks: () => get<Webhook[]>('/api/v1/webhooks'),
  createWebhook: (body: WebhookCreate) => post<Webhook>('/api/v1/webhooks', body),
  deleteWebhook: (id: string) => del(`/api/v1/webhooks/${id}`),
  exportSpdx: (snapshotId: string) => get<Record<string, unknown>>(`/api/v1/snapshots/${snapshotId}/export/spdx`),
};
