import { useState, useEffect } from 'react';
import { api } from './client';
import type { PlatformStats, Finding, AISystem, AttackPath, Snapshot } from './client';

function useQuery<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return { data, loading, error };
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

export type { PlatformStats, Finding, AISystem, AttackPath, Snapshot };
