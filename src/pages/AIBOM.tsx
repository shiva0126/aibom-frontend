import { useState } from 'react';
import { Download, RefreshCw, ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import PageShell from '../components/layout/PageShell';
import Badge from '../components/shared/Badge';
import { aibomSnapshots } from '../data/mock';

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)', maxWidth: 80 }}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-[11px] font-medium w-7 text-right" style={{ color: 'var(--text-primary)' }}>{value}%</span>
    </div>
  );
}

const driftIcon: Record<string, any> = {
  None:     <Minus size={12} style={{ color: 'var(--text-muted)' }} />,
  Minor:    <TrendingUp size={12} style={{ color: 'var(--warning)' }} />,
  Major:    <TrendingUp size={12} style={{ color: 'var(--orange)' }} />,
  Critical: <TrendingDown size={12} style={{ color: 'var(--danger)' }} />,
};

const driftColor: Record<string, string> = {
  None: 'var(--text-muted)', Minor: 'var(--warning)', Major: 'var(--orange)', Critical: 'var(--danger)',
};

export default function AIBOM() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <PageShell
      title="AI-BOM"
      subtitle="CycloneDX 1.7 snapshots for every AI system"
      actions={
        <button className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium"
          style={{ background: 'var(--accent)', color: 'white' }}>
          <Download size={12} /> Export BOM
        </button>
      }
    >
      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Snapshots', value: 56, color: 'var(--accent)' },
          { label: 'Valid',           value: 48, color: 'var(--success)' },
          { label: 'Drifted',         value: 6,  color: 'var(--warning)' },
          { label: 'Invalid',         value: 2,  color: 'var(--danger)'  },
        ].map(c => (
          <div key={c.label} className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="text-2xl font-bold mb-0.5" style={{ color: c.color, letterSpacing: '-0.5px' }}>{c.value}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
              {['BOM ID', 'System', 'Version', 'Components', 'Completeness', 'Trust Score', 'Drift', 'Created', 'Status', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {aibomSnapshots.map((s, i) => (
              <tr key={s.id}
                onClick={() => setSelected(selected === s.id ? null : s.id)}
                className="cursor-pointer transition-colors"
                style={{
                  borderBottom: i < aibomSnapshots.length - 1 ? '1px solid var(--border-muted)' : 'none',
                  background: selected === s.id ? 'var(--bg-selected)' : 'transparent',
                }}
                onMouseEnter={e => { if (selected !== s.id) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = selected === s.id ? 'var(--bg-selected)' : 'transparent'; }}
              >
                <td className="px-4 py-3"><span className="text-[11px] mono" style={{ color: 'var(--accent)' }}>{s.id}</span></td>
                <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{s.system}</td>
                <td className="px-4 py-3 text-xs mono" style={{ color: 'var(--text-secondary)' }}>{s.version}</td>
                <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{s.components}</td>
                <td className="px-4 py-3 w-36"><ScoreBar value={s.completeness} color="var(--accent)" /></td>
                <td className="px-4 py-3 w-36"><ScoreBar value={s.trust} color="var(--success)" /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: driftColor[s.drift] }}>
                    {driftIcon[s.drift]}
                    {s.drift}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{s.created}</td>
                <td className="px-4 py-3"><Badge label={s.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="text-[10px] px-2 py-1 rounded" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                      <RefreshCw size={10} />
                    </button>
                    <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
