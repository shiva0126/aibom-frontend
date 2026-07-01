import { useState } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, Minus, FileJson, FileCode2 } from 'lucide-react';
import PageShell from '../components/layout/PageShell';
import Badge from '../components/shared/Badge';
import { aibomSnapshots } from '../data/mock';
import { api } from '../api/client';

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

const driftIcon: Record<string, React.ReactNode> = {
  None:     <Minus size={12} style={{ color: 'var(--text-muted)' }} />,
  Minor:    <TrendingUp size={12} style={{ color: 'var(--warning)' }} />,
  Major:    <TrendingUp size={12} style={{ color: 'var(--orange)' }} />,
  Critical: <TrendingDown size={12} style={{ color: 'var(--danger)' }} />,
};

const driftColor: Record<string, string> = {
  None: 'var(--text-muted)', Minor: 'var(--warning)', Major: 'var(--orange)', Critical: 'var(--danger)',
};

function exportJson(data: Record<string, unknown>, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function ExportButtons({ snapshotId, snapshotVersion }: { snapshotId: string; snapshotVersion: number }) {
  const [spdxLoading, setSpdxLoading] = useState(false);
  const [spdxDone, setSpdxDone] = useState(false);

  const handleSpdx = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (spdxLoading) return;
    setSpdxLoading(true);
    try {
      const data = await api.exportSpdx(snapshotId);
      exportJson(data, `aibom-spdx-v${snapshotVersion}.spdx.json`);
      setSpdxDone(true);
      setTimeout(() => setSpdxDone(false), 2000);
    } catch {
      // ignore; show no toast for now
    } finally {
      setSpdxLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={e => e.stopPropagation()}>
      {/* CycloneDX stub */}
      <button
        title="Export CycloneDX 1.7"
        style={{
          padding: '4px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600,
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          color: 'var(--text-secondary)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4,
        }}
        onClick={e => e.stopPropagation()}
      >
        <FileCode2 size={10} />
        CDX
      </button>

      {/* SPDX export */}
      <button
        title="Export SPDX 2.3"
        onClick={handleSpdx}
        style={{
          padding: '4px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600,
          background: spdxDone ? 'var(--success-muted)' : 'var(--accent-muted)',
          border: `1px solid ${spdxDone ? 'var(--success-border)' : 'var(--accent-border)'}`,
          color: spdxDone ? 'var(--success)' : 'var(--accent)',
          cursor: spdxLoading ? 'wait' : 'pointer',
          display: 'flex', alignItems: 'center', gap: 4,
          transition: 'all 0.2s ease',
        }}
      >
        <FileJson size={10} />
        {spdxDone ? 'Saved!' : spdxLoading ? '…' : 'SPDX'}
      </button>

      <RefreshCw size={12} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
        onClick={e => e.stopPropagation()} />
    </div>
  );
}

export default function AIBOM() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <PageShell
      title="AI-BOM"
      subtitle="CycloneDX 1.7 · SPDX 2.3 snapshots for every AI system"
      actions={
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            <FileCode2 size={12} /> Export All CDX
          </button>
          <button className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium"
            style={{ background: 'var(--accent-muted)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}>
            <FileJson size={12} /> Export All SPDX
          </button>
        </div>
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

      {/* Format legend */}
      <div style={{
        marginBottom: 14, padding: '8px 14px', borderRadius: 9,
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>Export formats:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <FileCode2 size={11} style={{ color: 'var(--text-secondary)' }} />
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>CDX — CycloneDX 1.7</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <FileJson size={11} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: 10, color: 'var(--accent)' }}>SPDX — SPDX 2.3 (live)</span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
              {['BOM ID', 'System', 'Version', 'Components', 'Completeness', 'Trust Score', 'Drift', 'Created', 'Status', 'Export'].map(h => (
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
                  <ExportButtons snapshotId={s.id} snapshotVersion={parseInt(String(s.version), 10)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
