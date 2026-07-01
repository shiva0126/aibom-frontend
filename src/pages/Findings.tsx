import { useState } from 'react';
import { Search, SlidersHorizontal, Download, ChevronRight } from 'lucide-react';
import PageShell from '../components/layout/PageShell';
import Badge from '../components/shared/Badge';
import { allFindings } from '../data/mock';
import { useFindings } from '../api/hooks';

const severities = ['All', 'Critical', 'High', 'Medium', 'Low'];
const statuses = ['All', 'open', 'resolved'];

export default function Findings() {
  const [search, setSearch] = useState('');
  const [sev, setSev] = useState('All');
  const [status, setStatus] = useState('All');
  const { data: liveFindings } = useFindings();

  // Normalise live API findings to the same shape used by the table
  const findings = liveFindings
    ? liveFindings.map(f => ({
        id: f.id.slice(0, 8).toUpperCase(),
        title: f.title,
        system: f.system_id.slice(0, 8),
        category: f.finding_type,
        severity: f.severity.charAt(0).toUpperCase() + f.severity.slice(1),
        status: f.status,
        age: new Date(f.created_at).toLocaleDateString(),
        cve: null as string | null,
        description: f.description,
      }))
    : allFindings;

  const filtered = findings.filter(f =>
    (search === '' || f.title.toLowerCase().includes(search.toLowerCase()) || f.system.toLowerCase().includes(search.toLowerCase())) &&
    (sev === 'All' || f.severity.toLowerCase() === sev.toLowerCase()) &&
    (status === 'All' || f.status === status)
  );

  const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  findings.forEach(f => { if (f.severity in counts) (counts as any)[f.severity]++; });

  return (
    <PageShell
      title="Findings"
      subtitle={`${findings.length} findings${liveFindings ? ' (live)' : ' (demo)'}`}
      actions={
        <button className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
          <Download size={12} /> Export
        </button>
      }
    >
      {/* Severity summary */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {Object.entries(counts).map(([sev, count]) => {
          const colorMap: Record<string, string> = { Critical: 'var(--danger)', High: 'var(--orange)', Medium: 'var(--warning)', Low: 'var(--cyan)' };
          return (
            <div key={sev} className="rounded-xl p-4 cursor-pointer transition-all"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              onClick={() => setSev(sev === sev ? sev : 'All')}>
              <div className="text-2xl font-bold mb-0.5" style={{ color: colorMap[sev], letterSpacing: '-0.5px' }}>{count}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{sev}</div>
            </div>
          );
        })}
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 flex-1 max-w-xs"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <Search size={13} style={{ color: 'var(--text-muted)' }} />
          <input className="bg-transparent text-xs outline-none w-full" style={{ color: 'var(--text-primary)' }}
            placeholder="Search findings..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-1">
          <SlidersHorizontal size={13} style={{ color: 'var(--text-muted)' }} />
          {severities.map(f => (
            <button key={f} onClick={() => setSev(f)} className="px-3 py-1.5 rounded-lg text-xs transition-colors"
              style={{
                background: sev === f ? 'var(--accent-muted)' : 'var(--bg-card)',
                border: `1px solid ${sev === f ? 'var(--accent-border)' : 'var(--border)'}`,
                color: sev === f ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: sev === f ? 500 : 400,
              }}>{f}</button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {statuses.map(f => (
            <button key={f} onClick={() => setStatus(f)} className="px-3 py-1.5 rounded-lg text-xs transition-colors"
              style={{
                background: status === f ? 'var(--accent-muted)' : 'var(--bg-card)',
                border: `1px solid ${status === f ? 'var(--accent-border)' : 'var(--border)'}`,
                color: status === f ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: status === f ? 500 : 400,
              }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
              {['ID', 'Finding', 'System', 'Category', 'Severity', 'Status', 'Age', 'CVE', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((f, i) => (
              <tr key={f.id}
                className="cursor-pointer transition-colors"
                style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border-muted)' : 'none' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td className="px-4 py-3"><span className="text-[11px] mono font-medium" style={{ color: 'var(--accent)' }}>{f.id}</span></td>
                <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--text-primary)', maxWidth: 260 }}>{f.title}</td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{f.system}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{f.category}</span>
                </td>
                <td className="px-4 py-3"><Badge label={f.severity} /></td>
                <td className="px-4 py-3"><Badge label={f.status} /></td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{f.age}</td>
                <td className="px-4 py-3">
                  {f.cve ? <span className="text-[10px] mono" style={{ color: 'var(--accent)' }}>{f.cve}</span> : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                </td>
                <td className="px-4 py-3"><ChevronRight size={14} style={{ color: 'var(--text-muted)' }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-xs" style={{ color: 'var(--text-muted)' }}>No findings match the current filters.</div>
        )}
      </div>
    </PageShell>
  );
}
