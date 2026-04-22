import data from '@/../product/sections/sales-crm/data.json'
import { LeadsList } from './components/LeadsList'
import { navigateToScreen } from '@/lib/preview-navigation'

export default function LeadsListPreview() {
  return (
    <LeadsList
      leads={data.leads as any}
      followUps={data.followUps as any}
      quotations={data.quotations as any}
      services={data.services as any}
      wealthManagers={data.wealthManagers as any}
      statusCounts={data.statusCounts as any}
      onViewLead={() => navigateToScreen('sales-crm', 'LeadDetail')}
      onEditLead={(id) => console.log('Edit lead:', id)}
      onDeleteLead={(id) => console.log('Delete lead:', id)}
      onCreateLead={() => navigateToScreen('sales-crm', 'LeadForm')}
      onImportLeads={() => console.log('Import leads')}
      onExportLeads={() => console.log('Export leads')}
      onAddFollowUp={(id) => console.log('Add follow-up for:', id)}
      onAssignToAccounts={() => navigateToScreen('accounts', 'AccountsList')}
      onCreateQuotation={() => navigateToScreen('sales-crm', 'QuotationBuilder')}
      onSendQuotation={(id, via) => console.log('Send quotation:', id, via)}
      onCreateService={() => console.log('Create service')}
      onEditService={(id) => console.log('Edit service:', id)}
      onToggleService={(id) => console.log('Toggle service:', id)}
    />
  )
}
