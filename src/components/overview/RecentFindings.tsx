import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { recentFindings } from '../../data/mock';
import Badge from '../shared/Badge';
import Card from '../shared/Card';

export default function RecentFindings() {
  return (
    <Card padding={false}>
      <div className="flex items-center justify-between px-4 py-3.5"
        style={{ borderBottom: '1px solid var(--border)' }}>
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Critical Findings</span>
        <Link to="/findings" className="flex items-center gap-1 text-xs hover:underline"
          style={{ color: 'var(--accent)' }}>
          View all <ArrowUpRight size={12} />
        </Link>
      </div>

      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-muted)' }}>
            {['Finding', 'System', 'Severity', 'First Detected', 'Status'].map(h => (
              <th key={h} className="px-4 py-2.5 text-left text-[11px] font-medium"
                style={{ color: 'var(--text-muted)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {recentFindings.map((f, i) => (
            <tr key={f.id}
              className="transition-colors hover:opacity-80 cursor-pointer"
              style={{
                borderBottom: i < recentFindings.length - 1 ? '1px solid var(--border-muted)' : 'none',
                background: 'transparent',
              }}>
              <td className="px-4 py-3">
                <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{f.finding}</div>
                <div className="text-[10px] mono mt-0.5" style={{ color: 'var(--text-muted)' }}>{f.id}</div>
              </td>
              <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{f.system}</td>
              <td className="px-4 py-3"><Badge label={f.severity} /></td>
              <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>{f.firstDetected}</td>
              <td className="px-4 py-3"><Badge label={f.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
