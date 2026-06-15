import type { ExecutiveSummary } from '../types/workload';

interface Props {
  summary: ExecutiveSummary;
}

export function ExecutiveSummarySection({ summary }: Props) {
  const kpis = [
    {
      label: 'Total Releases',
      value: summary.totalReleases,
      sub: 'Title Core (YTD)',
      highlight: true,
    },
    {
      label: 'Active Apps',
      value: summary.activeApps,
      sub: `of ${summary.totalApps} tracked`,
    },
    {
      label: 'Stories Tested',
      value: summary.totalStories,
      sub: 'Across all releases',
    },
    {
      label: 'Bugs Worked',
      value: summary.totalBugs,
      sub: 'Bug-fix releases',
    },
    {
      label: 'QA Resources',
      value: summary.uniqueQaResources,
      sub: 'Primary (unique)',
    },
    {
      label: 'Highest Workload',
      value: summary.topAppByReleases ?? '—',
      sub: 'By release count',
    },
  ];

  return (
    <section className="section">
      <h2 className="section-title">Executive Summary</h2>
      <div className="kpi-grid">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className={`kpi-card${kpi.highlight ? ' highlight' : ''}`}
          >
            <div className="label">{kpi.label}</div>
            <div className="value">{kpi.value}</div>
            <div className="sub">{kpi.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
