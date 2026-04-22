# Accounts Specification

## Overview
The Accounts section handles payment confirmation, GST-compliant invoicing, and the critical lead-to-customer conversion. It receives leads assigned from Sales CRM, verifies payments, generates Proforma Invoices and Tax Invoices, converts leads to customers with unique IDs, and manages refund workflows with approval chains.

## Screens
- Accounts List View — KPI summary cards (Total PI Sent, Total Pending Amount, Received Payment, Total Quotations Sent) with status-tabbed data table (PI Sent, Payment Received, Invoice Sent, Subscription Enabled)
- Payment Confirmation — Record payment with invoice date, amount, GST, received date, amount received, TDS, and payment mode; supports partial payments with automatic balance tracking
- Lead-to-Customer Conversion — Conversion flow generating unique Customer ID (W24-CUST-XXXXX), carrying over all lead data, linking to original Wealth Manager, and triggering WM notification
- Invoice Management — Proforma Invoice and Tax Invoice generation with GST compliance (auto-determine CGST+SGST vs IGST based on buyer/seller state), invoice tracking with Pending/Paid statuses and aging analysis
- Refund Workflow — Refund initiation from payment records with original invoice reference, amount, reason, type (Full/Partial), multi-level approval workflow, auto-generated GST-compliant Credit Notes, and status tracking (Requested → Pending Approval → Approved → Processed → Completed)

## User Flows
- View leads assigned from Sales CRM with payment status and KPI summary
- Record payment with mode (NEFT, RTGS, IMPS, UPI, Cheque, Cash, Online Gateway), amount, TDS, and auto-generate receipts
- Support partial payments with automatic balance tracking across multiple payment entries
- Convert a paid lead to customer with auto-generated Customer ID (W24-CUST-XXXXX) and Wealth Manager linkage
- Generate and send Proforma Invoice / Tax Invoice with GST compliance (CGST+SGST or IGST)
- Initiate refund with approval workflow: Requested → Pending Approval → Approved → Processed → Completed
- Auto-generate GST-compliant Credit Notes on refund approval
- Generate repeat service quotations for existing customers (routed back through Accounts for payment confirmation)
- Track invoice aging and pending amounts with status indicators

## UI Requirements
- Summary KPI cards at top: Total PI Sent, Total Pending Amount, Received Payment, Total Quotations Sent
- Status tabs with counts: PI Sent, Payment Received, Invoice Sent, Subscription Enabled
- Table columns: Lead ID, Contact, Company, Wealth Manager, Quotation Ref, Amount, Status, Actions
- Actions per record: View Details, Edit, Follow-up, Send PI, Send Invoice, Record Payment, Convert to Customer
- Payment form with fields: Invoice Date, Amount, GST, Received Date, Amount Received, TDS, Payment Mode dropdown
- Payment modes supported: NEFT, RTGS, IMPS, UPI, Cheque, Cash, Online Gateway
- GST auto-determination display: CGST+SGST vs IGST based on buyer/seller state comparison
- Refund form: Original Invoice reference, Refund Amount, Reason, Type (Full/Partial)
- Refund status badges with multi-level approval chain visualization
- Invoice aging analysis with color-coded indicators
- Auto-generated receipts on payment confirmation

## Configuration
- shell: true
