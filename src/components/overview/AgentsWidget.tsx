import { Link } from 'react-router-dom';
import { Bot, ArrowUpRight, Info } from 'lucide-react';
import Card from '../shared/Card';
import { useAgents } from '../../api/hooks';

export default function AgentsWidget() {
  const { data: agents, loading } = useAgents();
  const list = (agents ?? []).slice(0, 4);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Agents & MCP</span>
          <Info size={13} style={{ color: 'var(--text-muted)' }} />
        </div>
        <Link to="/agents" className="flex items-center gap-1 text-xs hover:underline" style={{ color: 'var(--accent)' }}>
          View all <ArrowUpRight size={12} />
        </Link>
      </div>

      {!loading && list.length === 0 ? (
        <div className="py-8 text-center text-xs" style={{ color: 'var(--text-muted)' }}>No agents discovered.</div>
      ) : (
        <div className="space-y-2">
          {list.map((agent) => (
            <div key={agent.id} className="rounded-lg p-3"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'var(--purple-muted)', border: '1px solid var(--purple-border)' }}>
                  <Bot size={13} style={{ color: 'var(--purple)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{agent.display_name}</div>
                  <div className="text-[10px] mono truncate" style={{ color: 'var(--text-muted)' }}>{agent.provider ?? 'agent'}{agent.region ? ` · ${agent.region}` : ''}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
