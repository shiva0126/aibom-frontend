import { Info } from 'lucide-react';
import { coverageEvidence } from '../../data/mock';
import Card from '../shared/Card';

const barColors = [
  'var(--accent)', 'var(--success)', 'var(--cyan)',
  'var(--warning)', 'var(--orange)', 'var(--purple)', 'var(--text-secondary)',
];

export default function CoverageWidget() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Coverage & Evidence</span>
          <Info size={13} style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>

      <div className="space-y-2.5">
        {coverageEvidence.map((c, i) => {
          const pct = Math.round((c.value / c.max) * 100);
          return (
            <div key={c.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{c.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold" style={{ color: 'var(--text-primary)' }}>{c.value}</span>
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{pct}%</span>
                </div>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: barColors[i] }} />
              </div>
            </div>
          );
        })}
      </div>

      <button className="text-[11px] mt-3 hover:underline" style={{ color: 'var(--accent)' }}>
        View evidence matrix →
      </button>
    </Card>
  );
}
