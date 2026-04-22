import data from '@/../product/sections/accounts/data.json'
import { RefundWorkflow } from './components/RefundForm'
import { navigateToScreen } from '@/lib/preview-navigation'

/**
 * Preview wrapper for Design OS.
 * Shows the Refund Workflow with both refund records — one approved (partial)
 * and one pending-approval (full).
 */
export default function RefundWorkflowPreview() {
  return (
    <RefundWorkflow
      refunds={data.refunds as any}
      payments={data.payments as any}
      invoices={data.invoices as any}
      onApprove={(id) => console.log('Approve refund:', id)}
      onReject={(id) => console.log('Reject refund:', id)}
      onProcess={(id) => console.log('Process refund:', id)}
      onComplete={(id) => console.log('Complete refund:', id)}
      onInitiateRefund={(paymentId) => console.log('Initiate refund for payment:', paymentId)}
      onBack={() => navigateToScreen('accounts', 'InvoiceDetail')}
    />
  )
}
