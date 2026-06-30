import { CheckCircle2, AlertCircle, Plus, RefreshCw } from 'lucide-react';
import PageShell from '../components/layout/PageShell';
import { integrations } from '../data/mock';

const categoryColor: Record<string, string> = {
  Cloud: 'var(--accent)', VCS: 'var(--text-secondary)', 'Vector DB': 'var(--purple)',
  Registry: 'var(--warning)', Identity: 'var(--cyan)', Ticketing: 'var(--orange)',
};

const logoText: Record<string, string> = {
  aws: 'AWS', github: 'GH', pinecone: 'PC', hf: 'HF', azure: 'AZ', gcp: 'GCP', okta: 'OK', jira: 'JR',
};

export default function Integrations() {
  const connected = integrations.filter(i => i.status === 'Connected');
  const warning   = integrations.filter(i => i.status === 'Warning');
  const available = integrations.filter(i => i.status === 'Available');

  return (
    <PageShell
      title="Integrations"
      subtitle="Connect cloud providers, registries, and security tools"
      actions={
        <button className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium"
          style={{ background: 'var(--accent)', color: 'white' }}>
          <Plus size={12} /> Add Integration
        </button>
      }
    >
      {/* Status banner */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Connected',  count: connected.length, color: 'var(--success)', bg: 'var(--success-muted)', border: 'var(--success-border)' },
          { label: 'Warning',    count: warning.length,   color: 'var(--warning)', bg: 'var(--warning-muted)', border: 'var(--warning-border)' },
          { label: 'Available',  count: available.length, color: 'var(--text-secondary)', bg: 'var(--bg-elevated)', border: 'var(--border)' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
            <div className="text-2xl font-bold mb-0.5" style={{ color: s.color, letterSpacing: '-0.5px' }}>{s.count}</div>
            <div className="text-xs" style={{ color: s.color }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Integration cards */}
      <div className="grid grid-cols-2 gap-4">
        {integrations.map(int => {
          const isConnected = int.status === 'Connected';
          const isWarning   = int.status === 'Warning';
          const isAvailable = int.status === 'Available';
          return (
            <div key={int.id}
              className="rounded-xl p-4"
              style={{
                background: 'var(--bg-card)',
                border: `1px solid ${isWarning ? 'var(--warning-border)' : 'var(--border)'}`,
                opacity: isAvailable ? 0.7 : 1,
              }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    background: categoryColor[int.category] + '15',
                    border: `1px solid ${categoryColor[int.category]}30`,
                    color: categoryColor[int.category],
                  }}>
                  {logoText[int.logo]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{int.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                      {int.category}
                    </span>
                  </div>
                  {int.account && (
                    <div className="text-xs mt-0.5 mono" style={{ color: 'var(--text-muted)' }}>{int.account}</div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {isConnected && <CheckCircle2 size={14} style={{ color: 'var(--success)' }} />}
                  {isWarning   && <AlertCircle  size={14} style={{ color: 'var(--warning)' }} />}
                  <span className="text-[11px] font-medium"
                    style={{ color: isConnected ? 'var(--success)' : isWarning ? 'var(--warning)' : 'var(--text-muted)' }}>
                    {int.status}
                  </span>
                </div>
              </div>

              {/* Services */}
              <div className="flex flex-wrap gap-1 mb-3">
                {int.services.map(s => (
                  <span key={s} className="text-[10px] px-2 py-0.5 rounded"
                    style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                {int.lastSync
                  ? <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Last sync: {int.lastSync}</span>
                  : <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Not connected</span>
                }
                {isAvailable ? (
                  <button className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium"
                    style={{ background: 'var(--accent)', color: 'white' }}>
                    <Plus size={11} /> Connect
                  </button>
                ) : (
                  <button className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                    <RefreshCw size={11} /> Sync
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
