import { useState } from 'react';
import { Search, RefreshCw, Plus, ChevronRight } from 'lucide-react';
import PageShell from '../components/layout/PageShell';
import Badge from '../components/shared/Badge';
import { useSystems, useFindings } from '../api/hooks';

export default function AISystems() {
  const [search, setSearch] = useState('');
  const { data: systems, loading } = useSystems();
  const { data: findings } = useFindings();

  const findingCountBySystem: Record<string, number> = {};
  (findings ?? []).forEach(f => {
    if (f.status === 'open') findingCountBySystem[f.system_id] = (findingCountBySystem[f.system_id] ?? 0) + 1;
  });

  const rows = (systems ?? []).map(s => ({
    id: s.id,
    name: s.name,
    canonical: s.canonical_id,
    type: s.system_type,
    status: s.status,
    findings: findingCountBySystem[s.id] ?? 0,
    registered: s.created_at ? new Date(s.created_at).toLocaleDateString() : '—',
  }));

  const filtered = rows.filter(s =>
    search === '' ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.canonical.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageShell
      title="AI Systems"
      subtitle={loading ? 'Loading…' : `${rows.length} system${rows.length !== 1 ? 's' : ''} (live)`}
      actions={
        <>
          <button className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            <RefreshCw size={12} /> Scan All
          </button>
          <button className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium"
            style={{ background: 'var(--accent)', color: 'white' }}>
            <Plus size={12} /> Register System
          </button>
        </>
      }
    >
      {/* Filter */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 flex-1 max-w-xs"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <Search size={13} style={{ color: 'var(--text-muted)' }} />
          <input className="bg-transparent text-xs outline-none w-full" style={{ color: 'var(--text-primary)' }}
            placeholder="Search systems..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
              {['System', 'Type', 'Status', 'Open Findings', 'Registered', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id}
                className="cursor-pointer transition-colors"
                style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border-muted)' : 'none' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td className="px-4 py-3">
                  <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{s.name}</div>
                  <div className="text-[10px] mono mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.canonical}</div>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{s.type}</td>
                <td className="px-4 py-3"><Badge label={s.status} /></td>
                <td className="px-4 py-3">
                  {s.findings > 0
                    ? <span className="text-xs font-semibold" style={{ color: s.findings >= 4 ? 'var(--danger)' : 'var(--orange)' }}>{s.findings}</span>
                    : <span className="text-xs" style={{ color: 'var(--text-muted)' }}>—</span>}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{s.registered}</td>
                <td className="px-4 py-3"><ChevronRight size={14} style={{ color: 'var(--text-muted)' }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && (
          <div className="py-12 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
            {rows.length === 0 ? 'No AI systems ingested yet.' : 'No systems match the search.'}
          </div>
        )}
      </div>
    </PageShell>
  );
}
