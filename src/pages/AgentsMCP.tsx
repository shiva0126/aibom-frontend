import { Bot, Server, Wrench, ChevronRight, AlertTriangle } from 'lucide-react';
import PageShell from '../components/layout/PageShell';
import Badge from '../components/shared/Badge';
import { allAgents, mcpServers } from '../data/mock';

const permColors: Record<string, string> = {
  'read-only':  'var(--success)',
  'read-write': 'var(--warning)',
  'execute':    'var(--danger)',
  'sandboxed':  'var(--cyan)',
};

export default function AgentsMCP() {
  return (
    <PageShell
      title="Agents & MCP"
      subtitle="AI agent identities, tool scopes, and MCP server permissions"
    >
      <div className="grid grid-cols-2 gap-6">
        {/* Agents */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Bot size={15} style={{ color: 'var(--purple)' }} />
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Agents</h2>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--purple-muted)', color: 'var(--purple)' }}>
              {allAgents.length}
            </span>
          </div>
          <div className="space-y-2">
            {allAgents.map(agent => (
              <div key={agent.id} className="rounded-xl p-4 cursor-pointer transition-all"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--purple-muted)', border: '1px solid var(--purple-border)' }}>
                    <Bot size={16} style={{ color: 'var(--purple)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{agent.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{agent.system} · <span className="mono">{agent.version}</span></div>
                  </div>
                  <div className="flex items-center gap-2">
                    {agent.findings > 0 && (
                      <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--danger)' }}>
                        <AlertTriangle size={11} />
                        <span>{agent.findings}</span>
                      </div>
                    )}
                    <Badge label={agent.status} size="sm" dot />
                    <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Wrench size={11} />
                    <span>{agent.tools} tools</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Server size={11} />
                    <span>{agent.mcpServers} MCP servers</span>
                  </div>
                  <div className="flex gap-1 ml-auto">
                    {agent.frameworks.map(f => (
                      <span key={f} className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MCP Servers */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Server size={15} style={{ color: 'var(--cyan)' }} />
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>MCP Servers</h2>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--cyan-muted)', color: 'var(--cyan)' }}>
              {mcpServers.length}
            </span>
          </div>
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
                  {['Server', 'Type', 'Agent', 'Tools', 'Permissions', ''].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mcpServers.map((s, i) => (
                  <tr key={s.id}
                    className="cursor-pointer transition-colors"
                    style={{ borderBottom: i < mcpServers.length - 1 ? '1px solid var(--border-muted)' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td className="px-4 py-3">
                      <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{s.name}</div>
                      <div className="text-[10px] mono" style={{ color: 'var(--text-muted)' }}>{s.version}</div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{s.type}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{s.agent}</td>
                    <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{s.tools}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded"
                        style={{
                          background: permColors[s.permissions] + '15',
                          color: permColors[s.permissions],
                          border: `1px solid ${permColors[s.permissions]}30`,
                        }}>{s.permissions}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge label={s.status === 'ok' ? 'Healthy' : s.status === 'warning' ? 'Warning' : 'Critical'} size="sm" dot />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
