import {
  TrendingUp,
  TrendingDown,
  UserPlus,
  CreditCard,
  FileCheck,
  Send,
  ArrowUpRight,
  Clock,
  Briefcase,
  IndianRupee,
  AlertCircle,
  FolderKanban,
} from 'lucide-react'
import { AppShell } from './components'
import { navigateToSection } from '@/lib/preview-navigation'

const navigationItems = [
  { label: 'Dashboard Home', href: '/dashboard-home', isActive: true },
  { label: 'Sales CRM', href: '/sales-crm' },
  { label: 'Accounts', href: '/accounts' },
  { label: 'Customers', href: '/customers' },
  { label: 'Case Management', href: '/case-management' },
  { label: 'Partners', href: '/partners' },
  { label: 'Team Management', href: '/team-management' },
  { label: 'Reports & Analytics', href: '/reports-analytics' },
]

const user = {
  name: 'Anurag Bhatia',
  role: 'Admin',
  avatarUrl: undefined,
}

const kpiCards = [
  {
    label: 'Total Leads',
    value: '1,284',
    change: '+12.5%',
    trend: 'up' as const,
    icon: Briefcase,
    accent: 'orange',
  },
  {
    label: 'Active Cases',
    value: '342',
    change: '+5.2%',
    trend: 'up' as const,
    icon: FolderKanban,
    accent: 'blue',
  },
  {
    label: 'Revenue (MTD)',
    value: '₹24.5L',
    change: '+18.3%',
    trend: 'up' as const,
    icon: IndianRupee,
    accent: 'emerald',
  },
  {
    label: 'Pending Payments',
    value: '47',
    change: '-8.1%',
    trend: 'down' as const,
    icon: AlertCircle,
    accent: 'rose',
  },
]

const accentMap: Record<string, { bg: string; text: string; iconBg: string }> = {
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    text: 'text-orange-600 dark:text-orange-400',
    iconBg: 'bg-orange-100 dark:bg-orange-900/40',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    text: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    text: 'text-rose-600 dark:text-rose-400',
    iconBg: 'bg-rose-100 dark:bg-rose-900/40',
  },
}

const activityItems = [
  {
    icon: UserPlus,
    action: 'New lead added',
    detail: 'Rajesh Kumar',
    meta: 'Will Drafting',
    time: '5m ago',
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    icon: CreditCard,
    action: 'Payment confirmed',
    detail: '₹45,000',
    meta: 'Priya Sharma — W24-CUST-00412',
    time: '23m ago',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    icon: FileCheck,
    action: 'Case updated',
    detail: 'W24-CASE-00189',
    meta: 'Moved to Under Review',
    time: '1h ago',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: Send,
    action: 'Quotation sent',
    detail: 'Trust Registration',
    meta: 'Amit Patel',
    time: '2h ago',
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
  },
]

const quickActions = [
  { label: 'Add Lead', href: '/sales-crm' },
  { label: 'New Case', href: '/case-management' },
  { label: 'Record Payment', href: '/accounts' },
]

