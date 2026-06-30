import { Link } from 'react-router-dom';
import { GitBranch, Settings, Package, FileCode, UploadCloud, Server, CheckCircle2, XCircle, ArrowUpRight, Info } from 'lucide-react';
import { supplyChainSteps, supplyChainChecks } from '../../data/mock';
import Card from '../shared/Card';

const stepIcons = [GitBranch, Settings, Package, FileCode, UploadCloud, Server];

export default function SupplyChainWidget() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Model Supply Chain</span>
          <Info size={13} style={{ color: 'var(--text-muted)' }} />
        </div>
        <Link to="/supply-chain" className="flex items-center gap-1 text-xs hover:underline" style={{ color: 'var(--accent)' }}>
          View <ArrowUpRight size={12} />
        </Link>
      </div>

      {/* Pipeline */}
      <div className="flex items-end gap-1.5 mb-4">
        {supplyChainSteps.map((step, i) => {
          const Icon = stepIcons[i];
          const fail = step.status === 'fail';
          return (
            <div key={i} className="flex items-center gap-1.5 shrink-0">
              <div className="flex flex-col items-center gap-1">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    background: fail ? 'var(--danger-muted)' : 'var(--bg-elevated)',
                    border: `1px solid ${fail ? 'var(--danger-border)' : 'var(--border)'}`,
                  }}>
                  <Icon size={15} style={{ color: fail ? 'var(--danger)' : 'var(--accent)' }} />
                </div>
                <span className="text-[9px] text-center leading-tight" style={{ color: 'var(--text-muted)', maxWidth: 56 }}>{step.label}</span>
                {fail
                  ? <XCircle size={12} style={{ color: 'var(--danger)' }} />
                  : <CheckCircle2 size={12} style={{ color: 'var(--success)' }} />
                }
              </div>
              {i < supplyChainSteps.length - 1 && (
                <div className="w-4 h-px mb-5 shrink-0" style={{ background: 'var(--border-strong)' }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Checks */}
      <div style={{ borderTop: '1px solid var(--border)' }} className="pt-3">
        <div className="text-[10px] mb-2 font-medium" style={{ color: 'var(--text-muted)' }}>Attestation & Checks</div>
        <div className="grid grid-cols-3 gap-y-2">
          {supplyChainChecks.map((c) => (
            <div key={c.label} className="flex flex-col items-center gap-0.5">
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{c.label}</span>
              <span className="text-[10px] font-semibold"
                style={{ color: c.status === 'Passed' ? 'var(--success)' : 'var(--danger)' }}>{c.status}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
