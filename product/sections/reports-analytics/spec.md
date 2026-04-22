# Reports & Analytics Specification

## Overview
The Reports & Analytics section provides a comprehensive reporting dashboard with five tabbed categories — Sales, Cases, Accounts, WM Performance, and Documents. Each tab combines KPI summary cards, visual charts (bar, line, donut, funnel), and detailed data tables. A global date range selector with period comparison and export to Excel/PDF are available across all tabs.

## Screens
- Reports & Analytics — single page with 5 tabs (Sales, Cases, Accounts, WM Performance, Documents)

## User Flows
- Switch between report categories using tabs: Sales, Cases, Accounts, WM Performance, Documents
- Filter all reports by date range using presets (This Month, This Quarter, This Year, Custom) and compare with previous period
- View Sales reports: pipeline value, conversion rate, lead source ROI, team-wise performance with bar/funnel charts and breakdown table
- View Case reports: MIS with case status breakdown, resolution time trends, lawyer performance, SLA compliance with donut/line charts and case listing table
- View Accounts reports: revenue summary, outstanding receivables, collection rate, aging analysis with bar charts and receivables table
- View WM Performance reports: sales by wealth manager, conversion funnel, commission payouts, active vs inactive WMs with bar/funnel charts and performance table
- View Document reports: documents created vs approved vs pending, turnaround time (TAT) analysis, template-wise breakdown with line/bar charts and document status table
- Export any report tab as Excel or PDF

## UI Requirements
- Global date range selector at top with presets (This Month, This Quarter, This Year, Custom date picker) and "Compare with previous period" toggle
- Tab bar below date selector: Sales | Cases | Accounts | WM Performance | Documents
- Each tab follows a consistent layout: KPI summary cards row at top, 2-column chart grid in the middle, detailed data table at bottom
- KPI cards show current value, previous period value, and percentage change with up/down indicator
- Charts: CSS-only placeholder visualizations using Tailwind (bars, segments, lines)
- Data tables with sortable columns, and export buttons (Excel, PDF) in the header
- Mobile responsive: KPI cards 2-col, charts stack to single column, table scrolls horizontally
- Export buttons for each tab and a "Download All" option

## Configuration
- shell: true
