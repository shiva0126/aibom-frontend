import { ChevronRight, Route, ArrowRight } from 'lucide-react';
import PageShell from '../components/layout/PageShell';
import Badge from '../components/shared/Badge';
import { attackPaths } from '../data/mock';

const hopColor = (n: number) => n >= 5 ? 'var(--danger)' : n >= 4 ? 'var(--orange)' : 'var(--warning)';

export default function AttackPaths() {
  return (
    <PageShell
      title="Attack Paths"
      subtitle="Multi-hop exposure chains from entry points to sensitive assets"
    >
      <div className="space-y-3">
        {attackPaths.map(p => (
          <div key={p.id}
            className="rounded-xl p-4 cursor-pointer transition-all"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'var(--danger-muted)', border: '1px solid var(--danger-border)' }}>
                  <Route size={15} style={{ color: 'var(--danger)' }} />
                </div>
                <div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{p.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {p.systems.join(', ')} · <span className="mono">{p.id}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-xs px-2.5 py-1 rounded-lg font-semibold"
                  style={{ background: hopColor(p.hops) + '15', color: hopColor(p.hops), border: `1px solid ${hopColor(p.hops)}30` }}>
                  {p.hops} hops
                </div>
                <Badge label={p.severity} />
                <Badge label={p.status} />
                <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>

            {/* Path visualization */}
            <div className="flex items-center gap-1 flex-wrap">
              {p.path.map((node, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className="text-[11px] px-2.5 py-1 rounded-md font-medium"
                    style={{
                      background: i === p.path.length - 1 ? 'var(--danger-muted)' : 'var(--bg-elevated)',
                      color: i === p.path.length - 1 ? 'var(--danger)' : 'var(--text-secondary)',
                      border: `1px solid ${i === p.path.length - 1 ? 'var(--danger-border)' : 'var(--border)'}`,
                    }}>
                    {node}
                  </div>
                  {i < p.path.length - 1 && (
                    <ArrowRight size={11} style={{ color: 'var(--text-muted)' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
