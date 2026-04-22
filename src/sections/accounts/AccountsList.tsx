import data from '@/../product/sections/accounts/data.json'
import { AccountsList } from './components/AccountsList'
import { navigateToScreen } from '@/lib/preview-navigation'

/**
 * Preview wrapper for Design OS.
 * Shows the Accounts List View with all 8 entries across all statuses.
 */
export default function AccountsListPreview() {
  return (
    <AccountsList
      accountEntries={data.accountEntries as any}
      kpiStats={data.kpiStats as any}
      statusCounts={data.statusCounts as any}
      onView={() => navigateToScreen('accounts', 'InvoiceDetail')}
      onEdit={(id) => console.log('Edit account entry:', id)}
      onFollowUp={(id) => console.log('Follow-up on:', id)}
      onSendPI={(id) => console.log('Send PI for:', id)}
      onSendInvoice={(id) => console.log('Send Invoice for:', id)}
      onRecordPayment={() => navigateToScreen('accounts', 'PaymentForm')}
      onConvertToCustomer={() => navigateToScreen('customers', 'CustomerList')}
    />
  )
}
