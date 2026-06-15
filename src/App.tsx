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
    fetch(`${import.meta.env.BASE_URL}data/workload.json`)
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

  const lastUpdated = new Date(data.summary.lastUpdated).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Title Core QA Workload Dashboard</h1>
        <p>
          Title Origination &amp; Intent applications only — releases, stories, bugs,
          and QA resources. Last updated {lastUpdated}.
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
    </div>
  );
}

export default App;
