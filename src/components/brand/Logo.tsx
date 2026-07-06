/**
 * AISPM brand mark — a geometric horse (knight) head.
 * The knight = strategy & defense; single accent, no decoration.
 */

const HORSE_PATH =
  'M30.5 6.2 L26.8 13 L22.4 10.6 C18 12.4 15 14.2 13.4 16 C11 18.8 9.6 24 9.4 31 ' +
  'L12.4 43 L20.4 43 L22 30.5 C22.4 29 23.4 28 25 27.4 L30 25.6 L41.5 31 L44.2 26 ' +
  'L36 16.4 C34.6 13 33 9.4 30.5 6.2 Z';

export function HorseMark({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d={HORSE_PATH} fill={color} />
    </svg>
  );
}

/** The horse mark inside the rounded gradient badge. */
export function LogoBadge({ size = 32, radius }: { size?: number; radius?: number }) {
  const r = radius ?? Math.round(size * 0.3);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: r,
        background: 'linear-gradient(150deg, var(--accent-hover) 0%, var(--accent) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 14px var(--accent-glow), inset 0 0 0 1px rgba(255,255,255,0.08)',
        flexShrink: 0,
      }}
    >
      <HorseMark size={Math.round(size * 0.62)} />
    </div>
  );
}

/** Full brand lockup: badge + AISPM wordmark + subtitle. */
export function Logo({ size = 32, subtitle = 'AI Security Posture Mgmt' }: { size?: number; subtitle?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <LogoBadge size={size} />
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px', lineHeight: 1 }}>
          AISPM
        </div>
        <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 3, fontWeight: 500 }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
}
