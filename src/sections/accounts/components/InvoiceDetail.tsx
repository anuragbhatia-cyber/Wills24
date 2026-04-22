import { useState } from 'react'
import {
  ArrowLeft,
  FileText,
  Download,
  IndianRupee,
  Calendar,
  MapPin,
  Building2,
  User,
  Mail,
  Receipt,
  AlertCircle,
  CheckCircle2,
  Clock,
  RotateCcw,
  Printer,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Ban,
  CircleDot,
  Loader2,
  ShieldCheck,
  CreditCard,
} from 'lucide-react'
import type {
  Invoice,
  Payment,
  Refund,
  InvoiceStatus,
  RefundStatus,
} from '@/../product/sections/accounts/types'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface InvoiceDetailProps {
  invoice: Invoice
  payments: Payment[]
  refunds: Refund[]
  onRecordPayment?: () => void
  onInitiateRefund?: (paymentId: string) => void
  onDownloadPDF?: () => void
  onBack?: () => void
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const INVOICE_STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; dot: string; bg: string; text: string }
> = {
  pending: {
    label: 'Pending',
    dot: 'bg-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-700 dark:text-amber-400',
  },
  partial: {
    label: 'Partial',
    dot: 'bg-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-700 dark:text-blue-400',
  },
  paid: {
    label: 'Paid',
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    text: 'text-emerald-700 dark:text-emerald-400',
  },
  overdue: {
    label: 'Overdue',
    dot: 'bg-red-500',
    bg: 'bg-red-50 dark:bg-red-950/30',
    text: 'text-red-700 dark:text-red-400',
  },
}

const REFUND_STATUS_CONFIG: Record<
  RefundStatus,
  { label: string; icon: React.ReactNode; color: string }
> = {
  requested: {
    label: 'Requested',
    icon: <CircleDot size={12} />,
    color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
  },
  'pending-approval': {
    label: 'Pending Approval',
    icon: <Clock size={12} />,
    color: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800',
  },
  approved: {
    label: 'Approved',
    icon: <ShieldCheck size={12} />,
    color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
  },
  processed: {
    label: 'Processed',
    icon: <Loader2 size={12} />,
    color: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800',
  },
  completed: {
    label: 'Completed',
    icon: <CheckCircle2 size={12} />,
    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
  },
  rejected: {
    label: 'Rejected',
    icon: <Ban size={12} />,
    color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
  },
}

