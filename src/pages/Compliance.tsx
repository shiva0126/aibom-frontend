import { useState } from 'react';
import {
  CheckCircle2, XCircle, Clock,
  ShieldCheck, ChevronDown, Info, Globe,
} from 'lucide-react';
import PageShell from '../components/layout/PageShell';
import { useSystems, useGlobalCompliance, useEuAiAct, useNistRmf } from '../api/hooks';
import type { FrameworkResult, ComplianceRequirement, NistRmfFunctionDetail } from '../api/client';

/* ──────────────────────────────────────────────────────────────
   Country flags (emoji — works cross-platform)
────────────────────────────────────────────────────────────── */
const FLAGS: Record<string, string> = {
  'india-dpdpa':        '🇮🇳',
  'us-eo-14110':        '🇺🇸',
  'uk-ai-safety':       '🇬🇧',
  'canada-aida':        '🇨🇦',
  'china-cac':          '🇨🇳',
  'brazil-lgpd':        '🇧🇷',
  'singapore-maigf':   '🇸🇬',
  'australia-ai-ethics':'🇦🇺',
  'japan-aiga':         '🇯🇵',
  'uae-ai':             '🇦🇪',
  'iso-42001':          '🌐',
  'eu-ai-act':          '🇪🇺',
};

const REGIONS = ['All', 'Europe', 'Americas', 'Asia-Pacific', 'Middle East', 'Global Standards'];

