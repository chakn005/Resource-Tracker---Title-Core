import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { AppSummary } from '../types/workload';
import { APP_COLORS } from '../lib/chartColors';

interface Props {
  apps: AppSummary[];
}

export function ReleasesByAppPieChart({ apps }: Props) {
  const data = apps
    .filter((app) => app.totalReleases > 0)
    .map((app) => ({
      name: app.project,
      value: app.totalReleases,
    }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return <div className="empty-state">No release data available.</div>;
  }

  return (
    <div className="card">
      <h3 className="section-title">
        Releases by Application
        <span>Share of total releases per app</span>
      </h3>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={APP_COLORS[index % APP_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#1a2332',
                border: '1px solid #2d3a4f',
                borderRadius: 8,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
