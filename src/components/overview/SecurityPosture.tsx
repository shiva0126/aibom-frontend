import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../shared/Card';
import { useSystems, useGlobalCompliance, useFindings } from '../../api/hooks';

const sevMeta = [
  { key: 'critical', label: 'Critical', color: 'var(--danger)' },
  { key: 'high',     label: 'High',     color: 'var(--orange)' },
  { key: 'medium',   label: 'Medium',   color: 'var(--warning)' },
  { key: 'low',      label: 'Low',      color: 'var(--cyan)' },
];

export default function SecurityPosture() {
  const { data: systems } = useSystems();
  const firstId = systems?.[0]?.id ?? '__skip__';
  const { data: global } = useGlobalCompliance(firstId);
  const { data: findings } = useFindings();

  const score = global ? Math.round(global.global_score) : null;
  const scoreColor = score == null ? 'var(--text-muted)' : score >= 70 ? 'var(--success)' : score >= 45 ? 'var(--warning)' : 'var(--danger)';

  const counts: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 };
  (findings ?? []).forEach(f => { if (f.status === 'open' && f.severity in counts) counts[f.severity]++; });
  const totalFindings = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <Card padding={false}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>AI Security Posture</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Global compliance across 11 frameworks (live)</div>
        </div>
        <Link to="/compliance" style={{ fontSize: 11, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent)', textDecoration: 'none' }}>
          Details <ArrowUpRight size={12} />
        </Link>
      </div>

      <div style={{ padding: '18px 16px', display: 'flex', gap: 20, alignItems: 'center' }}>
        {/* Score ring */}
        <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
          <svg width={120} height={120} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={60} cy={60} r={50} fill="none" stroke="var(--border)" strokeWidth={9} />
            <circle cx={60} cy={60} r={50} fill="none" stroke={scoreColor} strokeWidth={9} strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 50 * ((score ?? 0) / 100)} ${2 * Math.PI * 50}`}
              style={{ transition: 'stroke-dasharray 0.8s ease' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-1px', lineHeight: 1 }}>{score ?? '—'}</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>/100</span>
          </div>
        </div>

        {/* Severity breakdown */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>
            {totalFindings} open finding{totalFindings !== 1 ? 's' : ''} by severity
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sevMeta.map(s => {
              const v = counts[s.key];
              const pct = totalFindings ? Math.round((v / totalFindings) * 100) : 0;
              return (
                <div key={s.key}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />{s.label}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>{v}</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 99, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: s.color, borderRadius: 99, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
