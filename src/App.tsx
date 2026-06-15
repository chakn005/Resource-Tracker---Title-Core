import { useEffect, useState } from 'react';
import type { DashboardData, WorkloadDataset } from './types/workload';
import { transformWorkloadData } from './lib/transformWorkload';
import { ExecutiveSummarySection } from './components/ExecutiveSummarySection';
import { ReleasesByAppPieChart } from './components/ReleasesByAppPieChart';
import { MonthlyTrendChart } from './components/MonthlyTrendChart';
import { ResourceMatrix } from './components/ResourceMatrix';

function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dataUrl = `${import.meta.env.BASE_URL}data/workload.json?t=${Date.now()}`;
    fetch(dataUrl, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load workload data');
        return res.json() as Promise<WorkloadDataset>;
      })
      .then((dataset) => setData(transformWorkloadData(dataset)))
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!data) {
    return <div className="loading">Loading Title Core workload data…</div>;
  }

  const lastUpdated = new Date(data.summary.lastUpdated).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const activeAppNames = data.apps
    .filter((app) => app.totalReleases > 0)
    .map((app) => app.project)
    .join(', ');

  return (
    <div className="dashboard">
      <header className="dashboard-header disney-header">
        <div className="brand-bar">
          <span className="brand-mark">Disney</span>
          <span className="brand-divider" aria-hidden="true" />
          <span className="brand-product">Title Core QA</span>
        </div>
        <h1>Workload Dashboard</h1>
        <p>
          Title Origination &amp; Intent — {data.summary.activeApps} apps with releases
          ({activeAppNames}). Data refreshed {lastUpdated}.
        </p>
      </header>

      <ExecutiveSummarySection summary={data.summary} />

      <section className="section">
        <ReleasesByAppPieChart apps={data.apps} />
      </section>

      <section className="section">
        <MonthlyTrendChart trend={data.monthlyTrend} />
      </section>

      <ResourceMatrix apps={data.apps} />

      <footer className="dashboard-footer">
        Disney · Title Origination &amp; Intent · QA Workload Tracker
      </footer>
    </div>
  );
}

export default App;
