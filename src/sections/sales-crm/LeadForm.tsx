import data from '@/../product/sections/sales-crm/data.json'
import { LeadForm } from './components/LeadForm'
import { navigateToScreen } from '@/lib/preview-navigation'

/**
 * Preview wrapper for Design OS.
 * Shows the Add Lead form (no lead prop = create mode).
 * To preview edit mode, pass a lead from the data.
 */
export default function LeadFormPreview() {
  // Derive employee list from leads data
  const employees = [...new Set(data.leads.map((l) => l.assignedEmployee).filter(Boolean))].sort()

  return (
    <LeadForm
      wealthManagers={data.wealthManagers as any}
      employees={employees}
      onSave={() => navigateToScreen('sales-crm', 'LeadsList')}
      onCancel={() => navigateToScreen('sales-crm', 'LeadsList')}
    />
  )
}
