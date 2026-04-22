# Customers Specification

## Overview
Central repository of all converted customers. A customer is a lead that has been verified by Accounts after payment confirmation. This section provides list and detail views to manage customer records, track services availed, monitor cases, access documents, and review payment history.

## Screens
- Customer List View — Searchable/filterable table with KPI summary cards (Total Customers, Active Cases, Services Availed, Revenue Generated)
- Customer Detail View — Tabbed profile with Services, Cases, Documents, Payments, and Follow-up history

## User Flows
- View all converted customers with filters: Search, Wealth Manager, Service Type, Status, Date Range
- View customer details across tabs: Profile, Services, Cases, Documents, Payments, Follow-ups
- Edit customer information and contact details
- Send quotation for additional/repeat services (routed through Accounts for payment confirmation)
- View linked cases and their current status
- View all generated documents (Wills, Trusts, Succession Certificates)
- View payment history, invoices, and pending amounts
- View assigned Wealth Manager details and contact info
- Track complete interaction history as a follow-up timeline

## UI Requirements
- KPI summary cards: Total Customers, Active Cases, Services Availed, Revenue Generated
- Table columns: Customer ID, Name, Contact, Company, Wealth Manager, Services Availed, Active Cases, Status, Actions
- Actions per row: View Details, Edit, Send Quotation, View Cases, View Documents
- Customer ID format: WCUS-XXXXX
- Tabbed detail view with 6 tabs: Profile, Services, Cases, Documents, Payments, Follow-ups
- Profile tab: Full customer information, contact details, company, designation
- Services tab: List of all availed services with status and linked case references
- Cases tab: All cases associated with this customer with status and assigned lawyer
- Documents tab: All generated documents (Wills, Trusts, Certificates) with download actions
- Payments tab: Payment history, invoices, refunds, and pending amounts
- Follow-ups tab: Complete interaction history as timeline with dates, notes, and status changes
- Wealth Manager info card showing assigned WM details on the detail view
- Status badges: Active, Inactive, Pending

## Configuration
- shell: true
