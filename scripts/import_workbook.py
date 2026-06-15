#!/usr/bin/env python3
"""Import Title Core sheet from Offshore Team Workload Tracker.xlsx into workload.json."""

import json
import os
import re
from datetime import datetime
from pathlib import Path

import openpyxl

WORKBOOK = Path.home() / "Desktop" / "Offshore Team Workload Tracker.xlsx"
OUTPUT = Path(__file__).resolve().parent.parent / "public" / "data" / "workload.json"


def parse_details(details) -> list[dict]:
    if not details:
        return []
    releases = []
    blocks = re.split(r"Release\d+:", str(details))
    for block in blocks[1:]:
        stories = bugs = 0
        sm = re.search(r"No of stories:\s*(\d+)", block)
        bm = re.search(r"Bugs worked:\s*(\d+)", block)
        if sm:
            stories = int(sm.group(1))
        if bm:
            bugs = int(bm.group(1))
        if stories == 0 and bugs == 0:
            continue
        releases.append({"stories": stories, "bugs": bugs})
    return releases


def norm_month(value) -> str | None:
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.strftime("%Y-%m")
    s = str(value).strip().replace("\n", "")
    months = {
        "jan": "2026-01",
        "feb": "2026-02",
        "mar": "2026-03",
        "apr": "2026-04",
        "may": "2026-05",
        "jun": "2026-06",
    }
    low = s.lower()[:3]
    return months.get(low, s)


def split_names(value) -> list[str]:
    if not value:
        return []
    result = []
    for name in re.split(r"[/,]", str(value)):
        name = re.sub(r"\(.*?\)", "", name).strip()
        name = re.sub(r"\s+", " ", name)
        if name and name.lower() not in ("na", "none"):
            result.append(name)
    return result


def main() -> None:
    if not WORKBOOK.exists():
        raise SystemExit(f"Workbook not found: {WORKBOOK}")

    wb = openpyxl.load_workbook(WORKBOOK, data_only=True)
    ws = wb["Title Core"]

    records = []
    for row in range(2, ws.max_row + 1):
        project = ws.cell(row, 4).value
        if not project:
            continue
        details = ws.cell(row, 6).value
        parsed = parse_details(details)
        if not parsed:
            continue
        records.append(
            {
                "month": norm_month(ws.cell(row, 1).value),
                "primaryResource": ws.cell(row, 2).value,
                "fleet": ws.cell(row, 3).value,
                "project": str(project).strip(),
                "releases": len(parsed),
                "releaseVersion": str(ws.cell(row, 7).value)
                if ws.cell(row, 7).value
                else None,
                "testPlanLink": str(ws.cell(row, 8).value)
                if ws.cell(row, 8).value
                else None,
                "backupResource": ws.cell(row, 9).value,
                "primaryResources": split_names(ws.cell(row, 2).value),
                "backupResources": split_names(ws.cell(row, 9).value),
                "releaseBreakdown": parsed,
                "totalStories": sum(x["stories"] for x in parsed),
                "totalBugs": sum(x["bugs"] for x in parsed),
            }
        )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "source": WORKBOOK.name,
        "sheet": "Title Core",
        "lastUpdated": datetime.now().isoformat(),
        "records": records,
    }
    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)

    print(f"Imported {len(records)} records -> {OUTPUT}")


if __name__ == "__main__":
    main()
