import { Bot, Server, AlertTriangle } from 'lucide-react';
import PageShell from '../components/layout/PageShell';
import Badge from '../components/shared/Badge';
import { useAgents, useMcpServers, useFindings } from '../api/hooks';

function metaStr(meta: Record<string, unknown>, key: string): string | null {
  const v = meta?.[key];
  return v == null ? null : String(v);
}

export default function AgentsMCP() {
  const { data: agents, loading: agentsLoading } = useAgents();
  const { data: mcp, loading: mcpLoading } = useMcpServers();
  const { data: findings } = useFindings();

  const agentFindingTypes = new Set([
    'destructive_tool_no_approval', 'broad_oauth_scope', 'unauthenticated_mcp_server',
    'shared_identity_session_risk', 'annotation_conflict',
  ]);
  const agentFindingCount = (findings ?? []).filter(f => f.status === 'open' && agentFindingTypes.has(f.finding_type)).length;

  const agentList = agents ?? [];
  const mcpList = mcp ?? [];

  return (
    <PageShell
      title="Agents & MCP"
      subtitle="AI agent identities, tool scopes, and MCP server permissions (live)"
    >
      <div className="grid grid-cols-2 gap-6">
        {/* Agents */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Bot size={15} style={{ color: 'var(--purple)' }} />
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Agents</h2>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--purple-muted)', color: 'var(--purple)' }}>
              {agentList.length}
            </span>
            {agentFindingCount > 0 && (
              <span className="flex items-center gap-1 text-xs ml-auto" style={{ color: 'var(--danger)' }}>
                <AlertTriangle size={11} /> {agentFindingCount} open finding{agentFindingCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {!agentsLoading && agentList.length === 0 ? (
            <div className="rounded-xl py-10 text-center text-xs" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              No agents discovered yet.
            </div>
          ) : (
            <div className="space-y-2">
              {agentList.map(agent => {
                const framework = metaStr(agent.metadata, 'framework') ?? metaStr(agent.metadata, 'agent_type');
                const model = metaStr(agent.metadata, 'model_id') ?? metaStr(agent.metadata, 'foundation_model');
                return (
                  <div key={agent.id} className="rounded-xl p-4 transition-all"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'var(--purple-muted)', border: '1px solid var(--purple-border)' }}>
                        <Bot size={16} style={{ color: 'var(--purple)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{agent.display_name}</div>
                        <div className="text-[10px] mono truncate" style={{ color: 'var(--text-muted)' }}>{agent.canonical_id}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {agent.provider && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>{agent.provider}</span>}
                      {agent.region && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{agent.region}</span>}
                      {framework && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--purple-muted)', color: 'var(--purple)', border: '1px solid var(--purple-border)' }}>{framework}</span>}
                      {model && <span className="text-[10px] px-1.5 py-0.5 rounded mono" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{model}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MCP Servers */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Server size={15} style={{ color: 'var(--cyan)' }} />
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>MCP Servers</h2>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--cyan-muted)', color: 'var(--cyan)' }}>
              {mcpList.length}
            </span>
          </div>
          {!mcpLoading && mcpList.length === 0 ? (
            <div className="rounded-xl py-10 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <Server size={24} style={{ color: 'var(--text-muted)', margin: '0 auto 8px', display: 'block' }} />
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>No MCP servers discovered</div>
              <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>The MCP discovery connector found none in scope.</div>
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
                    {['Server', 'Provider', 'Region', ''].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mcpList.map((s, i) => (
                    <tr key={s.id ?? i} className="transition-colors"
                      style={{ borderBottom: i < mcpList.length - 1 ? '1px solid var(--border-muted)' : 'none' }}>
                      <td className="px-4 py-3">
                        <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{s.display_name}</div>
                        <div className="text-[10px] mono" style={{ color: 'var(--text-muted)' }}>{s.canonical_id}</div>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{metaStr(s.metadata ?? {}, 'provider') ?? '—'}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{metaStr(s.metadata ?? {}, 'region') ?? '—'}</td>
                      <td className="px-4 py-3"><Badge label="Discovered" size="sm" dot /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
