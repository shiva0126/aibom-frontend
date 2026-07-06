import { Server, Radio, AlertTriangle, ShieldAlert, Route, CircleCheck, type LucideIcon } from 'lucide-react';
import { useStats } from '../../api/hooks';

interface Stat {
  label: string;
  value: number | string;
  icon: LucideIcon;
  /** semantic color only when the value carries risk meaning */
  tone?: 'danger' | 'warning' | 'success' | 'neutral';
  active?: boolean; // value>0 lights the tone
}

export default function StatsRow() {
  const { data: s } = useStats();

  const stats: Stat[] = [
    { label: 'AI Systems',    value: s?.ai_systems ?? '—',         icon: Server },
    { label: 'Observations',  value: s?.total_observations ?? '—', icon: Radio },
    { label: 'Open Findings', value: s?.open_findings ?? '—',      icon: AlertTriangle, tone: 'warning', active: (s?.open_findings ?? 0) > 0 },
    { label: 'Critical',      value: s?.critical_findings ?? '—',  icon: ShieldAlert,   tone: 'danger',  active: (s?.critical_findings ?? 0) > 0 },
    { label: 'Attack Paths',  value: s?.attack_paths ?? '—',       icon: Route,         tone: 'danger',  active: (s?.attack_paths ?? 0) > 0 },
    { label: 'Platform',      value: s ? 'Live' : '—',             icon: CircleCheck,   tone: 'success', active: !!s },
  ];

  const toneColor = (t?: Stat['tone']) =>
    t === 'danger' ? 'var(--danger)' : t === 'warning' ? 'var(--warning)' : t === 'success' ? 'var(--success)' : 'var(--accent)';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 12 }}>
      {stats.map((st) => {
        const Icon = st.icon;
        const lit = st.active;
        const c = lit ? toneColor(st.tone) : 'var(--text-muted)';
        return (
          <div
            key={st.label}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12,
              padding: '15px 16px', transition: 'border-color 0.15s ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 8, marginBottom: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: lit ? `color-mix(in srgb, ${c} 12%, transparent)` : 'var(--bg-elevated)',
              border: `1px solid ${lit ? `color-mix(in srgb, ${c} 30%, transparent)` : 'var(--border)'}`,
            }}>
              <Icon size={15} style={{ color: c }} />
            </div>
            <div style={{
              fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1, marginBottom: 5,
              color: lit && st.tone !== 'success' ? c : 'var(--text-primary)',
            }}>
              {st.value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{st.label}</div>
          </div>
        );
      })}
    </div>
  );
}
