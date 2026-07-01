import { Cpu, Brain, Bot, Wrench, ShieldAlert, FileStack } from 'lucide-react';
import { overviewStats } from '../../data/mock';
import { useStats } from '../../api/hooks';

const icons  = [Cpu, Brain, Bot, Wrench, ShieldAlert, FileStack];
const colors = [
  { icon: 'var(--accent)',  glow: 'rgba(91,127,255,0.12)'  },
  { icon: 'var(--success)', glow: 'rgba(30,199,106,0.12)'  },
  { icon: 'var(--purple)',  glow: 'rgba(169,124,248,0.12)' },
  { icon: 'var(--cyan)',    glow: 'rgba(29,212,244,0.12)'  },
  { icon: 'var(--danger)',  glow: 'rgba(240,61,61,0.12)'   },
  { icon: 'var(--warning)', glow: 'rgba(244,162,30,0.12)'  },
];

export default function StatsRow() {
  const { data: live } = useStats();

  const stats = live
    ? [
        { label: 'AI Systems',       value: live.ai_systems,        delta: '',   trend: 'up',   icon: 'systems'   },
        { label: 'Observations',     value: live.total_observations, delta: '',   trend: 'up',   icon: 'models'    },
        { label: 'Open Findings',    value: live.open_findings,      delta: '',   trend: 'down', icon: 'findings'  },
        { label: 'Critical',         value: live.critical_findings,  delta: '',   trend: 'down', icon: 'findings'  },
        { label: 'Attack Paths',     value: live.attack_paths,       delta: '',   trend: 'down', icon: 'agents'    },
        { label: 'Live Platform',    value: 1,                       delta: '✓',  trend: 'up',   icon: 'snapshots' },
      ]
    : overviewStats;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 12 }}>
      {stats.map((s, i) => {
        const Icon  = icons[i];
        const color = colors[i];
        const isDown = s.trend === 'down';

        return (
          <div
            key={s.label}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '16px',
              cursor: 'default',
              transition: 'border-color 0.15s ease, transform 0.15s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            {/* Subtle top glow */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background: `linear-gradient(90deg, transparent, ${color.icon}40, transparent)`,
              }}
            />

            {/* Icon + delta row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: color.glow,
                  border: `1px solid ${color.icon}25`,
                }}
              >
                <Icon size={16} style={{ color: color.icon }} />
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: isDown ? 'var(--danger)' : 'var(--success)',
                  background: isDown ? 'var(--danger-muted)' : 'var(--success-muted)',
                  border: `1px solid ${isDown ? 'var(--danger-border)' : 'var(--success-border)'}`,
                  padding: '2px 6px',
                  borderRadius: 4,
                }}
              >
                ↑ {s.delta}
              </span>
            </div>

            {/* Value */}
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.5px',
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              {s.value}
            </div>

            {/* Label */}
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>
              {s.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
