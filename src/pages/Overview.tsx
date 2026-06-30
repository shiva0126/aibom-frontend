import StatsRow from '../components/overview/StatsRow';
import SecurityPosture from '../components/overview/SecurityPosture';
import RecentFindings from '../components/overview/RecentFindings';
import AttackPathWidget from '../components/overview/AttackPathWidget';
import AIBOMWidget from '../components/overview/AIBOMWidget';
import SupplyChainWidget from '../components/overview/SupplyChainWidget';
import AgentsWidget from '../components/overview/AgentsWidget';
import RAGWidget from '../components/overview/RAGWidget';
import CoverageWidget from '../components/overview/CoverageWidget';

export default function Overview() {
  return (
    <div className="page-content" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.4px', lineHeight: 1 }}>
            Overview
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            AI security posture across your environment — updated live
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            style={{
              fontSize: 11,
              fontWeight: 500,
              padding: '6px 12px',
              borderRadius: 8,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            Last 7 days ▾
          </button>
          <button
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: 8,
              background: 'var(--accent)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Export Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <StatsRow />

      {/* Posture + Findings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <SecurityPosture />
        <RecentFindings />
      </div>

      {/* Attack paths + AIBOM */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <AttackPathWidget />
        <AIBOMWidget />
      </div>

      {/* Bottom widgets row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
        <SupplyChainWidget />
        <AgentsWidget />
        <RAGWidget />
        <CoverageWidget />
      </div>
    </div>
  );
}
