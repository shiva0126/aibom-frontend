type Variant =
  | 'critical' | 'high' | 'medium' | 'low'
  | 'success' | 'warning' | 'info' | 'neutral'
  | 'purple' | 'cyan';

const variants: Record<Variant, { bg: string; color: string; border: string }> = {
  critical: { bg: 'var(--danger-muted)',  color: 'var(--danger)',  border: 'var(--danger-border)'  },
  high:     { bg: 'var(--orange-muted)',  color: 'var(--orange)',  border: 'var(--orange-border)'  },
  medium:   { bg: 'var(--warning-muted)', color: 'var(--warning)', border: 'var(--warning-border)' },
  low:      { bg: 'var(--cyan-muted)',    color: 'var(--cyan)',    border: 'var(--cyan-border)'    },
  success:  { bg: 'var(--success-muted)', color: 'var(--success)', border: 'var(--success-border)' },
  warning:  { bg: 'var(--warning-muted)', color: 'var(--warning)', border: 'var(--warning-border)' },
  info:     { bg: 'var(--accent-muted)',  color: 'var(--accent)',  border: 'var(--accent-border)'  },
  neutral:  { bg: 'var(--bg-elevated)',   color: 'var(--text-secondary)', border: 'var(--border)' },
  purple:   { bg: 'var(--purple-muted)',  color: 'var(--purple)',  border: 'var(--purple-border)'  },
  cyan:     { bg: 'var(--cyan-muted)',    color: 'var(--cyan)',    border: 'var(--cyan-border)'    },
};

const severityMap: Record<string, Variant> = {
  Critical: 'critical',
  High:     'high',
  Medium:   'medium',
  Low:      'low',
};

const statusMap: Record<string, Variant> = {
  New:           'critical',
  'In Progress': 'info',
  Open:          'neutral',
  Resolved:      'success',
  Active:        'success',
  Warning:       'warning',
  Healthy:       'success',
  Critical:      'critical',
  Connected:     'success',
  Available:     'neutral',
  Stale:         'warning',
  Valid:         'success',
  Drifted:       'warning',
  Invalid:       'critical',
  Investigating: 'warning',
  Mitigated:     'success',
  'At Risk':     'high',
  Secure:        'success',
  Watch:         'warning',
  ok:            'success',
  warning:       'warning',
  critical:      'critical',
};

interface Props {
  label: string;
  variant?: Variant;
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
}

export default function Badge({ label, variant, size = 'md', dot }: Props) {
  const v = variant ?? severityMap[label] ?? statusMap[label] ?? 'neutral';
  const { bg, color, border } = variants[v];

  const fontSize = size === 'xs' ? 9 : size === 'sm' ? 10 : 11;
  const padding  = size === 'xs' ? '1px 5px' : size === 'sm' ? '2px 6px' : '3px 7px';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize,
        fontWeight: 600,
        padding,
        borderRadius: 5,
        background: bg,
        color,
        border: `1px solid ${border}`,
        whiteSpace: 'nowrap',
        letterSpacing: '0.01em',
        lineHeight: 1.4,
      }}
    >
      {dot && (
        <span
          style={{
            width: size === 'xs' ? 4 : 5,
            height: size === 'xs' ? 4 : 5,
            borderRadius: '50%',
            background: 'currentColor',
            flexShrink: 0,
          }}
        />
      )}
      {label}
    </span>
  );
}
