import { GitBranch, ShieldCheck, ShieldAlert, Package, AlertTriangle, Crosshair } from 'lucide-react';
import PageShell from '../components/layout/PageShell';
import Badge from '../components/shared/Badge';
import { useSupplyChainModels, useSupplyChainFindings } from '../api/hooks';

const sevColor: Record<string, string> = {
  critical: 'var(--danger)', high: 'var(--orange)', medium: 'var(--warning)', low: 'var(--cyan)',
};

export default function SupplyChain() {
  const { data: models, loading } = useSupplyChainModels();
  const { data: findings } = useSupplyChainFindings();

  const list = models ?? [];
  const scFindings = findings ?? [];

  const verified = list.filter(m => m.has_digest).length;
  const approved = list.filter(m => m.approval_status === 'approved').length;

  return (
    <PageShell
      title="Supply Chain"
      subtitle={loading ? 'Loading…' : `${list.length} model artifact${list.length !== 1 ? 's' : ''} · ${scFindings.length} finding${scFindings.length !== 1 ? 's' : ''} (live)`}
    >
      {/* Summary */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Model Artifacts', value: list.length, color: 'var(--accent)', icon: Package },
          { label: 'Digest Verified', value: verified, color: 'var(--success)', icon: ShieldCheck },
          { label: 'Approved', value: approved, color: 'var(--cyan)', icon: ShieldCheck },
          { label: 'Open Findings', value: scFindings.length, color: scFindings.length > 0 ? 'var(--danger)' : 'var(--text-muted)', icon: ShieldAlert },
        ].map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-1.5 mb-1.5"><Icon size={12} style={{ color: c.color }} /><span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{c.label}</span></div>
              <div className="text-2xl font-bold" style={{ color: c.color, letterSpacing: '-0.5px' }}>{c.value}</div>
            </div>
          );
        })}
      </div>

      {/* Models table */}
      <div className="flex items-center gap-2 mb-3">
        <GitBranch size={14} style={{ color: 'var(--accent)' }} />
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Model Artifacts</h2>
      </div>
      {!loading && list.length === 0 ? (
        <div className="rounded-xl py-10 text-center text-xs mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>No model artifacts discovered.</div>
      ) : (
        <div className="rounded-xl overflow-hidden mb-6" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
                {['Model', 'Type', 'Provider', 'Region', 'Digest', 'Approval', 'Last Eval'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((m, i) => (
                <tr key={m.id} className="transition-colors"
                  style={{ borderBottom: i < list.length - 1 ? '1px solid var(--border-muted)' : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td className="px-4 py-3">
                    <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{m.display_name}</div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{m.entity_type}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{m.provider ?? '—'}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{m.region ?? '—'}</td>
                  <td className="px-4 py-3">
                    {m.has_digest
                      ? <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{ background: 'var(--success-muted)', color: 'var(--success)', border: '1px solid var(--success-border)' }}>verified</span>
                      : <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{ background: 'var(--danger-muted)', color: 'var(--danger)', border: '1px solid var(--danger-border)' }}>none</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{
                      background: m.approval_status === 'approved' ? 'var(--success-muted)' : 'var(--warning-muted)',
                      color: m.approval_status === 'approved' ? 'var(--success)' : 'var(--warning)',
                      border: `1px solid ${m.approval_status === 'approved' ? 'var(--success-border)' : 'var(--warning-border)'}`,
                    }}>{m.approval_status ?? 'unknown'}</span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{m.evaluation_date ? new Date(m.evaluation_date).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Supply chain findings */}
      {scFindings.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} style={{ color: 'var(--danger)' }} />
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Supply Chain Findings</h2>
          </div>
          <div className="space-y-2">
            {scFindings.map(f => (
              <div key={f.id} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: sevColor[f.severity] ?? 'var(--text-muted)', flexShrink: 0 }} />
                <span className="text-xs flex-1" style={{ color: 'var(--text-primary)' }}>{f.title}</span>
                {f.atlas_technique && (
                  <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded mono" style={{ background: 'var(--purple-muted)', color: 'var(--purple)', border: '1px solid var(--purple-border)' }}>
                    <Crosshair size={9} />{f.atlas_technique}
                  </span>
                )}
                {f.owasp_llm_id && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded mono" style={{ background: 'var(--orange-muted)', color: 'var(--orange)', border: '1px solid var(--orange-border)' }}>{f.owasp_llm_id}</span>
                )}
                <Badge label={f.severity.charAt(0).toUpperCase() + f.severity.slice(1)} size="sm" />
              </div>
            ))}
          </div>
        </>
      )}
    </PageShell>
  );
}
