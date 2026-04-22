import { useState, useMemo } from 'react'
import {
  Search,
  Users,
  TrendingUp,
  MoreVertical,
  Eye,
  Pencil,
  Plus,
  Download,
  ChevronDown,
  ArrowUpDown,
  UserCircle,
  Phone,
  Mail,
  Building2,
  FileText,
  Crown,
  Award,
  Medal,
  Gem,
  ToggleLeft,
  ToggleRight,
  Briefcase,
  IndianRupee,
  Package,
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
  WMListProps,
  WealthManager,
  WMStatus,
  WMTier,
} from '@/../product/sections/partners/types'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

type StatusTab = 'all' | WMStatus

const STATUS_TABS: { key: StatusTab; label: string }[] = [
  { key: 'all', label: 'All Partners' },
  { key: 'active', label: 'Active' },
  { key: 'inactive', label: 'Inactive' },
]

const TIER_CONFIG: Record<WMTier, { label: string; icon: React.ReactNode; bg: string; text: string; border: string }> = {
  platinum: {
    label: 'Platinum',
    icon: <Gem size={11} />,
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    text: 'text-violet-700 dark:text-violet-400',
    border: 'border-violet-200 dark:border-violet-800/60',
  },
  gold: {
    label: 'Gold',
    icon: <Crown size={11} />,
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800/60',
  },
  silver: {
    label: 'Silver',
    icon: <Award size={11} />,
    bg: 'bg-neutral-100 dark:bg-neutral-800',
    text: 'text-neutral-600 dark:text-neutral-400',
    border: 'border-neutral-300 dark:border-neutral-700',
  },
  bronze: {
    label: 'Bronze',
    icon: <Medal size={11} />,
    bg: 'bg-orange-50 dark:bg-orange-950/20',
    text: 'text-orange-700 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-800/60',
  },
}

const STATUS_BADGE: Record<WMStatus, { label: string; dot: string; bg: string; text: string }> = {
  active: { label: 'Active', dot: 'bg-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-400' },
  inactive: { label: 'Inactive', dot: 'bg-neutral-400', bg: 'bg-neutral-100 dark:bg-neutral-800', text: 'text-neutral-500 dark:text-neutral-400' },
}

