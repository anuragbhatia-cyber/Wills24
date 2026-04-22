import { useState } from 'react'
import {
  ArrowLeft,
  Pencil,
  ToggleLeft,
  ToggleRight,
  Phone,
  Mail,
  MapPin,
  Building2,
  Calendar,
  Clock,
  Users,
  Briefcase,
  IndianRupee,
  Wallet,
  TrendingUp,
  Crown,
  Award,
  Medal,
  MessageSquare,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Eye,
  UserPlus,
  Shield,
  ChevronRight,
  Gem,
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
  WMDetailProps,
  WealthManager,
  WMFollowUp,
  WMWalletTransaction,
  WMTeamMember,
  WMCustomer,
  WMPackage,
  WMPackageStatus,
  WMTier,
  WMStatus,
  WMFollowUpType,
  WMAuthorRole,
  WalletTransactionType,
  TeamMemberStatus,
} from '@/../product/sections/partners/types'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

type TabKey = 'followups' | 'wallet' | 'team' | 'customers' | 'packages'

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'followups', label: 'Follow-ups', icon: <MessageSquare size={14} /> },
  { key: 'wallet', label: 'Wallet', icon: <Wallet size={14} /> },
  { key: 'team', label: 'Team', icon: <Users size={14} /> },
  { key: 'customers', label: 'Customers', icon: <Briefcase size={14} /> },
  { key: 'packages', label: 'Packages', icon: <Package size={14} /> },
]

