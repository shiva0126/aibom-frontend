import { GitBranch, Settings, Package, FileCode, UploadCloud, Server, CheckCircle2, XCircle, ArrowRight, Info } from 'lucide-react';
import PageShell from '../components/layout/PageShell';
import { supplyChainSteps, supplyChainChecks } from '../data/mock';

const stepIcons = [GitBranch, Settings, Package, FileCode, UploadCloud, Server];

export default function SupplyChain() {
  return (
    <PageShell
      title="Supply Chain"
      subtitle="Model provenance, artifact attestation, and deployment pipeline"
    >
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Models Tracked',       value: 246, sub: 'across all systems'       },
          { label: 'Provenance Verified',   value: 198, sub: '81% coverage'             },
          { label: 'Policy Violations',     value: 12,  sub: '3 critical'               },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="text-2xl font-bold mb-0.5" style={{ color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{s.value}</div>
            <div className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
            <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Full pipeline card */}
      <div className="rounded-xl p-5 mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 mb-5">
          <Info size={14} style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Fraud Detection Model Pipeline</span>
          <span className="text-xs px-2 py-0.5 rounded-full ml-auto" style={{ background: 'var(--danger-muted)', color: 'var(--danger)', border: '1px solid var(--danger-border)' }}>
            1 Failure
          </span>
        </div>

        {/* Pipeline horizontal */}
        <div className="flex items-end gap-3 mb-6">
          {supplyChainSteps.map((step, i) => {
            const Icon = stepIcons[i];
            const fail = step.status === 'fail';
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: fail ? 'var(--danger-muted)' : 'var(--accent-muted)',
                      border: `1px solid ${fail ? 'var(--danger-border)' : 'var(--accent-border)'}`,
                    }}>
                    <Icon size={20} style={{ color: fail ? 'var(--danger)' : 'var(--accent)' }} />
                  </div>
                  <div className="text-center">
                    <div className="text-[11px] font-medium" style={{ color: 'var(--text-primary)' }}>{step.label}</div>
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{step.sub}</div>
                  </div>
                  {fail
                    ? <XCircle size={16} style={{ color: 'var(--danger)' }} />
                    : <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
                  }
                </div>
                {i < supplyChainSteps.length - 1 && (
                  <ArrowRight size={16} className="mb-8" style={{ color: 'var(--border-strong)' }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Checks grid */}
        <div style={{ borderTop: '1px solid var(--border)' }} className="pt-4">
          <div className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>Attestation & Checks</div>
          <div className="grid grid-cols-6 gap-3">
            {supplyChainChecks.map(c => (
              <div key={c.label}
                className="rounded-lg p-3 flex flex-col items-center gap-1.5"
                style={{
                  background: c.status === 'Failed' ? 'var(--danger-muted)' : 'var(--success-muted)',
                  border: `1px solid ${c.status === 'Failed' ? 'var(--danger-border)' : 'var(--success-border)'}`,
                }}>
                {c.status === 'Passed'
                  ? <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
                  : <XCircle size={16} style={{ color: 'var(--danger)' }} />
                }
                <span className="text-[10px] font-medium text-center" style={{ color: c.status === 'Failed' ? 'var(--danger)' : 'var(--success)' }}>{c.label}</span>
                <span className="text-[10px]" style={{ color: c.status === 'Failed' ? 'var(--danger)' : 'var(--success)' }}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
