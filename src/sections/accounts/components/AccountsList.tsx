import { useState, useMemo } from 'react'
import {
  Search,
  FileText,
  Receipt,
  IndianRupee,
  Send,
  UserCheck,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  Download,
  MessageSquare,
  Eye,
  Pencil,
  X,
  Check,
  Minus,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import type {
  AccountEntry,
  AccountEntryStatus,
  KpiStats,
  StatusCounts,
} from '@/../product/sections/accounts/types'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface AccountsListProps {
  accountEntries: AccountEntry[]
  kpiStats: KpiStats
  statusCounts: StatusCounts
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onFollowUp?: (id: string) => void
  onSendPI?: (id: string) => void
  onSendInvoice?: (id: string) => void
  onRecordPayment?: (id: string) => void
  onConvertToCustomer?: (id: string) => void
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

type TabKey = 'all' | AccountEntryStatus

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pi-sent', label: 'PI Sent' },
  { key: 'payment-received', label: 'Payment Received' },
  { key: 'invoice-sent', label: 'Invoice Sent' },
  { key: 'subscription-enabled', label: 'Converted' },
]

const STATUS_CONFIG: Record<AccountEntryStatus, { label: string; dot: string; bg: string; text: string }> = {
  'pi-sent': {
    label: 'PI Sent',
    dot: 'bg-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-700 dark:text-amber-400',
  },
  'payment-received': {
    label: 'Payment Received',
    dot: 'bg-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-700 dark:text-blue-400',
  },
  'invoice-sent': {
    label: 'Invoice Sent',
    dot: 'bg-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    text: 'text-violet-700 dark:text-violet-400',
  },
  'subscription-enabled': {
    label: 'Converted',
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    text: 'text-emerald-700 dark:text-emerald-400',
  },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

// ---------------------------------------------------------------------------
// Modal State Types
// ---------------------------------------------------------------------------

interface EditModalState {
  entry: AccountEntry
  name: string
  amount: string
  dueDate: string
  status: AccountEntryStatus
  notes: string
}

interface FollowUpModalState {
  entryId: string
  entryName: string
  date: string
  type: 'call' | 'email' | 'meeting'
  notes: string
}

interface SendPIModalState {
  entryId: string
  entryName: string
  email: string
  message: string
}

interface SendInvoiceModalState {
  entryId: string
  entryName: string
  email: string
  message: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AccountsList({
  accountEntries,
  kpiStats,
  statusCounts,
  onView,
  onEdit,
  onFollowUp,
  onSendPI,
  onSendInvoice,
  onRecordPayment,
  onConvertToCustomer,
}: AccountsListProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('all')
  const [search, setSearch] = useState('')
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Modal states
  const [editModal, setEditModal] = useState<EditModalState | null>(null)
  const [followUpModal, setFollowUpModal] = useState<FollowUpModalState | null>(null)
  const [sendPIModal, setSendPIModal] = useState<SendPIModalState | null>(null)
  const [sendInvoiceModal, setSendInvoiceModal] = useState<SendInvoiceModalState | null>(null)

  // --- Filter ---------------------------------------------------------------

  const filtered = useMemo(() => {
    let list = accountEntries
    if (activeTab !== 'all') list = list.filter((e) => e.status === activeTab)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.leadId.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.phone.includes(q) ||
          e.company.toLowerCase().includes(q) ||
          e.wealthManagerName.toLowerCase().includes(q) ||
          e.quotationRef.toLowerCase().includes(q),
      )
    }
    return list
  }, [accountEntries, activeTab, search])

  const allSelected = filtered.length > 0 && filtered.every(e => selectedIds.has(e.id))

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map(e => e.id)))
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // --- Modal Handlers -------------------------------------------------------

  function openEditModal(entry: AccountEntry) {
    setEditModal({
      entry,
      name: entry.name,
      amount: entry.quotationAmount.toString(),
      dueDate: entry.piSentDate,
      status: entry.status,
      notes: entry.notes,
    })
    setOpenMenu(null)
  }

  function openFollowUpModal(entry: AccountEntry) {
    setFollowUpModal({
      entryId: entry.id,
      entryName: entry.name,
      date: new Date().toISOString().split('T')[0],
      type: 'call',
      notes: '',
    })
    setOpenMenu(null)
  }

  function openSendPIModal(entry: AccountEntry) {
    setSendPIModal({
      entryId: entry.id,
      entryName: entry.name,
      email: entry.email,
      message: '',
    })
    setOpenMenu(null)
  }

  function openSendInvoiceModal(entry: AccountEntry) {
    setSendInvoiceModal({
      entryId: entry.id,
      entryName: entry.name,
      email: entry.email,
      message: '',
    })
    setOpenMenu(null)
  }

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Accounts
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
            Payment confirmation, invoicing, and lead-to-customer conversion
          </p>
        </div>
        <div className="flex items-center gap-2 mt-3 sm:mt-0">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 dark:hover:border-neutral-600 dark:hover:bg-neutral-700 transition-all cursor-pointer">
            <Download size={13} />
            Export
          </button>
        </div>
      </div>

      {/* ── KPI Cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          icon={<FileText size={16} />}
          label="Total PI Sent"
          value={kpiStats.totalPISent}
          iconBg="bg-amber-100 dark:bg-amber-900/40"
          iconColor="text-amber-600 dark:text-amber-400"
        />
        <KpiCard
          icon={<Clock size={16} />}
          label="Pending Amount"
          value={formatCurrency(kpiStats.totalPendingAmount)}
          iconBg="bg-red-100 dark:bg-red-900/40"
          iconColor="text-red-600 dark:text-red-400"
          trend={{ direction: 'up', label: '₹1.47L' }}
        />
        <KpiCard
          icon={<IndianRupee size={16} />}
          label="Received Payment"
          value={formatCurrency(kpiStats.receivedPayment)}
          iconBg="bg-emerald-100 dark:bg-emerald-900/40"
          iconColor="text-emerald-600 dark:text-emerald-400"
          trend={{ direction: 'up', label: '₹3.29L' }}
        />
        <KpiCard
          icon={<Send size={16} />}
          label="Quotations Sent"
          value={kpiStats.totalQuotationsSent}
          iconBg="bg-orange-100 dark:bg-orange-900/40"
          iconColor="text-orange-600 dark:text-orange-400"
        />
      </div>

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Status tabs */}
        <div className="flex items-center gap-1 bg-neutral-200/50 dark:bg-neutral-800 rounded-lg p-1 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key
            const count = tab.key === 'all' ? statusCounts.all : (statusCounts as any)[tab.key] ?? 0
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-neutral-700 text-orange-600 dark:text-orange-400 shadow-sm'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
              >
                {tab.label}
                <span
                  className={`ml-1.5 text-[10px] font-bold tabular-nums ${
                    isActive ? 'text-orange-400 dark:text-orange-300' : 'text-neutral-400 dark:text-neutral-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search + filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search leads, quotations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 pl-8 pr-3 py-2 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-all"
            />
          </div>
          <button className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg transition-colors cursor-pointer">
            <Filter size={14} />
          </button>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[32px_90px_minmax(160px,1.5fr)_minmax(120px,1fr)_120px_110px_100px_100px_48px] gap-2 px-5 py-3 bg-neutral-50 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            <span className="flex items-center">
              <button
                onClick={toggleSelectAll}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${
                  allSelected
                    ? 'border-orange-500 bg-orange-500'
                    : selectedIds.size > 0
                      ? 'border-orange-500 bg-orange-500'
                      : 'border-neutral-300 dark:border-neutral-600'
                }`}
              >
                {allSelected ? <Check size={10} className="text-white" /> : selectedIds.size > 0 ? <Minus size={10} className="text-white" /> : null}
              </button>
            </span>
            <span>Lead ID</span>
            <span>Contact</span>
            <span>Wealth Manager</span>
            <span>Quotation</span>
            <span className="text-right">Amount</span>
            <span className="text-center">Status</span>
            <span className="text-center">Assigned</span>
            <span />
          </div>

          {/* Table rows */}
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Receipt size={36} className="mx-auto text-neutral-300 dark:text-neutral-600 mb-3" />
              <p className="font-medium text-neutral-500 dark:text-neutral-400">No entries found</p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                {search ? 'Try a different search term' : 'No leads assigned to accounts in this status'}
              </p>
            </div>
          ) : (
            filtered.map((entry, idx) => {
              const statusCfg = STATUS_CONFIG[entry.status]
              const isLast = idx === filtered.length - 1
              const isMenuOpen = openMenu === entry.id

              return (
                <div
                  key={entry.id}
                  className={`grid grid-cols-[32px_90px_minmax(160px,1.5fr)_minmax(120px,1fr)_120px_110px_100px_100px_48px] gap-2 px-5 py-3 items-center hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors ${
                    !isLast ? 'border-b border-neutral-100 dark:border-neutral-800/60' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <span className="flex items-center" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => toggleSelect(entry.id)}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${
                        selectedIds.has(entry.id)
                          ? 'border-orange-500 bg-orange-500'
                          : 'border-neutral-300 dark:border-neutral-600'
                      }`}
                    >
                      {selectedIds.has(entry.id) && <Check size={10} className="text-white" />}
                    </button>
                  </span>

                  {/* Lead ID */}
                  <span className="text-xs font-medium text-neutral-900 dark:text-neutral-100 font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                    {entry.leadId.replace('W24-LEAD-', 'L-')}
                  </span>

                  {/* Contact */}
                  <div className="min-w-0 overflow-hidden pr-2">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{entry.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate">{entry.company || entry.email}</span>
                    </div>
                  </div>

                  {/* Wealth Manager */}
                  <div className="min-w-0 overflow-hidden">
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 truncate">{entry.wealthManagerName}</p>
                  </div>

                  {/* Quotation Ref */}
                  <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                    {entry.quotationRef.replace('W24-QT-2026-', 'QT-')}
                  </span>

                  {/* Amount */}
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 text-right font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                    {formatCurrency(entry.quotationAmount)}
                  </p>

                  {/* Status */}
                  <div className="flex justify-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusCfg.bg} ${statusCfg.text}`}>
                      {statusCfg.label.split(' ')[0]}
                    </span>
                  </div>

                  {/* Assigned date */}
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500 text-center">
                    {timeAgo(entry.assignedAt)}
                  </p>

                  {/* Actions */}
                  <div className="relative flex justify-center" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setOpenMenu(isMenuOpen ? null : entry.id)}
                      className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      <MoreVertical size={14} />
                    </button>

                    {isMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                        <div className="absolute right-0 top-8 z-20 w-52 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg py-1.5 text-sm">
                          <MenuItem icon={<Eye size={13} />} label="View Details" onClick={() => { onView?.(entry.id); setOpenMenu(null) }} />
                          <MenuItem icon={<Pencil size={13} />} label="Edit" onClick={() => openEditModal(entry)} />
                          <div className="my-1 border-t border-neutral-100 dark:border-neutral-700" />
                          {(entry.status === 'pi-sent' || entry.status === 'payment-received') && (
                            <MenuItem icon={<FileText size={13} />} label="Send PI" onClick={() => openSendPIModal(entry)} accent />
                          )}
                          {entry.status === 'payment-received' && (
                            <MenuItem icon={<Receipt size={13} />} label="Send Invoice" onClick={() => openSendInvoiceModal(entry)} accent />
                          )}
                          {entry.status !== 'subscription-enabled' && (
                            <MenuItem icon={<IndianRupee size={13} />} label="Record Payment" onClick={() => { onRecordPayment?.(entry.id); setOpenMenu(null) }} accent />
                          )}
                          {(entry.status === 'payment-received' || entry.status === 'invoice-sent') && (
                            <>
                              <div className="my-1 border-t border-neutral-100 dark:border-neutral-700" />
                              <MenuItem icon={<UserCheck size={13} />} label="Convert to Customer" onClick={() => { onConvertToCustomer?.(entry.id); setOpenMenu(null) }} highlight />
                            </>
                          )}
                          {entry.status === 'subscription-enabled' && entry.customerId && (
                            <>
                              <div className="my-1 border-t border-neutral-100 dark:border-neutral-700" />
                              <div className="px-3 py-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                                <CheckCircle2 size={12} />
                                {entry.customerId}
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )
            })
          )}

          {/* Table footer */}
          {filtered.length > 0 && (
            <div className="px-5 py-3 bg-neutral-50 dark:bg-neutral-800/40 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
                {activeTab !== 'all' && ` in ${TABS.find((t) => t.key === activeTab)?.label}`}
              </p>
              <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                Total: {formatCurrency(filtered.reduce((sum, e) => sum + e.quotationAmount, 0))}
              </p>
            </div>
          )}
      </div>

      {/* ── Bulk Actions Tray ──────────────────────────────────────────── */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 bg-neutral-900 dark:bg-neutral-800 rounded-xl shadow-2xl border border-neutral-700 dark:border-neutral-600">
          <span className="text-sm font-medium text-white">
            {selectedIds.size} selected
          </span>
          <div className="w-px h-5 bg-neutral-700 dark:bg-neutral-600" />
          <button
            onClick={() => { selectedIds.forEach(id => onSendPI?.(id)); setSelectedIds(new Set()) }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition-colors cursor-pointer"
          >
            <Send size={12} />
            Send PI
          </button>
          <button
            onClick={() => { selectedIds.forEach(id => onSendInvoice?.(id)); setSelectedIds(new Set()) }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition-colors cursor-pointer"
          >
            <FileText size={12} />
            Send Invoice
          </button>
          <button
            onClick={() => { selectedIds.forEach(id => onRecordPayment?.(id)); setSelectedIds(new Set()) }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition-colors cursor-pointer"
          >
            <IndianRupee size={12} />
            Mark Payment
          </button>
          <div className="w-px h-5 bg-neutral-700 dark:bg-neutral-600" />
          <button
            onClick={() => setSelectedIds(new Set())}
            className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Edit Account Modal ─────────────────────────────────────────── */}
      <Dialog open={editModal !== null} onOpenChange={(open) => { if (!open) setEditModal(null) }}>
        <DialogContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <DialogHeader>
            <DialogTitle className="text-neutral-900 dark:text-neutral-100">Edit Account</DialogTitle>
            <DialogDescription className="text-neutral-500 dark:text-neutral-400">
              Update account entry details for {editModal?.entry.name}
            </DialogDescription>
          </DialogHeader>
          {editModal && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Lead / Customer Name
                </label>
                <input
                  type="text"
                  value={editModal.name}
                  onChange={(e) => setEditModal({ ...editModal, name: e.target.value })}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={editModal.amount}
                  onChange={(e) => setEditModal({ ...editModal, amount: e.target.value })}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={editModal.dueDate}
                  onChange={(e) => setEditModal({ ...editModal, dueDate: e.target.value })}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Status
                </label>
                <select
                  value={editModal.status}
                  onChange={(e) => setEditModal({ ...editModal, status: e.target.value as AccountEntryStatus })}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
                >
                  <option value="pi-sent">PI Sent</option>
                  <option value="payment-received">Payment Received</option>
                  <option value="invoice-sent">Invoice Sent</option>
                  <option value="subscription-enabled">Converted</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={editModal.notes}
                  onChange={(e) => setEditModal({ ...editModal, notes: e.target.value })}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <button
              onClick={() => setEditModal(null)}
              className="rounded-lg border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (editModal) {
                  onEdit?.(editModal.entry.id)
                  setEditModal(null)
                }
              }}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
            >
              Save Changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Follow-up Modal ────────────────────────────────────────────── */}
      <Dialog open={followUpModal !== null} onOpenChange={(open) => { if (!open) setFollowUpModal(null) }}>
        <DialogContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <DialogHeader>
            <DialogTitle className="text-neutral-900 dark:text-neutral-100">Schedule Follow-up</DialogTitle>
            <DialogDescription className="text-neutral-500 dark:text-neutral-400">
              Add a follow-up for {followUpModal?.entryName}
            </DialogDescription>
          </DialogHeader>
          {followUpModal && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={followUpModal.date}
                  onChange={(e) => setFollowUpModal({ ...followUpModal, date: e.target.value })}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Type
                </label>
                <select
                  value={followUpModal.type}
                  onChange={(e) => setFollowUpModal({ ...followUpModal, type: e.target.value as 'call' | 'email' | 'meeting' })}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
                >
                  <option value="call">Call</option>
                  <option value="email">Email</option>
                  <option value="meeting">Meeting</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={followUpModal.notes}
                  onChange={(e) => setFollowUpModal({ ...followUpModal, notes: e.target.value })}
                  placeholder="Add any notes about this follow-up..."
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <button
              onClick={() => setFollowUpModal(null)}
              className="rounded-lg border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (followUpModal) {
                  onFollowUp?.(followUpModal.entryId)
                  setFollowUpModal(null)
                }
              }}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
            >
              Schedule Follow-up
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Send PI Modal ──────────────────────────────────────────────── */}
      <Dialog open={sendPIModal !== null} onOpenChange={(open) => { if (!open) setSendPIModal(null) }}>
        <DialogContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <DialogHeader>
            <DialogTitle className="text-neutral-900 dark:text-neutral-100">Send Proforma Invoice</DialogTitle>
            <DialogDescription className="text-neutral-500 dark:text-neutral-400">
              Send Proforma Invoice to {sendPIModal?.entryName}?
            </DialogDescription>
          </DialogHeader>
          {sendPIModal && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={sendPIModal.email}
                  onChange={(e) => setSendPIModal({ ...sendPIModal, email: e.target.value })}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Message (optional)
                </label>
                <textarea
                  rows={3}
                  value={sendPIModal.message}
                  onChange={(e) => setSendPIModal({ ...sendPIModal, message: e.target.value })}
                  placeholder="Add a personal message to include with the invoice..."
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <button
              onClick={() => setSendPIModal(null)}
              className="rounded-lg border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (sendPIModal) {
                  onSendPI?.(sendPIModal.entryId)
                  setSendPIModal(null)
                }
              }}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
            >
              Send PI
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Send Invoice Modal ─────────────────────────────────────────── */}
      <Dialog open={sendInvoiceModal !== null} onOpenChange={(open) => { if (!open) setSendInvoiceModal(null) }}>
        <DialogContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <DialogHeader>
            <DialogTitle className="text-neutral-900 dark:text-neutral-100">Send Invoice</DialogTitle>
            <DialogDescription className="text-neutral-500 dark:text-neutral-400">
              Send Invoice to {sendInvoiceModal?.entryName}?
            </DialogDescription>
          </DialogHeader>
          {sendInvoiceModal && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={sendInvoiceModal.email}
                  onChange={(e) => setSendInvoiceModal({ ...sendInvoiceModal, email: e.target.value })}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Message (optional)
                </label>
                <textarea
                  rows={3}
                  value={sendInvoiceModal.message}
                  onChange={(e) => setSendInvoiceModal({ ...sendInvoiceModal, message: e.target.value })}
                  placeholder="Add a personal message to include with the invoice..."
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <button
              onClick={() => setSendInvoiceModal(null)}
              className="rounded-lg border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (sendInvoiceModal) {
                  onSendInvoice?.(sendInvoiceModal.entryId)
                  setSendInvoiceModal(null)
                }
              }}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
            >
              Send Invoice
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ===========================================================================
// Sub-components
// ===========================================================================

// ── KPI Card ────────────────────────────────────────────────────────────────

function KpiCard({
  icon,
  label,
  value,
  iconBg,
  iconColor,
  trend,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  iconBg: string
  iconColor: string
  trend?: { direction: 'up' | 'down'; label: string }
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3.5">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          <span className={iconColor}>{icon}</span>
        </div>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${
              trend.direction === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
            }`}
          >
            {trend.direction === 'up' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {trend.label}
          </span>
        )}
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-0.5">
        {label}
      </p>
      <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
        {value}
      </p>
    </div>
  )
}

// ── Menu Item ───────────────────────────────────────────────────────────────

function MenuItem({
  icon,
  label,
  onClick,
  accent,
  highlight,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  accent?: boolean
  highlight?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors cursor-pointer ${
        highlight
          ? 'text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 font-medium'
          : accent
            ? 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700/50'
            : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50'
      }`}
    >
      <span className={highlight ? 'text-orange-500' : 'text-neutral-400 dark:text-neutral-500'}>{icon}</span>
      <span className="text-sm">{label}</span>
    </button>
  )
}
