import data from '@/../product/sections/customers/data.json'
import { CustomerDetail } from './components/CustomerDetail'
import { navigateToScreen } from '@/lib/preview-navigation'

/**
 * Preview wrapper for Design OS.
 * Shows Arvind Saxena (WCUS-00004) — high-value client with 4 services,
 * 3 active cases, 2 documents, 2 payments, 3 follow-ups, and ₹35,400 pending.
 */
export default function CustomerDetailPreview() {
  const customerId = 'WCUS-00004'
  const customer = data.customers.find((c) => c.id === customerId)!
  const services = data.customerServices.filter((s) => s.customerId === customerId)
  const cases = data.customerCases.filter((c) => c.customerId === customerId)
  const documents = data.customerDocuments.filter((d) => d.customerId === customerId)
  const payments = data.customerPayments.filter((p) => p.customerId === customerId)
  const followUps = data.customerFollowUps.filter((f) => f.customerId === customerId)
  const wealthManager = data.wealthManagers.find((wm) => wm.id === customer.wealthManagerId)!

  return (
    <CustomerDetail
      customer={customer as any}
      services={services as any}
      cases={cases as any}
      documents={documents as any}
      payments={payments as any}
      followUps={followUps as any}
      wealthManager={wealthManager as any}
      onEdit={() => console.log('Edit customer:', customerId)}
      onSendQuotation={() => console.log('Send quotation:', customerId)}
      onViewCase={() => navigateToScreen('case-management', 'CaseDetail')}
      onDownloadDocument={(docId) => console.log('Download document:', docId)}
      onBack={() => navigateToScreen('customers', 'CustomerList')}
    />
  )
}
