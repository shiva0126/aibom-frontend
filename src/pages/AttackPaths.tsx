import { Route, ArrowRight, Crosshair, ShieldCheck } from 'lucide-react';
import PageShell from '../components/layout/PageShell';
import Badge from '../components/shared/Badge';
import { useAttackPaths } from '../api/hooks';

function nodeLabel(node: unknown): string {
  if (typeof node === 'string') return node;
  if (node && typeof node === 'object') {
    const o = node as Record<string, unknown>;
    return String(o.label ?? o.name ?? o.display_name ?? o.entity_type ?? o.canonical_id ?? o.type ?? 'node');
  }
  return String(node);
}

export default function AttackPaths() {
  const { data: paths, loading } = useAttackPaths();
  const list = paths ?? [];

  return (
    <PageShell
      title="Attack Paths"
      subtitle={loading ? 'Loading…' : `${list.length} exposure chain${list.length !== 1 ? 's' : ''} · mapped to MITRE ATLAS (live)`}
    >
      {!loading && list.length === 0 ? (
        <div style={{
          padding: '48px 24px', textAlign: 'center', borderRadius: 14,
          border: '1px solid var(--border)', background: 'var(--bg-card)',
        }}>
          <ShieldCheck size={30} style={{ color: 'var(--success)', margin: '0 auto 12px', display: 'block' }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>No attack paths detected</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 460, margin: '0 auto' }}>
            The attack-path engine chains exploitable conditions (public endpoints, over-privileged agents,
            unverified artifacts reaching production). None of the current systems present such a chain.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map(p => {
            const nodes = Array.isArray(p.path_nodes) ? p.path_nodes : [];
            return (
              <div key={p.id}
                className="rounded-xl p-4 transition-all"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'var(--danger-muted)', border: '1px solid var(--danger-border)' }}>
                      <Route size={15} style={{ color: 'var(--danger)' }} />
                    </div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{p.path_summary}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        <span className="mono">{p.path_family}</span>
                        {p.inferred_evidence_used && ' · inferred evidence'}
                        {p.stale_evidence_used && ' · stale evidence'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {nodes.length > 0 && (
                      <div className="text-xs px-2.5 py-1 rounded-lg font-semibold"
                        style={{ background: 'var(--warning-muted)', color: 'var(--warning)', border: '1px solid var(--warning-border)' }}>
                        {nodes.length} hops
                      </div>
                    )}
                    <Badge label={p.severity} />
                  </div>
                </div>

                {/* Path visualization */}
                {nodes.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap mb-3">
                    {nodes.map((node, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <div className="text-[11px] px-2.5 py-1 rounded-md font-medium"
                          style={{
                            background: i === nodes.length - 1 ? 'var(--danger-muted)' : 'var(--bg-elevated)',
                            color: i === nodes.length - 1 ? 'var(--danger)' : 'var(--text-secondary)',
                            border: `1px solid ${i === nodes.length - 1 ? 'var(--danger-border)' : 'var(--border)'}`,
                          }}>
                          {nodeLabel(node)}
                        </div>
                        {i < nodes.length - 1 && <ArrowRight size={11} style={{ color: 'var(--text-muted)' }} />}
                      </div>
                    ))}
                  </div>
                )}

                {/* ATLAS technique pills */}
                {p.atlas_techniques && p.atlas_techniques.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap" style={{ borderTop: '1px solid var(--border-muted)', paddingTop: 10 }}>
                    <Crosshair size={11} style={{ color: 'var(--purple)' }} />
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', marginRight: 2 }}>ATLAS:</span>
                    {p.atlas_techniques.map(t => (
                      <span key={t.id} title={t.name ?? undefined}
                        style={{
                          fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 5,
                          background: 'var(--purple-muted)', color: 'var(--purple)', border: '1px solid var(--purple-border)',
                        }}>
                        <span style={{ fontFamily: 'monospace' }}>{t.id}</span> · {t.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
