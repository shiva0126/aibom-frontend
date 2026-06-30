import { Link } from 'react-router-dom';
import { Bot, Wrench, Server, ArrowUpRight, Info } from 'lucide-react';
import { overviewAgents } from '../../data/mock';
import Badge from '../shared/Badge';
import Card from '../shared/Card';

export default function AgentsWidget() {
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

      <div className="space-y-2">
        {overviewAgents.map((agent) => (
          <div key={agent.name} className="rounded-lg p-3"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--purple-muted)', border: '1px solid var(--purple-border)' }}>
                <Bot size={13} style={{ color: 'var(--purple)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{agent.name}</div>
                <div className="text-[10px] mono" style={{ color: 'var(--text-muted)' }}>{agent.version}</div>
              </div>
              <Badge label={agent.status} size="sm" dot />
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                <Wrench size={10} />
                <span>Tools</span>
                <span className="font-semibold ml-1" style={{ color: 'var(--text-primary)' }}>{agent.tools}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                <Server size={10} />
                <span>MCP</span>
                <span className="font-semibold ml-1" style={{ color: 'var(--text-primary)' }}>{agent.mcpServers}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
