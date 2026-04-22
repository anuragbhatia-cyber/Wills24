import data from '@/../product/sections/customers/data.json'
import { CustomerList } from './components/CustomerList'
import { navigateToScreen } from '@/lib/preview-navigation'

/**
 * Preview wrapper for Design OS.
 * Shows the Customer List View with all 6 sample customers, KPI cards,
 * and status filter tabs.
 */
export default function CustomerListPreview() {
  return (
    <CustomerList
      customers={data.customers as any}
      kpiStats={data.kpiStats as any}
      statusCounts={data.statusCounts as any}
      onView={() => navigateToScreen('customers', 'CustomerDetail')}
      onEdit={(id) => console.log('Edit customer:', id)}
      onSendQuotation={(id) => console.log('Send quotation:', id)}
      onViewCases={() => navigateToScreen('case-management', 'CaseList')}
      onViewDocuments={(id) => console.log('View documents:', id)}
    />
  )
}
