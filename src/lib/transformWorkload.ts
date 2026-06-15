import type {
  AppSummary,
  DashboardData,
  ExecutiveSummary,
  MonthlyTrendData,
  MonthlyTrendRow,
  WorkloadDataset,
  WorkloadRecord,
} from '../types/workload';
import {
  PROJECT_ALIASES,
  RESOURCE_CANONICAL,
  TITLE_CORE_FLEET,
} from './titleCoreConfig';

function normalizeResourceName(name: string): string {
  return name
    .replace(/\s*-\s*SDET$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function resourceKey(name: string): string {
  return normalizeResourceName(name).toLowerCase().replace(/\s+/g, '');
}

function toCanonicalName(name: string): string {
  const key = resourceKey(name);
  return RESOURCE_CANONICAL[key] ?? normalizeResourceName(name);
}

function normalizeProject(project: string): string {
  const key = project.trim().toLowerCase();
  return PROJECT_ALIASES[key] ?? project.trim();
}

function isTitleCoreRecord(record: WorkloadRecord): boolean {
  return record.fleet === TITLE_CORE_FLEET;
}

function hasReleaseWork(item: { stories: number; bugs: number }): boolean {
  return item.stories > 0 || item.bugs > 0;
}

function sanitizeRecord(record: WorkloadRecord): WorkloadRecord {
  const releaseBreakdown = record.releaseBreakdown.filter(hasReleaseWork);
  return {
    ...record,
    releaseBreakdown,
    totalStories: releaseBreakdown.reduce((sum, item) => sum + item.stories, 0),
    totalBugs: releaseBreakdown.reduce((sum, item) => sum + item.bugs, 0),
    releases: releaseBreakdown.length,
  };
}

function prepareTitleCoreRecords(records: WorkloadRecord[]): WorkloadRecord[] {
  return records
    .filter(isTitleCoreRecord)
    .map((record) =>
      sanitizeRecord({
        ...record,
        project: normalizeProject(record.project),
        primaryResources: record.primaryResources.map(toCanonicalName),
      }),
    )
    .filter((record) => record.releases > 0);
}

function dedupeResources(names: string[]): string[] {
  const seen = new Map<string, string>();
  for (const raw of names) {
    const canonical = toCanonicalName(raw);
    const key = resourceKey(canonical);
    if (!seen.has(key)) {
      seen.set(key, canonical);
    }
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b));
}

function computeWorkloadScore(releases: number, stories: number, bugs: number): number {
  return releases * 3 + stories + bugs * 0.5;
}

function buildAppSummaries(records: WorkloadRecord[]): AppSummary[] {
  const byProject = new Map<string, WorkloadRecord[]>();
  for (const record of records) {
    const list = byProject.get(record.project) ?? [];
    list.push(record);
    byProject.set(record.project, list);
  }

  return [...byProject.entries()]
    .map(([project, projectRecords]) => {
      let totalStories = 0;
      let totalBugs = 0;
      let totalReleases = 0;
      const primary: string[] = [];
      const months = new Set<string>();

      for (const record of projectRecords) {
        totalReleases += record.releases;
        totalStories += record.totalStories;
        totalBugs += record.totalBugs;
        primary.push(...record.primaryResources);
        if (record.month) months.add(record.month);
      }

      const fleet =
        projectRecords.find((r) => r.fleet)?.fleet ??
        projectRecords[0]?.fleet ??
        null;

      return {
        project,
        fleet,
        totalReleases,
        totalStories,
        totalBugs,
        primaryResources: dedupeResources(primary),
        monthsActive: months.size,
        workloadScore: computeWorkloadScore(totalReleases, totalStories, totalBugs),
      };
    })
    .sort((a, b) => b.workloadScore - a.workloadScore);
}

function buildExecutiveSummary(
  dataset: WorkloadDataset,
  apps: AppSummary[],
): ExecutiveSummary {
  const totalReleases = apps.reduce((sum, app) => sum + app.totalReleases, 0);
  const activeApps = apps.filter((app) => app.totalReleases > 0).length;
  const totalStories = apps.reduce((sum, app) => sum + app.totalStories, 0);
  const totalBugs = apps.reduce((sum, app) => sum + app.totalBugs, 0);

  const allQa = new Set<string>();
  for (const app of apps) {
    for (const name of app.primaryResources) {
      allQa.add(resourceKey(name));
    }
  }

  const topApp = apps.find((app) => app.totalReleases > 0) ?? null;

  return {
    totalReleases,
    activeApps,
    totalApps: apps.length,
    totalStories,
    totalBugs,
    uniqueQaResources: allQa.size,
    topAppByReleases: topApp?.project ?? null,
    lastUpdated: dataset.lastUpdated,
  };
}

function formatMonthLabel(month: string): string {
  const parts = month.split('-');
  if (parts.length === 2) {
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  }
  return month;
}

function buildMonthlyTrend(records: WorkloadRecord[]): MonthlyTrendData {
  const appNames = [...new Set(records.map((record) => record.project))].sort((a, b) =>
    a.localeCompare(b),
  );
  const byMonth = new Map<string, MonthlyTrendRow>();

  for (const record of records) {
    if (!record.month) continue;
    const existing = byMonth.get(record.month) ?? {
      month: record.month,
      label: formatMonthLabel(record.month),
      totalReleases: 0,
      apps: Object.fromEntries(appNames.map((name) => [name, 0])),
    };
    existing.totalReleases += record.releases;
    existing.apps[record.project] = (existing.apps[record.project] ?? 0) + record.releases;
    byMonth.set(record.month, existing);
  }

  return {
    appNames,
    rows: [...byMonth.values()].sort((a, b) => a.month.localeCompare(b.month)),
  };
}

export function transformWorkloadData(dataset: WorkloadDataset): DashboardData {
  const records = prepareTitleCoreRecords(dataset.records);
  const apps = buildAppSummaries(records);
  return {
    summary: buildExecutiveSummary(dataset, apps),
    apps,
    monthlyTrend: buildMonthlyTrend(records),
  };
}
