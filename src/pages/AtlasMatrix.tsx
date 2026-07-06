import { useState } from 'react';
import { Crosshair, ChevronDown, ShieldAlert, Info, FileWarning, Route } from 'lucide-react';
import PageShell from '../components/layout/PageShell';
import { useSystems, useAtlasMatrix, useAtlasCoverage } from '../api/hooks';
import type { AtlasMatrixTactic, AtlasCoverageTechnique } from '../api/client';

/* severity color helper */
const sevColor: Record<string, string> = {
  critical: 'var(--danger)', high: 'var(--orange)', medium: 'var(--warning)', low: 'var(--cyan)',
};

function Legend() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      {[
        { c: 'var(--danger)', border: 'var(--danger-border)', bg: 'var(--danger-muted)', label: 'Observed (evidence in this system)' },
        { c: 'var(--accent)', border: 'var(--accent-border)', bg: 'var(--accent-muted)', label: 'Detectable (platform can find it)' },
        { c: 'var(--text-muted)', border: 'var(--border)', bg: 'var(--bg-elevated)', label: 'Not covered' },
      ].map(l => (
        <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 11, height: 11, borderRadius: 3, background: l.bg, border: `1px solid ${l.border}` }} />
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{l.label}</span>
        </div>
      ))}
    </div>
  );
}

