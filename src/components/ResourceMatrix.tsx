import type { AppSummary } from '../types/workload';

interface Props {
  apps: AppSummary[];
}

export function ResourceMatrix({ apps }: Props) {
  const activeApps = apps.filter((a) => a.totalReleases > 0);

  return (
    <section className="section">
      <h2 className="section-title">
        Team Contribution Matrix
        <span>QA resources per application</span>
      </h2>
      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Application</th>
              <th>Fleet</th>
              <th>Releases</th>
              <th>Stories</th>
              <th>Bugs</th>
              <th>QA</th>
            </tr>
          </thead>
          <tbody>
            {activeApps.map((app) => (
              <tr key={app.project}>
                <td>
                  <strong>{app.project}</strong>
                </td>
                <td>
                  <span className="fleet-tag">{app.fleet ?? '—'}</span>
                </td>
                <td>{app.totalReleases}</td>
                <td>{app.totalStories}</td>
                <td>{app.totalBugs}</td>
                <td>
                  <div className="resource-list">
                    {app.primaryResources.length > 0
                      ? app.primaryResources.map((r) => (
                          <span key={r} className="resource-chip">
                            {r}
                          </span>
                        ))
                      : '—'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
