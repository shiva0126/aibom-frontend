import { Cloud, GitCompare, Boxes, Camera, ScanSearch, Route, type LucideIcon } from 'lucide-react';

interface Stage {
  key: string;
  label: string;
  icon: LucideIcon;
  value?: number | string | null;
  unit?: string;
}

/**
 * The AISPM evidence pipeline, left→right. Stages are real (ingest → normalise →
 * materialise → snapshot → scan → attack-paths); counts are passed from live data.
 */
export default function PipelineFlow({
  observations, entities, relationships, snapshots, findings, attackPaths,
}: {
  observations?: number | null;
  entities?: number | null;
  relationships?: number | null;
  snapshots?: number | null;
  findings?: number | null;
  attackPaths?: number | null;
}) {
  const stages: Stage[] = [
    { key: 'ingest',     label: 'Ingest',       icon: Cloud,      value: observations, unit: 'observations' },
    { key: 'normalise',  label: 'Normalise',    icon: GitCompare, value: entities,     unit: 'entities' },
    { key: 'materialise',label: 'Materialise',  icon: Boxes,      value: relationships,unit: 'relationships' },
    { key: 'snapshot',   label: 'Snapshot',     icon: Camera,     value: snapshots,    unit: 'versions' },
    { key: 'scan',       label: 'Finding Scan', icon: ScanSearch, value: findings,     unit: 'findings' },
    { key: 'paths',      label: 'Attack Paths', icon: Route,      value: attackPaths,  unit: 'paths' },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, overflowX: 'auto', paddingBottom: 4 }}>
      {stages.map((s, i) => {
        const Icon = s.icon;
        const last = i === stages.length - 1;
        return (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', flex: '1 1 0', minWidth: 128 }}>
            <div style={{
              flex: 1, borderRadius: 11, padding: '13px 14px',
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', gap: 8, minWidth: 118,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: 'var(--accent-muted)', border: '1px solid var(--accent-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={14} style={{ color: 'var(--accent)' }} />
                </div>
                <span style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 500 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>
                  {s.value == null
                    ? <span>—</span>
                    : <><span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>{s.value}</span> {s.unit}</>}
                </div>
              </div>
            </div>
            {!last && (
              <div style={{ flexShrink: 0, width: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
                  <path d="M1 6 H16" stroke="var(--border-strong)" strokeWidth="1.4" />
                  <path d="M15 2 L20 6 L15 10" fill="none" stroke="var(--border-strong)" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
