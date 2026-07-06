import { ChevronDown } from 'lucide-react';
import StatsRow from '../components/overview/StatsRow';
import SecurityPosture from '../components/overview/SecurityPosture';
import RecentFindings from '../components/overview/RecentFindings';
import CoverageWidget from '../components/overview/CoverageWidget';
import SystemGraph from '../components/viz/SystemGraph';
import PipelineFlow from '../components/viz/PipelineFlow';
import Card from '../components/shared/Card';
import { useStats, useSystems, useSystemGraph, useSnapshots } from '../api/hooks';

function SectionLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>{children}</span>
      {hint && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{hint}</span>}
    </div>
  );
}

export default function Overview() {
  const { data: stats } = useStats();
  const { data: systems } = useSystems();
  const first = systems?.[0];
  const { data: graph } = useSystemGraph(first?.id ?? '__skip__');
  const { data: snapshots } = useSnapshots(first?.id ?? '__skip__');

  return (
    <div className="page-content" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.4px', lineHeight: 1 }}>
            Posture Overview
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 5 }}>
            Live AI security posture across your environment
          </p>
        </div>
        <button style={{
          fontSize: 11, fontWeight: 500, padding: '7px 12px', borderRadius: 8,
          background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          Last 7 days <ChevronDown size={12} />
        </button>
      </div>

      {/* Stats */}
      <StatsRow />

      {/* Evidence pipeline */}
      <Card>
        <SectionLabel hint="ingest → normalise → materialise → snapshot → scan → attack paths">Evidence Pipeline</SectionLabel>
        <PipelineFlow
          observations={stats?.total_observations}
          entities={graph?.nodes.length}
          relationships={graph?.edges.length}
          snapshots={snapshots?.length}
          findings={stats?.open_findings}
          attackPaths={stats?.attack_paths}
        />
      </Card>

      {/* System component map */}
      <Card>
        <SectionLabel hint={first ? first.name : undefined}>System Component Map</SectionLabel>
        {graph
          ? <SystemGraph nodes={graph.nodes} edges={graph.edges} />
          : <div style={{ height: 180, borderRadius: 10, background: 'var(--bg-elevated)', animation: 'shimmer 1.4s infinite', backgroundSize: '200% 100%' }} />}
      </Card>

      {/* Posture + Findings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <SecurityPosture />
        <RecentFindings />
      </div>

      {/* ATLAS coverage */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <CoverageWidget />
        <div />
      </div>
    </div>
  );
}
