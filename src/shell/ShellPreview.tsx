import { AppShell } from './components'
import { navigateToSection } from '@/lib/preview-navigation'
import { DashboardHome } from '@/sections/dashboard-home/components/DashboardHome'
import { navigateToScreen } from '@/lib/preview-navigation'
import data from '@/../product/sections/dashboard-home/data.json'

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

const quickActionTargets: Record<string, [string, string]> = {
  'new-lead': ['sales-crm', 'LeadForm'],
  'new-case': ['case-management', 'AddCaseForm'],
  'record-payment': ['accounts', 'PaymentForm'],
  'view-reports': ['reports-analytics', 'ReportsAnalytics'],
}

const activityTypeTargets: Record<string, [string, string]> = {
  lead: ['sales-crm', 'LeadDetail'],
  case: ['case-management', 'CaseDetail'],
  customer: ['customers', 'CustomerDetail'],
  invoice: ['accounts', 'InvoiceDetail'],
  payment: ['accounts', 'InvoiceDetail'],
  partner: ['partners', 'WMDetail'],
  wm: ['partners', 'WMDetail'],
}

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
      <DashboardHome
        kpiStats={data.kpiStats}
        activityFeed={data.activityFeed as any}
        pendingItems={data.pendingItems as any}
        salesTrend={data.salesTrend}
        caseStatusDistribution={data.caseStatusDistribution}
        monthlyRevenue={data.monthlyRevenue}
        conversionFunnel={data.conversionFunnel}
        quickActions={data.quickActions}
        user={data.user}
        onDateRangeChange={(range) => console.log('Date range:', range)}
        onQuickAction={(id) => {
          const target = quickActionTargets[id]
          if (target) navigateToScreen(target[0], target[1])
        }}
        onActivityClick={(type, id) => {
          const target = activityTypeTargets[type]
          if (target) navigateToScreen(target[0], target[1])
          else console.log('Activity:', type, id)
        }}
        onPendingItemClick={(id) => console.log('Pending item:', id)}
      />
    </AppShell>
  )
}
