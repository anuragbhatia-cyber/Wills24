# Case Management Specification

## Overview
Cases are created against converted customers for availed services. This module handles case lifecycle management — creation, lawyer assignment, follow-up timelines, document generation, and progress tracking through defined case levels (Not Started → Drafting → Review → Court Filing → Delivered).

## Screens
- Case List View — Searchable/filterable table with status tabs and case counts
- Add New Case Form — Case creation form with customer/service/lawyer selection
- Case Detail View — Tabbed view with Follow-ups, Details, Notes, Find Lawyer, Documents

## User Flows
- View all cases with filters: Search, Case Level, Status, Assigned Lawyer, Service Type, Customer, Date Range
- Create a new case: Select customer, service type, assign lawyer, set priority, add description
- View case details across tabs: Follow-ups timeline, Case Details, Notes, Find Lawyer, Documents
- Add follow-up entries with service-specific actions, status changes, and priority
- Assign or reassign lawyers to cases
- Track case progress through levels: Not Started → Drafting → Review → Court Filing → Delivered
- View and manage documents generated for a case

## UI Requirements
- Status tabs with counts: All, In Progress, Drafting, Under Review, Approved, Completed, On Hold
- Table columns: Case ID, Customer ID, Customer Name, Service Type, Assigned Lawyer, Status, Follow-ups, Last Updated, Actions
- Case ID format: W24-CASE-XXXXX
- Actions per row: View, Edit
- Case header with Case ID, Customer details, Service type, Assigned Lawyer, Case Status, Case Level
- 5-tab detail view: Follow-ups, Case Details, Notes, Find Lawyer, Documents
- Follow-up timeline (chronological, most recent first) with title, notes, timestamp, author, status change, priority, and service-specific actions
- Service-specific follow-up actions:
  - Will services: Drafting, Client Review, Revision, Registration, Advisory
  - Trust services: Trust Drafting, Client Review, Trust Registration, Advisory
  - Succession Certificate: Application Filing, Court Hearing, Certificate Obtained
- Case level progress bar: Not Started → Drafting → Review → Court Filing → Delivered
- Add New Case form: Customer selection dropdown, service type (auto-populated from customer's availed services), lawyer assignment dropdown, case level classification, priority, description, notes, document requirements checklist
- Auto-generated Case ID on creation

## Configuration
- shell: true
