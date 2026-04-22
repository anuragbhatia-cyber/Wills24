# Sales CRM Specification

## Overview
The Sales CRM section manages the complete sales pipeline from lead entry to accounts handoff. It provides lead management with status tracking, follow-up and meeting workflows, quotation generation from a configurable services catalog, and the ability to assign leads to Accounts for payment confirmation.

## Screens
- Leads List View — Data table with status tabs (All, New, Assigned, Follow-up, Quotation Sent, Projected, Invoice Sent, Won, Lost), filters, search, bulk actions, and import/export
- Lead Detail View — Full lead profile with follow-up timeline, meetings, quotation history, and assign-to-accounts action
- Add/Edit Lead Form — Multi-field form for capturing lead info with mandatory Wealth Manager assignment
- Quotation Builder — Service selection from CMS catalog, quantity and pricing, preview, and send via email/WhatsApp
- Services Catalog — CRUD for service categories and sub-services with pricing, TAT, and document checklists

## User Flows
- Create a new lead with contact details, service interest, and mandatory Wealth Manager tagging
- Log follow-ups (updates, meetings, quotations) on a lead with chronological timeline
- Generate quotations by selecting services from the catalog, previewing, and sending via email or WhatsApp
- Filter and search leads by status, source, assigned employee, date range, and Wealth Manager
- Import leads in bulk via CSV/Excel and export filtered lists
- Assign a lead to Accounts for payment confirmation (changes status to "Pending Payment")
- Manage services catalog: add/edit/archive service categories, set pricing, TAT, and document checklists

## UI Requirements
- Status tabs with count badges across the top of the list view
- Action buttons: + Add Lead, + Import Leads (with CSV template download), Export
- Lead table columns: Lead ID, Source, Contact (Name/Phone/Email), Company, Wealth Manager, Service Interest, Status, Last Activity, Actions
- Actions per lead: View Details, Edit, Follow-up, Assign to Accounts
- Follow-up timeline displayed chronologically with type badges (Update, Meeting, Quotation)
- Quotation preview with auto-calculated pricing and tax from CMS
- Each quotation has a unique reference number
- Services catalog with active/inactive toggle and pricing history

## Configuration
- shell: true
