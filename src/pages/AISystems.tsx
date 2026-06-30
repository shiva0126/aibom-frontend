import { useState } from 'react';
import { Search, Filter, RefreshCw, Plus, ChevronRight } from 'lucide-react';
import PageShell from '../components/layout/PageShell';
import Badge from '../components/shared/Badge';
import { aiSystems } from '../data/mock';

const envFilters = ['All', 'Production', 'Staging'];
const statusFilters = ['All', 'Critical', 'At Risk', 'Watch', 'Secure'];

export default function AISystems() {
  const [search, setSearch] = useState('');
  const [env, setEnv] = useState('All');
  const [status, setStatus] = useState('All');

  const filtered = aiSystems.filter(s =>
    (search === '' || s.name.toLowerCase().includes(search.toLowerCase())) &&
    (env === 'All' || s.env === env) &&
    (status === 'All' || s.status === status)
  );

  return (
    <PageShell
      title="AI Systems"
      subtitle={`${aiSystems.length} systems across your environment`}
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
      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 flex-1 max-w-xs"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <Search size={13} style={{ color: 'var(--text-muted)' }} />
          <input
            className="bg-transparent text-xs outline-none w-full"
            style={{ color: 'var(--text-primary)' }}
            placeholder="Search systems..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1">
          <Filter size={13} style={{ color: 'var(--text-muted)' }} />
          {envFilters.map(f => (
            <button key={f}
              onClick={() => setEnv(f)}
              className="px-3 py-1.5 rounded-lg text-xs transition-colors"
              style={{
                background: env === f ? 'var(--accent-muted)' : 'var(--bg-card)',
                border: `1px solid ${env === f ? 'var(--accent-border)' : 'var(--border)'}`,
                color: env === f ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: env === f ? 500 : 400,
              }}>
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          {statusFilters.map(f => (
            <button key={f}
              onClick={() => setStatus(f)}
              className="px-3 py-1.5 rounded-lg text-xs transition-colors"
              style={{
                background: status === f ? 'var(--accent-muted)' : 'var(--bg-card)',
                border: `1px solid ${status === f ? 'var(--accent-border)' : 'var(--border)'}`,
                color: status === f ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: status === f ? 500 : 400,
              }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
              {['System', 'Type', 'Environment', 'Status', 'Models', 'Findings', 'Last Scanned', 'Owner', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id}
                className="cursor-pointer transition-colors"
                style={{
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border-muted)' : 'none',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td className="px-4 py-3">
                  <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{s.name}</div>
                  <div className="text-[10px] mono mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.id}</div>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{s.type}</td>
                <td className="px-4 py-3">
                  <span className="text-[11px] px-2 py-0.5 rounded"
                    style={{
                      background: s.env === 'Production' ? 'var(--success-muted)' : 'var(--warning-muted)',
                      color: s.env === 'Production' ? 'var(--success)' : 'var(--warning)',
                      border: `1px solid ${s.env === 'Production' ? 'var(--success-border)' : 'var(--warning-border)'}`,
                    }}>
                    {s.env}
                  </span>
                </td>
                <td className="px-4 py-3"><Badge label={s.status} /></td>
                <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{s.models}</td>
                <td className="px-4 py-3">
                  {s.findings > 0
                    ? <span className="text-xs font-semibold" style={{ color: s.findings >= 4 ? 'var(--danger)' : 'var(--orange)' }}>{s.findings}</span>
                    : <span className="text-xs" style={{ color: 'var(--text-muted)' }}>—</span>
                  }
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{s.lastScanned}</td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{s.owner}</td>
                <td className="px-4 py-3">
                  <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-xs" style={{ color: 'var(--text-muted)' }}>No systems match the current filters.</div>
        )}
      </div>
    </PageShell>
  );
}
