import { Link } from 'react-router-dom';
import { Brain, Bot, Server, BookOpen, Database, Wrench, FileStack, ArrowUpRight, Info } from 'lucide-react';
import { aibomSnapshot } from '../../data/mock';
import Card from '../shared/Card';

function Node({ icon: Icon, label, version, color }: { icon: any; label: string; version: string; color: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg px-2.5 py-2 shrink-0 min-w-[110px]"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
      <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
        style={{ background: color + '20' }}>
        <Icon size={12} style={{ color }} />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>{label}</div>
        <div className="text-[10px] mono" style={{ color: 'var(--text-muted)' }}>{version}</div>
      </div>
    </div>
  );
}

function Arr() {
  return (
    <div className="flex items-center shrink-0">
      <div className="w-3 h-px" style={{ background: 'var(--border-strong)' }} />
      <div className="w-0 h-0" style={{
        borderTop: '3px solid transparent',
        borderBottom: '3px solid transparent',
        borderLeft: `4px solid var(--border-strong)`,
      }} />
    </div>
  );
}

export default function AIBOMWidget() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>AI-BOM Snapshot</span>
          <Info size={13} style={{ color: 'var(--text-muted)' }} />
        </div>
        <Link to="/aibom" className="flex items-center gap-1 text-xs hover:underline" style={{ color: 'var(--accent)' }}>
          Full AI-BOM <ArrowUpRight size={12} />
        </Link>
      </div>

      <div className="flex items-start gap-2 overflow-x-auto pb-1">
        <Node icon={Brain}     label={aibomSnapshot.model.name}  version={aibomSnapshot.model.version}  color="var(--accent)" />
        <Arr />
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Node icon={Bot}      label={aibomSnapshot.agent.name}  version={aibomSnapshot.agent.version}  color="var(--purple)" />
            <Arr />
            <div className="flex flex-col gap-2">
              <Node icon={BookOpen} label={aibomSnapshot.kb.name}    version={aibomSnapshot.kb.version}    color="var(--cyan)" />
              <Node icon={Wrench}   label={aibomSnapshot.tool.name}  version={aibomSnapshot.tool.version}  color="var(--success)" />
            </div>
            <Arr />
            <div className="flex flex-col gap-2">
              <Node icon={Database} label={aibomSnapshot.vectorIndex.name} version={aibomSnapshot.vectorIndex.version} color="var(--warning)" />
              <Node icon={FileStack} label={aibomSnapshot.dataset.name} version={aibomSnapshot.dataset.version} color="var(--text-secondary)" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Node icon={Server}   label={aibomSnapshot.mcp.name}   version={aibomSnapshot.mcp.version}   color="var(--text-muted)" />
          </div>
        </div>
      </div>
    </Card>
  );
}
