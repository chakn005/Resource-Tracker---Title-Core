import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { MonthlyTrendData } from '../types/workload';
import { appColor } from '../lib/chartColors';
import { CHART_THEME } from '../lib/chartTheme';

interface Props {
  trend: MonthlyTrendData;
}

export function MonthlyTrendChart({ trend }: Props) {
  const { rows, appNames } = trend;

  const chartData = rows.map((row) => ({
    label: row.label,
    ...row.apps,
  }));

  const monthLabels = rows.map((row) => row.label);

  if (chartData.length === 0) {
    return <div className="empty-state">No monthly trend data.</div>;
  }

  const appTotals = appNames.map((app) => ({
    app,
    total: rows.reduce((sum, row) => sum + (row.apps[app] ?? 0), 0),
  }));

  return (
    <div className="card">
      <h3 className="section-title">
        Monthly Release Trend
        <span>Each line = one application · table below has exact counts</span>
      </h3>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ left: 4, right: 24, top: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} vertical={false} />
            <XAxis dataKey="label" stroke={CHART_THEME.axis} fontSize={12} />
            <YAxis
              allowDecimals={false}
              stroke={CHART_THEME.axis}
              fontSize={12}
              label={{
                value: 'Releases',
                angle: -90,
                position: 'insideLeft',
                fill: CHART_THEME.axis,
                fontSize: 11,
              }}
            />
            <Tooltip
              contentStyle={{
                background: CHART_THEME.tooltipBg,
                border: `1px solid ${CHART_THEME.tooltipBorder}`,
                borderRadius: 8,
                color: '#f5f7fc',
              }}
              formatter={(value: number, name: string) => [`${value} release${value === 1 ? '' : 's'}`, name]}
            />
            <Legend
              verticalAlign="bottom"
              wrapperStyle={{ paddingTop: 16, fontSize: 12 }}
            />
            {appNames.map((app, index) => (
              <Line
                key={app}
                type="monotone"
                dataKey={app}
                name={app}
                stroke={appColor(index)}
                strokeWidth={2.5}
                dot={{ r: 5, strokeWidth: 2 }}
                activeDot={{ r: 7 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="monthly-matrix-wrap">
        <table className="monthly-matrix">
          <thead>
            <tr>
              <th>Application</th>
              {monthLabels.map((label) => (
                <th key={label}>{label}</th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {appTotals
              .sort((a, b) => b.total - a.total)
              .map(({ app, total }) => (
                <tr key={app}>
                  <td>
                    <span
                      className="matrix-app-dot"
                      style={{ background: appColor(appNames.indexOf(app)) }}
                    />
                    <strong>{app}</strong>
                  </td>
                  {rows.map((row) => {
                    const count = row.apps[app] ?? 0;
                    return (
                      <td key={row.month} className={count > 0 ? 'has-value' : 'no-value'}>
                        {count > 0 ? count : '—'}
                      </td>
                    );
                  })}
                  <td className="total-cell">{total}</td>
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr>
              <td><strong>All apps</strong></td>
              {rows.map((row) => (
                <td key={row.month} className="total-cell">
                  {row.totalReleases}
                </td>
              ))}
              <td className="total-cell">
                {rows.reduce((sum, row) => sum + row.totalReleases, 0)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
