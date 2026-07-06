import { Database, AlertTriangle, CheckCircle2, Crosshair } from 'lucide-react';
import PageShell from '../components/layout/PageShell';
import Badge from '../components/shared/Badge';
import { useRagLineage, useRagFindings } from '../api/hooks';

const sevColor: Record<string, string> = {
  critical: 'var(--danger)', high: 'var(--orange)', medium: 'var(--warning)', low: 'var(--cyan)',
};

export default function RAGLineage() {
  const { data: lineage, loading } = useRagLineage();
  const { data: ragFindings } = useRagFindings();

  const kbs = lineage ?? [];
  const findings = ragFindings ?? [];

  return (
    <PageShell
      title="RAG Lineage"
      subtitle={loading ? 'Loading…' : `${kbs.length} knowledge base${kbs.length !== 1 ? 's' : ''} · ${findings.length} lineage finding${findings.length !== 1 ? 's' : ''} (live)`}
    >
      {!loading && kbs.length === 0 ? (
        <div className="rounded-xl py-12 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <Database size={28} style={{ color: 'var(--text-muted)', margin: '0 auto 10px', display: 'block' }} />
          <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>No RAG knowledge bases discovered</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Ingest a system with a knowledge base to see its lineage.</div>
        </div>
      ) : (
        <div className="space-y-4">
          {kbs.map(kb => {
            // findings that reference this KB entity
            const kbFindings = findings.filter(f => f.entity_id === kb.knowledge_base_id);
            const clean = kbFindings.length === 0;
            return (
              <div key={kb.knowledge_base_id} className="rounded-xl p-5"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'var(--accent-muted)', border: '1px solid var(--accent-border)' }}>
                      <Database size={16} style={{ color: 'var(--accent)' }} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{kb.display_name}</div>
                      <div className="text-[10px] mono mt-0.5" style={{ color: 'var(--text-muted)' }}>{kb.canonical_id}</div>
                    </div>
                  </div>
                  {clean
                    ? <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg" style={{ background: 'var(--success-muted)', color: 'var(--success)', border: '1px solid var(--success-border)' }}><CheckCircle2 size={12} /> No issues</span>
                    : <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg" style={{ background: 'var(--danger-muted)', color: 'var(--danger)', border: '1px solid var(--danger-border)' }}><AlertTriangle size={12} /> {kbFindings.length} finding{kbFindings.length !== 1 ? 's' : ''}</span>}
                </div>

                {/* Lineage findings for this KB */}
                {kbFindings.length > 0 && (
                  <div className="space-y-2" style={{ borderTop: '1px solid var(--border-muted)', paddingTop: 12 }}>
                    {kbFindings.map(f => (
                      <div key={f.id} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: sevColor[f.severity] ?? 'var(--text-muted)', flexShrink: 0 }} />
                        <span className="text-xs flex-1" style={{ color: 'var(--text-primary)' }}>{f.title}</span>
                        {f.atlas_technique && (
                          <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded mono" style={{ background: 'var(--purple-muted)', color: 'var(--purple)', border: '1px solid var(--purple-border)' }}>
                            <Crosshair size={9} />{f.atlas_technique}
                          </span>
                        )}
                        <Badge label={f.severity.charAt(0).toUpperCase() + f.severity.slice(1)} size="sm" />
                      </div>
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
