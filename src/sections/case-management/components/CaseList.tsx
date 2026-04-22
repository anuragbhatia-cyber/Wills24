import { useState, useMemo } from 'react'
import {
  Search,
  Briefcase,
  CheckCircle2,
  Clock,
  Pause,
  TrendingUp,
  MoreVertical,
  Eye,
  Pencil,
  Plus,
  Filter,
  Download,
  ChevronDown,
  ArrowUpDown,
  Scale,
  AlertTriangle,
  MessageSquare,
  FileText,
  UserCircle,
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
  CaseListProps,
  Case,
  CaseStatus,
  CasePriority,
  CaseKpiStats,
} from '@/../product/sections/case-management/types'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

type TabKey = 'all' | CaseStatus

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All Cases' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
]

const STATUS_CONFIG: Record<CaseStatus, { label: string; dot: string; bg: string; text: string }> = {
  'in-progress': { label: 'In Progress', dot: 'bg-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-700 dark:text-blue-400' },
  drafting: { label: 'Drafting', dot: 'bg-violet-500', bg: 'bg-violet-50 dark:bg-violet-950/30', text: 'text-violet-700 dark:text-violet-400' },
  'under-review': { label: 'Under Review', dot: 'bg-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-400' },
  approved: { label: 'Approved', dot: 'bg-teal-500', bg: 'bg-teal-50 dark:bg-teal-950/30', text: 'text-teal-700 dark:text-teal-400' },
  completed: { label: 'Completed', dot: 'bg-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-400' },
  'on-hold': { label: 'On Hold', dot: 'bg-neutral-400', bg: 'bg-neutral-100 dark:bg-neutral-800', text: 'text-neutral-600 dark:text-neutral-400' },
}

const PRIORITY_CONFIG: Record<CasePriority, { label: string; color: string; icon: React.ReactNode | null }> = {
  high: { label: 'High', color: 'text-red-500 dark:text-red-400', icon: <AlertTriangle size={10} /> },
  normal: { label: 'Normal', color: 'text-neutral-400 dark:text-neutral-500', icon: null },
  low: { label: 'Low', color: 'text-neutral-300 dark:text-neutral-600', icon: null },
}

type SortKey = 'lastUpdated' | 'customerName' | 'priority' | 'followUpCount'
type SortDir = 'asc' | 'desc'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

function getInitials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}

const INITIAL_COLORS = [
  'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
]

function getInitialColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return INITIAL_COLORS[Math.abs(hash) % INITIAL_COLORS.length]
}

