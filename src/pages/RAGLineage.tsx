import { Database, ArrowDown, Brain, LayoutGrid, Bot, AlertTriangle } from 'lucide-react';
import PageShell from '../components/layout/PageShell';
import Badge from '../components/shared/Badge';
import { ragLineages } from '../data/mock';

const stageIcons = [Database, ArrowDown, Brain, LayoutGrid, Bot];
const stageColors = ['var(--accent)', 'var(--text-muted)', 'var(--purple)', 'var(--warning)', 'var(--success)'];
const stageLabels = ['Source', 'Pipeline', 'Embedding', 'Index', 'Consumer'];

const classColors: Record<string, string> = {
  PII:          'var(--danger)',
  Confidential: 'var(--orange)',
  Internal:     'var(--warning)',
  Public:       'var(--success)',
};

export default function RAGLineage() {
  return (
    <PageShell
      title="RAG Lineage"
      subtitle="End-to-end data flow from source to AI consumer"
    >
      <div className="space-y-4">
        {ragLineages.map(rag => (
          <div key={rag.id} className="rounded-xl p-5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{rag.name}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{rag.system}</div>
              </div>
              <div className="flex items-center gap-2">
                {rag.dataClass in classColors && (
                  <div className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg"
                    style={{
                      background: classColors[rag.dataClass] + '15',
                      color: classColors[rag.dataClass],
                      border: `1px solid ${classColors[rag.dataClass]}30`,
                    }}>
                    <AlertTriangle size={11} />
                    {rag.dataClass}
                  </div>
                )}
                <Badge label={rag.status} />
              </div>
            </div>

            {/* Pipeline stages */}
            <div className="flex items-center gap-0">
              {[rag.source, rag.pipeline, rag.embedding, rag.index, rag.consumer].map((detail, i) => {
                const Icon = stageIcons[i];
                const col = stageColors[i];
                const isLast = i === 4;
                return (
                  <div key={i} className="flex items-center">
                    <div className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl min-w-[140px]"
                      style={{
                        background: col + '08',
                        border: `1px solid ${col}20`,
                      }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: col + '20' }}>
                        <Icon size={15} style={{ color: col }} />
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] font-semibold uppercase tracking-wide mb-0.5"
                          style={{ color: col }}>{stageLabels[i]}</div>
                        <div className="text-[11px] font-medium" style={{ color: 'var(--text-primary)' }}>{detail}</div>
                      </div>
                    </div>
                    {!isLast && (
                      <div className="flex items-center px-1">
                        <div className="w-6 h-px" style={{ background: 'var(--border-strong)' }} />
                        <div className="w-0 h-0" style={{
                          borderTop: '3px solid transparent',
                          borderBottom: '3px solid transparent',
                          borderLeft: `4px solid var(--border-strong)`,
                        }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
