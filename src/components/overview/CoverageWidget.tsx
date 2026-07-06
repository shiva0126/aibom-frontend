import { Info, Crosshair } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../shared/Card';
import { useSystems, useAtlasCoverage, useAtlasMatrix } from '../../api/hooks';

export default function CoverageWidget() {
  const { data: systems } = useSystems();
  const firstId = systems?.[0]?.id ?? '__skip__';
  const { data: coverage } = useAtlasCoverage(firstId);
  const { data: matrix } = useAtlasMatrix();

  const observedTactics = coverage?.tactics.filter(t => t.observed) ?? [];

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Crosshair size={14} style={{ color: 'var(--purple)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>ATLAS Coverage</span>
          <Info size={13} style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-1px' }}>
          {coverage ? coverage.observed_tactic_count : '—'}
        </span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          / {coverage?.total_tactic_count ?? 16} tactics observed
        </span>
      </div>

      <div className="space-y-2 mb-3">
        {observedTactics.length === 0 ? (
          <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>No adversary tactics observed for this system.</div>
        ) : observedTactics.map(t => (
          <div key={t.id} className="flex items-center gap-2">
            <span className="text-[9px] mono" style={{ color: 'var(--purple)', width: 64 }}>{t.id}</span>
            <span className="text-[11px] flex-1" style={{ color: 'var(--text-secondary)' }}>{t.name}</span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: 'var(--danger-muted)', color: 'var(--danger)' }}>{t.technique_count}</span>
          </div>
        ))}
      </div>

      {matrix && (
        <div className="text-[10px] mb-2" style={{ color: 'var(--text-muted)' }}>
          Platform detects {matrix.detectable_technique_count} of {matrix.total_technique_count} ATLAS techniques · v{matrix.atlas_version}
        </div>
      )}

      <Link to="/atlas" className="text-[11px] hover:underline" style={{ color: 'var(--accent)' }}>
        View ATLAS matrix →
      </Link>
    </Card>
  );
}