type SortKey = 'name' | 'totalSales' | 'totalCustomers' | 'lastActive'
type SortDir = 'asc' | 'desc'
type TierFilter = 'all' | WMTier

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(amount: number) {
  if (amount >= 10000000) return `${(amount / 10000000).toFixed(2)}Cr`
  if (amount >= 100000) return `${(amount / 100000).toFixed(2)}L`
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`
  return amount.toLocaleString('en-IN')
}

function formatCurrencyFull(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

function getInitials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}

const AVATAR_COLORS = [
  'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
]

function getAvatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function WMList({
  wealthManagers,
  kpiStats,
  statusCounts,
  tierCounts,
  onView,
  onEdit,
  onToggleStatus,
  onViewCustomers,
  onViewPackages,
  onCreate,
}: WMListProps) {
  const [activeTab, setActiveTab] = useState<StatusTab>('all')
  const [tierFilter, setTierFilter] = useState<TierFilter>('all')
  const [search, setSearch] = useState('')
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('lastActive')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  // Modal states
  const [editModalWM, setEditModalWM] = useState<WealthManager | null>(null)
  const [toggleStatusWM, setToggleStatusWM] = useState<WealthManager | null>(null)
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', company: '', tier: 'gold' as WMTier, status: 'active' as WMStatus })

  // --- Filter & Sort --------------------------------------------------------

  const filtered = useMemo(() => {
    let list = wealthManagers

    if (activeTab !== 'all') list = list.filter((wm) => wm.status === activeTab)

    if (tierFilter !== 'all') list = list.filter((wm) => wm.tier === tierFilter)

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (wm) =>
          wm.id.toLowerCase().includes(q) ||
          wm.name.toLowerCase().includes(q) ||
          wm.email.toLowerCase().includes(q) ||
          wm.phone.includes(q) ||
          wm.company.name.toLowerCase().includes(q) ||
          wm.address.city.toLowerCase().includes(q),
      )
    }

    list = [...list].sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'name':
          cmp = a.name.localeCompare(b.name)
          break
        case 'totalSales':
          cmp = a.totalSales - b.totalSales
          break
        case 'totalCustomers':
          cmp = a.totalCustomers - b.totalCustomers
          break
        case 'lastActive':
          cmp = new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime()
          break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })

    return list
  }, [wealthManagers, activeTab, tierFilter, search, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  function openEditModal(wm: WealthManager) {
    setEditForm({
      name: wm.name,
      email: wm.email,
      phone: wm.phone,
      company: wm.company.name,
      tier: wm.tier,
      status: wm.status,
    })
    setEditModalWM(wm)
  }

  function handleEditSave() {
    if (editModalWM) {
      onEdit?.(editModalWM.id)
    }
    setEditModalWM(null)
  }

  function handleToggleStatusConfirm() {
    if (toggleStatusWM) {
      onToggleStatus?.(toggleStatusWM.id)
    }
    setToggleStatusWM(null)
  }

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Partners
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
            Manage wealth managers, packages & channel performance
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
            Add Partner
          </button>
        </div>
      </div>

      {/* ── KPI Cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          icon={<IndianRupee size={16} />}
          label="Total Sales"
          value={formatCurrency(kpiStats.totalSales)}
          iconBg="bg-orange-100 dark:bg-orange-900/40"
          iconColor="text-orange-600 dark:text-orange-400"
        />
        <KpiCard
          icon={<Users size={16} />}
          label="Active Partners"
          value={kpiStats.activeWealthManagers}
          iconBg="bg-emerald-100 dark:bg-emerald-900/40"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <KpiCard
          icon={<TrendingUp size={16} />}
          label="Total Partners"
          value={kpiStats.totalWealthManagers}
          iconBg="bg-blue-100 dark:bg-blue-900/40"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <KpiCard
          icon={<FileText size={16} />}
          label="Wills Remaining"
          value={kpiStats.totalWillsRemaining}
          iconBg="bg-violet-100 dark:bg-violet-900/40"
          iconColor="text-violet-600 dark:text-violet-400"
        />
      </div>

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Status tabs */}
          <div className="flex items-center gap-1 bg-neutral-200/50 dark:bg-neutral-800 rounded-lg p-1 overflow-x-auto">
            {STATUS_TABS.map((tab) => {
              const isActive = activeTab === tab.key
              const count = tab.key === 'all'
                ? statusCounts.all
                : statusCounts[tab.key as WMStatus] ?? 0
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

            {/* Tier filter divider */}
            <div className="w-px h-5 bg-neutral-200 dark:bg-neutral-700 mx-2 shrink-0" />

            {/* Tier filters */}
            {(['all', 'platinum', 'gold', 'silver', 'bronze'] as const).map((tier) => {
              const isSelected = tierFilter === tier
              if (tier === 'all') {
                return (
                  <button
                    key={tier}
                    onClick={() => setTierFilter('all')}
                    className={`px-2.5 py-1.5 text-[11px] font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                        : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'
                    }`}
                  >
                    All Tiers
                  </button>
                )
              }
              const cfg = TIER_CONFIG[tier]
              const count = tierCounts[tier] ?? 0
              return (
                <button
                  key={tier}
                  onClick={() => setTierFilter(isSelected ? 'all' : tier)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium rounded-md border transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? `${cfg.bg} ${cfg.text} ${cfg.border}`
                      : 'border-transparent text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'
                  }`}
                >
                  {cfg.icon}
                  {cfg.label}
                  <span className="text-[10px] opacity-60">{count}</span>
                </button>
              )
            })}
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search partners, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 pl-8 pr-3 py-2 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-all"
            />
          </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          {/* Desktop header */}
          <div className="hidden lg:grid grid-cols-[70px_minmax(140px,1.5fr)_minmax(120px,1.2fr)_minmax(120px,1.2fr)_80px_90px_80px_90px_40px] gap-2 px-5 py-3 bg-neutral-50 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            <span>ID</span>
            <SortHeader label="Partner" sortKey="name" current={sortKey} dir={sortDir} onSort={toggleSort} />
            <span>Company</span>
            <span>Contact</span>
            <span>Tier</span>
            <SortHeader label="Sales" sortKey="totalSales" current={sortKey} dir={sortDir} onSort={toggleSort} />
            <SortHeader label="Clients" sortKey="totalCustomers" current={sortKey} dir={sortDir} onSort={toggleSort} />
            <span className="text-center">Status</span>
            <span />
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Users size={36} className="mx-auto text-neutral-300 dark:text-neutral-600 mb-3" />
              <p className="font-medium text-neutral-500 dark:text-neutral-400">No partners found</p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                {search ? 'Try a different search term' : 'No partners in this category'}
              </p>
            </div>
          ) : (
            filtered.map((wm, idx) => {
              const isLast = idx === filtered.length - 1
              const isMenuOpen = openMenu === wm.id
              const tierCfg = TIER_CONFIG[wm.tier]
              const statusCfg = STATUS_BADGE[wm.status]
              const isExpanded = expandedRow === wm.id

              return (
                <div key={wm.id}>
                  {/* ── Desktop row ───────────────────────────────── */}
                  <div
                    className={`hidden lg:grid grid-cols-[70px_minmax(140px,1.5fr)_minmax(120px,1.2fr)_minmax(120px,1.2fr)_80px_90px_80px_90px_40px] gap-2 px-5 py-3.5 items-center hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors cursor-pointer ${
                      !isLast ? 'border-b border-neutral-100 dark:border-neutral-800/60' : ''
                    }`}
                    onClick={() => onView?.(wm.id)}
                  >
                    {/* WM ID */}
                    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                      {wm.id}
                    </span>

                    {/* Partner Name + Avatar */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${getAvatarColor(wm.name)}`}>
                        {wm.photoUrl ? (
                          <img src={wm.photoUrl} alt={wm.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          getInitials(wm.name)
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{wm.name}</p>
                        <p className="text-[10px] text-neutral-400 dark:text-neutral-500">{wm.address.city}, {wm.address.state}</p>
                      </div>
                    </div>

                    {/* Company */}
                    <div className="min-w-0">
                      {wm.company.name ? (
                        <div>
                          <p className="text-xs text-neutral-700 dark:text-neutral-300 truncate">{wm.company.name}</p>
                          {wm.company.gstNumber && (
                            <p className="text-[9px] text-neutral-400 dark:text-neutral-500 font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)] mt-0.5 truncate">
                              GST: {wm.company.gstNumber.slice(0, 10)}...
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] italic text-neutral-400 dark:text-neutral-500">Individual</span>
                      )}
                    </div>

                    {/* Contact */}
                    <div className="min-w-0">
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 truncate">{wm.phone}</p>
                      <p className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate">{wm.email}</p>
                    </div>

                    {/* Tier */}
                    <div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${tierCfg.bg} ${tierCfg.text} ${tierCfg.border}`}>
                        {tierCfg.icon}
                        {tierCfg.label}
                      </span>
                    </div>

                    {/* Total Sales */}
                    <div>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                        {formatCurrency(wm.totalSales)}
                      </p>
                    </div>

                    {/* Total Customers */}
                    <div className="text-center">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">{wm.totalCustomers}</p>
                      <p className="text-[9px] text-neutral-400 dark:text-neutral-500">{wm.activeCases} active</p>
                    </div>

                    {/* Status toggle */}
                    <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setToggleStatusWM(wm)}
                        className="flex items-center gap-1.5 cursor-pointer group"
                        title={wm.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {wm.status === 'active' ? (
                          <ToggleRight size={22} className="text-emerald-500 group-hover:text-emerald-600 transition-colors" />
                        ) : (
                          <ToggleLeft size={22} className="text-neutral-400 group-hover:text-neutral-500 transition-colors" />
                        )}
                        <span className={`text-[10px] font-semibold ${statusCfg.text}`}>{statusCfg.label}</span>
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="relative flex justify-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setOpenMenu(isMenuOpen ? null : wm.id)}
                        className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        <MoreVertical size={14} />
                      </button>

                      {isMenuOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                          <div className="absolute right-0 top-8 z-20 w-48 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg py-1.5 text-sm">
                            <MenuItem icon={<Eye size={13} />} label="View Details" onClick={() => { onView?.(wm.id); setOpenMenu(null) }} />
                            <MenuItem icon={<Pencil size={13} />} label="Edit Profile" onClick={() => { openEditModal(wm); setOpenMenu(null) }} />
                            <MenuItem icon={<UserCircle size={13} />} label="View Customers" onClick={() => { onViewCustomers?.(wm.id); setOpenMenu(null) }} />
                            <MenuItem icon={<Package size={13} />} label="View Packages" onClick={() => { onViewPackages?.(wm.id); setOpenMenu(null) }} />
                            <div className="my-1 border-t border-neutral-100 dark:border-neutral-700" />
                            <MenuItem
                              icon={wm.status === 'active' ? <ToggleLeft size={13} /> : <ToggleRight size={13} />}
                              label={wm.status === 'active' ? 'Deactivate' : 'Activate'}
                              onClick={() => { setToggleStatusWM(wm); setOpenMenu(null) }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* ── Mobile / Tablet card ──────────────────────── */}
                  <div className={`lg:hidden ${!isLast ? 'border-b border-neutral-100 dark:border-neutral-800/60' : ''}`}>
                    <div
                      className="px-5 py-4 cursor-pointer"
                      onClick={() => setExpandedRow(isExpanded ? null : wm.id)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${getAvatarColor(wm.name)}`}>
                            {getInitials(wm.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">{wm.name}</p>
                            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">{wm.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${tierCfg.bg} ${tierCfg.text} ${tierCfg.border}`}>
                            {tierCfg.icon}
                            {tierCfg.label}
                          </span>
                          <ChevronDown size={14} className={`text-neutral-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>

                      {/* Quick info row */}
                      <div className="flex items-center gap-3 mt-2.5 text-xs text-neutral-500 dark:text-neutral-400 flex-wrap">
                        {wm.company.name && (
                          <span className="flex items-center gap-1"><Building2 size={10} /> {wm.company.name.length > 18 ? wm.company.name.slice(0, 16) + '...' : wm.company.name}</span>
                        )}
                        <span className="font-semibold text-neutral-700 dark:text-neutral-200 font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                          {formatCurrency(wm.totalSales)}
                        </span>
                        <span>{wm.totalCustomers} clients</span>
                        <span className={`inline-flex items-center gap-1 ${statusCfg.text}`}>
                          {statusCfg.label}
                        </span>
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="px-5 pb-4 border-t border-neutral-100 dark:border-neutral-800/60 pt-3">
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <DetailField icon={<Phone size={11} />} label="Phone" value={wm.phone} />
                          <DetailField icon={<Mail size={11} />} label="Email" value={wm.email} />
                          <DetailField icon={<Briefcase size={11} />} label="Active Cases" value={`${wm.activeCases}`} />
                          <DetailField icon={<FileText size={11} />} label="Credits Left" value={`${wm.willsRemaining} wills`} />
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-neutral-400 dark:text-neutral-500 mb-3">
                          <span>Credits: {wm.willsRemaining} remaining</span>
                          <span>·</span>
                          <span>{wm.totalLeads} leads</span>
                          <span>·</span>
                          <span>Active {timeAgo(wm.lastActive)}</span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <MobileAction icon={<Eye size={12} />} label="View" onClick={() => onView?.(wm.id)} />
                          <MobileAction icon={<Pencil size={12} />} label="Edit" onClick={() => openEditModal(wm)} />
                          <MobileAction icon={<UserCircle size={12} />} label="Customers" onClick={() => onViewCustomers?.(wm.id)} />
                          <MobileAction icon={<Package size={12} />} label="Packages" onClick={() => onViewPackages?.(wm.id)} />
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
                {filtered.length} {filtered.length === 1 ? 'partner' : 'partners'}
                {activeTab !== 'all' && ` · ${STATUS_TABS.find((t) => t.key === activeTab)?.label}`}
                {tierFilter !== 'all' && ` · ${TIER_CONFIG[tierFilter].label} tier`}
              </p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                Total sales: <span className="font-semibold text-neutral-600 dark:text-neutral-300">{formatCurrencyFull(kpiStats.totalSales)}</span>
              </p>
            </div>
          )}
      </div>

      {/* ── Edit WM Modal ─────────────────────────────────────────────── */}
      <Dialog open={!!editModalWM} onOpenChange={(open) => { if (!open) setEditModalWM(null) }}>
        <DialogContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
          <DialogHeader>
            <DialogTitle className="text-neutral-900 dark:text-neutral-100">Edit Partner</DialogTitle>
            <DialogDescription className="text-neutral-500 dark:text-neutral-400">
              Update partner profile information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Email</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Phone</label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Company</label>
              <input
                type="text"
                value={editForm.company}
                onChange={(e) => setEditForm((f) => ({ ...f, company: e.target.value }))}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Tier</label>
              <select
                value={editForm.tier}
                onChange={(e) => setEditForm((f) => ({ ...f, tier: e.target.value as WMTier }))}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              >
                <option value="platinum">Platinum</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="bronze">Bronze</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Status</label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value as WMStatus }))}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setEditModalWM(null)}
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

      {/* ── Toggle Status Confirmation Modal ──────────────────────────── */}
      <Dialog open={!!toggleStatusWM} onOpenChange={(open) => { if (!open) setToggleStatusWM(null) }}>
        <DialogContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
          <DialogHeader>
            <DialogTitle className="text-neutral-900 dark:text-neutral-100">
              {toggleStatusWM?.status === 'active' ? 'Deactivate' : 'Activate'} Partner
            </DialogTitle>
            <DialogDescription className="text-neutral-500 dark:text-neutral-400">
              Are you sure you want to {toggleStatusWM?.status === 'active' ? 'deactivate' : 'activate'} {toggleStatusWM?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setToggleStatusWM(null)}
              className="rounded-lg border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleToggleStatusConfirm}
              className={toggleStatusWM?.status === 'active'
                ? "rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                : "rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
              }
            >
              {toggleStatusWM?.status === 'active' ? 'Deactivate' : 'Activate'}
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

function DetailField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div>
      <p className="text-[10px] text-neutral-400 dark:text-neutral-500 flex items-center gap-1 mb-0.5">
        {icon}
        {label}
      </p>
      <p className="text-xs text-neutral-700 dark:text-neutral-300 truncate">{value}</p>
    </div>
  )
}
