import { BarChart2, Clock, Lock } from 'lucide-react';
import PageShell from '../components/layout/PageShell';
import EmptyState from '../components/shared/EmptyState';

const upcoming = [
  { title: 'AI Security Posture Report',    desc: 'Full scoring breakdown + trend analysis',               eta: 'S8' },
  { title: 'AI-BOM Compliance Export',      desc: 'CycloneDX 1.7 + VEX for all systems',                  eta: 'S8' },
  { title: 'Attack Path Summary',           desc: 'Executive-ready attack chain documentation',            eta: 'S8' },
  { title: 'Model Supply Chain Audit',      desc: 'Provenance, SBOMs, and policy violations',              eta: 'S9' },
  { title: 'DPDP §8(4) Evidence Report',    desc: 'Regulatory evidence auto-mapped to controls',          eta: 'S9' },
];

export default function Reports() {
  return (
    <PageShell
      title="Reports"
      subtitle="Scheduled reports and compliance exports"
    >
      <EmptyState
        icon={<BarChart2 size={28} />}
        title="Reports coming in Phase 2"
        description="Automated security posture, compliance exports, and attack-path summaries will be generated once the backend is deployed."
      />

      {/* Upcoming reports preview */}
      <div className="mt-8 max-w-2xl mx-auto">
        <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Planned for Phase 2
        </div>
        <div className="space-y-2">
          {upcoming.map(r => (
            <div key={r.title} className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <Lock size={13} style={{ color: 'var(--text-muted)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{r.title}</div>
                <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{r.desc}</div>
              </div>
              <div className="flex items-center gap-1 text-[10px] px-2 py-1 rounded"
                style={{ background: 'var(--accent-muted)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}>
                <Clock size={9} /> Sprint {r.eta}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
