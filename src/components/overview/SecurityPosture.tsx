import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight } from 'lucide-react';
import { postureTrend, postureBreakdown } from '../../data/mock';
import Card from '../shared/Card';

export default function SecurityPosture() {
  return (
    <Card padding={false}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>AI Security Posture</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>7-day rolling score</div>
        </div>
        <button
          style={{
            fontSize: 11,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: 'var(--accent)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Details <ArrowUpRight size={12} />
        </button>
      </div>

      <div style={{ padding: '16px', display: 'flex', gap: 16 }}>
        {/* Donut + Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ position: 'relative', width: 120, height: 120 }}>
            <PieChart width={120} height={120}>
              <Pie
                data={postureBreakdown}
                cx={56} cy={56}
                innerRadius={36} outerRadius={52}
                startAngle={90} endAngle={-270}
                dataKey="value"
                strokeWidth={2}
                stroke="var(--bg-card)"
              >
                {postureBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-1px', lineHeight: 1 }}>
                72
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>/100</span>
            </div>
          </div>

          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 5, width: '100%' }}>
            {postureBreakdown.map((b) => (
              <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: b.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', flex: 1 }}>{b.name}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>{b.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trend Chart */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={postureTrend} margin={{ top: 4, right: 4, bottom: 0, left: -22 }}>
              <defs>
                <linearGradient id="posGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-line)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="var(--chart-line)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'Inter' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[50, 80]}
                tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'Inter' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 8,
                  fontSize: 11,
                  fontFamily: 'Inter',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}
                labelStyle={{ color: 'var(--text-muted)', marginBottom: 2 }}
                itemStyle={{ color: 'var(--chart-line)', fontWeight: 600 }}
                cursor={{ stroke: 'var(--border-strong)', strokeWidth: 1, strokeDasharray: '4 2' }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="var(--chart-line)"
                strokeWidth={2}
                fill="url(#posGrad)"
                dot={false}
                activeDot={{ r: 4, fill: 'var(--chart-line)', strokeWidth: 2, stroke: 'var(--bg-card)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
