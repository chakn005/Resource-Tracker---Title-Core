# Title Core QA Workload Dashboard

Leadership-facing dashboard for **Title Core offshore QA engagement** (Title Origination & Intent fleet), built from the Offshore Team Workload Tracker spreadsheet.

## What it shows

- **Executive Summary** — total releases, active apps, stories, bugs, QA headcount
- **Releases by Application** — pie chart of releases per app
- **Monthly Trend** — releases, stories, and bugs over time
- **Team Contribution Matrix** — releases, stories, bugs, and QA per application

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Live site

**https://chakn005.github.io/Resource-Tracker---Title-Core/**

Repository: [Resource-Tracker---Title-Core](https://github.com/chakn005/Resource-Tracker---Title-Core)

### One-time GitHub Pages setup

After the first push, enable Pages in the repo:

1. Open [Settings → Pages](https://github.com/chakn005/Resource-Tracker---Title-Core/settings/pages)
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**
3. Set **Branch** to `gh-pages` / `/ (root)`
4. Save — the site will be live in 1–2 minutes

Pushes to `main` automatically rebuild and redeploy via GitHub Actions.

## Refresh data from Excel

Place your updated `Offshore Team Workload Tracker.xlsx` on the Desktop, then run:

```bash
python3 scripts/import_workbook.py
```

This regenerates `public/data/workload.json` from the **Title Core** sheet.
