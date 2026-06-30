import { Link } from 'react-router-dom';
import { Database, ArrowDown, Brain, LayoutGrid, Bot, ArrowUpRight, Info } from 'lucide-react';
import { ragLineageNodes } from '../../data/mock';
import Card from '../shared/Card';

const icons = [Database, ArrowDown, Brain, LayoutGrid, Bot];
const colors = ['var(--accent)', 'var(--text-muted)', 'var(--purple)', 'var(--warning)', 'var(--success)'];

export default function RAGWidget() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>RAG Lineage</span>
          <Info size={13} style={{ color: 'var(--text-muted)' }} />
        </div>
        <Link to="/rag" className="flex items-center gap-1 text-xs hover:underline" style={{ color: 'var(--accent)' }}>
          View <ArrowUpRight size={12} />
        </Link>
      </div>

      <div className="space-y-0">
        {ragLineageNodes.map((item, i) => {
          const Icon = icons[i];
          const col = colors[i];
          return (
            <div key={i}>
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                  style={{ background: col + '18' }}>
                  <Icon size={12} style={{ color: col }} />
                </div>
                <div>
                  <div className="text-[11px] font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</div>
                  <div className="text-[10px] mono" style={{ color: 'var(--text-muted)' }}>{item.detail}</div>
                </div>
              </div>
              {i < ragLineageNodes.length - 1 && (
                <div className="ml-[11px] w-px h-4 my-0.5" style={{ background: 'var(--border-strong)' }} />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