export default function ShellPreview() {
  return (
    <AppShell
      navigationItems={navigationItems}
      user={user}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard-home' },
        { label: 'Dashboard Home' },
      ]}
      onNavigate={(href) => navigateToSection(href)}
      onLogout={() => console.log('Logout')}
    >
      <div className="mx-auto max-w-[1100px]">
        {/* Header row */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Welcome back, Anurag
            </h1>
            <p className="mt-0.5 text-[13px] text-neutral-500 dark:text-neutral-400">
              Here's your platform overview for today.
            </p>
          </div>
          <div className="flex gap-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-[12px] font-medium text-neutral-700 transition-all hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-orange-800 dark:hover:bg-orange-950/30 dark:hover:text-orange-400"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          {kpiCards.map((kpi) => {
            const colors = accentMap[kpi.accent]
            const Icon = kpi.icon
            return (
              <div
                key={kpi.label}
                className="group relative overflow-hidden rounded-xl border border-neutral-200/80 bg-white p-4 transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-800/60"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${colors.iconBg}`}
                  >
                    <Icon size={18} strokeWidth={1.5} className={colors.text} />
                  </div>
                  <div
                    className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      kpi.trend === 'up'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
                    }`}
                  >
                    {kpi.trend === 'up' ? (
                      <TrendingUp size={12} strokeWidth={2} />
                    ) : (
                      <TrendingDown size={12} strokeWidth={2} />
                    )}
                    {kpi.change}
                  </div>
                </div>
                <p className="text-[24px] font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                  {kpi.value}
                </p>
                <p className="mt-0.5 text-[12px] font-medium text-neutral-500 dark:text-neutral-400">
                  {kpi.label}
                </p>
              </div>
            )
          })}
        </div>

        {/* Bottom row: Activity + SLA */}
        <div className="grid grid-cols-3 gap-4">
          {/* Recent Activity — 2 cols */}
          <div className="col-span-2 rounded-xl border border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-800/60">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3.5 dark:border-neutral-700/50">
              <h2 className="text-[14px] font-semibold text-neutral-800 dark:text-neutral-100">
                Recent Activity
              </h2>
              <button className="flex items-center gap-1 text-[12px] font-medium text-orange-600 transition-colors hover:text-orange-700 dark:text-orange-400">
                View all
                <ArrowUpRight size={12} strokeWidth={2} />
              </button>
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-700/50">
              {activityItems.map((item, i) => {
                const Icon = item.icon
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3.5 px-5 py-3 transition-colors hover:bg-neutral-50/60 dark:hover:bg-neutral-700/20"
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.bg}`}
                    >
                      <Icon size={15} strokeWidth={1.5} className={item.color} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-100">
                          {item.action}
                        </span>
                        <span className="text-[12px] font-medium text-neutral-500 dark:text-neutral-400">
                          {item.detail}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                        {item.meta}
                      </p>
                    </div>
                    <span
                      className="shrink-0 text-[11px] text-neutral-400 dark:text-neutral-500"
                      style={{ fontFamily: '"IBM Plex Mono", monospace' }}
                    >
                      {item.time}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* SLA / Quick Stats — 1 col */}
          <div className="rounded-xl border border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-800/60">
            <div className="border-b border-neutral-100 px-5 py-3.5 dark:border-neutral-700/50">
              <h2 className="text-[14px] font-semibold text-neutral-800 dark:text-neutral-100">
                SLA Overview
              </h2>
            </div>
            <div className="space-y-4 p-5">
              {[
                { label: 'Cases on track', value: '89%', bar: 89, color: 'bg-emerald-500' },
                { label: 'At risk', value: '8%', bar: 8, color: 'bg-amber-500' },
                { label: 'Breached', value: '3%', bar: 3, color: 'bg-rose-500' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[12px] font-medium text-neutral-600 dark:text-neutral-300">
                      {stat.label}
                    </span>
                    <span
                      className="text-[12px] font-semibold text-neutral-800 dark:text-neutral-100"
                      style={{ fontFamily: '"IBM Plex Mono", monospace' }}
                    >
                      {stat.value}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-700">
                    <div
                      className={`h-full rounded-full ${stat.color} transition-all`}
                      style={{ width: `${stat.bar}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className="mt-5 rounded-lg border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800/80">
                <div className="mb-1 flex items-center gap-1.5">
                  <Clock size={13} strokeWidth={2} className="text-orange-500" />
                  <span className="text-[12px] font-semibold text-neutral-700 dark:text-neutral-200">
                    Avg. Resolution
                  </span>
                </div>
                <p
                  className="text-[20px] font-bold text-neutral-900 dark:text-neutral-50"
                  style={{ fontFamily: '"IBM Plex Mono", monospace' }}
                >
                  4.2<span className="text-[13px] font-medium text-neutral-400"> days</span>
                </p>
                <p className="text-[11px] text-neutral-400">
                  Target: under 7 days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
