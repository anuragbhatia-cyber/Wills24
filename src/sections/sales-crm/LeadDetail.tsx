import data from '@/../product/sections/sales-crm/data.json'
import { LeadDetail } from './components/LeadDetail'
import { navigateToScreen } from '@/lib/preview-navigation'

/**
 * Preview wrapper for Design OS.
 * Shows lead W24-LEAD-00003 (Suresh Agarwal) — has multiple follow-ups and a quotation.
 */
export default function LeadDetailPreview() {
  // Pick a lead with rich data for the preview
  const lead = data.leads.find((l) => l.id === 'W24-LEAD-00003') ?? data.leads[0]
  const followUps = data.followUps.filter((fu) => fu.leadId === lead.id)
  const quotations = data.quotations.filter((qt) => qt.leadId === lead.id)

  return (
    <LeadDetail
      lead={lead as any}
      followUps={followUps as any}
      quotations={quotations as any}
      onBack={() => navigateToScreen('sales-crm', 'LeadsList')}
      onEditLead={(id) => console.log('Edit lead:', id)}
      onAddFollowUp={(id) => console.log('Add follow-up for:', id)}
      onCreateQuotation={() => navigateToScreen('sales-crm', 'QuotationBuilder')}
      onSendQuotation={(id, via) => console.log('Send quotation:', id, via)}
      onAssignToAccounts={() => navigateToScreen('accounts', 'AccountsList')}
    />
  )
}
