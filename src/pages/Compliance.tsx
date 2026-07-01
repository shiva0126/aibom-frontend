import { useState } from 'react';
import {
  Scale, CheckCircle2, XCircle, Clock, AlertTriangle,
  ShieldCheck, ChevronDown, Info,
} from 'lucide-react';
import PageShell from '../components/layout/PageShell';
import { useSystems, useEuAiAct, useNistRmf } from '../api/hooks';
import type { EuAiActRequirement, NistRmfFunctionDetail } from '../api/client';

/* ─── Ring Score ──────────────────────────────────────────── */
function RingScore({ score, size = 140 }: { score: number; size?: number }) {
  const stroke = 10;
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * Math.min(score / 100, 1);
  const color = score >= 75 ? 'var(--success)' : score >= 45 ? 'var(--warning)' : 'var(--danger)';
  const label = score >= 75 ? 'Compliant' : score >= 45 ? 'Partial' : 'At Risk';
  const glow = score >= 75 ? 'rgba(30,199,106,0.25)' : score >= 45 ? 'rgba(244,162,30,0.25)' : 'rgba(240,61,61,0.25)';

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <filter id="ring-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* track */}
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        {/* progress */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          filter="url(#ring-glow)"
          style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      {/* inner glow */}
      <div style={{
        position: 'absolute',
        inset: stroke + r / 2,
        borderRadius: '50%',
        background: glow,
        filter: 'blur(8px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-1.5px', lineHeight: 1 }}>
          {Math.round(score)}%
        </span>
        <span style={{ fontSize: 11, color, fontWeight: 700, marginTop: 3, letterSpacing: '0.02em' }}>{label}</span>
      </div>
    </div>
  );
}

/* ─── Requirement card ────────────────────────────────────── */
type ReqStatus = 'satisfied' | 'partial' | 'gap';

function ReqCard({ req, status }: { req: EuAiActRequirement; status: ReqStatus }) {
  const cfg = {
    satisfied: { icon: CheckCircle2, color: 'var(--success)', bg: 'var(--success-muted)', border: 'var(--success-border)', label: 'Met' },
    partial:   { icon: Clock,        color: 'var(--warning)', bg: 'var(--warning-muted)', border: 'var(--warning-border)', label: 'Partial' },
    gap:       { icon: XCircle,      color: 'var(--danger)',  bg: 'var(--danger-muted)',  border: 'var(--danger-border)',  label: 'Gap' },
  }[status];

  const Icon = cfg.icon;

  return (
    <div style={{
      padding: '12px 14px',
      borderRadius: 10,
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
    }}>
      <Icon size={14} style={{ color: cfg.color, flexShrink: 0, marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, fontFamily: 'monospace' }}>{req.id}</span>
          <span style={{ fontSize: 9, color: cfg.color, opacity: 0.8 }}>{req.article}</span>
          <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, color: cfg.color,
            background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: 3 }}>
            {cfg.label}
          </span>
        </div>
        <div style={{ fontSize: 11, color: cfg.color, opacity: 0.85, lineHeight: 1.4 }}>{req.requirement}</div>
      </div>
    </div>
  );
}

/* ─── NIST Function Card ──────────────────────────────────── */
const nistColors: Record<string, { color: string; muted: string; border: string }> = {
  SATISFACTORY:    { color: 'var(--success)', muted: 'var(--success-muted)', border: 'var(--success-border)' },
  RISK_IDENTIFIED: { color: 'var(--danger)',  muted: 'var(--danger-muted)',  border: 'var(--danger-border)'  },
  INCOMPLETE:      { color: 'var(--warning)', muted: 'var(--warning-muted)', border: 'var(--warning-border)' },
};

const nistGradients: Record<string, string> = {
  GOVERN:  'linear-gradient(135deg, rgba(91,127,255,0.12) 0%, rgba(91,127,255,0.04) 100%)',
  MAP:     'linear-gradient(135deg, rgba(169,124,248,0.12) 0%, rgba(169,124,248,0.04) 100%)',
  MEASURE: 'linear-gradient(135deg, rgba(29,212,244,0.12) 0%, rgba(29,212,244,0.04) 100%)',
  MANAGE:  'linear-gradient(135deg, rgba(30,199,106,0.12) 0%, rgba(30,199,106,0.04) 100%)',
};

const nistAccents: Record<string, string> = {
  GOVERN:  'var(--accent)',
  MAP:     'var(--purple)',
  MEASURE: 'var(--cyan)',
  MANAGE:  'var(--success)',
};

