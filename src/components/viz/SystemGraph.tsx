import { useMemo, useState } from 'react';
import {
  Brain, Cpu, Server, Bot, Database, Wrench, Layers, Package, Plug, Box,
  type LucideIcon,
} from 'lucide-react';
import type { GraphNode, GraphEdge } from '../../api/client';

/* entity_type → tier (left→right flow) + icon */
const TYPE_META: Record<string, { tier: number; icon: LucideIcon; label: string }> = {
  dataset:          { tier: 0, icon: Layers,   label: 'Dataset' },
  s3_bucket:        { tier: 0, icon: Package,  label: 'Bucket' },
  knowledge_base:   { tier: 1, icon: Database, label: 'Knowledge Base' },
  foundation_model: { tier: 2, icon: Brain,    label: 'Foundation Model' },
  fine_tuned_model: { tier: 2, icon: Cpu,      label: 'Fine-tuned Model' },
  model_endpoint:   { tier: 3, icon: Server,   label: 'Endpoint' },
  agent:            { tier: 4, icon: Bot,      label: 'Agent' },
  tool:             { tier: 5, icon: Wrench,   label: 'Tool' },
  mcp_server:       { tier: 5, icon: Plug,     label: 'MCP Server' },
};
const meta = (t: string) => TYPE_META[t] ?? { tier: 3, icon: Box, label: t };

const COL_W = 176;
const NODE_W = 148;
const NODE_H = 46;
const ROW_H = 62;
const PAD_X = 20;
const PAD_Y = 24;

interface Positioned extends GraphNode { x: number; y: number; icon: LucideIcon; typeLabel: string; }

export default function SystemGraph({ nodes, edges }: { nodes: GraphNode[]; edges: GraphEdge[] }) {
  const [hover, setHover] = useState<string | null>(null);

  const { placed, width, height } = useMemo(() => {
    // group by tier, then normalise tiers to consecutive columns actually present
    const byTier = new Map<number, GraphNode[]>();
    for (const n of nodes) {
      const t = meta(n.entity_type).tier;
      if (!byTier.has(t)) byTier.set(t, []);
      byTier.get(t)!.push(n);
    }
    const tiers = [...byTier.keys()].sort((a, b) => a - b);
    const maxRows = Math.max(1, ...[...byTier.values()].map(v => v.length));

    const placed: Positioned[] = [];
    tiers.forEach((t, col) => {
      const group = byTier.get(t)!;
      const colH = group.length * ROW_H;
      const startY = PAD_Y + (maxRows * ROW_H - colH) / 2;
      group.forEach((n, i) => {
        const m = meta(n.entity_type);
        placed.push({
          ...n,
          x: PAD_X + col * COL_W,
          y: startY + i * ROW_H,
          icon: m.icon,
          typeLabel: m.label,
        });
      });
    });
    return {
      placed,
      width: PAD_X * 2 + Math.max(1, tiers.length) * COL_W - (COL_W - NODE_W),
      height: PAD_Y * 2 + maxRows * ROW_H,
    };
  }, [nodes, edges]);

  const posById = useMemo(() => {
    const m = new Map<string, Positioned>();
    placed.forEach(p => m.set(p.id, p));
    return m;
  }, [placed]);

  const connected = useMemo(() => {
    if (!hover) return null;
    const s = new Set<string>([hover]);
    edges.forEach(e => { if (e.from === hover) s.add(e.to); if (e.to === hover) s.add(e.from); });
    return s;
  }, [hover, edges]);

  if (nodes.length === 0) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>No components in this system's graph.</div>;
  }

  return (
    <div style={{ overflowX: 'auto', overflowY: 'hidden' }}>
      <svg width={width} height={height} style={{ display: 'block', minWidth: '100%' }}>
        <defs>
          <marker id="sg-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M1 1 L7 4 L1 7" fill="none" stroke="var(--border-strong)" strokeWidth="1.2" />
          </marker>
        </defs>

        {/* edges */}
        {edges.map(e => {
          const a = posById.get(e.from), b = posById.get(e.to);
          if (!a || !b) return null;
          const x1 = a.x + NODE_W, y1 = a.y + NODE_H / 2;
          const x2 = b.x, y2 = b.y + NODE_H / 2;
          const mx = (x1 + x2) / 2;
          const active = connected && connected.has(e.from) && connected.has(e.to);
          const dim = connected && !active;
          return (
            <path key={e.id}
              d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
              fill="none"
              stroke={active ? 'var(--accent)' : 'var(--border-strong)'}
              strokeWidth={active ? 1.6 : 1.2}
              markerEnd="url(#sg-arrow)"
              opacity={dim ? 0.25 : 1}
              style={{ transition: 'stroke 0.15s ease, opacity 0.15s ease' }}
            />
          );
        })}

        {/* nodes */}
        {placed.map(n => {
          const Icon = n.icon;
          const active = connected?.has(n.id);
          const dim = connected && !active;
          return (
            <g key={n.id}
              transform={`translate(${n.x} ${n.y})`}
              onMouseEnter={() => setHover(n.id)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: 'default', opacity: dim ? 0.35 : 1, transition: 'opacity 0.15s ease' }}
            >
              <rect
                width={NODE_W} height={NODE_H} rx={9}
                fill="var(--bg-elevated)"
                stroke={active ? 'var(--accent)' : 'var(--border)'}
                strokeWidth={active ? 1.5 : 1}
              />
              <rect x={0} y={0} width={3} height={NODE_H} rx={1.5} fill="var(--accent)" opacity={active ? 1 : 0.45} />
              <foreignObject x={10} y={7} width={NODE_W - 16} height={NODE_H - 12}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: '100%' }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                    background: 'var(--accent-muted)', border: '1px solid var(--accent-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={13} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.1,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {n.display_name}
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>{n.typeLabel}</div>
                  </div>
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
