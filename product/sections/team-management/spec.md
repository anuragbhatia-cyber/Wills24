# Team Management Specification

## Overview
Unified section for managing internal users, lawyers, and employees. Provides role-based access control, a searchable lawyer directory with case tracking, and HRMS capabilities for employee management — all organized in a tabbed interface.

## User Flows

### Users & Roles Tab
- View a searchable, filterable table of all internal users (Admin, Sales, Ops, Legal, Accounts, HR)
- Each row shows: name, email, role, department, status (active/inactive), last login
- Add a new user via a slide-over or modal form: name, email, phone, role assignment, department
- Edit an existing user's details or role
- Deactivate/reactivate a user (soft delete — never hard delete)
- View a role permissions matrix showing module-level access per role (read-only reference)
- Filter users by role, department, and status

### Lawyers Directory Tab
- View a searchable directory of lawyers displayed as a table
- Each row shows: name, specialization, Bar Council ID, location, experience (years), availability status, active cases count, rating
- Availability status: Available, On Leave, Overloaded — shown with color-coded badges
- Click a lawyer row to expand or view a detail panel showing:
  - Full profile (email, phone, specialization, Bar Council ID, location, experience)
  - Case assignment summary: active cases, total cases handled, success rate
  - Performance metrics: avg resolution time, client rating (star display)
  - Uploaded documents: Bar Council Certificate, ID Proof, Qualification Certificates
- Add a new lawyer via form: name, email, phone, specialization, Bar Council ID, location, experience years
- Edit lawyer details or update availability status
- Filter by specialization, location, and availability

### Employees (HRMS) Tab
- View a searchable employee directory as a table
- Each row shows: employee ID, name, department, designation, date of joining, status (active/inactive)
- Add a new employee via a multi-section form:
  - Basic Info: first name, last name, email, mobile, gender, DOB
  - Company Details: department, designation, date of joining, reporting manager
  - Address: current and permanent address
  - KYC Documents: Aadhaar, PAN, Driving License, Cancelled Cheque (upload with preview)
  - Bank Details: bank name, account number, IFSC code
- View employee detail with all sections of information
- Edit/deactivate employees
- Filter by department, designation, and status

## UI Requirements
- Single page with 3 tabs: Users & Roles, Lawyers Directory, Employees (HRMS)
- Consistent table design across all tabs with search bar, filters, and "Add" button in the header
- Role permissions matrix displayed as a compact grid/table in the Users & Roles tab (read-only reference)
- Color-coded status badges: active (green), inactive (gray), available (green), on-leave (amber), overloaded (red)
- Star rating display for lawyer performance
- KYC document upload indicators (uploaded/pending) shown as pill badges
- Responsive layout: tables scroll horizontally on mobile

## Configuration
- shell: true
