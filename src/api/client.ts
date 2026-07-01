const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8001';
const TENANT = import.meta.env.VITE_TENANT_ID ?? '10000000-0000-0000-0000-000000000001';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'X-Tenant-ID': TENANT },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
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
};
