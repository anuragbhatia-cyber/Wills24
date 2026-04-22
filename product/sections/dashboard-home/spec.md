# Dashboard Home Specification

## Overview
The Dashboard Home is the admin landing page that provides a comprehensive operational overview of the Wills24 platform. It displays KPI cards across sales, cases, customers, and team metrics, along with visual charts, a real-time activity feed, pending items/SLA alerts, and quick action shortcuts — all filterable by a custom date range selector.

## Screens
- Dashboard Home — single-page overview with KPIs, charts, activity feed, alerts, and quick actions

## User Flows
- View key performance metrics at a glance across sales, cases, customers, partners, and team
- Adjust the date range using a custom period selector to analyze trends over any time period
- View recent activity feed showing the latest actions across the system (leads, cases, payments, partner updates)
- Monitor pending items and SLA alerts: overdue follow-ups, pending payouts, SLA breaches, upcoming deadlines
- Execute quick actions: Add Lead, Create Case, Create Quotation, Assign Lawyer, Add Partner, Process Payout, Generate Invoice, Upload Document, Schedule Follow-up
- View visual charts: sales trend line, case status breakdown, monthly revenue bars, lead conversion funnel

## UI Requirements
- Date range selector at the top with preset options (Today, This Week, This Month, This Quarter) and custom date picker
- KPI cards row: Total Sales, Revenue This Month, Active Cases, Completed Cases, Avg Resolution Time, New Leads, Active Partners, Pending Payouts, Active Team Members, Tasks Assigned
- Charts section: Sales trend (line), case status distribution (donut/pie), monthly revenue (bar), lead-to-customer conversion (funnel). Use placeholder chart visualizations built with Tailwind (CSS-only bars, segments, etc.)
- Activity feed: Chronological timeline with actor name, action description, entity reference, and timestamp. Show the latest 10–15 entries with color-coded action types
- Pending/Alerts panel: SLA breach warnings (red), overdue follow-ups (amber), pending approvals (blue), upcoming deadlines (neutral) — grouped by severity
- Quick actions grid: Icon + label shortcut buttons for the 9 frequent actions across modules
- Mobile responsive: KPI cards 2-col on mobile, charts stack to single column, feed and alerts below charts
- Greeting header: "Good morning, [User]" with current date

## Configuration
- shell: true
