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

After pushing to `main`, GitHub Actions deploys to:

**https://chakn005.github.io/Resource-Tracker---Title-Core/**

Repository: [Resource-Tracker---Title-Core](https://github.com/chakn005/Resource-Tracker---Title-Core)

## Refresh data from Excel

Place your updated `Offshore Team Workload Tracker.xlsx` on the Desktop, then run:

```bash
python3 scripts/import_workbook.py
```

This regenerates `public/data/workload.json` from the **Title Core** sheet.