function priorityWeight(p: CasePriority) {
  return p === 'high' ? 3 : p === 'normal' ? 2 : 1
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CaseList({
  cases,
  kpiStats,
  statusCounts,
  onView,
  onEdit,
  onCreate,
}: CaseListProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('all')
  const [search, setSearch] = useState('')
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('lastUpdated')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  // Modal state
  const [editModal, setEditModal] = useState<{ open: boolean; item: Case | null }>({ open: false, item: null })

  // Edit form state
  const [editTitle, setEditTitle] = useState('')
  const [editType, setEditType] = useState('')
  const [editStatus, setEditStatus] = useState<CaseStatus>('in-progress')
  const [editPriority, setEditPriority] = useState<CasePriority>('normal')
  const [editCustomer, setEditCustomer] = useState('')
  const [editDescription, setEditDescription] = useState('')

  function openEditModal(cs: Case) {
    setEditTitle(cs.serviceName)
    setEditType(cs.serviceType)
    setEditStatus(cs.status)
    setEditPriority(cs.priority)
    setEditCustomer(cs.customerName)
    setEditDescription(cs.description)
    setEditModal({ open: true, item: cs })
  }

  function handleEditSave() {
    if (editModal.item) {
      onEdit?.(editModal.item.id)
    }
    setEditModal({ open: false, item: null })
  }

  // --- Filter & Sort --------------------------------------------------------

  const filtered = useMemo(() => {
    let list = cases

    if (activeTab !== 'all') list = list.filter((c) => c.status === activeTab)

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.customerName.toLowerCase().includes(q) ||
          c.customerId.toLowerCase().includes(q) ||
          c.serviceType.toLowerCase().includes(q) ||
          c.assignedLawyer.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q),
      )
    }

    list = [...list].sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'lastUpdated':
          cmp = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
          break
        case 'customerName':
          cmp = a.customerName.localeCompare(b.customerName)
          break
        case 'priority':
          cmp = priorityWeight(a.priority) - priorityWeight(b.priority)
          break
        case 'followUpCount':
          cmp = a.followUpCount - b.followUpCount
          break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })

    return list
  }, [cases, activeTab, search, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
            All Cases
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
            Manage cases & services — creation, follow-ups, and progress tracking
          </p>
        </div>
        <div className="flex items-center gap-2 mt-3 sm:mt-0">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 dark:hover:border-neutral-600 dark:hover:bg-neutral-700 transition-all cursor-pointer">
            <Download size={13} />
            Export
          </button>
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-500 transition-colors cursor-pointer shadow-sm"
          >
            <Plus size={13} />
            Add New Case
          </button>
        </div>
      </div>

      {/* ── KPI Cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <KpiCard
          icon={<Briefcase size={16} />}
          label="Total Cases"
          value={kpiStats.totalCases}
          iconBg="bg-orange-100 dark:bg-orange-900/40"
          iconColor="text-orange-600 dark:text-orange-400"
        />
        <KpiCard
          icon={<Clock size={16} />}
          label="Active"
          value={kpiStats.activeCases}
          iconBg="bg-blue-100 dark:bg-blue-900/40"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <KpiCard
          icon={<CheckCircle2 size={16} />}
          label="Completed"
          value={kpiStats.completedCases}
          iconBg="bg-emerald-100 dark:bg-emerald-900/40"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <KpiCard
          icon={<TrendingUp size={16} />}
          label="Avg. Resolution"
          value={`${kpiStats.avgResolutionDays}d`}
          iconBg="bg-violet-100 dark:bg-violet-900/40"
          iconColor="text-violet-600 dark:text-violet-400"
        />
        <KpiCard
          icon={<Pause size={16} />}
          label="On Hold"
          value={kpiStats.onHold}
          iconBg="bg-neutral-200 dark:bg-neutral-700"
          iconColor="text-neutral-500 dark:text-neutral-400"
        />
      </div>

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1 bg-neutral-200/50 dark:bg-neutral-800 rounded-lg p-1 overflow-x-auto">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key
              const count = tab.key === 'all'
                ? statusCounts.all
                : (statusCounts as any)[tab.key] ?? 0
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
                  <span className={`ml-1.5 text-[10px] font-bold tabular-nums ${isActive ? 'text-orange-400 dark:text-orange-300' : 'text-neutral-400 dark:text-neutral-500'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search cases, customers..."
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
          {/* Desktop header */}
          <div className="hidden lg:grid grid-cols-[100px_minmax(140px,1.5fr)_minmax(120px,1fr)_minmax(120px,1fr)_70px_90px_80px_48px] gap-2 px-5 py-3 bg-neutral-50 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            <span>Case ID</span>
            <SortHeader label="Customer" sortKey="customerName" current={sortKey} dir={sortDir} onSort={toggleSort} />
            <span>Service Type</span>
            <span>Assigned Lawyer</span>
            <SortHeader label="Follow-ups" sortKey="followUpCount" current={sortKey} dir={sortDir} onSort={toggleSort} />
            <span className="text-center">Status</span>
            <SortHeader label="Updated" sortKey="lastUpdated" current={sortKey} dir={sortDir} onSort={toggleSort} />
            <span />
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Briefcase size={36} className="mx-auto text-neutral-300 dark:text-neutral-600 mb-3" />
              <p className="font-medium text-neutral-500 dark:text-neutral-400">No cases found</p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                {search ? 'Try a different search term' : 'No cases in this status'}
              </p>
            </div>
          ) : (
            filtered.map((cs, idx) => {
              const isLast = idx === filtered.length - 1
              const isMenuOpen = openMenu === cs.id
              const statusCfg = STATUS_CONFIG[cs.status]
              const priorityCfg = PRIORITY_CONFIG[cs.priority]
              const isExpanded = expandedRow === cs.id

              return (
                <div key={cs.id}>
                  {/* ── Desktop row ───────────────────────────────── */}
                  <div
                    className={`hidden lg:grid grid-cols-[100px_minmax(140px,1.5fr)_minmax(120px,1fr)_minmax(120px,1fr)_70px_90px_80px_48px] gap-2 px-5 py-3.5 items-center hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors cursor-pointer ${
                      !isLast ? 'border-b border-neutral-100 dark:border-neutral-800/60' : ''
                    }`}
                    onClick={() => onView?.(cs.id)}
                  >
                    {/* Case ID */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                        {cs.id.replace('W24-CASE-', '')}
                      </span>
                    </div>

                    {/* Customer */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${getInitialColor(cs.customerName)}`}>
                        {getInitials(cs.customerName)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{cs.customerName}</p>
                        <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">{cs.customerId}</p>
                      </div>
                    </div>

                    {/* Service Type */}
                    <div className="min-w-0">
                      <span className="inline-block px-1.5 py-0.5 text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded truncate max-w-full" title={cs.serviceType}>
                        {cs.serviceType.length > 22 ? cs.serviceType.slice(0, 20) + '…' : cs.serviceType}
                      </span>
                    </div>

                    {/* Assigned Lawyer */}
                    <div className="min-w-0">
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 truncate">{cs.assignedLawyer}</p>
                    </div>

                    {/* Follow-ups */}
                    <div className="flex items-center justify-center gap-1">
                      <MessageSquare size={11} className="text-neutral-400 dark:text-neutral-500" />
                      <span className="text-xs tabular-nums text-neutral-600 dark:text-neutral-300">{cs.followUpCount}</span>
                    </div>

                    {/* Status */}
                    <div className="flex justify-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${statusCfg.bg} ${statusCfg.text}`}>
                        {statusCfg.label}
                      </span>
                    </div>

                    {/* Last Updated */}
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 text-center whitespace-nowrap">
                      {timeAgo(cs.lastUpdated)}
                    </p>

                    {/* Actions */}
                    <div className="relative flex justify-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setOpenMenu(isMenuOpen ? null : cs.id)}
                        className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        <MoreVertical size={14} />
                      </button>

                      {isMenuOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                          <div className="absolute right-0 top-8 z-20 w-44 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg py-1.5 text-sm">
                            <MenuItem icon={<Eye size={13} />} label="View Case" onClick={() => { onView?.(cs.id); setOpenMenu(null) }} />
                            <MenuItem icon={<Pencil size={13} />} label="Edit Case" onClick={() => { openEditModal(cs); setOpenMenu(null) }} />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* ── Mobile / Tablet card ──────────────────────── */}
                  <div className={`lg:hidden ${!isLast ? 'border-b border-neutral-100 dark:border-neutral-800/60' : ''}`}>
                    <div
                      className="px-5 py-4 cursor-pointer"
                      onClick={() => setExpandedRow(isExpanded ? null : cs.id)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${getInitialColor(cs.customerName)}`}>
                            {getInitials(cs.customerName)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">{cs.customerName}</p>
                            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">{cs.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusCfg.bg} ${statusCfg.text}`}>
                            {statusCfg.label}
                          </span>
                          <ChevronDown size={14} className={`text-neutral-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>

                      {/* Quick info */}
                      <div className="flex items-center gap-3 mt-2.5 text-xs text-neutral-500 dark:text-neutral-400 flex-wrap">
                        <span className="inline-block px-1.5 py-0.5 text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded">
                          {cs.serviceType}
                        </span>
                        <span className="flex items-center gap-1"><Scale size={10} /> {cs.assignedLawyer.replace('Adv. ', '')}</span>
                        <span className="flex items-center gap-1"><MessageSquare size={10} /> {cs.followUpCount}</span>
                      </div>

                    </div>

                    {/* Expanded */}
                    {isExpanded && (
                      <div className="px-5 pb-4 border-t border-neutral-100 dark:border-neutral-800/60 pt-3">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-3 line-clamp-3">{cs.description}</p>
                        <div className="flex items-center gap-2 text-[10px] text-neutral-400 dark:text-neutral-500 mb-3">
                          <span>Created {formatDate(cs.createdAt)}</span>
                          <span>·</span>
                          <span>Updated {timeAgo(cs.lastUpdated)}</span>
                        </div>
                        <div className="flex gap-2">
                          <MobileAction icon={<Eye size={12} />} label="View" onClick={() => onView?.(cs.id)} />
                          <MobileAction icon={<Pencil size={12} />} label="Edit" onClick={() => openEditModal(cs)} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}

          {/* Footer */}
          {filtered.length > 0 && (
            <div className="px-5 py-3 bg-neutral-50 dark:bg-neutral-800/40 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                {filtered.length} {filtered.length === 1 ? 'case' : 'cases'}
                {activeTab !== 'all' && ` · ${TABS.find((t) => t.key === activeTab)?.label}`}
              </p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                Avg. resolution: <span className="font-semibold text-neutral-600 dark:text-neutral-300">{kpiStats.avgResolutionDays} days</span>
              </p>
            </div>
          )}
      </div>

      {/* ── Edit Case Modal ───────────────────────────────────────────────── */}
      <Dialog open={editModal.open} onOpenChange={(open) => { if (!open) setEditModal({ open: false, item: null }) }}>
        <DialogContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <DialogHeader>
            <DialogTitle className="text-neutral-900 dark:text-neutral-100">Edit Case</DialogTitle>
            <DialogDescription className="text-neutral-500 dark:text-neutral-400">Update case details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Type</label>
              <select
                value={editType}
                onChange={(e) => setEditType(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
              >
                <option value="Will Drafting">Will Drafting</option>
                <option value="Trust Formation">Trust Formation</option>
                <option value="Succession Certificate">Succession Certificate</option>
                <option value="Estate Planning">Estate Planning</option>
                <option value="Power of Attorney">Power of Attorney</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as CaseStatus)}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
                >
                  <option value="in-progress">In Progress</option>
                  <option value="drafting">Drafting</option>
                  <option value="under-review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Priority</label>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as CasePriority)}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
                >
                  <option value="high">High</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Customer</label>
              <input
                type="text"
                value={editCustomer}
                onChange={(e) => setEditCustomer(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Description</label>
              <textarea
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
              />
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setEditModal({ open: false, item: null })}
              className="rounded-lg border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEditSave}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
            >
              Save Changes
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

function KpiCard({
  icon,
  label,
  value,
  iconBg,
  iconColor,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  iconBg: string
  iconColor: string
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3.5">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          <span className={iconColor}>{icon}</span>
        </div>
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-0.5">{label}</p>
      <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">{value}</p>
    </div>
  )
}

function SortHeader({
  label,
  sortKey: key,
  current,
  dir,
  onSort,
}: {
  label: string
  sortKey: SortKey
  current: SortKey
  dir: SortDir
  onSort: (key: SortKey) => void
}) {
  const isActive = current === key
  return (
    <button className="flex items-center gap-1 cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors" onClick={() => onSort(key)}>
      <span>{label}</span>
      <ArrowUpDown size={10} className={isActive ? 'text-orange-500' : 'text-neutral-300 dark:text-neutral-600'} />
    </button>
  )
}

function MenuItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-3 py-2 text-left text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer"
    >
      <span className="text-neutral-400 dark:text-neutral-500">{icon}</span>
      <span className="text-sm">{label}</span>
    </button>
  )
}

function MobileAction({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
    >
      {icon}
      {label}
    </button>
  )
}
