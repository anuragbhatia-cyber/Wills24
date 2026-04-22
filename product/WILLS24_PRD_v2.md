**WILLS 24**  
Powered by Lawyered

Product Requirements Document  
*Three-Dashboard Platform*

Admin Dashboard  •  Wealth Manager Dashboard  •  Customer Dashboard

| Field | Details |
| :---- | :---- |
| Version | v2.0 |
| Status | Draft |
| Date | April 2026 |
| Owner | Product Management |
| Confidentiality | Internal — Strictly Confidential |

# **Table of Contents** {#table-of-contents}

[Table of Contents	1](#table-of-contents)

[1\. Product Overview	1](#1.-product-overview)

[1.1 Objectives	1](#1.1-objectives)

[1.2 Platform Architecture	1](#1.2-platform-architecture)

[1.3 Key Stakeholders	1](#1.3-key-stakeholders)

[2\. Customer Lifecycle Journey	1](#2.-customer-lifecycle-journey)

[2.1 Lifecycle Stages	1](#2.1-lifecycle-stages)

[2.2 Lead Tagging — Wealth Manager Assignment	1](#2.2-lead-tagging-—-wealth-manager-assignment)

[3\. Dashboard A — Admin Dashboard	1](#3.-dashboard-a-—-admin-dashboard)

[3.1 Authentication & Access Control	1](#3.1-authentication-&-access-control)

[3.1.1 Login	1](#3.1.1-login)

[3.1.2 Role Permissions Matrix	1](#3.1.2-role-permissions-matrix)

[3.2 Module: Sales CRM (Leads)	1](#3.2-module:-sales-crm-\(leads\))

[3.2.1 Leads List View	1](#3.2.1-leads-list-view)

[3.2.2 Add / Edit Lead	1](#3.2.2-add-/-edit-lead)

[3.2.3 Follow-up & Meetings	1](#3.2.3-follow-up-&-meetings)

[3.2.4 Quotation Generation & Delivery	1](#3.2.4-quotation-generation-&-delivery)

[3.2.5 Assign to Accounts	1](#3.2.5-assign-to-accounts)

[3.3 Module: Accounts	1](#3.3-module:-accounts)

[3.3.1 Accounts List View	1](#3.3.1-accounts-list-view)

[3.3.2 Payment Confirmation	1](#3.3.2-payment-confirmation)

[3.3.3 Lead-to-Customer Conversion	1](#3.3.3-lead-to-customer-conversion)

[3.3.4 Repeat Service Quotations	1](#3.3.4-repeat-service-quotations)

[3.3.5 Invoicing & Billing	1](#3.3.5-invoicing-&-billing)

[3.3.6 Refund Workflow	1](#3.3.6-refund-workflow)

[3.4 Module: Customers	1](#3.4-module:-customers)

[3.4.1 Customer List View	1](#3.4.1-customer-list-view)

[3.4.2 Customer Detail View	1](#3.4.2-customer-detail-view)

[3.5 Module: Cases (Case Management)	1](#3.5-module:-cases-\(case-management\))

[3.5.1 Cases List View	1](#3.5.1-cases-list-view)

[3.5.2 Add New Case	1](#3.5.2-add-new-case)

[3.5.3 Case Detail View	1](#3.5.3-case-detail-view)

[3.5.4 Case Follow-up (Critical Feature)	1](#3.5.4-case-follow-up-\(critical-feature\))

[3.6 Module: Services CMS (Content Management System)	1](#3.6-module:-services-cms-\(content-management-system\))

[3.6.1 Service Categories	1](#3.6.1-service-categories)

[3.6.2 CMS Features	1](#3.6.2-cms-features)

[3.7 Module: Templates Library	1](#3.7-module:-templates-library)

[3.7.1 Template Categories	1](#3.7.1-template-categories)

[3.7.2 Template Features	1](#3.7.2-template-features)

[3.8 Module: Automated Will & Trust Creation	1](#3.8-module:-automated-will-&-trust-creation)

[3.8.1 Creation Flow	1](#3.8.1-creation-flow)

[3.8.2 Technical Features	1](#3.8.2-technical-features)

[3.8.3 Document Download & Export	1](#3.8.3-document-download-&-export)

[3.9 Module: Progress Tracking	1](#3.9-module:-progress-tracking)

[3.9.1 Document/Case Lifecycle Stages	1](#3.9.1-document/case-lifecycle-stages)

[3.9.2 Tracking Features	1](#3.9.2-tracking-features)

[3.10 Module: Wealth Managers (Partners)	1](#3.10-module:-wealth-managers-\(partners\))

[3.10.1 Wealth Manager List View	1](#3.10.1-wealth-manager-list-view)

[3.10.2 Add / Edit Wealth Manager	1](#3.10.2-add-/-edit-wealth-manager)

[3.10.3 Wealth Manager Detail Tabs	1](#3.10.3-wealth-manager-detail-tabs)

[3.11 Module: Users & Teams	1](#3.11-module:-users-&-teams)

[3.12 Module: Lawyers	1](#3.12-module:-lawyers)

[3.13 Module: HRMS	1](#3.13-module:-hrms)

[3.13.1 Employee Management	1](#3.13.1-employee-management)

[3.13.2 Employee List & Directory	1](#3.13.2-employee-list-&-directory)

[3.13.3 New Feature Priorities	1](#3.13.3-new-feature-priorities)

[3.14 Module: Reports & Analytics	1](#3.14-module:-reports-&-analytics)

[3.15 Admin Dashboard Home	1](#3.15-admin-dashboard-home)

[4\. Dashboard B — Wealth Manager Dashboard	1](#4.-dashboard-b-—-wealth-manager-dashboard)

[4.1 Authentication	1](#4.1-authentication)

[4.2 Business Dashboard (Home)	1](#4.2-business-dashboard-\(home\))

[4.3 Leads (Wealth Manager View)	1](#4.3-leads-\(wealth-manager-view\))

[4.4 Customers	1](#4.4-customers)

[4.5 Cases	1](#4.5-cases)

[4.6 Partners (Sub-Partners)	1](#4.6-partners-\(sub-partners\))

[4.7 Wallet	1](#4.7-wallet)

[4.8 Team	1](#4.8-team)

[5\. Dashboard C — Customer Dashboard	1](#5.-dashboard-c-—-customer-dashboard)

[5.1 Authentication	1](#5.1-authentication)

[5.2 My Dashboard (Home)	1](#5.2-my-dashboard-\(home\))

[5.3 My Cases	1](#5.3-my-cases)

[5.4 My Documents	1](#5.4-my-documents)

[5.5 Subscription / Plan Details	1](#5.5-subscription-/-plan-details)

[5.6 Accounts & Payments	1](#5.6-accounts-&-payments)

[5.7 My Wealth Manager	1](#5.7-my-wealth-manager)

[5.8 All Requests	1](#5.8-all-requests)

[5.9 Reports	1](#heading=h.8us3vcmcqw42)

[5.10 Teams	1](#5.9-teams)

[6\. Functional Requirements	1](#6.-functional-requirements)

[7\. Non-Functional Requirements	1](#7.-non-functional-requirements)

[8\. Dependencies & Risks	1](#8.-dependencies-&-risks)

[8.1 Dependencies	1](#8.1-dependencies)

[8.2 Risks & Mitigation	1](#8.2-risks-&-mitigation)

[9\. Success Metrics	1](#9.-success-metrics)

[10\. Future Enhancements	1](#10.-future-enhancements)

[11\. Open Questions	1](#heading=h.24leumk0ibt1)

# **1\. Product Overview** {#1.-product-overview}

WILLS 24 is a comprehensive digital platform by Lawyered that enables end-to-end management of estate planning services including Wills, Trusts, and Succession Certificates. The platform encompasses three distinct dashboards serving different stakeholders: an Admin Dashboard for internal operations, a Wealth Manager Dashboard for channel partners, and a Customer Dashboard for end clients.

The system manages the complete customer lifecycle — from lead acquisition through service delivery — with integrated CRM, case management, accounts, HRMS, legal templates, automated document generation, and a configurable service catalog.

## **1.1 Objectives** {#1.1-objectives}

* Enable complete lead-to-customer lifecycle management: Lead → Sales → Accounts → Customer conversion

* Provide Wealth Managers with a dedicated password-based dashboard to manage assigned leads, customers, and cases

* Offer customers an OTP-based self-service dashboard to view cases, plans, and wealth manager details

* Centralize case management for Wills, Trusts, and Succession Certificates with detailed follow-up tracking

* Manage a configurable service catalog (CMS) with pricing for all service types and sub-services

* Integrate quotation generation and delivery via email and WhatsApp directly from the dashboard

* Enable accounts team to confirm payments and convert leads to customers with unique customer IDs

* Automate document generation for Wills and Trusts using pre-defined legal templates in DOCX and PDF

* Provide HRMS capabilities for internal employee and lawyer management

* Deliver real-time tracking of customer document progress with SLA and TAT monitoring

## **1.2 Platform Architecture** {#1.2-platform-architecture}

The WILLS 24 platform consists of three independent but interconnected dashboards:

| \# | Dashboard | Users | Auth Method | Key Purpose |
| :---- | :---- | :---- | :---- | :---- |
| 1 | Admin Dashboard | Admin, Sales, Ops, Legal, Accounts, HR | Email \+ Password | Full operational control — CRM, cases, accounts, HRMS, services, templates, reports |
| 2 | Wealth Manager Dashboard | Wealth Managers (Partners) | Email \+ Password | Manage assigned leads, customers, cases, team, wallet, commissions |
| 3 | Customer Dashboard | End Customers | Mobile \+ OTP | View cases, subscription plan, wealth manager details, documents, payments |

## **1.3 Key Stakeholders** {#1.3-key-stakeholders}

| Stakeholder | Role | Dashboard Access |
| :---- | :---- | :---- |
| Product Manager | Owns roadmap and delivery | Admin (Full) |
| Admin Team | System configuration, user management, service catalog | Admin (Full) |
| Sales Team | Lead management, quotations, follow-ups, meetings | Admin (Sales Module) |
| Operations Team | Case management, follow-ups, status updates | Admin (Cases Module) |
| Legal Team | Document review, approval, template management | Admin (Legal Access) |
| Accounts Team | Payment confirmation, invoicing, lead-to-customer conversion | Admin (Accounts Module) |
| HR Team | Employee and lawyer management | Admin (HRMS Module) |
| Wealth Manager | Channel partner managing leads and customers | Wealth Manager Dashboard |
| End Customer | Creates/tracks Wills, Trusts via self-service | Customer Dashboard |

# **2\. Customer Lifecycle Journey** {#2.-customer-lifecycle-journey}

The platform follows a structured lead-to-customer conversion process that spans across the Sales, Accounts, and Customer modules.

## **2.1 Lifecycle Stages** {#2.1-lifecycle-stages}

| Stage | Module | Key Actions |
| :---- | :---- | :---- |
| 1\. Lead Entry | Sales CRM | Lead is entered manually or imported; tagged under a Wealth Manager; source captured |
| 2\. Follow-up & Meetings | Sales CRM | Schedule meetings, add follow-up notes, set reminders; log all interactions |
| 3\. Quotation | Sales CRM | Select service type and quantity from CMS; generate quotation; send via Email or WhatsApp |
| 4\. Assign to Accounts | Sales CRM → Accounts | Lead is assigned to Accounts team for payment confirmation |
| 5\. Payment Confirmation | Accounts | Accounts verifies payment; records transaction details; sends PI/Invoice |
| 6\. Convert to Customer | Accounts → Customers | Lead is converted to Customer with unique Customer ID; visible in Customers module |
| 7\. Additional Services | Customers | New quotation can be sent for additional services; must be confirmed by Accounts again |
| 8\. Case Creation | Cases | Case created against customer for availed service with all relevant details |
| 9\. Case Follow-up | Cases | Team updates follow-up with title, notes, automatic date/time stamp |
| 10\. Document Delivery | Cases / Templates | Final documents (Will/Trust) generated, reviewed, approved, and delivered |

## **2.2 Lead Tagging — Wealth Manager Assignment** {#2.2-lead-tagging-—-wealth-manager-assignment}

Every lead MUST be tagged under a Wealth Manager at the time of entry. The Wealth Manager is the primary relationship owner and can view all their assigned leads in the Wealth Manager Dashboard. This tagging is mandatory and drives data visibility, commission calculations, and performance tracking.

# **3\. Dashboard A — Admin Dashboard** {#3.-dashboard-a-—-admin-dashboard}

The Admin Dashboard is the central operational hub for all internal teams. It provides full access to CRM, case management, accounts, HRMS, service catalog, templates, and reporting. Authentication is via email and password with role-based access control.

## **3.1 Authentication & Access Control** {#3.1-authentication-&-access-control}

### **3.1.1 Login** {#3.1.1-login}

* Email and password-based login

* Role-based access control with tiers: Admin, Sales, Operations, Legal, Accounts, HR

* Persistent session management with auto-logout on inactivity

* Audit log of login/logout events with timestamps

### **3.1.2 Role Permissions Matrix** {#3.1.2-role-permissions-matrix}

| Action | Admin | Sales | Ops | Legal | Accounts | HR |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| View/Manage Leads | Yes | Yes | Read-only | No | Read-only | No |
| Create/Send Quotations | Yes | Yes | No | No | No | No |
| Assign Lead to Accounts | Yes | Yes | No | No | No | No |
| Confirm Payments | Yes | No | No | No | Yes | No |
| Convert Lead to Customer | Yes | No | No | No | Yes | No |
| View/Manage Customers | Yes | Yes | Yes | Read-only | Yes | No |
| Create/Manage Cases | Yes | No | Yes | Yes | No | No |
| Update Case Follow-up | Yes | No | Yes | Yes | No | No |
| Approve Documents | Yes | No | No | Yes | No | No |
| Manage Templates | Yes | No | No | Yes | No | No |
| Manage Services (CMS) | Yes | No | No | No | No | No |
| View Activity Logs | Yes | No | No | No | No | No |
| User/Team Management | Yes | No | No | No | No | Yes |
| HRMS Access | Yes | No | No | No | No | Yes |
| Manage Wealth Managers | Yes | Yes | No | No | No | No |
| Manage Lawyers | Yes | No | No | Yes | No | Yes |
| Accounts & Invoicing | Yes | No | No | No | Yes | No |
| Reports & Analytics | Yes | Yes | Yes | Yes | Yes | Yes |

## **3.2 Module: Sales CRM (Leads)** {#3.2-module:-sales-crm-(leads)}

Manages the complete sales pipeline from lead entry to accounts handoff. Mirrors and extends the existing Sales CRM module from the LOTS product.

### **3.2.1 Leads List View** {#3.2.1-leads-list-view}

* Page title with breadcrumb and total lead count

* Action buttons: \+ Add Lead, \+ Import Leads (CSV/Excel with template download)

* Filters: Search (typeahead), Assigned Employee, Source, UTM Source, Lead Type, Date Range

* Export/Download button with format options (CSV, Excel, PDF)

* Status tabs with counts: All, New, Assigned, Follow-up, Quotation Sent, Projected, Invoice Sent, Won, Lost

* Table columns: Lead ID, Source, Contact (Name, Phone, Email), Company, Wealth Manager, Service Interest, Status, Last Activity, Actions

* Actions per lead: View Details, Edit Lead, Follow-up, Assign to Accounts

### **3.2.2 Add / Edit Lead** {#3.2.2-add-/-edit-lead}

* Lead source (Website, Referral, Wealth Manager, Walk-in, Campaign, etc.)

* Contact details: Name, Phone, Email, Address, City, State, Pin Code

* Company details: Company Name, Designation

* Service interest: Dropdown from CMS service catalog

* Wealth Manager assignment (mandatory) — dropdown of active Wealth Managers

* Lead type classification

* Notes / initial comments

### **3.2.3 Follow-up & Meetings** {#3.2.3-follow-up-&-meetings}

Follow-up types supported:

* Update — General status update with notes, next follow-up date, and priority

* Meeting — Schedule meeting with date, time, location/virtual link, agenda; sync to calendar

* Quotation — Generate and send a quotation (see 3.2.4)

Each follow-up entry captures: type, title, notes, date/time (auto-stamped), employee name, and next action date.

Follow-up history displayed as a timeline with chronological entries.

### **3.2.4 Quotation Generation & Delivery** {#3.2.4-quotation-generation-&-delivery}

Quotation is generated directly from the lead detail screen:

1. Select service type from CMS catalog (e.g., Will Drafting, Trust Registration)

2. Select quantity for each service

3. System auto-calculates pricing from CMS with applicable taxes

4. Preview the quotation

5. Send to client via: Send to Email button OR Send to WhatsApp button

Quotation is logged in the lead timeline and linked to the lead record. Multiple quotations can be sent to the same lead. Each quotation has a unique reference number.

### **3.2.5 Assign to Accounts** {#3.2.5-assign-to-accounts}

Once a lead has received a quotation and shown purchase intent, the sales team assigns the lead to the Accounts module for payment confirmation. This changes the lead status to “Pending Payment” and makes it visible in the Accounts queue.

## **3.3 Module: Accounts** {#3.3-module:-accounts}

Handles payment confirmation, invoicing, and the critical lead-to-customer conversion. Mirrors and extends the existing Accounts module.

### **3.3.1 Accounts List View** {#3.3.1-accounts-list-view}

* Summary KPI cards: Total PI Sent, Total Pending Amount, Received Payment, Total Quotations Sent

* Status tabs: PI Sent, Payment Received, Invoice Sent, Subscription Enabled

* Table columns: Lead ID, Contact, Company, Wealth Manager, Quotation Ref, Amount, Status, Actions

* Actions: View Details, Edit, Follow-up, Send PI, Send Invoice, Record Payment, Convert to Customer

### **3.3.2 Payment Confirmation** {#3.3.2-payment-confirmation}

* Record payment with: Invoice Date, Amount, GST, Received Date, Amount Received, TDS, Payment Mode

* Support partial payments with automatic balance tracking

* Payment modes: NEFT, RTGS, IMPS, UPI, Cheque, Cash, Online Gateway

* Auto-generate receipts on payment confirmation

### **3.3.3 Lead-to-Customer Conversion** {#3.3.3-lead-to-customer-conversion}

After payment is confirmed, the Accounts team converts the lead to a customer:

6. Click “Convert to Customer” action button

7. System generates a unique Customer ID (format: W24-CUST-XXXXX)

8. Customer record is created in the Customers module with all lead data carried over

9. The customer is linked to the original Wealth Manager

10. The customer is now visible in both the Admin Customers module and the Wealth Manager Dashboard

11. A notification is sent to the Wealth Manager

### **3.3.4 Repeat Service Quotations** {#3.3.4-repeat-service-quotations}

For existing customers who wish to purchase additional services, a new quotation can be generated from the Customers module. However, this quotation must again be routed through Accounts for payment confirmation before the service is activated.

### **3.3.5 Invoicing & Billing** {#3.3.5-invoicing-&-billing}

* Auto-generate branded PI and Invoice PDFs from configurable templates

* GST compliance: auto-determine CGST+SGST vs IGST based on buyer/seller state

* Invoice tracking with Pending/Paid statuses and aging analysis

* Wallet system for credit/debit tracking per customer

### **3.3.6 Refund Workflow** {#3.3.6-refund-workflow}

* Initiate Refund button on payment records

* Refund form: Original Invoice, Amount, Reason, Type (Full/Partial)

* Multi-level approval workflow with configurable thresholds

* Auto-generate GST-compliant Credit Notes

* Refund status tracking: Requested → Pending Approval → Approved → Processed → Completed

## **3.4 Module: Customers** {#3.4-module:-customers}

Central repository of all converted customers. A customer is a lead that has been verified by Accounts after payment confirmation.

### **3.4.1 Customer List View** {#3.4.1-customer-list-view}

* Filters: Search, Wealth Manager, Service Type, Status, Date Range

* Table columns: Customer ID, Name, Contact, Company, Wealth Manager, Services Availed, Active Cases, Status, Actions

* Actions: View Details, Edit, Send Quotation (for additional services), View Cases, View Documents

### **3.4.2 Customer Detail View** {#3.4.2-customer-detail-view}

* Profile tab: All customer information, contact details, company

* Services tab: List of all availed services with status and linked cases

* Cases tab: All cases associated with this customer

* Documents tab: All generated documents (Wills, Trusts, Certificates)

* Payments tab: Payment history, invoices, pending amounts

* Follow-up tab: Complete interaction history as timeline

* Wealth Manager info: Assigned Wealth Manager details

## **3.5 Module: Cases (Case Management)** {#3.5-module:-cases-(case-management)}

Cases are created against converted customers for the services they have availed. This module replaces the “Incidents” module from LOTS and is tailored for legal service delivery.

### **3.5.1 Cases List View** {#3.5.1-cases-list-view}

* Page title: “All Cases” with subtitle “Manage Cases & Services”

* Action buttons: \+ Add New Case, \+ Import Cases, Bulk Update

* Filters: Search, Case Level, Status, Assigned Lawyer, Service Type, Customer, Wealth Manager, Date Range

* Status tabs with counts: All, In Progress, Drafting, Under Review, Approved, Completed, On Hold

* Table columns: Case ID (IRN), Customer ID, Customer Name, Service Type, Assigned Lawyer, Status, Follow-ups, Last Updated, Actions

* Actions per case: View, Edit

### **3.5.2 Add New Case** {#3.5.2-add-new-case}

A new case is created against a specific customer for a specific availed service:

* Customer selection (dropdown of converted customers)

* Service type (auto-populated from customer’s availed services)

* Case details: description, priority, notes

* Assign lawyer (dropdown of available lawyers from Lawyers module)

* Case level classification

* Document requirements checklist

* Auto-generated Case ID (format: W24-CASE-XXXXX)

### **3.5.3 Case Detail View** {#3.5.3-case-detail-view}

**Case Header:**

* Case ID, Customer details, Service type, Assigned Lawyer, Case Status, Case Level

**Tabs:**

* Case Follow-up — Timeline of all updates (see 3.5.4)

* Case Details — Full case information, documents required/submitted

* Notes — Internal notes visible only to admin/ops/legal

* Find Lawyer — Search and assign/reassign lawyers

* Documents — All generated and uploaded documents for this case

### **3.5.4 Case Follow-up (Critical Feature)** {#3.5.4-case-follow-up-(critical-feature)}

The follow-up system is the core operational workflow for case progress tracking. Each follow-up entry captures:

* Title — Short summary of the update (e.g., “First draft completed”, “Client review pending”)

* Notes — Detailed description of the action taken or update

* Service-specific action — Depending on the service type:

  * Will services: Drafting, Client Review, Revision, Registration, Advisory

  * Trust services: Trust Drafting, Client Review, Trust Registration, Advisory

  * Succession Certificate: Application Filing, Court Hearing, Certificate Obtained

* Automatic date and time stamp — System captures when the follow-up was added

* Employee/Lawyer name — Auto-captured from logged-in user

* Status change — Option to update case status with the follow-up

* Priority — High, Medium, Low

* Attachments — Upload supporting documents

Follow-up history is displayed as a chronological timeline with the most recent entry on top. Each entry shows the title, notes, timestamp, author, and any status change.

## **3.6 Module: Services CMS (Content Management System)** {#3.6-module:-services-cms-(content-management-system)}

A dedicated configuration module for managing all services offered on the platform. This is the master catalog from which quotations, case creation, and customer subscriptions pull their data.

### **3.6.1 Service Categories** {#3.6.1-service-categories}

| Category | Sub-Services | Pricing Model |
| :---- | :---- | :---- |
| Wills | Will Drafting, Will Registration, Will Advisory | Per service, configurable |
| Trusts | Trust Drafting, Trust Registration, Trust Advisory | Per service, configurable |
| Succession Certificate | Application Filing, Court Representation, Certificate Procurement | Per service, configurable |

### **3.6.2 CMS Features** {#3.6.2-cms-features}

* Add/Edit/Archive service categories and sub-services

* Set pricing per sub-service (base price, tax rate, discount rules)

* Define service descriptions visible in quotations

* Set estimated TAT (turnaround time) per service

* Define document checklist required per service

* Service versioning — maintain history of pricing changes

* Active/Inactive toggle per service

* Admin-only access for service management

## **3.7 Module: Templates Library** {#3.7-module:-templates-library}

A structured library of legal templates enabling standardized, fast document creation. Carries forward from the original PRD.

### **3.7.1 Template Categories** {#3.7.1-template-categories}

* Basic Will — Simple asset distribution for individuals

* Advanced Will — Complex estates with multiple beneficiaries

* Living Trust — Revocable trust for asset management during lifetime

* Family Trust — Irrevocable trust for family wealth protection

* Succession Certificate Application — Court petition template

### **3.7.2 Template Features** {#3.7.2-template-features}

* Pre-defined legal structures validated by the legal team

* Editable placeholders: Name, Address, Assets, Beneficiaries, Executor, Trustee

* Template versioning and deprecation management

* Admin ability to add, edit, or archive templates

* Preview mode before document generation

## **3.8 Module: Automated Will & Trust Creation** {#3.8-module:-automated-will-&-trust-creation}

A guided, step-by-step document creation flow powered by dynamic field mapping. Carried forward from the original PRD.

### **3.8.1 Creation Flow** {#3.8.1-creation-flow}

12. User selects a template from the library

13. Guided form collects required details (personal info, assets, beneficiaries, executors)

14. System validates all mandatory fields before proceeding

15. Document is generated and displayed in preview mode

16. User confirms and triggers final generation

17. Document is sent for internal legal review/approval

18. Approved document is linked to the customer’s case

### **3.8.2 Technical Features** {#3.8.2-technical-features}

* Dynamic field mapping from form inputs to template placeholders

* Auto-save drafts every 60 seconds to prevent data loss

* Full preview before final submission

* Version control — each edit creates a new document version

* Performance target: document generation within 5 seconds

### **3.8.3 Document Download & Export** {#3.8.3-document-download-&-export}

* Supported formats: DOCX (.docx) and PDF (.pdf)

* Draft watermark on unapproved documents

* Final documents are watermark-free after legal approval

* Download access controlled by role: Legal and Admin can download anytime; Ops can download approved only

* Documents are auto-linked to the corresponding case and customer record

## **3.9 Module: Progress Tracking** {#3.9-module:-progress-tracking}

Real-time lifecycle status tracking with TAT monitoring and audit trail. Applies across both leads and cases.

### **3.9.1 Document/Case Lifecycle Stages** {#3.9.1-document/case-lifecycle-stages}

| Stage | Description | Responsible |
| :---- | :---- | :---- |
| Draft Created | Initial document generated from template | System / Ops |
| Under Review | Document sent for legal review | Legal Team |
| Changes Requested | Legal has requested revisions | Legal → Ops |
| Revised | Ops has made requested changes | Ops Team |
| Approved | Legal has approved the final document | Legal Team |
| Delivered | Document shared with customer | Ops / System |
| Registered | Document has been officially registered | Legal Team |

### **3.9.2 Tracking Features** {#3.9.2-tracking-features}

* Real-time status updates visible across all relevant screens

* TAT tracking per stage with configurable SLA thresholds

* SLA breach alerts sent to ops managers and admin

* Complete audit trail: actor, timestamp, action, and notes for every status change

* Progress visible to customer on their dashboard

## **3.10 Module: Wealth Managers (Partners)** {#3.10-module:-wealth-managers-(partners)}

Admin-side management of Wealth Managers (channel partners). Mirrors and extends the existing Partners module.

### **3.10.1 Wealth Manager List View** {#3.10.1-wealth-manager-list-view}

* KPI badges: Total Sales, Total Active Wealth Managers

* Filters: Search, Partner Kind/Tier, Status

* Table columns: WM ID (PAT-XX), Photo, Name, Contact, Company, GST/PAN Docs, Total Sales, Status, Actions

* Actions: ON/OFF Toggle, View, Edit Profile, View Customers, View Earnings

### **3.10.2 Add / Edit Wealth Manager** {#3.10.2-add-/-edit-wealth-manager}

* Profile photo upload with drag-and-drop

* Basic info: Name, Email, Phone, Gender, DOB, Password

* Address: Country, State, City, Area, Address, Pin Code

* Company: Company Name, Email, GST, PAN, Bank Details

* Permission checkboxes: Module access (Leads, Customers, Cases, etc.)

* Dashboard visibility toggles: What KPI cards and data the WM can see

* Commission structure configuration

### **3.10.3 Wealth Manager Detail Tabs** {#3.10.3-wealth-manager-detail-tabs}

* Follow-up / Update history

* Wallet — Credit/Debit transaction history

* Team — WM’s sub-agents/team members

* Customers — All customers tagged under this WM

* Earnings — Commission and payout details

## **3.11 Module: Users & Teams** {#3.11-module:-users-&-teams}

Management of all internal users (Admin, Sales, Ops, Legal, Accounts, HR) who access the Admin Dashboard.

* Add/Edit/Deactivate users

* Assign roles and permissions

* Team hierarchy and reporting structure

* User activity logs and last login tracking

## **3.12 Module: Lawyers** {#3.12-module:-lawyers}

A dedicated module for managing the network of lawyers who handle cases.

* Lawyer profile: Name, Email, Phone, Specialization, Bar Council ID, Location, Experience

* Document uploads: Bar Council Certificate, ID Proof, Qualification Certificates

* Case assignment tracking: Current active cases, total cases handled, success rate

* Availability status: Available, On Leave, Overloaded

* Performance metrics: Average case resolution time, client ratings

* Search and filter by specialization, location, availability

## **3.13 Module: HRMS** {#3.13-module:-hrms}

Human Resource Management for internal employees and lawyers. Mirrors and extends the existing HRMS module.

### **3.13.1 Employee Management** {#3.13.1-employee-management}

* Add Employee: Multi-section form with profile photo, basic info, address (current \+ permanent), company details, KYC documents, bank details, offer letter

* Required fields: First Name, Last Name, Email, Mobile, Gender, DOB, Department, Designation, Date of Joining

* KYC documents: Aadhaar, PAN, Driving License, Cancelled Cheque (upload with preview)

* Permission assignment: Module-level access checkboxes

### **3.13.2 Employee List & Directory** {#3.13.2-employee-list-&-directory}

* Searchable employee directory with filters: Department, Designation, Status

* Employee detail view with all information and document access

* Attendance and leave tracking (future enhancement)

* Edit/Deactivate employees

### **3.13.3 New Feature Priorities** {#3.13.3-new-feature-priorities}

* P0: Bulk Employee Import (CSV/Excel), Onboarding Checklist Workflow, RBAC

* P1: Employee Self-Service Portal, Multi-Step Form with Progress Bar, Document Expiry Alerts, Auto Employee ID, Offer Letter Templates, Audit Trail, Exit/Offboarding

## **3.14 Module: Reports & Analytics** {#3.14-module:-reports-&-analytics}

* Sales Dashboard: Pipeline value, conversion rate, lead source ROI, team performance

* Case Reports: MIS

* Accounts Dashboard: Revenue, Outstanding Receivables, Collection Rate, Aging Analysis

* Wealth Manager Performance: Sales by WM, conversion funnel, commission payouts

* Document Reports: Documents created, approved, pending, TAT analysis

* HRMS Reports: Headcount, department-wise distribution, onboarding pipeline

* Export all reports in Excel and PDF formats

## **3.15 Admin Dashboard Home** {#3.15-admin-dashboard-home}

The landing page after login shows a real-time operational summary:

* Total Leads (with breakdown by status)

* Total Customers

* Active Cases (by level and status)

* Pending Payments

* Revenue This Month

* SLA Breach Alerts

* Recent Activity Feed — Latest leads, cases, payments, and follow-ups

* Quick Action buttons: Add Lead, Add Case, Record Payment

# **4\. Dashboard B — Wealth Manager Dashboard** {#4.-dashboard-b-—-wealth-manager-dashboard}

A dedicated partner-facing dashboard for Wealth Managers to manage their assigned leads, customers, and cases. Authentication is via email and password. Data is scoped — each Wealth Manager sees only their own tagged leads, customers, and cases.

*Reference: Product Presentation for Partner Panel (attached) provides the visual UI guide for this dashboard.*

## **4.1 Authentication** {#4.1-authentication}

* Email \+ Password based login (Sign in to Your Partner Account)

* Password-based, NOT OTP-based

* Session management with auto-logout

* Master Partner (Super Admin) vs Regular Partner access levels

## **4.2 Business Dashboard (Home)** {#4.2-business-dashboard-(home)}

After login, the Wealth Manager sees a summary dashboard showing:

* Total Customers (subscribers under this WM)

* Total Cases (total incidents/cases)

* Resolved Cases count

* Hold Cases count

* Total Sales value

* Sales Current Month and Sales Today

* Recent Cases panel — Latest case updates on the right side

* Recent Customers panel — Recently registered customers

## **4.3 Leads (Wealth Manager View)** {#4.3-leads-(wealth-manager-view)}

Wealth Managers can view and manage leads that are tagged to them:

* View all assigned leads with status

* Add new leads (which auto-tag to this WM)

* Add follow-up notes and schedule meetings

* View quotation history per lead

* Cannot directly convert to customer (must go through Accounts)

## **4.4 Customers** {#4.4-customers}

All converted customers tagged under this Wealth Manager:

* Customer list with: Info, Photo, Contact, Company, Service Type, Actions

* Search with date range filter

* Total Sales badge

* Actions per customer: View Cases, View Documents

* Can send additional quotation for more services (routed to Accounts)

## **4.5 Cases** {#4.5-cases}

All cases associated with the Wealth Manager’s customers:

* Filter by: Search, Case Level, Case Status

* Table: Case ID, Customer, Service Type, Assigned Lawyer, Follow-up count, Status, Actions

* View button to see case detail and follow-up timeline

* Case follow-up timeline — read-only view of all updates, notes, timestamps

## **4.6 Partners (Sub-Partners)** {#4.6-partners-(sub-partners)}

* Master/Super Partner can view other partners’ details and sales

* Regular partners can only see their own details and sales

## **4.7 Wallet** {#4.7-wallet}

* View all debit and credit transactions

* Transaction details: Title, Customer, Type (Used/Added), Amount, Remarks

* Master Partner can view transactions of all sub-partners

## **4.8 Team** {#4.8-team}

* View all team members: Name, Email, Phone, Designation, Status, Actions

* Master Partner can add new team members via “Add Team” form

* Add Team form: First Name, Last Name, Email, Phone, Designation, Password

* Edit and deactivate team members

# **5\. Dashboard C — Customer Dashboard** {#5.-dashboard-c-—-customer-dashboard}

A self-service portal for end customers to track their cases, view their subscription plan, and contact their Wealth Manager. Authentication is OTP-based for maximum accessibility.

*Reference: Subscriber Dashboard PDF (attached) provides the visual UI guide for this dashboard.*

## **5.1 Authentication** {#5.1-authentication}

* Phone Number \+ OTP based login

* No password required — OTP sent to registered mobile number

* Session management with auto-logout on inactivity

## **5.2 My Dashboard (Home)** {#5.2-my-dashboard-(home)}

Landing page shows a personalized summary:

* Customer name and profile

* Total services availed

* Total cases with breakdown: Active, Completed, On Hold

* Resolved Cases count

* Recent Cases panel — Latest case updates

## **5.3 My Cases** {#5.3-my-cases}

* List all cases with: Case ID, Service Type, Status, Level, Assigned Lawyer, Last Updated

* Filter by: Case Level, Case Status

* Search by Case ID or Service Type

* View case detail: Full case information and follow-up timeline (read-only)

* Follow-up timeline shows: Date, Title, Notes, Status changes — customer can track progress

* Add Comment — Customer can add comments/queries on their case (visible to ops team)

## **5.4 My Documents** {#5.4-my-documents}

* View all documents: Type, Document link, Created Date, Expiry Date

* Click to view/download documents

* Filter by document type and date range

* Upload documents requested by the legal team

## **5.5 Subscription / Plan Details** {#5.5-subscription-/-plan-details}

* Current Plan name and validity (e.g., “Current Plan: BSafe — Valid till 31 Mar 2026”)

* Plan features breakdown: Services covered, coverage details, pay-per-use items

* Add-ons: Active add-ons with descriptions

* Upgrade/Renewal option (routes to payment)

## **5.6 Accounts & Payments** {#5.6-accounts-&-payments}

* Wallet: Total Paid Amount, Total Subscription Amount, Total Pending Amount, Add-on Amount

* Transaction history: Title, Type (Used/Added), Amount, Remarks, Date

* Invoices: Invoice number, Created Date, Due Date, Amount, TDS, Paid, Remaining, Status, Download

* Payment status: Pending / Paid indicators

## **5.7 My Wealth Manager** {#5.7-my-wealth-manager}

* Wealth Manager profile: Name, Photo, Contact details, Company

* Direct contact options: Call, Email, WhatsApp

* No ability to change WM — read-only

## **5.8 All Requests** {#5.8-all-requests}

Customers can raise service requests from the dashboard:

* Request types: Single Challan, Bulk Challan, Subscription, Add-Ons, Invoice, None of the Above

* Request form with: Request Type, Details/Comment, File Upload (for bulk)

* Request tracking: Requested At, Type, Status (In Process / Incident Created), Notes, Follow-up

* Request follow-up timeline with timestamped updates from the operations team

## **5.9 Teams** {#5.9-teams}

* View team members added by the customer (if applicable)

* Add team members with: Name, Email, Phone, Designation

* Permission checkboxes: Reports, Accounts, Add Team

# **6\. Functional Requirements** {#6.-functional-requirements}

| Module | Requirement | Priority | Dashboard |
| :---- | :---- | :---- | :---- |
| Auth | OTP-based login for Customer Dashboard | P0 | Customer |
| Auth | Email \+ Password login for Admin and WM Dashboards | P0 | Admin, WM |
| Auth | Role-based access control (Admin, Sales, Ops, Legal, Accounts, HR) | P0 | Admin |
| Sales CRM | Lead entry with mandatory Wealth Manager tagging | P0 | Admin |
| Sales CRM | Follow-up, meeting, and quotation workflows | P0 | Admin |
| Sales CRM | Quotation generation from CMS with Send to Email/WhatsApp | P0 | Admin |
| Sales CRM | Assign lead to Accounts for payment confirmation | P0 | Admin |
| Accounts | Payment confirmation and recording | P0 | Admin |
| Accounts | Lead-to-Customer conversion with unique Customer ID | P0 | Admin |
| Accounts | PI and Invoice generation with GST compliance | P1 | Admin |
| Accounts | Refund workflow with approval chain | P1 | Admin |
| Customers | Full CRUD on customer records | P0 | Admin |
| Customers | Send additional quotations for repeat services | P1 | Admin, WM |
| Cases | Case creation against customer with service type | P0 | Admin |
| Cases | Case follow-up with title, notes, auto date/time stamp | P0 | Admin |
| Cases | Case status tracking with level classification | P0 | Admin |
| Services CMS | CRUD on service categories and sub-services with pricing | P0 | Admin |
| Templates | Pre-configured legal templates (Will & Trust types) | P0 | Admin |
| Templates | Admin can add, edit, archive templates | P1 | Admin |
| Doc Creation | Multi-step guided form with field validation | P0 | Admin |
| Doc Creation | Auto-save drafts every 60 seconds | P1 | Admin |
| Doc Creation | Full preview before final generation | P0 | Admin |
| Doc Creation | Version control for all document iterations | P1 | Admin |
| Export | Download documents in DOCX and PDF | P0 | Admin, Customer |
| Export | Draft watermark on unapproved documents | P1 | Admin |
| Tracking | Real-time status updates across lifecycle stages | P0 | All |
| Tracking | TAT tracking and SLA breach alerts | P1 | Admin |
| Tracking | Audit trail with actor, timestamp, action | P1 | Admin |
| WM Dashboard | Scoped view of assigned leads, customers, cases | P0 | WM |
| WM Dashboard | Business dashboard with KPIs | P0 | WM |
| WM Dashboard | Wallet and team management | P1 | WM |
| Customer Dashboard | View cases and follow-up timeline | P0 | Customer |
| Customer Dashboard | View subscription plan and WM details | P0 | Customer |
| Customer Dashboard | Raise service requests | P1 | Customer |
| Customer Dashboard | View/download documents and invoices | P0 | Customer |
| HRMS | Employee add/edit with KYC and document management | P1 | Admin |
| Lawyers | Lawyer directory with case assignment tracking | P1 | Admin |
| Reports | Sales, Case, Accounts, and WM performance reports | P1 | Admin |
| Dashboard | KPI widgets refreshed in real-time | P1 | All |

# **7\. Non-Functional Requirements** {#7.-non-functional-requirements}

| Category | Requirement |
| :---- | :---- |
| Security | End-to-end encryption for all documents and customer PII |
| Security | Role-based access enforced at API and UI layer across all three dashboards |
| Security | OTP expiry and rate limiting for Customer Dashboard |
| Performance | Document generation completed within 5 seconds |
| Performance | Dashboard page load under 2 seconds |
| Performance | Quotation PDF generation under 3 seconds |
| Scalability | Support 500+ concurrent users without degradation |
| Availability | 99.5% uptime SLA with scheduled maintenance windows |
| Auditability | All user actions logged with immutable audit trail |
| Compliance | Adherence to applicable data protection regulations |
| Data Isolation | Wealth Manager sees only their tagged data; Customer sees only their own data |
| Notifications | Email and WhatsApp notifications for key events (quotation sent, payment confirmed, case updated) |

# **8\. Dependencies & Risks** {#8.-dependencies-&-risks}

## **8.1 Dependencies** {#8.1-dependencies}

* Legal team approval for all template structures before launch

* Document generation engine (DOCX/PDF rendering service)

* Secure file storage system with redundancy and backups

* OTP/Authentication service provider (for Customer Dashboard)

* WhatsApp Business API integration for quotation delivery

* Email service provider for quotation and notification delivery

* Payment gateway integration for online payments

* Notification service for SLA alerts and status updates

## **8.2 Risks & Mitigation** {#8.2-risks-&-mitigation}

| Risk | Impact | Mitigation |
| :---- | :---- | :---- |
| Incorrect legal templates | High | Mandatory legal team validation before publish |
| Data loss during creation | High | Auto-save every 60s \+ server-side draft storage |
| Unauthorized document access | Critical | Role-based permissions enforced at API layer; data isolation per dashboard |
| Document generation failure | Medium | Retry mechanism \+ fallback error handling |
| SLA breaches going unnoticed | Medium | Automated alerts for cases nearing SLA |
| Wealth Manager data leakage | High | Strict server-side data scoping; no client-side filtering |
| Customer OTP abuse | Medium | Rate limiting, OTP expiry, device fingerprinting |
| Scope creep in services | Low | Freeze service catalog for v1; roadmap additions for v2 |
| WhatsApp API downtime | Medium | Email fallback for all WhatsApp-dependent features |

# **9\. Success Metrics** {#9.-success-metrics}

| Metric | Target | Measurement |
| :---- | :---- | :---- |
| Leads created per month | \> 500 in Month 3 | System count |
| Lead-to-Customer conversion rate | \> 25% | CRM analytics |
| Wills/Trusts created per month | \> 100 in Month 1 | System count |
| Document generation success rate | \> 98% | System logs |
| Avg. document completion time | \< 15 minutes | TAT tracking |
| Case resolution TAT | \< 7 days for standard services | Case tracking |
| Quotation-to-Payment conversion | \> 30% | Accounts analytics |
| Form drop-off rate | \< 20% | Step completion analytics |
| Ops team processing TAT | \< 24 hours per stage | Tracking module |
| Legal review turnaround | \< 48 hours | Stage timestamps |
| System uptime | \> 99.5% | Monitoring tools |
| Customer dashboard adoption | \> 60% of customers login within 30 days | Login analytics |
| Wealth Manager active usage | \> 80% weekly active | Login analytics |

# **10\. Future Enhancements** {#10.-future-enhancements}

| Enhancement | Description | Phase |
| :---- | :---- | :---- |
| E-Sign Integration | Legally binding digital signatures within the platform | v2 |
| AI Template Recommendations | Suggest most appropriate template based on customer profile | v3 |
| Multi-Language Support | Hindi and regional language versions of templates and UI | v3 |
| Automated Legal Validation | AI-assisted check for completeness and legal consistency | v3 |
| Mobile App | Native iOS/Android app for Wealth Managers and field team | v2 |
| WhatsApp Bot | Automated status updates and case queries via WhatsApp | v2 |
| Calendar Integration | Sync meetings to Google Calendar/Outlook from CRM | v2 |
| Lead Scoring | Auto-prioritize leads based on engagement and profile | v2 |
| Commission Auto-Payout | Automated Wealth Manager commission calculations and payouts | v2 |
| Customer Satisfaction Surveys | Auto-send CSAT survey on case closure | v2 |
| Kanban Board for Sales | Drag-and-drop pipeline view for sales team | v2 |
| Bulk Operations | Bulk lead assignment, bulk quotation send, bulk case update | v2 |

**END OF DOCUMENT**

*WILLS 24 Dashboard PRD | Confidential | v2.0 | April 2026*