function NistCard({ fn, detail }: { fn: string; detail: NistRmfFunctionDetail }) {
  const sc = nistColors[detail.status] ?? nistColors.SATISFACTORY;
  const accent = nistAccents[fn] ?? 'var(--accent)';
  const evidence = detail.evidence as Record<string, unknown>;

  const metricPairs: [string, string][] = [];
  if (fn === 'GOVERN' && typeof evidence.policy_approval_findings === 'number') {
    metricPairs.push(['Policy violations', String(evidence.policy_approval_findings)]);
  }
  if (fn === 'MAP') {
    if (typeof evidence.component_count === 'number') metricPairs.push(['Components', String(evidence.component_count)]);
    if (typeof evidence.completeness_score === 'number')
      metricPairs.push(['Completeness', `${Math.round((evidence.completeness_score as number) * 100)}%`]);
  }
  if (fn === 'MEASURE') {
    const fc = evidence.finding_counts as Record<string, number> | undefined;
    if (fc) {
      metricPairs.push(['Critical', String(fc.critical ?? 0)]);
      metricPairs.push(['High', String(fc.high ?? 0)]);
    }
  }
  if (fn === 'MANAGE' && typeof evidence.stale_evidence_findings === 'number') {
    metricPairs.push(['Stale signals', String(evidence.stale_evidence_findings)]);
  }

  return (
    <div style={{
      borderRadius: 14,
      border: '1px solid var(--border)',
      background: nistGradients[fn],
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* header bar */}
      <div style={{
        padding: '14px 16px 12px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-elevated)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: `color-mix(in srgb, ${accent} 20%, transparent)`,
            border: `1px solid color-mix(in srgb, ${accent} 40%, transparent)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShieldCheck size={13} style={{ color: accent }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.05em' }}>{fn}</span>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
          background: sc.muted, color: sc.color, border: `1px solid ${sc.border}`,
        }}>
          {detail.status === 'SATISFACTORY' ? 'OK' : detail.status === 'RISK_IDENTIFIED' ? 'Risk' : 'Incomplete'}
        </span>
      </div>

      <div style={{ padding: '12px 16px', flex: 1 }}>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10 }}>
          {detail.description}
        </p>
        {metricPairs.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {metricPairs.map(([k, v]) => (
              <div key={k} style={{
                padding: '4px 8px', borderRadius: 6,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{k} </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Skeleton loader ─────────────────────────────────────── */
function Skeleton({ h = 80 }: { h?: number }) {
  return (
    <div style={{
      height: h, borderRadius: 10,
      background: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--bg-hover) 50%, var(--bg-elevated) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
    }} />
  );
}

/* ─── Main page ───────────────────────────────────────────── */
export default function Compliance() {
  const { data: systems } = useSystems();
  const [selectedId, setSelectedId] = useState('');

  const effectiveId = selectedId || (systems?.[0]?.id ?? '');
  const skip = !effectiveId;

  const { data: eu, loading: euLoading } = useEuAiAct(skip ? '__skip__' : effectiveId);
  const { data: nist, loading: nistLoading } = useNistRmf(skip ? '__skip__' : effectiveId);

  const loading = euLoading || nistLoading;

  const allReqs: { req: EuAiActRequirement; status: ReqStatus }[] = [
    ...(eu?.satisfied ?? []).map(r => ({ req: r, status: 'satisfied' as ReqStatus })),
    ...(eu?.partial ?? []).map(r => ({ req: r, status: 'partial' as ReqStatus })),
    ...(eu?.gaps ?? []).map(r => ({ req: r, status: 'gap' as ReqStatus })),
  ].sort((a, b) => {
    const n = (id: string) => parseInt(id.replace('AIA-', ''), 10);
    return n(a.req.id) - n(b.req.id);
  });

  const overallRiskColor = {
    CRITICAL: 'var(--danger)',
    HIGH: 'var(--orange)',
    MEDIUM: 'var(--warning)',
    LOW: 'var(--success)',
  }[nist?.overall_risk_level ?? 'LOW'] ?? 'var(--success)';

  return (
    <PageShell
      title="Compliance"
      subtitle="EU AI Act Article 11 · NIST AI RMF 1.0"
      actions={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {systems && systems.length > 0 && (
            <div style={{ position: 'relative' }}>
              <select
                value={effectiveId}
                onChange={e => setSelectedId(e.target.value)}
                style={{
                  appearance: 'none',
                  padding: '7px 28px 7px 10px',
                  borderRadius: 8, fontSize: 12, fontWeight: 500,
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  color: 'var(--text-primary)', cursor: 'pointer', outline: 'none',
                }}
              >
                {systems.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <ChevronDown size={12} style={{
                position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)', pointerEvents: 'none',
              }} />
            </div>
          )}
        </div>
      }
    >
      <style>{`
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>

      {!effectiveId ? (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
          No AI systems found. Ingest a system to run compliance checks.
        </div>
      ) : (
        <>
          {/* ── Score summary row ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
            {/* EU AI Act ring card */}
            <div style={{
              gridColumn: '1',
              padding: '20px 24px',
              borderRadius: 16,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
            }}>
              {loading ? (
                <div style={{ width: 140, height: 140, borderRadius: '50%', background: 'var(--bg-elevated)', animation: 'shimmer 1.4s infinite', backgroundSize: '200% 100%' }} />
              ) : (
                <RingScore score={eu?.compliance_score ?? 0} />
              )}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>EU AI Act</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Article 11 / Annex IV</div>
              </div>
            </div>

            {/* Stats */}
            {loading ? (
              <>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ padding: 20, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <Skeleton h={60} />
                  </div>
                ))}
              </>
            ) : (
              <>
                {[
                  {
                    label: 'Requirements Met',
                    value: eu?.satisfied.length ?? 0,
                    total: (eu?.satisfied.length ?? 0) + (eu?.partial.length ?? 0) + (eu?.gaps.length ?? 0),
                    color: 'var(--success)',
                    sub: 'Fully satisfied',
                  },
                  {
                    label: 'Partial Coverage',
                    value: eu?.partial.length ?? 0,
                    total: null,
                    color: 'var(--warning)',
                    sub: 'Needs evidence',
                  },
                  {
                    label: 'NIST Risk Level',
                    value: nist?.overall_risk_level ?? '—',
                    total: null,
                    color: overallRiskColor,
                    sub: 'AI RMF overall',
                  },
                ].map(c => (
                  <div key={c.label} style={{
                    padding: '20px 24px',
                    borderRadius: 16,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}>
                    <div style={{
                      fontSize: 32, fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1,
                      color: c.color, marginBottom: 6,
                    }}>
                      {c.value}
                      {c.total !== null && (
                        <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-muted)' }}> / {c.total}</span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{c.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.sub}</div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* ── EU AI Act requirements grid ── */}
          <div style={{
            borderRadius: 16, border: '1px solid var(--border)',
            background: 'var(--bg-card)', marginBottom: 24, overflow: 'hidden',
          }}>
            <div style={{
              padding: '14px 20px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-elevated)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <Scale size={15} style={{ color: 'var(--accent)' }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>EU AI Act — Article 11 Requirements</span>
              {eu && (
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                  {[
                    { label: `${eu.satisfied.length} Met`,     color: 'var(--success)', muted: 'var(--success-muted)', border: 'var(--success-border)' },
                    { label: `${eu.partial.length} Partial`,   color: 'var(--warning)', muted: 'var(--warning-muted)', border: 'var(--warning-border)' },
                    { label: `${eu.gaps.length} Gaps`,         color: 'var(--danger)',  muted: 'var(--danger-muted)',  border: 'var(--danger-border)'  },
                  ].map(s => (
                    <span key={s.label} style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 5,
                      background: s.muted, color: s.color, border: `1px solid ${s.border}`,
                    }}>{s.label}</span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ padding: 16 }}>
              {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} h={70} />)}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {allReqs.map(({ req, status }) => (
                    <ReqCard key={req.id} req={req} status={status} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── NIST AI RMF ── */}
          <div style={{
            borderRadius: 16, border: '1px solid var(--border)',
            background: 'var(--bg-card)', marginBottom: 24, overflow: 'hidden',
          }}>
            <div style={{
              padding: '14px 20px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-elevated)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <ShieldCheck size={15} style={{ color: 'var(--purple)' }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>NIST AI RMF 1.0 — Core Functions</span>
              {nist && (
                <span style={{
                  marginLeft: 'auto', fontSize: 10, fontWeight: 700,
                  padding: '2px 8px', borderRadius: 5,
                  background: 'var(--accent-muted)', color: overallRiskColor,
                  border: `1px solid var(--accent-border)`,
                }}>
                  Overall: {nist.overall_risk_level}
                </span>
              )}
            </div>

            <div style={{ padding: 16 }}>
              {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  {[0, 1, 2, 3].map(i => <Skeleton key={i} h={180} />)}
                </div>
              ) : nist ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  {(Object.entries(nist.functions) as [string, NistRmfFunctionDetail][]).map(([fn, detail]) => (
                    <NistCard key={fn} fn={fn} detail={detail} />
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {/* ── Notes ── */}
          {eu?.notes && eu.notes.length > 0 && (
            <div style={{
              borderRadius: 12, border: '1px solid var(--border)',
              background: 'var(--bg-card)', padding: '14px 18px',
              display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <Info size={14} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Notes</div>
                {eu.notes.map((n, i) => (
                  <div key={i} style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 2 }}>
                    • {n}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Critical findings alert ── */}
          {(eu?.critical_findings?.length ?? 0) > 0 && (
            <div style={{
              marginTop: 16, borderRadius: 12,
              border: '1px solid var(--danger-border)',
              background: 'var(--danger-muted)', padding: '14px 18px',
              display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <AlertTriangle size={14} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--danger)', marginBottom: 6 }}>
                  {eu!.critical_findings.length} Critical Finding{eu!.critical_findings.length > 1 ? 's' : ''} Blocking Compliance
                </div>
                {eu!.critical_findings.map(f => (
                  <div key={f.id} style={{ fontSize: 11, color: 'var(--danger)', opacity: 0.85, lineHeight: 1.5 }}>
                    • {f.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </PageShell>
  );
}