const GST_TYPE_LABEL: Record<string, string> = {
  'cgst-sgst': 'Intra-state',
  igst: 'Inter-state',
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

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function InvoiceDetail({
  invoice,
  payments,
  refunds,
  onRecordPayment,
  onInitiateRefund,
  onDownloadPDF,
  onBack,
}: InvoiceDetailProps) {
  const [showPayments, setShowPayments] = useState(true)
  const [showRefunds, setShowRefunds] = useState(true)

  const statusCfg = INVOICE_STATUS_CONFIG[invoice.status]
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0)
  const balanceDue = invoice.netPayable - totalPaid
  const paymentPercentage = Math.min(
    100,
    Math.round((totalPaid / invoice.netPayable) * 100),
  )

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div>
          <div className="flex items-start gap-3">
            <button
              onClick={onBack}
              className="p-2 -ml-2 mt-0.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                  {invoice.invoiceNumber}
                </h1>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    invoice.type === 'proforma'
                      ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                      : 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                  }`}
                >
                  {invoice.type === 'proforma' ? 'Proforma Invoice' : 'Tax Invoice'}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusCfg.bg} ${statusCfg.text}`}
                >
                  {statusCfg.label}
                </span>
              </div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Issued {formatDate(invoice.createdAt)}
                {invoice.paidAt && (
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {' '}
                    — Paid {formatDate(invoice.paidAt)}
                  </span>
                )}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onDownloadPDF}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                <Download size={13} />
                <span className="hidden sm:inline">Download</span>
              </button>
              <button
                onClick={onDownloadPDF}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                <Printer size={13} />
                <span className="hidden sm:inline">Print</span>
              </button>
              {invoice.status !== 'paid' && (
                <button
                  onClick={onRecordPayment}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-500 rounded-lg shadow-sm shadow-orange-500/20 transition-colors cursor-pointer"
                >
                  <IndianRupee size={13} />
                  Record Payment
                </button>
              )}
            </div>
          </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Main Content (Left 2 cols) ─────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">
            {/* ── Invoice Document Card ─────────────────────────────────── */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              {/* Parties */}
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-neutral-100 dark:divide-neutral-800">
                {/* From */}
                <div className="p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
                    From
                  </p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    Lawyered (Wills24)
                  </p>
                  <div className="mt-1.5 space-y-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                    <p className="flex items-center gap-1.5">
                      <MapPin size={11} className="shrink-0" />
                      {invoice.sellerState}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Building2 size={11} className="shrink-0" />
                      GSTIN: 07AXXXX1234X1ZX
                    </p>
                  </div>
                </div>

                {/* To */}
                <div className="p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
                    Bill To
                  </p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {invoice.customerName}
                  </p>
                  <div className="mt-1.5 space-y-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                    <p className="flex items-center gap-1.5">
                      <Mail size={11} className="shrink-0" />
                      {invoice.customerEmail}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin size={11} className="shrink-0" />
                      {invoice.billingAddress}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Building2 size={11} className="shrink-0" />
                      State: {invoice.customerState}
                    </p>
                  </div>
                </div>
              </div>

              {/* GST classification */}
              <div className="mx-5 mb-4 px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 flex items-center gap-2 text-xs">
                <span className="font-semibold text-neutral-500 dark:text-neutral-400">
                  GST Classification:
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase tracking-wider ${
                    invoice.gstType === 'cgst-sgst'
                      ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400'
                      : 'bg-violet-100 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400'
                  }`}
                >
                  {invoice.gstType === 'cgst-sgst' ? 'CGST + SGST' : 'IGST'}
                </span>
                <span className="text-neutral-400 dark:text-neutral-500">
                  ({GST_TYPE_LABEL[invoice.gstType]} — Seller: {invoice.sellerState}, Buyer: {invoice.customerState})
                </span>
              </div>

              {/* Line Items Table */}
              <div className="border-t border-neutral-100 dark:border-neutral-800">
                {/* Table header */}
                <div className="grid grid-cols-[minmax(0,2fr)_80px_100px_100px] gap-2 px-5 py-2.5 bg-neutral-50 dark:bg-neutral-800/40 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  <span>Service</span>
                  <span className="text-center">Qty</span>
                  <span className="text-right">Unit Price</span>
                  <span className="text-right">Amount</span>
                </div>

                {/* Table rows */}
                {invoice.items.map((item, idx) => (
                  <div
                    key={idx}
                    className={`grid grid-cols-[minmax(0,2fr)_80px_100px_100px] gap-2 px-5 py-3 items-center ${
                      idx < invoice.items.length - 1
                        ? 'border-b border-neutral-100 dark:border-neutral-800/60'
                        : ''
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-neutral-900 dark:text-neutral-100 font-medium truncate">
                        {item.serviceName}
                      </p>
                      <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                        {item.serviceId}
                      </p>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 text-center tabular-nums">
                      {item.quantity}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 text-right tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                      {formatCurrency(item.unitPrice)}
                    </p>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 text-right tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                      {formatCurrency(item.amount)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/30 px-5 py-4">
                <div className="max-w-xs ml-auto space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">
                      Subtotal
                    </span>
                    <span className="font-medium text-neutral-800 dark:text-neutral-200 tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                      {formatCurrency(invoice.subtotal)}
                    </span>
                  </div>

                  {/* GST detail */}
                  {invoice.gstType === 'cgst-sgst' ? (
                    <>
                      <div className="flex justify-between text-xs">
                        <span className="text-neutral-400 dark:text-neutral-500 pl-2">
                          CGST @ 9%
                        </span>
                        <span className="text-neutral-600 dark:text-neutral-400 tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                          {formatCurrency(invoice.cgst)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-neutral-400 dark:text-neutral-500 pl-2">
                          SGST @ 9%
                        </span>
                        <span className="text-neutral-600 dark:text-neutral-400 tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                          {formatCurrency(invoice.sgst)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-400 dark:text-neutral-500 pl-2">
                        IGST @ 18%
                      </span>
                      <span className="text-neutral-600 dark:text-neutral-400 tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                        {formatCurrency(invoice.igst)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">
                      Total Tax
                    </span>
                    <span className="font-medium text-neutral-800 dark:text-neutral-200 tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                      {formatCurrency(invoice.totalTax)}
                    </span>
                  </div>

                  <div className="flex justify-between font-semibold border-t border-neutral-200 dark:border-neutral-700 pt-1.5">
                    <span className="text-neutral-700 dark:text-neutral-300">
                      Total
                    </span>
                    <span className="text-neutral-900 dark:text-neutral-100 tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                      {formatCurrency(invoice.total)}
                    </span>
                  </div>

                  {invoice.tds > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-400 dark:text-neutral-500">
                        Less: TDS
                      </span>
                      <span className="text-red-500 tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                        −{formatCurrency(invoice.tds)}
                      </span>
                    </div>
                  )}

                  {invoice.tds > 0 && (
                    <div className="flex justify-between font-bold border-t border-neutral-200 dark:border-neutral-700 pt-1.5 text-base">
                      <span className="text-neutral-800 dark:text-neutral-200">
                        Net Payable
                      </span>
                      <span className="text-neutral-900 dark:text-neutral-100 tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                        {formatCurrency(invoice.netPayable)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Payment History ────────────────────────────────────────── */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <button
                onClick={() => setShowPayments(!showPayments)}
                className="w-full px-5 py-3.5 flex items-center justify-between cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Receipt size={15} className="text-neutral-400" />
                  <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    Payment History
                  </span>
                  <span className="text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                    {payments.length}
                  </span>
                </div>
                {showPayments ? (
                  <ChevronUp size={14} className="text-neutral-400" />
                ) : (
                  <ChevronDown size={14} className="text-neutral-400" />
                )}
              </button>

              {showPayments && (
                <>
                  {payments.length === 0 ? (
                    <div className="px-5 py-10 text-center border-t border-neutral-100 dark:border-neutral-800">
                      <CreditCard
                        size={28}
                        className="mx-auto text-neutral-300 dark:text-neutral-600 mb-2"
                      />
                      <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        No payments recorded
                      </p>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                        Record a payment to update this invoice
                      </p>
                    </div>
                  ) : (
                    <div className="border-t border-neutral-100 dark:border-neutral-800">
                      {/* Payment table header */}
                      <div className="grid grid-cols-[100px_90px_90px_minmax(0,1fr)_80px_70px] gap-2 px-5 py-2 bg-neutral-50 dark:bg-neutral-800/40 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                        <span>Receipt</span>
                        <span>Date</span>
                        <span>Mode</span>
                        <span>Reference</span>
                        <span className="text-right">Amount</span>
                        <span className="text-center">Refund</span>
                      </div>

                      {payments.map((pmt, idx) => {
                        const pmtRefund = refunds.find(
                          (r) => r.paymentId === pmt.id,
                        )
                        return (
                          <div
                            key={pmt.id}
                            className={`grid grid-cols-[100px_90px_90px_minmax(0,1fr)_80px_70px] gap-2 px-5 py-3 items-center ${
                              idx < payments.length - 1
                                ? 'border-b border-neutral-100 dark:border-neutral-800/60'
                                : ''
                            }`}
                          >
                            <span className="text-[11px] font-semibold text-neutral-900 dark:text-neutral-100 font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)] truncate">
                              {pmt.receiptNumber.replace('W24-REC-2026-', 'R-')}
                            </span>
                            <span className="text-xs text-neutral-600 dark:text-neutral-300">
                              {formatDate(pmt.receivedDate)}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 w-fit">
                              {pmt.paymentMode}
                            </span>
                            <div className="min-w-0">
                              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)] truncate">
                                {pmt.transactionRef}
                              </p>
                              {pmt.tds > 0 && (
                                <p className="text-[10px] text-red-400 mt-0.5">
                                  TDS: {formatCurrency(pmt.tds)}
                                </p>
                              )}
                            </div>
                            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 text-right tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                              {formatCurrency(pmt.amount)}
                            </p>
                            <div className="flex justify-center">
                              {pmtRefund ? (
                                <span
                                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border ${REFUND_STATUS_CONFIG[pmtRefund.status].color}`}
                                >
                                  {REFUND_STATUS_CONFIG[pmtRefund.status].icon}
                                </span>
                              ) : (
                                <button
                                  onClick={() => onInitiateRefund?.(pmt.id)}
                                  className="text-[10px] text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer flex items-center gap-0.5"
                                >
                                  <RotateCcw size={10} />
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      })}

                      {/* Payment summary footer */}
                      <div className="px-5 py-3 bg-neutral-50 dark:bg-neutral-800/40 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-neutral-500 dark:text-neutral-400">
                            {payments.length}{' '}
                            {payments.length === 1 ? 'payment' : 'payments'}
                          </span>
                          {invoice.status !== 'paid' && (
                            <button
                              onClick={onRecordPayment}
                              className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium cursor-pointer flex items-center gap-1"
                            >
                              <IndianRupee size={11} />
                              Record another payment
                            </button>
                          )}
                        </div>
                        <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                          {formatCurrency(totalPaid)}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>

          {/* ── Sidebar (Right col) ────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Payment Progress */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">
                Payment Progress
              </p>

              <div className="flex items-end justify-between mb-2">
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                  {paymentPercentage}%
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500">
                  {formatCurrency(totalPaid)} of {formatCurrency(invoice.netPayable)}
                </p>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    paymentPercentage >= 100
                      ? 'bg-emerald-500'
                      : paymentPercentage > 0
                        ? 'bg-gradient-to-r from-orange-400 to-orange-500'
                        : ''
                  }`}
                  style={{ width: `${paymentPercentage}%` }}
                />
              </div>

              {balanceDue > 0 ? (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500 dark:text-neutral-400">
                    Balance Due
                  </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                    {formatCurrency(balanceDue)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 size={12} />
                  Fully paid
                </div>
              )}
            </div>

            {/* Key Dates */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">
                Key Dates
              </p>
              <div className="space-y-2.5">
                <DateRow
                  label="Created"
                  date={formatDate(invoice.createdAt)}
                  icon={<FileText size={12} />}
                />
                <DateRow
                  label="Due Date"
                  date={formatDate(invoice.dueDate)}
                  icon={<Calendar size={12} />}
                  highlight={
                    new Date(invoice.dueDate) < new Date() &&
                    invoice.status !== 'paid'
                  }
                />
                {invoice.paidAt && (
                  <DateRow
                    label="Paid"
                    date={formatDate(invoice.paidAt)}
                    icon={<CheckCircle2 size={12} />}
                    success
                  />
                )}
              </div>
            </div>

            {/* Invoice Aging */}
            {invoice.status !== 'paid' && (
              <div
                className={`rounded-xl border p-4 ${
                  new Date(invoice.dueDate) < new Date()
                    ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50'
                    : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle
                    size={14}
                    className={
                      new Date(invoice.dueDate) < new Date()
                        ? 'text-red-500'
                        : 'text-amber-500'
                    }
                  />
                  <p
                    className={`text-xs font-semibold ${
                      new Date(invoice.dueDate) < new Date()
                        ? 'text-red-800 dark:text-red-300'
                        : 'text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {new Date(invoice.dueDate) < new Date()
                      ? 'Overdue'
                      : 'Upcoming Due Date'}
                  </p>
                </div>
                <p
                  className={`text-[11px] ${
                    new Date(invoice.dueDate) < new Date()
                      ? 'text-red-700 dark:text-red-400'
                      : 'text-amber-700 dark:text-amber-400'
                  }`}
                >
                  {new Date(invoice.dueDate) < new Date()
                    ? `This invoice is ${Math.floor((Date.now() - new Date(invoice.dueDate).getTime()) / 86400000)} days past due.`
                    : `Due in ${Math.ceil((new Date(invoice.dueDate).getTime() - Date.now()) / 86400000)} days.`}
                </p>
              </div>
            )}

            {/* Quick Info */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">
                Quick Info
              </p>
              <div className="space-y-2">
                <InfoRow label="Account" value={invoice.accountEntryId} mono />
                <InfoRow label="Lead" value={invoice.leadId} mono />
                {invoice.customerId && (
                  <InfoRow label="Customer" value={invoice.customerId} mono />
                )}
                <InfoRow
                  label="Items"
                  value={`${invoice.items.length} service${invoice.items.length > 1 ? 's' : ''}`}
                />
                <InfoRow
                  label="Tax Rate"
                  value={`18% GST (${invoice.gstType === 'cgst-sgst' ? '9% + 9%' : 'IGST'})`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===========================================================================
// Sub-components
// ===========================================================================

function DateRow({
  label,
  date,
  icon,
  highlight,
  success,
}: {
  label: string
  date: string
  icon: React.ReactNode
  highlight?: boolean
  success?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
        <span
          className={
            success
              ? 'text-emerald-500'
              : highlight
                ? 'text-red-500'
                : 'text-neutral-400 dark:text-neutral-500'
          }
        >
          {icon}
        </span>
        <span>{label}</span>
      </div>
      <span
        className={`font-medium ${
          success
            ? 'text-emerald-600 dark:text-emerald-400'
            : highlight
              ? 'text-red-600 dark:text-red-400 font-bold'
              : 'text-neutral-700 dark:text-neutral-300'
        }`}
      >
        {date}
      </span>
    </div>
  )
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-neutral-500 dark:text-neutral-400">{label}</span>
      <span
        className={`font-medium text-neutral-700 dark:text-neutral-300 ${
          mono
            ? 'font-[family-name:var(--font-mono,\'IBM_Plex_Mono\',ui-monospace,monospace)]'
            : ''
        }`}
      >
        {value}
      </span>
    </div>
  )
}
