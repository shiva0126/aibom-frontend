import { Link } from 'react-router-dom';
import { Globe, Zap, User, BookOpen, Database, HardDrive, ArrowUpRight, Info } from 'lucide-react';
import { attackPathNodes } from '../../data/mock';
import Badge from '../shared/Badge';
import Card from '../shared/Card';

const icons = [Globe, Zap, User, BookOpen, Database, HardDrive];

const riskColor: Record<string, string> = {
  High:     'var(--orange)',
  Medium:   'var(--warning)',
  Critical: 'var(--danger)',
};

export default function AttackPathWidget() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Attack Path Explorer</span>
          <Info size={13} style={{ color: 'var(--text-muted)' }} />
        </div>
        <Link to="/attack-paths" className="flex items-center gap-1 text-xs hover:underline" style={{ color: 'var(--accent)' }}>
          View all <ArrowUpRight size={12} />
        </Link>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {attackPathNodes.map((node, i) => {
          const Icon = icons[i];
          const col = riskColor[node.risk] ?? 'var(--text-secondary)';
          return (
            <div key={i} className="flex items-center gap-1 shrink-0">
              <div className="flex flex-col items-center gap-1.5 rounded-xl p-3 min-w-[76px]"
                style={{
                  background: col + '10',
                  border: `1px solid ${col}30`,
                }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: col + '15', border: `1.5px solid ${col}` }}>
                  <Icon size={16} style={{ color: col }} />
                </div>
                <span className="text-[10px] text-center leading-tight" style={{ color: 'var(--text-secondary)' }}>
                  {node.label}
                </span>
                <Badge label={node.risk} size="sm" />
              </div>
              {i < attackPathNodes.length - 1 && (
                <div className="flex items-center gap-px shrink-0">
                  <div className="w-2 h-px" style={{ background: col }} />
                  <div className="w-2 h-2 rounded-full" style={{ background: col }} />
                  <div className="w-2 h-px" style={{ background: col }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
