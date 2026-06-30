import { Sun, Moon, CheckCircle2, Clock, Zap } from 'lucide-react';
import PageShell from '../components/layout/PageShell';
import { useTheme } from '../context/ThemeContext';
import { roadmapPhases } from '../data/mock';

function ThemeOption({ value, current, label, icon: Icon, onSelect }: {
  value: 'dark' | 'light'; current: string; label: string; icon: any; onSelect: () => void;
}) {
  const active = current === value;
  return (
    <button onClick={onSelect}
      className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all w-28"
      style={{
        background: active ? 'var(--accent-muted)' : 'var(--bg-elevated)',
        border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
      }}>
      <Icon size={20} style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }} />
      <span className="text-xs font-medium" style={{ color: active ? 'var(--accent)' : 'var(--text-secondary)' }}>{label}</span>
      {active && <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />}
    </button>
  );
}

const phaseStatus: Record<string, { icon: any; color: string; bg: string; border: string }> = {
  upcoming: { icon: Clock,         color: 'var(--text-muted)',   bg: 'var(--bg-elevated)',  border: 'var(--border)'        },
  current:  { icon: Zap,           color: 'var(--accent)',       bg: 'var(--accent-muted)', border: 'var(--accent-border)' },
  future:   { icon: CheckCircle2,  color: 'var(--text-muted)',   bg: 'var(--bg-elevated)',  border: 'var(--border)'        },
};

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <PageShell title="Settings" subtitle="Appearance, organization, and roadmap">
      <div className="max-w-3xl space-y-8">

        {/* Appearance */}
        <section>
          <h2 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Appearance</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>Choose how AIBOM looks to you. Saved to your browser.</p>
          <div className="flex items-center gap-3">
            <ThemeOption value="dark"  current={theme} label="Dark"  icon={Moon}    onSelect={() => setTheme('dark')} />
            <ThemeOption value="light" current={theme} label="Light" icon={Sun}     onSelect={() => setTheme('light')} />
          </div>
        </section>

        {/* Organization */}
        <section>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Organization</h2>
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
            {[
              { label: 'Organization Name', value: 'Acme Corporation' },
              { label: 'Environment',       value: 'Production'       },
              { label: 'Region',            value: 'ap-south-1'       },
              { label: 'Plan',              value: 'Enterprise Pilot'  },
            ].map((row, i, arr) => (
              <div key={row.label}
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border-muted)' : 'none' }}>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{row.label}</span>
                <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Next Phase Roadmap */}
        <section>
          <h2 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Next Phase — Backend Deployment</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
            The frontend is fully operational with mock data. The following sprints will wire up the real backend.
          </p>

          <div className="space-y-3">
            {roadmapPhases.map(phase => {
              const s = phaseStatus[phase.status];
              const Icon = s.icon;
              return (
                <div key={phase.sprint} className="rounded-xl p-4"
                  style={{ background: s.bg, border: `1.5px solid ${s.border}` }}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: s.color + '15', border: `1px solid ${s.color}30` }}>
                      <Icon size={14} style={{ color: s.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold mono" style={{ color: s.color }}>Sprint {phase.sprint}</span>
                        <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{phase.title}</span>
                        <span className="ml-auto text-[10px]" style={{ color: 'var(--text-muted)' }}>{phase.week}</span>
                      </div>
                      <ul className="space-y-0.5">
                        {phase.items.map(item => (
                          <li key={item} className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                            <span className="w-1 h-1 rounded-full shrink-0" style={{ background: 'var(--border-strong)' }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Version */}
        <section className="pt-2" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>AIBOM Platform</span>
            <span>·</span>
            <span className="mono">v0.8.0-frontend</span>
            <span>·</span>
            <span>Sprint S8 — UI</span>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
