import data from '@/../product/sections/sales-crm/data.json'
import { QuotationBuilder } from './components/QuotationBuilder'
import { navigateToScreen } from '@/lib/preview-navigation'

/**
 * Preview wrapper for Design OS.
 * Shows the Quotation Builder for Suresh Agarwal (W24-LEAD-00003)
 * who has an existing quotation — lets us preview both catalog and pre-filled state.
 */
export default function QuotationBuilderPreview() {
  const lead = data.leads.find((l) => l.id === 'W24-LEAD-00003')!

  return (
    <QuotationBuilder
      lead={lead as any}
      services={data.services as any}
      onSave={() => navigateToScreen('sales-crm', 'LeadDetail')}
      onSendEmail={() => console.log('Send quotation via Email')}
      onSendWhatsApp={() => console.log('Send quotation via WhatsApp')}
      onBack={() => navigateToScreen('sales-crm', 'LeadDetail')}
    />
  )
}