/* One technique cell in the matrix */
function TechCell({
  id, name, detectable, observed, onClick, selected,
}: {
  id: string; name: string; detectable: boolean; observed: boolean;
  onClick?: () => void; selected?: boolean;
}) {
  const style = observed
    ? { bg: 'var(--danger-muted)', border: 'var(--danger-border)', color: 'var(--danger)' }
    : detectable
    ? { bg: 'var(--accent-muted)', border: 'var(--accent-border)', color: 'var(--accent)' }
    : { bg: 'var(--bg-elevated)', border: 'var(--border)', color: 'var(--text-muted)' };
  return (
    <div
      onClick={onClick}
      title={`${id} — ${name}`}
      style={{
        padding: '6px 8px', borderRadius: 6, cursor: observed ? 'pointer' : 'default',
        background: style.bg, border: `1px solid ${selected ? 'var(--text-primary)' : style.border}`,
        boxShadow: selected ? '0 0 0 1px var(--text-primary)' : 'none',
        transition: 'all 0.12s ease',
      }}
    >
      <div style={{ fontSize: 8.5, fontFamily: 'monospace', fontWeight: 700, color: style.color, marginBottom: 1 }}>
        {id}{observed ? ' ●' : ''}
      </div>
      <div style={{ fontSize: 9.5, color: observed ? 'var(--text-primary)' : 'var(--text-secondary)', lineHeight: 1.25,
        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
        {name}
      </div>
    </div>
  );
}

export default function AtlasMatrix() {
  const { data: systems } = useSystems();
  const [selectedSystemId, setSelectedSystemId] = useState('');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  const effectiveId = selectedSystemId || (systems?.[0]?.id ?? '');
  const { data: matrix, loading: matrixLoading } = useAtlasMatrix();
  const { data: coverage } = useAtlasCoverage(effectiveId || '__skip__');

  const observedIds = new Set(coverage?.techniques.map(t => t.id) ?? []);
  const techById: Record<string, AtlasCoverageTechnique> = {};
  (coverage?.techniques ?? []).forEach(t => { techById[t.id] = t; });

  const selectedEvidence = selectedTech ? techById[selectedTech] : null;

  return (
    <PageShell
      title="MITRE ATLAS"
      subtitle={matrix ? `Adversarial threat coverage · ATLAS v${matrix.atlas_version}` : 'Adversarial threat coverage for AI systems'}
      actions={
        systems && systems.length > 0 ? (
          <div style={{ position: 'relative' }}>
            <select value={effectiveId} onChange={e => { setSelectedSystemId(e.target.value); setSelectedTech(null); }}
              style={{ appearance: 'none', padding: '7px 28px 7px 10px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)', cursor: 'pointer', outline: 'none' }}>
              {systems.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <ChevronDown size={12} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          </div>
        ) : null
      }
    >
      {/* Summary band */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 18 }}>
        {[
          { label: 'Tactics observed', value: coverage ? `${coverage.observed_tactic_count}/${coverage.total_tactic_count}` : '—', color: 'var(--danger)', icon: Crosshair },
          { label: 'Techniques observed', value: coverage?.observed_technique_count ?? '—', color: 'var(--orange)', icon: ShieldAlert },
          { label: 'Detectable techniques', value: matrix ? `${matrix.detectable_technique_count}/${matrix.total_technique_count}` : '—', color: 'var(--accent)', icon: FileWarning },
          { label: 'ATLAS version', value: matrix?.atlas_version ?? '—', color: 'var(--text-secondary)', icon: Info },
        ].map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Icon size={13} style={{ color: c.color }} />
                <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>{c.label}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: c.color, letterSpacing: '-0.5px' }}>{c.value}</div>
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: 12 }}><Legend /></div>

      {/* The matrix: tactics as columns */}
      {matrixLoading ? (
        <div style={{ height: 400, borderRadius: 12, background: 'var(--bg-elevated)', animation: 'shimmer 1.4s infinite', backgroundSize: '200% 100%' }} />
      ) : matrix ? (
        <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg-card)', padding: 12 }}>
          <div style={{ display: 'flex', gap: 8, minWidth: 'min-content' }}>
            {matrix.tactics.map((tac: AtlasMatrixTactic) => {
              const observedHere = coverage?.tactics.find(t => t.id === tac.id)?.observed ?? false;
              return (
                <div key={tac.id} style={{ width: 150, flexShrink: 0 }}>
                  {/* tactic header */}
                  <div style={{
                    padding: '8px 8px', borderRadius: 7, marginBottom: 8,
                    background: observedHere ? 'var(--danger-muted)' : 'var(--bg-elevated)',
                    border: `1px solid ${observedHere ? 'var(--danger-border)' : 'var(--border)'}`,
                  }}>
                    <div style={{ fontSize: 8, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{tac.id}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: observedHere ? 'var(--danger)' : 'var(--text-primary)', lineHeight: 1.2 }}>{tac.name}</div>
                    <div style={{ fontSize: 8.5, color: 'var(--text-muted)', marginTop: 2 }}>{tac.techniques.length} techniques</div>
                  </div>
                  {/* technique cells */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {tac.techniques.map(t => (
                      <TechCell
                        key={t.id + tac.id}
                        id={t.id} name={t.name} detectable={t.detectable}
                        observed={observedIds.has(t.id)}
                        selected={selectedTech === t.id}
                        onClick={observedIds.has(t.id) ? () => setSelectedTech(selectedTech === t.id ? null : t.id) : undefined}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>ATLAS matrix unavailable.</div>
      )}

      {/* Evidence drawer for a selected observed technique */}
      {selectedEvidence && (
        <div style={{ marginTop: 16, borderRadius: 12, border: '1px solid var(--danger-border)', background: 'var(--bg-card)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: 'var(--danger-muted)', borderBottom: '1px solid var(--danger-border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldAlert size={15} style={{ color: 'var(--danger)' }} />
            <div>
              <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: 'var(--danger)' }}>{selectedEvidence.id}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginLeft: 8 }}>{selectedEvidence.name}</span>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)' }}>{selectedEvidence.evidence_count} evidence item(s)</span>
          </div>
          <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {selectedEvidence.evidence.map(ev => (
              <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                {ev.kind === 'attack_path' ? <Route size={12} style={{ color: 'var(--purple)', flexShrink: 0 }} /> : <FileWarning size={12} style={{ color: 'var(--orange)', flexShrink: 0 }} />}
                <span style={{ fontSize: 11, color: 'var(--text-primary)', flex: 1 }}>{ev.title}</span>
                <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{ev.type}</span>
                <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 4,
                  background: `color-mix(in srgb, ${sevColor[ev.severity] ?? 'var(--text-muted)'} 15%, transparent)`,
                  color: sevColor[ev.severity] ?? 'var(--text-muted)' }}>{ev.severity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </PageShell>
  );
}