/* ──────────────────────────────────────────────────────────────
   Mini ring (for country grid cards)
────────────────────────────────────────────────────────────── */
function MiniRing({ score, size = 44 }: { score: number; size?: number }) {
  const stroke = 5;
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * Math.min(score / 100, 1);
  const color = score >= 70 ? '#1ec76a' : score >= 45 ? '#f4a21e' : '#f03d3d';
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────
   Big ring (for detail panel)
────────────────────────────────────────────────────────────── */
function BigRing({ score, size = 130 }: { score: number; size?: number }) {
  const stroke = 10;
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * Math.min(score / 100, 1);
  const color = score >= 70 ? 'var(--success)' : score >= 45 ? 'var(--warning)' : 'var(--danger)';
  const label = score >= 70 ? 'Compliant' : score >= 45 ? 'Partial' : 'At Risk';
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-1.5px', lineHeight: 1 }}>
          {Math.round(score)}%
        </span>
        <span style={{ fontSize: 10, color, fontWeight: 700, marginTop: 3 }}>{label}</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Requirement card
────────────────────────────────────────────────────────────── */
type ReqStatus = 'satisfied' | 'partial' | 'gap';

const REQ_CFG = {
  satisfied: { Icon: CheckCircle2, color: 'var(--success)', bg: 'var(--success-muted)', border: 'var(--success-border)', label: 'Met' },
  partial:   { Icon: Clock,        color: 'var(--warning)', bg: 'var(--warning-muted)', border: 'var(--warning-border)', label: 'Partial' },
  gap:       { Icon: XCircle,      color: 'var(--danger)',  bg: 'var(--danger-muted)',  border: 'var(--danger-border)',  label: 'Gap' },
};

function ReqCard({ req, status }: { req: ComplianceRequirement; status: ReqStatus }) {
  const c = REQ_CFG[status];
  const Icon = c.Icon;
  return (
    <div style={{
      padding: '10px 12px', borderRadius: 10,
      background: c.bg, border: `1px solid ${c.border}`,
      display: 'flex', gap: 8, alignItems: 'flex-start',
    }}>
      <Icon size={13} style={{ color: c.color, flexShrink: 0, marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: c.color, fontFamily: 'monospace' }}>{req.id}</span>
          <span style={{ fontSize: 9, color: c.color, opacity: 0.7, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{req.article}</span>
          <span style={{
            fontSize: 8, fontWeight: 700, padding: '1px 4px', borderRadius: 3,
            background: 'rgba(255,255,255,0.1)', color: c.color, flexShrink: 0,
          }}>{c.label}</span>
        </div>
        <div style={{ fontSize: 10, color: c.color, opacity: 0.85, lineHeight: 1.4 }}>{req.requirement}</div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Country card (grid)
────────────────────────────────────────────────────────────── */
function CountryCard({
  fw, selected, onClick,
}: {
  fw: FrameworkResult;
  selected: boolean;
  onClick: () => void;
}) {
  const flag = FLAGS[fw.framework_id] ?? '🌍';
  const scoreColor = fw.compliance_score >= 70 ? 'var(--success)' : fw.compliance_score >= 45 ? 'var(--warning)' : 'var(--danger)';
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: 14, border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
        background: selected ? 'var(--bg-selected)' : 'var(--bg-card)',
        padding: '14px 16px', cursor: 'pointer',
        transition: 'all 0.15s ease',
        boxShadow: selected ? '0 0 0 1px var(--accent-border), 0 4px 16px var(--accent-glow)' : 'none',
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{flag}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {fw.name}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{fw.country}</div>
        </div>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <MiniRing score={fw.compliance_score} />
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 9, fontWeight: 800, color: scoreColor }}>
              {Math.round(fw.compliance_score)}%
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 5 }}>
        {[
          { count: fw.satisfied_count, color: 'var(--success)', label: 'Met' },
          { count: fw.partial_count,   color: 'var(--warning)', label: '±' },
          { count: fw.gaps_count,      color: 'var(--danger)',  label: 'Gap' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, textAlign: 'center', padding: '3px 0',
            borderRadius: 5, background: 'var(--bg-elevated)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.count}</div>
            <div style={{ fontSize: 8, color: 'var(--text-muted)', marginTop: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Detail panel (expanded framework view)
────────────────────────────────────────────────────────────── */
function FrameworkDetail({ fw }: { fw: FrameworkResult }) {
  const flag = FLAGS[fw.framework_id] ?? '🌍';
  const allReqs: { req: ComplianceRequirement; status: ReqStatus }[] = [
    ...fw.satisfied.map(r => ({ req: r, status: 'satisfied' as ReqStatus })),
    ...fw.partial.map(r => ({ req: r, status: 'partial' as ReqStatus })),
    ...fw.gaps.map(r => ({ req: r, status: 'gap' as ReqStatus })),
  ].sort((a, b) => {
    const num = (id: string) => parseInt(id.replace(/[^0-9]/g, ''), 10) || 0;
    return num(a.req.id) - num(b.req.id);
  });

  return (
    <div style={{
      borderRadius: 16, border: '1px solid var(--accent-border)',
      background: 'var(--bg-card)', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        background: 'linear-gradient(135deg, var(--accent-muted) 0%, var(--bg-elevated) 100%)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <span style={{ fontSize: 28 }}>{flag}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
            {fw.full_name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 }}>
            {fw.authority} · {fw.effective}
          </div>
        </div>
        <BigRing score={fw.compliance_score} />
      </div>

      {/* Meta bar */}
      <div style={{
        padding: '10px 20px',
        background: 'var(--bg-elevated)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', gap: 24, flexWrap: 'wrap',
      }}>
        {[
          { label: 'Scope', value: fw.scope },
          { label: 'Penalty', value: fw.penalty },
        ].map(m => (
          <div key={m.label} style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{m.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{m.value}</div>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
          {[
            { count: fw.satisfied_count, color: 'var(--success)', muted: 'var(--success-muted)', border: 'var(--success-border)', label: 'Met' },
            { count: fw.partial_count,   color: 'var(--warning)', muted: 'var(--warning-muted)', border: 'var(--warning-border)', label: 'Partial' },
            { count: fw.gaps_count,      color: 'var(--danger)',  muted: 'var(--danger-muted)',  border: 'var(--danger-border)',  label: 'Gaps' },
          ].map(s => (
            <span key={s.label} style={{
              fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6,
              background: s.muted, color: s.color, border: `1px solid ${s.border}`,
            }}>
              {s.count} {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Requirements grid */}
      <div style={{ padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {allReqs.map(({ req, status }) => (
            <ReqCard key={req.id} req={req} status={status} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   NIST RMF Section (reused from existing compliance page)
────────────────────────────────────────────────────────────── */
function NistSection({ systemId }: { systemId: string }) {
  const { data: nist, loading } = useNistRmf(systemId);
  if (loading) return <div style={{ height: 200, borderRadius: 14, background: 'var(--bg-elevated)', animation: 'shimmer 1.4s infinite', backgroundSize: '200% 100%' }} />;
  if (!nist) return null;

  const funcColors: Record<string, string> = { GOVERN: 'var(--accent)', MAP: 'var(--purple)', MEASURE: 'var(--cyan)', MANAGE: 'var(--success)' };
  const statusCfg: Record<string, { color: string; label: string }> = {
    SATISFACTORY:    { color: 'var(--success)', label: 'OK' },
    RISK_IDENTIFIED: { color: 'var(--danger)',  label: 'Risk' },
    INCOMPLETE:      { color: 'var(--warning)', label: 'Incomplete' },
  };

  return (
    <div style={{ borderRadius: 16, border: '1px solid var(--border)', background: 'var(--bg-card)', overflow: 'hidden' }}>
      <div style={{ padding: '13px 18px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <ShieldCheck size={14} style={{ color: 'var(--purple)' }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>NIST AI RMF 1.0</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5,
          background: 'var(--accent-muted)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}>
          Overall: {nist.overall_risk_level}
        </span>
      </div>
      <div style={{ padding: 14, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {(Object.entries(nist.functions) as [string, NistRmfFunctionDetail][]).map(([fn, detail]) => {
          const sc = statusCfg[detail.status] ?? statusCfg.SATISFACTORY;
          const accent = funcColors[fn] ?? 'var(--accent)';
          return (
            <div key={fn} style={{ borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-elevated)', overflow: 'hidden' }}>
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: accent }}>{fn}</span>
                <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 4,
                  background: `color-mix(in srgb, ${sc.color} 15%, transparent)`,
                  color: sc.color }}>
                  {sc.label}
                </span>
              </div>
              <div style={{ padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 }}>{detail.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Global hero score bar
────────────────────────────────────────────────────────────── */
function GlobalHero({
  globalScore,
  frameworksCount,
  openFindings,
  regionScores,
}: {
  globalScore: number;
  frameworksCount: number;
  openFindings: number;
  regionScores: Record<string, number>;
}) {
  const color = globalScore >= 70 ? 'var(--success)' : globalScore >= 45 ? 'var(--warning)' : 'var(--danger)';
  return (
    <div style={{
      borderRadius: 16, border: '1px solid var(--border)',
      background: 'linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-card) 100%)',
      padding: '20px 24px', marginBottom: 20,
      display: 'grid', gridTemplateColumns: 'auto 1px 1fr', gap: 24, alignItems: 'center',
    }}>
      {/* Global score */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Globe size={18} style={{ color: 'var(--accent)' }} />
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Global Compliance Score</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 42, fontWeight: 900, color, letterSpacing: '-2px', lineHeight: 1 }}>
              {Math.round(globalScore)}
            </span>
            <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>/ 100</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            {frameworksCount} frameworks · {openFindings} open finding{openFindings !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: '100%', background: 'var(--border)' }} />

      {/* Region scores */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
        {Object.entries(regionScores).map(([region, score]) => {
          const rc = score >= 70 ? 'var(--success)' : score >= 45 ? 'var(--warning)' : 'var(--danger)';
          const barW = Math.min(score, 100);
          return (
            <div key={region}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)' }}>{region}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: rc }}>{Math.round(score)}%</span>
              </div>
              <div style={{ height: 3, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${barW}%`, background: rc, borderRadius: 99, transition: 'width 0.6s ease' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Skeleton shimmer
────────────────────────────────────────────────────────────── */
function Skeleton({ h = 80 }: { h?: number }) {
  return (
    <div style={{
      height: h, borderRadius: 12,
      background: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--bg-hover) 50%, var(--bg-elevated) 75%)',
      backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite',
    }} />
  );
}

/* ──────────────────────────────────────────────────────────────
   EU AI Act Detail (fetched separately for full data)
────────────────────────────────────────────────────────────── */
function EuAiActDetail({ systemId }: { systemId: string }) {
  const { data: eu } = useEuAiAct(systemId);
  if (!eu) return <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>Loading EU AI Act data…</div>;

  const allReqs: { req: ComplianceRequirement; status: ReqStatus }[] = [
    ...eu.satisfied.map(r => ({ req: r as ComplianceRequirement, status: 'satisfied' as ReqStatus })),
    ...eu.partial.map(r => ({ req: r as ComplianceRequirement, status: 'partial' as ReqStatus })),
    ...eu.gaps.map(r => ({ req: r as ComplianceRequirement, status: 'gap' as ReqStatus })),
  ].sort((a, b) => {
    const n = (id: string) => parseInt(id.replace('AIA-', ''), 10);
    return n(a.req.id) - n(b.req.id);
  });

  return (
    <div style={{ borderRadius: 16, border: '1px solid var(--accent-border)', background: 'var(--bg-card)', overflow: 'hidden' }}>
      <div style={{
        padding: '16px 20px',
        background: 'linear-gradient(135deg, var(--accent-muted) 0%, var(--bg-elevated) 100%)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <span style={{ fontSize: 28 }}>🇪🇺</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>EU AI Act — Article 11 / Annex IV</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 }}>
            European Commission · Effective August 2024 (phased)
          </div>
        </div>
        <BigRing score={eu.compliance_score} />
      </div>
      <div style={{ padding: '10px 20px', background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 10 }}>
        {[
          { count: eu.satisfied.length, color: 'var(--success)', muted: 'var(--success-muted)', border: 'var(--success-border)', label: 'Met' },
          { count: eu.partial.length,   color: 'var(--warning)', muted: 'var(--warning-muted)', border: 'var(--warning-border)', label: 'Partial' },
          { count: eu.gaps.length,      color: 'var(--danger)',  muted: 'var(--danger-muted)',  border: 'var(--danger-border)',  label: 'Gaps' },
        ].map(s => (
          <span key={s.label} style={{
            fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6,
            background: s.muted, color: s.color, border: `1px solid ${s.border}`,
          }}>{s.count} {s.label}</span>
        ))}
        {eu.critical_findings.length > 0 && (
          <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 6,
            background: 'var(--danger-muted)', color: 'var(--danger)', border: '1px solid var(--danger-border)' }}>
            ⚠ {eu.critical_findings.length} critical
          </span>
        )}
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {allReqs.map(({ req, status }) => <ReqCard key={req.id} req={req} status={status} />)}
        </div>
      </div>
      {eu.notes?.length > 0 && (
        <div style={{ padding: '10px 18px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
          <Info size={12} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {eu.notes.join(' · ')}
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Main page
────────────────────────────────────────────────────────────── */
export default function Compliance() {
  const { data: systems } = useSystems();
  const [selectedSystemId, setSelectedSystemId] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [selectedFw, setSelectedFw] = useState<string | null>(null);

  const effectiveId = selectedSystemId || (systems?.[0]?.id ?? '');
  const skip = !effectiveId;

  const { data: globalData, loading } = useGlobalCompliance(skip ? '__skip__' : effectiveId);

  const frameworks = globalData?.frameworks ?? [];
  const filtered = regionFilter === 'All'
    ? frameworks
    : frameworks.filter(fw => fw.region === regionFilter);

  const selectedFramework = frameworks.find(fw => fw.framework_id === selectedFw) ?? null;
  const isEu = selectedFw === 'eu-ai-act';

  return (
    <PageShell
      title="Compliance"
      subtitle="Global AI regulatory coverage — 11 frameworks across 10 jurisdictions"
      actions={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {systems && systems.length > 0 && (
            <div style={{ position: 'relative' }}>
              <select
                value={effectiveId}
                onChange={e => setSelectedSystemId(e.target.value)}
                style={{
                  appearance: 'none', padding: '7px 28px 7px 10px',
                  borderRadius: 8, fontSize: 12, fontWeight: 500,
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  color: 'var(--text-primary)', cursor: 'pointer', outline: 'none',
                }}
              >
                {systems.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
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
          {/* ── Global hero ── */}
          {loading ? <Skeleton h={120} /> : globalData ? (
            <GlobalHero
              globalScore={globalData.global_score}
              frameworksCount={globalData.frameworks_count}
              openFindings={globalData.open_findings_count}
              regionScores={globalData.region_scores}
            />
          ) : null}

          {/* ── Region filter tabs ── */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            {REGIONS.map(r => (
              <button
                key={r}
                onClick={() => setRegionFilter(r)}
                style={{
                  padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 500, cursor: 'pointer',
                  background: regionFilter === r ? 'var(--accent-muted)' : 'var(--bg-card)',
                  border: `1px solid ${regionFilter === r ? 'var(--accent-border)' : 'var(--border)'}`,
                  color: regionFilter === r ? 'var(--accent)' : 'var(--text-secondary)',
                  transition: 'all 0.12s ease',
                }}
              >
                {r}
                {r !== 'All' && ` (${frameworks.filter(fw => fw.region === r).length})`}
              </button>
            ))}
          </div>

          {/* ── Country grid ── */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} h={110} />)}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
              {/* EU AI Act special card — links to existing detailed endpoint */}
              {(regionFilter === 'All' || regionFilter === 'Europe') && (
                <CountryCard
                  fw={{
                    framework_id: 'eu-ai-act',
                    name: 'EU AI Act',
                    full_name: 'EU Artificial Intelligence Act',
                    authority: 'European Commission',
                    country: 'European Union',
                    region: 'Europe',
                    effective: 'August 2024',
                    scope: 'AI systems placed or put into service in the EU',
                    penalty: 'Up to €35M or 7% of global turnover',
                    compliance_score: globalData ? (
                      frameworks.find(f => f.framework_id === 'eu-ai-act')?.compliance_score
                      ?? 0
                    ) : 0,
                    total: 12,
                    satisfied_count: frameworks.find(f => f.framework_id === 'eu-ai-act')?.satisfied_count ?? 0,
                    partial_count:   frameworks.find(f => f.framework_id === 'eu-ai-act')?.partial_count ?? 0,
                    gaps_count:      frameworks.find(f => f.framework_id === 'eu-ai-act')?.gaps_count ?? 0,
                    satisfied: [], partial: [], gaps: [],
                  }}
                  selected={selectedFw === 'eu-ai-act'}
                  onClick={() => setSelectedFw(selectedFw === 'eu-ai-act' ? null : 'eu-ai-act')}
                />
              )}
              {filtered
                .filter(fw => fw.framework_id !== 'eu-ai-act')
                .map(fw => (
                  <CountryCard
                    key={fw.framework_id}
                    fw={fw}
                    selected={selectedFw === fw.framework_id}
                    onClick={() => setSelectedFw(selectedFw === fw.framework_id ? null : fw.framework_id)}
                  />
                ))
              }
            </div>
          )}

          {/* ── Detail panel ── */}
          {selectedFw && (
            <div style={{ marginBottom: 20 }}>
              {isEu ? (
                <EuAiActDetail systemId={effectiveId} />
              ) : selectedFramework ? (
                <FrameworkDetail fw={selectedFramework} />
              ) : null}
            </div>
          )}

          {/* ── NIST AI RMF ── */}
          <NistSection systemId={effectiveId} />
        </>
      )}
    </PageShell>
  );
}
