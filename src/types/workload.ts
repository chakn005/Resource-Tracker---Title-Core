export interface ReleaseBreakdown {
  stories: number;
  bugs: number;
}

export interface WorkloadRecord {
  month: string | null;
  primaryResource: string | null;
  fleet: string | null;
  project: string;
  releases: number;
  releaseVersion: string | null;
  testPlanLink: string | null;
  backupResource: string | null;
  primaryResources: string[];
  backupResources: string[];
  releaseBreakdown: ReleaseBreakdown[];
  totalStories: number;
  totalBugs: number;
}

export interface WorkloadDataset {
  source: string;
  sheet: string;
  lastUpdated: string;
  records: WorkloadRecord[];
}

export interface AppSummary {
  project: string;
  fleet: string | null;
  totalReleases: number;
  totalStories: number;
  totalBugs: number;
  primaryResources: string[];
  monthsActive: number;
  workloadScore: number;
}

export interface ExecutiveSummary {
  totalReleases: number;
  activeApps: number;
  totalApps: number;
  totalStories: number;
  totalBugs: number;
  uniqueQaResources: number;
  topAppByReleases: string | null;
  lastUpdated: string;
}

export interface MonthlyTrendRow {
  month: string;
  label: string;
  totalReleases: number;
  apps: Record<string, number>;
}

export interface MonthlyTrendData {
  rows: MonthlyTrendRow[];
  appNames: string[];
}

export interface DashboardData {
  summary: ExecutiveSummary;
  apps: AppSummary[];
  monthlyTrend: MonthlyTrendData;
}
