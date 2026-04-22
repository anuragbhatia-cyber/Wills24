import data from '@/../product/sections/accounts/data.json'
import { PaymentForm } from './components/PaymentForm'
import { navigateToScreen } from '@/lib/preview-navigation'

/**
 * Preview wrapper for Design OS.
 * Shows the Payment Form for Meera Nair (ACC-004) with a partial payment scenario.
 */
export default function PaymentFormPreview() {
  // Use Meera Nair (ACC-004) — she has a partial payment (₹50,000 paid, ₹32,600 balance)
  const accountEntry = data.accountEntries.find((e) => e.id === 'ACC-004')!
  const invoice = data.invoices.find((inv) => inv.id === 'INV-004')!
  const existingPayments = data.payments.filter(
    (p) => p.invoiceId === 'INV-004' && p.accountEntryId === 'ACC-004',
  )

  return (
    <PaymentForm
      accountEntry={accountEntry as any}
      invoice={invoice as any}
      existingPayments={existingPayments as any}
      onSave={() => navigateToScreen('accounts', 'InvoiceDetail')}
      onCancel={() => navigateToScreen('accounts', 'InvoiceDetail')}
    />
  )
}
