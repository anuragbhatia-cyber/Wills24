import data from '@/../product/sections/dashboard-home/data.json'
import { DashboardHome } from './components/DashboardHome'
import { navigateToScreen } from '@/lib/preview-navigation'

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

export default function DashboardHomePreview() {
  return (
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
  )
}
