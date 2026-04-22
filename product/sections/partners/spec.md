# Partners Specification

## Overview
The Partners section manages Wealth Managers (channel partners) who purchase packages of wills and serve clients using those credits. Admins can onboard new WMs, track their package usage and will credits, manage their wallet transactions, view their sub-teams, and monitor customer/sales metrics.

## Screens
- Wealth Manager List View — Searchable/filterable table with KPI badges and status management
- Add/Edit Wealth Manager Form — Multi-section form for profile, company, permissions, and package selection
- Wealth Manager Detail View — Tabbed view with Follow-ups, Wallet, Team, Customers, Packages

## User Flows
- View all Wealth Managers with filters: Search, Partner Tier, Status
- Activate/deactivate Wealth Managers via ON/OFF toggle
- Onboard a new WM: Profile info, address, company details, permissions, package tier selection
- View WM details across tabs: Follow-ups history, Wallet transactions, Team members, Tagged customers, Package purchase history
- Track WM performance: Total Sales, Active WMs count, Wills Remaining
- Manage WM wallet: View package purchase debits and will usage entries
- View WM's sub-team members and customers

## UI Requirements
- KPI badges: Total Sales, Total Active Wealth Managers, Wills Remaining
- Table columns: WM ID (PAT-XX), Photo, Name, Contact, Company, GST/PAN Docs, Total Sales, Status, Actions
- Actions per row: ON/OFF Toggle, View, Edit Profile, View Customers, View Packages
- WM ID format: PAT-XXXXX
- Add/Edit form sections: Basic Info (name, email, phone, gender, DOB), Address (country, state, city, area, pin code), Company (company name, email, GST, PAN, bank details), Permissions (module access checkboxes), Package selection (tier cards with wills, price, validity)
- 5-tab detail view: Follow-ups, Wallet, Team, Customers, Packages
- Wallet: Package purchase and will usage entries with title, customer, type, amount/credits, remarks
- Team: Members table with name, email, phone, designation, status
- Customers: Tagged customers with service type, linked cases, and sales value
- Packages: Purchase history with tier, wills included/used/remaining, price, validity, status

## Configuration
- shell: true