const TIER_CONFIG: Record<WMTier, { label: string; icon: React.ReactNode; bg: string; text: string; border: string }> = {
  platinum: { label: 'Platinum', icon: <Gem size={12} />, bg: 'bg-violet-50 dark:bg-violet-950/30', text: 'text-violet-700 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-800/60' },
  gold: { label: 'Gold', icon: <Crown size={12} />, bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800/60' },
  silver: { label: 'Silver', icon: <Award size={12} />, bg: 'bg-neutral-100 dark:bg-neutral-800', text: 'text-neutral-600 dark:text-neutral-400', border: 'border-neutral-300 dark:border-neutral-700' },
  bronze: { label: 'Bronze', icon: <Medal size={12} />, bg: 'bg-orange-50 dark:bg-orange-950/20', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800/60' },
}

const FOLLOWUP_TYPE_CONFIG: Record<WMFollowUpType, { label: string; bg: string; text: string }> = {
  meeting: { label: 'Meeting', bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-700 dark:text-blue-400' },
  update: { label: 'Update', bg: 'bg-violet-50 dark:bg-violet-950/30', text: 'text-violet-700 dark:text-violet-400' },
}

const AUTHOR_ROLE_CONFIG: Record<WMAuthorRole, { label: string; bg: string; text: string }> = {
  admin: { label: 'Admin', bg: 'bg-orange-50 dark:bg-orange-950/20', text: 'text-orange-700 dark:text-orange-400' },
  operations: { label: 'Operations', bg: 'bg-sky-50 dark:bg-sky-950/20', text: 'text-sky-700 dark:text-sky-400' },
}

const TXN_TYPE_CONFIG: Record<WalletTransactionType, { label: string; icon: React.ReactNode; color: string; sign: string }> = {
  package_purchase: { label: 'Package Purchase', icon: <ArrowDownLeft size={12} />, color: 'text-emerald-600 dark:text-emerald-400', sign: '+' },
  will_used: { label: 'Will Used', icon: <ArrowUpRight size={12} />, color: 'text-red-500 dark:text-red-400', sign: '−' },
}

const TEAM_STATUS_CONFIG: Record<TeamMemberStatus, { label: string; dot: string; text: string }> = {
  active: { label: 'Active', dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400' },
  inactive: { label: 'Inactive', dot: 'bg-neutral-400', text: 'text-neutral-500 dark:text-neutral-400' },
}

const PACKAGE_STATUS_CONFIG: Record<WMPackageStatus, { label: string; bg: string; text: string }> = {
  active: { label: 'Active', bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-400' },
  expired: { label: 'Expired', bg: 'bg-neutral-100 dark:bg-neutral-800', text: 'text-neutral-500 dark:text-neutral-400' },
  exhausted: { label: 'Exhausted', bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-400' },
}

const PERMISSION_LABELS: Record<string, string> = {
  leads: 'Leads',
  customers: 'Customers',
  cases: 'Cases',
  documents: 'Documents',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

function formatCurrencyShort(amount: number) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`
  return `₹${amount.toLocaleString('en-IN')}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
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
// Main Component
// ---------------------------------------------------------------------------

export function WMDetail({
  wealthManager: wm,
  followUps,
  walletTransactions,
  teamMembers,
  customers,
  packages,
  onEdit,
  onToggleStatus,
  onAddFollowUp,
  onViewCustomer,
  onAddTeamMember,
  onBack,
}: WMDetailProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('followups')
  const tierCfg = TIER_CONFIG[wm.tier]

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false)
  const [showToggleStatus, setShowToggleStatus] = useState(false)
  const [showAddFollowUp, setShowAddFollowUp] = useState(false)
  const [showAddTeamMember, setShowAddTeamMember] = useState(false)

  const [editForm, setEditForm] = useState({
    name: wm.name,
    email: wm.email,
    phone: wm.phone,
    company: wm.company.name,
    tier: wm.tier as WMTier,
    status: wm.status as WMStatus,
  })

  const [followUpForm, setFollowUpForm] = useState({
    date: '',
    type: 'meeting' as 'meeting' | 'update',
    notes: '',
  })

  const [teamMemberForm, setTeamMemberForm] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
  })

  function handleEditSave() {
    onEdit?.()
    setShowEditModal(false)
  }

  function handleToggleStatusConfirm() {
    onToggleStatus?.()
    setShowToggleStatus(false)
  }

  function handleAddFollowUpSave() {
    onAddFollowUp?.()
    setShowAddFollowUp(false)
    setFollowUpForm({ date: '', type: 'meeting', notes: '' })
  }

  function handleAddTeamMemberSave() {
    onAddTeamMember?.()
    setShowAddTeamMember(false)
    setTeamMemberForm({ name: '', email: '', phone: '', designation: '' })
  }

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div>
        <div>
          {/* Profile Row */}
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
            >
              <ArrowLeft size={20} />
            </button>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0 ${getAvatarColor(wm.name)}`}>
              {wm.photoUrl ? (
                <img src={wm.photoUrl} alt={wm.name} className="w-16 h-16 rounded-2xl object-cover" />
              ) : (
                getInitials(wm.name)
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">{wm.name}</h1>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${tierCfg.bg} ${tierCfg.text} ${tierCfg.border}`}>
                  {tierCfg.icon}
                  {tierCfg.label} Partner
                </span>
                {wm.status === 'active' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                    Inactive
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                {wm.id}
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-neutral-500 dark:text-neutral-400 flex-wrap">
                <span className="flex items-center gap-1"><Phone size={11} /> {wm.phone}</span>
                <span className="flex items-center gap-1"><Mail size={11} /> {wm.email}</span>
                <span className="flex items-center gap-1"><MapPin size={11} /> {wm.address.city}, {wm.address.state}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-auto shrink-0">
              <button
                onClick={() => setShowToggleStatus(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                {wm.status === 'active' ? <ToggleLeft size={14} /> : <ToggleRight size={14} />}
                {wm.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => setShowEditModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-500 transition-colors cursor-pointer shadow-sm"
              >
                <Pencil size={13} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-5">
            <QuickStat label="Total Sales" value={formatCurrencyShort(wm.totalSales)} />
            <QuickStat label="Customers" value={wm.totalCustomers} />
            <QuickStat label="Leads" value={wm.totalLeads} />
            <QuickStat label="Active Cases" value={wm.activeCases} />
            <QuickStat label="Wills Left" value={wm.willsRemaining} />
            <QuickStat label="Wills Used" value={wm.willsUsed} />
          </div>

          {/* Company + Permissions row */}
          <div className="flex flex-col sm:flex-row gap-4 mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800/60">
            {/* Company */}
            {wm.company.name ? (
              <div className="flex items-start gap-2 min-w-0">
                <Building2 size={14} className="text-neutral-400 dark:text-neutral-500 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{wm.company.name}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-[10px] text-neutral-400 dark:text-neutral-500 font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                    {wm.company.gstNumber && <span>GST: {wm.company.gstNumber}</span>}
                    {wm.company.panNumber && <span>PAN: {wm.company.panNumber}</span>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500">
                <Building2 size={14} />
                <span className="italic">Individual partner (no company)</span>
              </div>
            )}

            {/* Permissions */}
            <div className="flex items-start gap-2 sm:ml-auto">
              <Shield size={14} className="text-neutral-400 dark:text-neutral-500 mt-0.5 shrink-0" />
              <div className="flex items-center gap-1.5 flex-wrap">
                {wm.permissions.map((p) => (
                  <span key={p} className="inline-block px-1.5 py-0.5 text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded">
                    {PERMISSION_LABELS[p] || p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Date info */}
          <div className="flex items-center gap-4 mt-3 text-[10px] text-neutral-400 dark:text-neutral-500">
            <span className="flex items-center gap-1"><Calendar size={10} /> Joined {formatDate(wm.joinedAt)}</span>
            <span className="flex items-center gap-1"><Clock size={10} /> Last active {timeAgo(wm.lastActive)}</span>
          </div>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key
            const count =
              tab.key === 'followups' ? followUps.length :
              tab.key === 'wallet' ? walletTransactions.length :
              tab.key === 'team' ? teamMembers.length :
              tab.key === 'customers' ? customers.length :
              packages.length
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                    : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600'
                }`}
              >
                {tab.icon}
                {tab.label}
                <span className={`text-[10px] font-bold tabular-nums ${isActive ? 'text-orange-400 dark:text-orange-500' : 'text-neutral-400 dark:text-neutral-600'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Tab Content ─────────────────────────────────────────────────── */}
      <div>
        {activeTab === 'followups' && (
          <FollowUpsTab followUps={followUps} onAddFollowUp={() => setShowAddFollowUp(true)} />
        )}
        {activeTab === 'wallet' && (
          <WalletTab transactions={walletTransactions} />
        )}
        {activeTab === 'team' && (
          <TeamTab teamMembers={teamMembers} onAddTeamMember={() => setShowAddTeamMember(true)} />
        )}
        {activeTab === 'customers' && (
          <CustomersTab customers={customers} onViewCustomer={onViewCustomer} />
        )}
        {activeTab === 'packages' && (
          <PackagesTab packages={packages} />
        )}
      </div>

      {/* ── Edit WM Modal ─────────────────────────────────────────────── */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
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
              onClick={() => setShowEditModal(false)}
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
      <Dialog open={showToggleStatus} onOpenChange={setShowToggleStatus}>
        <DialogContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
          <DialogHeader>
            <DialogTitle className="text-neutral-900 dark:text-neutral-100">
              {wm.status === 'active' ? 'Deactivate' : 'Activate'} Partner
            </DialogTitle>
            <DialogDescription className="text-neutral-500 dark:text-neutral-400">
              Are you sure you want to {wm.status === 'active' ? 'deactivate' : 'activate'} {wm.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setShowToggleStatus(false)}
              className="rounded-lg border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleToggleStatusConfirm}
              className={wm.status === 'active'
                ? "rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                : "rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
              }
            >
              {wm.status === 'active' ? 'Deactivate' : 'Activate'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Add Follow-up Modal ───────────────────────────────────────── */}
      <Dialog open={showAddFollowUp} onOpenChange={setShowAddFollowUp}>
        <DialogContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
          <DialogHeader>
            <DialogTitle className="text-neutral-900 dark:text-neutral-100">Add Follow-up</DialogTitle>
            <DialogDescription className="text-neutral-500 dark:text-neutral-400">
              Record a new follow-up interaction with this partner.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Date</label>
              <input
                type="date"
                value={followUpForm.date}
                onChange={(e) => setFollowUpForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Type</label>
              <select
                value={followUpForm.type}
                onChange={(e) => setFollowUpForm((f) => ({ ...f, type: e.target.value as 'meeting' | 'update' }))}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              >
                <option value="meeting">Meeting</option>
                <option value="update">Update</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Notes</label>
              <textarea
                rows={3}
                value={followUpForm.notes}
                onChange={(e) => setFollowUpForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Add follow-up details..."
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
              />
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setShowAddFollowUp(false)}
              className="rounded-lg border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddFollowUpSave}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
            >
              Add Follow-up
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Add Team Member Modal ─────────────────────────────────────── */}
      <Dialog open={showAddTeamMember} onOpenChange={setShowAddTeamMember}>
        <DialogContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
          <DialogHeader>
            <DialogTitle className="text-neutral-900 dark:text-neutral-100">Add Team Member</DialogTitle>
            <DialogDescription className="text-neutral-500 dark:text-neutral-400">
              Add a new team member to this partner's team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Name</label>
              <input
                type="text"
                value={teamMemberForm.name}
                onChange={(e) => setTeamMemberForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Full name"
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Email</label>
              <input
                type="email"
                value={teamMemberForm.email}
                onChange={(e) => setTeamMemberForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="email@example.com"
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Phone</label>
              <input
                type="tel"
                value={teamMemberForm.phone}
                onChange={(e) => setTeamMemberForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+91 XXXXX XXXXX"
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Role / Designation</label>
              <input
                type="text"
                value={teamMemberForm.designation}
                onChange={(e) => setTeamMemberForm((f) => ({ ...f, designation: e.target.value }))}
                placeholder="e.g. Relationship Manager"
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
              />
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setShowAddTeamMember(false)}
              className="rounded-lg border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddTeamMemberSave}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
            >
              Add Member
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ===========================================================================
// Tab Components
// ===========================================================================

// ── Follow-ups Tab ──────────────────────────────────────────────────────────

function FollowUpsTab({
  followUps,
  onAddFollowUp,
}: {
  followUps: WMFollowUp[]
  onAddFollowUp?: () => void
}) {
  const sorted = [...followUps].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Follow-up Timeline</h2>
        <button
          onClick={onAddFollowUp}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-500 transition-colors cursor-pointer shadow-sm"
        >
          <Plus size={12} />
          Add Follow-up
        </button>
      </div>

      {sorted.length === 0 ? (
        <EmptyState icon={<MessageSquare size={32} />} title="No follow-ups yet" subtitle="Add the first follow-up to start tracking interactions" />
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-neutral-200 dark:bg-neutral-800" />

          <div className="space-y-0">
            {sorted.map((fu, idx) => {
              const typeCfg = FOLLOWUP_TYPE_CONFIG[fu.type]
              const roleCfg = AUTHOR_ROLE_CONFIG[fu.authorRole]
              return (
                <div key={fu.id} className="relative pl-10 pb-6">
                  {/* Dot */}
                  <div className={`absolute left-[10px] top-1.5 w-[11px] h-[11px] rounded-full border-2 border-white dark:border-neutral-950 ${fu.type === 'meeting' ? 'bg-blue-500' : 'bg-violet-500'}`} />

                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{fu.title}</h3>
                          <span className={`inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded ${typeCfg.bg} ${typeCfg.text}`}>
                            {typeCfg.label}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{fu.notes}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-3 text-[10px] text-neutral-400 dark:text-neutral-500">
                      <span className="font-medium text-neutral-600 dark:text-neutral-300">{fu.author}</span>
                      <span className={`inline-block px-1.5 py-0.5 rounded font-medium ${roleCfg.bg} ${roleCfg.text}`}>
                        {roleCfg.label}
                      </span>
                      <span>{formatDate(fu.createdAt)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Wallet Tab ──────────────────────────────────────────────────────────────

function WalletTab({ transactions }: { transactions: WMWalletTransaction[] }) {
  const sorted = [...transactions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const totalPurchased = transactions.filter((t) => t.type === 'package_purchase').reduce((sum, t) => sum + (t.willCredits || 0), 0)
  const totalUsed = transactions.filter((t) => t.type === 'will_used').reduce((sum, t) => sum + Math.abs(t.willCredits || 0), 0)
  const totalSpent = transactions.filter((t) => t.type === 'package_purchase').reduce((sum, t) => sum + t.amount, 0)

  return (
    <div>
      {/* Wallet summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-0.5">Total Purchased</p>
          <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
            {totalPurchased}
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-500 dark:text-emerald-400 mb-0.5">Total Used</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
            {totalUsed}
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-red-500 dark:text-red-400 mb-0.5">Total Spent</p>
          <p className="text-xl font-bold text-red-500 dark:text-red-400 tracking-tight font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
            {formatCurrency(totalSpent)}
          </p>
        </div>
      </div>

      {/* Transaction list */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3 bg-neutral-50 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Transaction History</h3>
        </div>

        {sorted.length === 0 ? (
          <EmptyState icon={<Wallet size={32} />} title="No transactions" subtitle="Wallet transaction history will appear here" />
        ) : (
          sorted.map((txn, idx) => {
            const cfg = TXN_TYPE_CONFIG[txn.type]
            const isLast = idx === sorted.length - 1
            return (
              <div
                key={txn.id}
                className={`flex items-center justify-between px-5 py-3.5 ${!isLast ? 'border-b border-neutral-100 dark:border-neutral-800/60' : ''}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${txn.type === 'package_purchase' ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-red-50 dark:bg-red-950/30'}`}>
                    <span className={cfg.color}>{cfg.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{txn.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {txn.customerName && (
                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400">{txn.customerName}</span>
                      )}
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500">{formatDate(txn.createdAt)}</span>
                    </div>
                    {txn.remarks && (
                      <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5 truncate">{txn.remarks}</p>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  {txn.amount > 0 ? (
                    <p className={`text-sm font-semibold tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)] ${cfg.color}`}>
                      {cfg.sign}{formatCurrency(txn.amount)}
                    </p>
                  ) : null}
                  {txn.willCredits != null && (
                    <p className={`text-[10px] font-medium mt-0.5 ${txn.willCredits > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                      {txn.willCredits > 0 ? '+' : ''}{txn.willCredits} credit{Math.abs(txn.willCredits) !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

// ── Team Tab ────────────────────────────────────────────────────────────────

function TeamTab({
  teamMembers,
  onAddTeamMember,
}: {
  teamMembers: WMTeamMember[]
  onAddTeamMember?: () => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Team Members</h2>
        <button
          onClick={onAddTeamMember}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-500 transition-colors cursor-pointer shadow-sm"
        >
          <UserPlus size={12} />
          Add Member
        </button>
      </div>

      {teamMembers.length === 0 ? (
        <EmptyState icon={<Users size={32} />} title="No team members" subtitle="This partner hasn't added any team members yet" />
      ) : (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
          {/* Desktop table header */}
          <div className="hidden sm:grid grid-cols-[minmax(140px,2fr)_minmax(120px,1.5fr)_minmax(100px,1fr)_100px_80px_80px] gap-2 px-5 py-3 bg-neutral-50 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            <span>Name</span>
            <span>Email</span>
            <span>Phone</span>
            <span>Designation</span>
            <span className="text-center">Status</span>
            <span className="text-right">Joined</span>
          </div>

          {teamMembers.map((member, idx) => {
            const isLast = idx === teamMembers.length - 1
            const statusCfg = TEAM_STATUS_CONFIG[member.status]
            const fullName = `${member.firstName} ${member.lastName}`
            return (
              <div key={member.id}>
                {/* Desktop row */}
                <div className={`hidden sm:grid grid-cols-[minmax(140px,2fr)_minmax(120px,1.5fr)_minmax(100px,1fr)_100px_80px_80px] gap-2 px-5 py-3.5 items-center ${!isLast ? 'border-b border-neutral-100 dark:border-neutral-800/60' : ''}`}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${getAvatarColor(fullName)}`}>
                      {getInitials(fullName)}
                    </div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{fullName}</p>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{member.email}</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300">{member.phone}</p>
                  <span className="inline-block px-1.5 py-0.5 text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded truncate">
                    {member.designation}
                  </span>
                  <div className="flex justify-center">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${statusCfg.text}`}>
                      {statusCfg.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 text-right">{formatDate(member.joinedAt)}</p>
                </div>

                {/* Mobile card */}
                <div className={`sm:hidden px-5 py-4 ${!isLast ? 'border-b border-neutral-100 dark:border-neutral-800/60' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${getAvatarColor(fullName)}`}>
                      {getInitials(fullName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{fullName}</p>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${statusCfg.text}`}>
                          {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">{member.designation}</p>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-neutral-400 dark:text-neutral-500">
                        <span>{member.phone}</span>
                        <span>{member.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Customers Tab ───────────────────────────────────────────────────────────

function CustomersTab({
  customers,
  onViewCustomer,
}: {
  customers: WMCustomer[]
  onViewCustomer?: (customerId: string) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Tagged Customers</h2>
        <p className="text-xs text-neutral-400 dark:text-neutral-500">{customers.length} customer{customers.length !== 1 ? 's' : ''}</p>
      </div>

      {customers.length === 0 ? (
        <EmptyState icon={<Briefcase size={32} />} title="No customers yet" subtitle="Customers tagged under this partner will appear here" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {customers.map((cust) => (
            <div
              key={cust.id}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 hover:border-orange-300 dark:hover:border-orange-800 transition-colors cursor-pointer group"
              onClick={() => onViewCustomer?.(cust.customerId)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${getAvatarColor(cust.customerName)}`}>
                    {getInitials(cust.customerName)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">{cust.customerName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">{cust.customerId}</span>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500">{cust.city}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight size={14} className="text-neutral-300 dark:text-neutral-600 group-hover:text-orange-500 transition-colors shrink-0 mt-1" />
              </div>

              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="inline-block px-1.5 py-0.5 text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded">
                  {cust.serviceType.length > 30 ? cust.serviceType.slice(0, 28) + '...' : cust.serviceType}
                </span>
              </div>

              <div className="flex items-center gap-4 mt-3 text-xs">
                <span className="text-neutral-500 dark:text-neutral-400">
                  <span className="font-semibold text-neutral-700 dark:text-neutral-200">{cust.totalCases}</span> cases
                </span>
                <span className="text-neutral-500 dark:text-neutral-400">
                  <span className="font-semibold text-neutral-700 dark:text-neutral-200">{cust.activeCases}</span> active
                </span>
                <span className="ml-auto font-semibold text-neutral-900 dark:text-neutral-100 font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                  {formatCurrency(cust.salesValue)}
                </span>
              </div>

              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-2">
                Converted {formatDate(cust.convertedAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Packages Tab ────────────────────────────────────────────────────────────

function PackagesTab({ packages }: { packages: WMPackage[] }) {
  const sorted = [...packages].sort((a, b) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime())
  const totalWillsIncluded = packages.reduce((sum, p) => sum + p.willsIncluded, 0)
  const totalWillsUsed = packages.reduce((sum, p) => sum + p.willsUsed, 0)
  const totalSpent = packages.reduce((sum, p) => sum + p.totalPrice, 0)

  return (
    <div>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-0.5">Total Wills Included</p>
          <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
            {totalWillsIncluded}
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-500 dark:text-emerald-400 mb-0.5">Wills Used</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
            {totalWillsUsed}
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-500 dark:text-violet-400 mb-0.5">Total Spent</p>
          <p className="text-xl font-bold text-violet-600 dark:text-violet-400 tracking-tight font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
            {formatCurrency(totalSpent)}
          </p>
        </div>
      </div>

      {/* Packages table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-[80px_minmax(80px,1fr)_minmax(140px,1.5fr)_90px_90px_90px_70px] gap-2 px-5 py-3 bg-neutral-50 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          <span>Tier</span>
          <span>Wills</span>
          <span>Progress</span>
          <span className="text-right">Price</span>
          <span>Purchased</span>
          <span>Expires</span>
          <span className="text-center">Status</span>
        </div>

        {sorted.length === 0 ? (
          <EmptyState icon={<Package size={32} />} title="No packages" subtitle="Package purchase history will appear here" />
        ) : (
          sorted.map((pkg, idx) => {
            const isLast = idx === sorted.length - 1
            const tierCfg = TIER_CONFIG[pkg.tier]
            const statusCfg = PACKAGE_STATUS_CONFIG[pkg.status]
            const usagePct = pkg.willsIncluded > 0 ? (pkg.willsUsed / pkg.willsIncluded) * 100 : 0
            return (
              <div key={pkg.id}>
                {/* Desktop row */}
                <div className={`hidden sm:grid grid-cols-[80px_minmax(80px,1fr)_minmax(140px,1.5fr)_90px_90px_90px_70px] gap-2 px-5 py-3.5 items-center ${!isLast ? 'border-b border-neutral-100 dark:border-neutral-800/60' : ''}`}>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${tierCfg.bg} ${tierCfg.text} ${tierCfg.border}`}>
                    {tierCfg.icon}
                    {tierCfg.label}
                  </span>
                  <span className="text-xs text-neutral-600 dark:text-neutral-300 font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                    {pkg.willsUsed}/{pkg.willsIncluded}
                  </span>
                  <div>
                    <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${usagePct >= 100 ? 'bg-red-500' : usagePct >= 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(usagePct, 100)}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-neutral-400 dark:text-neutral-500 mt-0.5">{pkg.willsRemaining} remaining</p>
                  </div>
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 text-right tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                    {formatCurrency(pkg.totalPrice)}
                  </span>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400">{formatDate(pkg.purchasedAt)}</span>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400">{formatDate(pkg.expiresAt)}</span>
                  <div className="flex justify-center">
                    <span className={`inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded ${statusCfg.bg} ${statusCfg.text}`}>
                      {statusCfg.label}
                    </span>
                  </div>
                </div>

                {/* Mobile card */}
                <div className={`sm:hidden px-5 py-4 ${!isLast ? 'border-b border-neutral-100 dark:border-neutral-800/60' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${tierCfg.bg} ${tierCfg.text} ${tierCfg.border}`}>
                          {tierCfg.icon}
                          {tierCfg.label}
                        </span>
                        <span className={`inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded ${statusCfg.bg} ${statusCfg.text}`}>
                          {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {pkg.willsUsed}/{pkg.willsIncluded} wills used · {pkg.willsRemaining} remaining
                      </p>
                      <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden mt-1.5 max-w-[180px]">
                        <div
                          className={`h-full rounded-full ${usagePct >= 100 ? 'bg-red-500' : usagePct >= 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(usagePct, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">
                        {formatCurrency(pkg.totalPrice)}
                      </p>
                      <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                        {formatDate(pkg.purchasedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}

        {/* Footer */}
        {sorted.length > 0 && (
          <div className="px-5 py-3 bg-neutral-50 dark:bg-neutral-800/40 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <p className="text-xs text-neutral-400 dark:text-neutral-500">{sorted.length} package{sorted.length !== 1 ? 's' : ''}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Total spent: <span className="font-bold text-neutral-800 dark:text-neutral-200 font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">{formatCurrency(totalSpent)}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ===========================================================================
// Shared Sub-components
// ===========================================================================

function QuickStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center px-3 py-2 bg-neutral-50 dark:bg-neutral-800/40 rounded-lg">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-0.5">{label}</p>
      <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tabular-nums font-[family-name:var(--font-mono,'IBM_Plex_Mono',ui-monospace,monospace)]">{value}</p>
    </div>
  )
}

function EmptyState({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="py-14 text-center">
      <div className="mx-auto text-neutral-300 dark:text-neutral-600 mb-3">{icon}</div>
      <p className="font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">{subtitle}</p>
    </div>
  )
}
