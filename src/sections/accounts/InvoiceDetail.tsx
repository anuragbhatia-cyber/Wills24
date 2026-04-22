import data from '@/../product/sections/accounts/data.json'
import { InvoiceDetail } from './components/InvoiceDetail'
import { navigateToScreen } from '@/lib/preview-navigation'

/**
 * Preview wrapper for Design OS.
 * Shows the Invoice Detail for Prakash Jain's Proforma Invoice (INV-001)
 * with payment history and a pending-approval refund.
 */
export default function InvoiceDetailPreview() {
  // Use Prakash Jain's PI (INV-001) — paid, with payment PAY-001 and refund REF-002
  const invoice = data.invoices.find((inv) => inv.id === 'INV-001')!
  const payments = data.payments.filter((p) => p.invoiceId === 'INV-001')
  const refunds = data.refunds.filter((r) => r.invoiceId === 'INV-001')

  return (
    <InvoiceDetail
      invoice={invoice as any}
      payments={payments as any}
      refunds={refunds as any}
      onRecordPayment={() => navigateToScreen('accounts', 'PaymentForm')}
      onInitiateRefund={() => navigateToScreen('accounts', 'RefundWorkflow')}
      onDownloadPDF={() => console.log('Download PDF')}
      onBack={() => navigateToScreen('accounts', 'AccountsList')}
    />
  )
}
