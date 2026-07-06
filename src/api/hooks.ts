import { useState, useEffect, useCallback } from 'react';
import { api } from './client';
import type {
  PlatformStats, Finding, AISystem, AttackPath, Snapshot,
  EuAiActCompliance, NistRmfCompliance, Webhook, GlobalCompliance,
  Agent, McpServer, RagLineage, SupplyChainModel, AtlasMatrix, AtlasCoverage,
} from './client';

function useQuery<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    fetcher()
      .then(d => { setData(d); setError(null); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetcher()
      .then(d => { if (!cancelled) { setData(d); setError(null); } })
      .catch(e => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch };
}

export const useStats = () => useQuery<PlatformStats>(api.stats);
export const useFindings = () => useQuery<Finding[]>(api.findings);
export const useSystemFindings = (id: string) => useQuery<Finding[]>(() => api.systemFindings(id), [id]);
export const useSystems = () => useQuery<AISystem[]>(api.systems);
export const useAttackPaths = () => useQuery<AttackPath[]>(api.attackPaths);
export const useSystemAttackPaths = (id: string) => useQuery<AttackPath[]>(() => api.systemAttackPaths(id), [id]);
export const useSnapshots = (systemId: string) => useQuery<Snapshot[]>(() => api.snapshots(systemId), [systemId]);
export const useRagFindings = () => useQuery<Finding[]>(api.ragFindings);
export const useSupplyChainFindings = () => useQuery<Finding[]>(api.supplyChainFindings);
export const useEuAiAct = (systemId: string) => useQuery<EuAiActCompliance>(() => api.euAiAct(systemId), [systemId]);
export const useNistRmf = (systemId: string) => useQuery<NistRmfCompliance>(() => api.nistRmf(systemId), [systemId]);
export const useGlobalCompliance = (systemId: string) => useQuery<GlobalCompliance>(() => api.globalCompliance(systemId), [systemId]);
export const useWebhooks = () => useQuery<Webhook[]>(api.webhooks);
export const useAgents = () => useQuery<Agent[]>(api.agents);
export const useMcpServers = () => useQuery<McpServer[]>(api.mcpServers);
export const useRagLineage = () => useQuery<RagLineage[]>(api.ragLineage);
export const useSupplyChainModels = () => useQuery<SupplyChainModel[]>(api.supplyChainModels);
export const useAtlasMatrix = () => useQuery<AtlasMatrix>(api.atlasMatrix);
export const useAtlasCoverage = (systemId: string) => useQuery<AtlasCoverage>(() => api.atlasCoverage(systemId), [systemId]);

export type {
  PlatformStats, Finding, AISystem, AttackPath, Snapshot,
  EuAiActCompliance, NistRmfCompliance, Webhook, GlobalCompliance,
  Agent, McpServer, RagLineage, SupplyChainModel, AtlasMatrix, AtlasCoverage,
};
