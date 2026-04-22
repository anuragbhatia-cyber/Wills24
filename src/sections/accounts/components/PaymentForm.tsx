import { useState, useMemo } from 'react'
import {
  ArrowLeft,
  IndianRupee,
  Calendar,
  CreditCard,
  FileText,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Info,
  Banknote,
  ChevronDown,
} from 'lucide-react'
import type {
  AccountEntry,
  Invoice,
  Payment,
  PaymentMode,
} from '@/../product/sections/accounts/types'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface PaymentFormProps {
  accountEntry: AccountEntry
  invoice: Invoice
  existingPayments?: Payment[]
  onSave?: (data: Omit<Payment, 'id' | 'receiptNumber' | 'createdAt'>) => void
  onCancel?: () => void
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PAYMENT_MODES: { value: PaymentMode; label: string; icon: string }[] = [
  { value: 'neft', label: 'NEFT', icon: '🏦' },
  { value: 'rtgs', label: 'RTGS', icon: '🏛️' },
  { value: 'imps', label: 'IMPS', icon: '⚡' },
  { value: 'upi', label: 'UPI', icon: '📱' },
  { value: 'cheque', label: 'Cheque', icon: '📝' },
  { value: 'cash', label: 'Cash', icon: '💵' },
  { value: 'online-gateway', label: 'Online Gateway', icon: '🌐' },
]

const GST_TYPE_LABEL: Record<string, string> = {
  'cgst-sgst': 'CGST + SGST (Intra-state)',
  igst: 'IGST (Inter-state)',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function toInputDate(iso: string) {
  return new Date(iso).toISOString().slice(0, 10)
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PaymentForm({
  accountEntry,
  invoice,
  existingPayments = [],
  onSave,
  onCancel,
}: PaymentFormProps) {
  // --- Derived values -------------------------------------------------------

  const totalPaid = useMemo(
    () => existingPayments.reduce((sum, p) => sum + p.amount, 0),
    [existingPayments],
  )

  const totalTdsDeducted = useMemo(
    () => existingPayments.reduce((sum, p) => sum + p.tds, 0),
    [existingPayments],
  )

  const balanceDue = invoice.netPayable - totalPaid

  const isPartialScenario = existingPayments.length > 0

  // --- Form state -----------------------------------------------------------

  const [receivedDate, setReceivedDate] = useState(todayISO())
  const [amount, setAmount] = useState(balanceDue > 0 ? balanceDue.toString() : '')
  const [tds, setTds] = useState('0')
  const [paymentMode, setPaymentMode] = useState<PaymentMode | ''>('')
  const [transactionRef, setTransactionRef] = useState('')
  const [remarks, setRemarks] = useState('')
  const [showModeDropdown, setShowModeDropdown] = useState(false)

  // --- Calculated fields ----------------------------------------------------

  const amountNum = parseFloat(amount) || 0
  const tdsNum = parseFloat(tds) || 0
  const netReceived = amountNum - tdsNum
  const newBalance = balanceDue - amountNum

  // --- Validation -----------------------------------------------------------

  const errors = useMemo(() => {
    const e: string[] = []
    if (amountNum <= 0) e.push('Amount must be greater than zero')
    if (amountNum > balanceDue && balanceDue > 0)
      e.push('Amount exceeds balance due')
    if (tdsNum < 0) e.push('TDS cannot be negative')
    if (tdsNum >= amountNum && amountNum > 0)
      e.push('TDS must be less than payment amount')
    if (!paymentMode) e.push('Select a payment mode')
    if (!receivedDate) e.push('Select a received date')
    return e
  }, [amountNum, tdsNum, balanceDue, paymentMode, receivedDate])

  const canSave = errors.length === 0 && amountNum > 0

  // --- Handlers -------------------------------------------------------------

  function handleSave() {
    if (!canSave || !paymentMode) return
    onSave?.({
      invoiceId: invoice.id,
      accountEntryId: accountEntry.id,
      customerName: accountEntry.name,
      amount: amountNum,
      tds: tdsNum,
      netReceived,
      paymentMode,
      transactionRef,
      receivedDate: new Date(receivedDate).toISOString(),
      invoiceDate: invoice.createdAt,
      remarks,
    })
  }

  // --- Render ---------------------------------------------------------------

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div>
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="p-2 -ml-2 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                Record Payment
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                {accountEntry.name}
                {accountEntry.company && (
                  <span className="text-neutral-400 dark:text-neutral-500">
                    {' '}
                    — {accountEntry.company}
                  </span>
                )}
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-900/50">
              <Banknote size={11} />
              Payment
            </span>
          </div>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
          {/* ── Left: Invoice Context ──────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Invoice Summary */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                <FileText size={14} className="text-neutral-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Invoice
                </span>
                <span
                  className={`ml-auto px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    invoice.type === 'proforma'
                      ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                      : 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                  }`}
                >
                  {invoice.type === 'proforma' ? 'Proforma' : 'Tax Invoice'}
                </span>
              </div>

              <div className="p-4 space-y-3">
                {/* Invoice number */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-0.5">
                    Invoice No.
                  </p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                    {invoice.invoiceNumber}
                  </p>
                </div>

                {/* Customer */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-0.5">
                    Customer
                  </p>
                  <p className="text-sm text-neutral-800 dark:text-neutral-200">
                    {invoice.customerName}
                  </p>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                    {invoice.billingAddress}
                  </p>
                </div>

                {/* Line items */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1.5">
                    Line Items
                  </p>
                  <div className="space-y-1.5">
                    {invoice.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-neutral-700 dark:text-neutral-300 truncate">
                            {item.serviceName}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
                              {item.quantity} ×{' '}
                              {formatCurrency(item.unitPrice)}
                            </p>
                          )}
                        </div>
                        <p className="text-neutral-900 dark:text-neutral-100 font-semibold tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)] shrink-0">
                          {formatCurrency(item.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-dashed border-neutral-200 dark:border-neutral-700" />

                {/* Subtotal, GST, Total */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">
                      Subtotal
                    </span>
                    <span className="text-neutral-800 dark:text-neutral-200 tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                      {formatCurrency(invoice.subtotal)}
                    </span>
                  </div>

                  {/* GST breakdown */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-neutral-500 dark:text-neutral-400">
                        GST
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium">
                        {GST_TYPE_LABEL[invoice.gstType]}
                      </span>
                    </div>
                    <span className="text-neutral-800 dark:text-neutral-200 tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                      {formatCurrency(invoice.totalTax)}
                    </span>
                  </div>

                  {/* GST detail */}
                  {invoice.gstType === 'cgst-sgst' ? (
                    <div className="pl-3 space-y-0.5">
                      <div className="flex justify-between text-[11px] text-neutral-400 dark:text-neutral-500">
                        <span>CGST (9%)</span>
                        <span className="tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                          {formatCurrency(invoice.cgst)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-neutral-400 dark:text-neutral-500">
                        <span>SGST (9%)</span>
                        <span className="tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                          {formatCurrency(invoice.sgst)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="pl-3">
                      <div className="flex justify-between text-[11px] text-neutral-400 dark:text-neutral-500">
                        <span>IGST (18%)</span>
                        <span className="tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                          {formatCurrency(invoice.igst)}
                        </span>
                      </div>
                    </div>
                  )}

                  {invoice.tds > 0 && (
                    <div className="flex justify-between">
                      <span className="text-neutral-500 dark:text-neutral-400">
                        TDS (on invoice)
                      </span>
                      <span className="text-red-500 tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                        −{formatCurrency(invoice.tds)}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-1.5 flex justify-between font-semibold">
                    <span className="text-neutral-700 dark:text-neutral-300">
                      Net Payable
                    </span>
                    <span className="text-neutral-900 dark:text-neutral-100 tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                      {formatCurrency(invoice.netPayable)}
                    </span>
                  </div>
                </div>

                {/* Due date */}
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-500">
                  <Calendar size={11} />
                  <span>
                    Due {formatDate(invoice.dueDate)}
                  </span>
                  {new Date(invoice.dueDate) < new Date() &&
                    invoice.status !== 'paid' && (
                      <span className="ml-1 text-[9px] font-bold text-red-500 uppercase">
                        Overdue
                      </span>
                    )}
                </div>
              </div>
            </div>

            {/* Previous Payments (if any) */}
            {isPartialScenario && (
              <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                  <Receipt size={14} className="text-neutral-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Previous Payments
                  </span>
                  <span className="ml-auto text-[10px] font-bold tabular-nums text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded">
                    {existingPayments.length} recorded
                  </span>
                </div>

                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {existingPayments.map((pmt) => (
                    <div key={pmt.id} className="px-4 py-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                          {pmt.receiptNumber}
                        </span>
                        <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                          {formatCurrency(pmt.amount)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-neutral-400 dark:text-neutral-500">
                        <span>{formatDate(pmt.receivedDate)}</span>
                        <span className="uppercase text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">
                          {pmt.paymentMode}
                        </span>
                        {pmt.tds > 0 && (
                          <span className="text-red-400">
                            TDS: {formatCurrency(pmt.tds)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Payment summary */}
                <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-800/40 border-t border-neutral-200 dark:border-neutral-800 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500 dark:text-neutral-400">
                      Total Paid
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                      {formatCurrency(totalPaid)}
                    </span>
                  </div>
                  {totalTdsDeducted > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-500 dark:text-neutral-400">
                        Total TDS Deducted
                      </span>
                      <span className="font-semibold text-red-500 tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                        {formatCurrency(totalTdsDeducted)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs pt-1 border-t border-neutral-200 dark:border-neutral-700">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                      Balance Due
                    </span>
                    <span
                      className={`font-bold tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)] ${
                        balanceDue > 0
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {formatCurrency(balanceDue)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Balance indicator (when no prior payments) */}
            {!isPartialScenario && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
                  <IndianRupee
                    size={14}
                    className="text-amber-600 dark:text-amber-400"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                    Full Amount Due
                  </p>
                  <p className="text-lg font-bold text-amber-900 dark:text-amber-200 tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                    {formatCurrency(invoice.netPayable)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Payment Form ───────────────────────────────────── */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              {/* Form header */}
              <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                    <CreditCard
                      size={15}
                      className="text-orange-600 dark:text-orange-400"
                    />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      Payment Details
                    </h2>
                    <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                      Record the payment received against this invoice
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-5">
                {/* Row 1: Received Date + Payment Mode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Received Date */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                      Received Date <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Calendar
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                      />
                      <input
                        type="date"
                        value={receivedDate}
                        onChange={(e) => setReceivedDate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-all"
                      />
                    </div>
                  </div>

                  {/* Payment Mode */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                      Payment Mode <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowModeDropdown(!showModeDropdown)}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-all cursor-pointer"
                      >
                        {paymentMode ? (
                          <span className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                            <span className="text-base leading-none">
                              {PAYMENT_MODES.find((m) => m.value === paymentMode)?.icon}
                            </span>
                            {PAYMENT_MODES.find((m) => m.value === paymentMode)?.label}
                          </span>
                        ) : (
                          <span className="text-neutral-400">
                            Select mode...
                          </span>
                        )}
                        <ChevronDown
                          size={14}
                          className={`text-neutral-400 transition-transform ${showModeDropdown ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {showModeDropdown && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowModeDropdown(false)}
                          />
                          <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg py-1 max-h-60 overflow-auto">
                            {PAYMENT_MODES.map((mode) => (
                              <button
                                key={mode.value}
                                type="button"
                                onClick={() => {
                                  setPaymentMode(mode.value)
                                  setShowModeDropdown(false)
                                }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer ${
                                  paymentMode === mode.value
                                    ? 'bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 font-medium'
                                    : 'text-neutral-700 dark:text-neutral-200'
                                }`}
                              >
                                <span className="text-base leading-none w-5 text-center">
                                  {mode.icon}
                                </span>
                                {mode.label}
                                {paymentMode === mode.value && (
                                  <CheckCircle2
                                    size={13}
                                    className="ml-auto text-orange-500"
                                  />
                                )}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-neutral-100 dark:border-neutral-800" />

                {/* Row 2: Amount + TDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Amount Received */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                      Amount Received <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-medium">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        className="w-full pl-7 pr-3 py-2.5 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)] focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-all"
                      />
                    </div>
                    {balanceDue > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <button
                          type="button"
                          onClick={() => setAmount(balanceDue.toString())}
                          className="text-[10px] text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium cursor-pointer"
                        >
                          Fill balance: {formatCurrency(balanceDue)}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* TDS */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                      TDS Deducted
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-medium">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={tds}
                        onChange={(e) => setTds(e.target.value)}
                        placeholder="0"
                        className="w-full pl-7 pr-3 py-2.5 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)] focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-all"
                      />
                    </div>
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 flex items-center gap-1">
                      <Info size={9} />
                      Tax Deducted at Source by the payer
                    </p>
                  </div>
                </div>

                {/* Net Received Calculation */}
                <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                        Amount
                      </p>
                      <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                        {amountNum > 0 ? formatCurrency(amountNum) : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                        TDS
                      </p>
                      <p className="text-sm font-bold text-red-500 tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                        {tdsNum > 0 ? `−${formatCurrency(tdsNum)}` : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                        Net Received
                      </p>
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                        {netReceived > 0 ? formatCurrency(netReceived) : '—'}
                      </p>
                    </div>
                  </div>

                  {/* Balance indicator */}
                  {amountNum > 0 && balanceDue > 0 && (
                    <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-500 dark:text-neutral-400">
                          {newBalance > 0
                            ? 'Remaining balance after this payment'
                            : 'Full payment'}
                        </span>
                        <span
                          className={`font-bold tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)] ${
                            newBalance > 0
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {newBalance > 0 ? formatCurrency(newBalance) : 'Nil'}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-2 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-orange-400 to-emerald-400 transition-all duration-500"
                          style={{
                            width: `${Math.min(100, ((totalPaid + amountNum) / invoice.netPayable) * 100)}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between mt-1 text-[9px] text-neutral-400 dark:text-neutral-500">
                        <span>
                          {Math.round(
                            ((totalPaid + amountNum) / invoice.netPayable) *
                              100,
                          )}
                          % of total
                        </span>
                        <span>{formatCurrency(invoice.netPayable)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-neutral-100 dark:border-neutral-800" />

                {/* Transaction Reference */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                    Transaction Reference
                  </label>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="UTR number, cheque no., UPI ref..."
                    className="w-full px-3 py-2.5 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)] placeholder:font-[family-name:var(--font-sans)] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-all"
                  />
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                    Remarks
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={3}
                    placeholder="Additional notes about this payment..."
                    className="w-full px-3 py-2.5 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-all resize-none"
                  />
                </div>

                {/* Partial payment warning */}
                {amountNum > 0 && amountNum < balanceDue && (
                  <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                    <AlertTriangle
                      size={14}
                      className="text-amber-500 mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                        Partial Payment
                      </p>
                      <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-0.5">
                        A balance of{' '}
                        <span className="font-semibold">
                          {formatCurrency(newBalance)}
                        </span>{' '}
                        will remain after recording this payment.
                      </p>
                    </div>
                  </div>
                )}

                {/* Full payment success message */}
                {amountNum > 0 && amountNum >= balanceDue && balanceDue > 0 && (
                  <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                    <CheckCircle2
                      size={14}
                      className="text-emerald-500 mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                        Full Payment
                      </p>
                      <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">
                        This will clear the entire outstanding balance. A receipt
                        will be auto-generated.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Actions ────────────────────────────────────────────── */}
              <div className="px-5 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 flex items-center justify-between gap-3">
                <div className="text-xs text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                  <Clock size={11} />
                  <span>
                    Invoice dated{' '}
                    {formatDate(invoice.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!canSave}
                    className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      canSave
                        ? 'bg-orange-500 hover:bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                        : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle2 size={14} />
                    Record Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
