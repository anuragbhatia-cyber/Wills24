import data from '@/../product/sections/dashboard-home/data.json'
import { DashboardHome } from './components/DashboardHome'
import { navigateToScreen } from '@/lib/preview-navigation'

const quickActionTargets: Record<string, [string, string]> = {
  'qa-1': ['sales-crm', 'LeadForm'],          // Add Lead
  'qa-2': ['case-management', 'AddCaseForm'], // Create Case
  'qa-3': ['sales-crm', 'LeadsList'],         // Create Quotation
  'qa-4': ['case-management', 'CaseList'],    // Assign Lawyer
  'qa-5': ['partners', 'AddWMForm'],          // Add Partner
  'qa-6': ['accounts', 'AccountsList'],       // Process Payout
  'qa-7': ['accounts', 'AccountsList'],       // Generate Invoice
  'qa-8': ['case-management', 'CaseList'],    // Upload Document
  'qa-9': ['sales-crm', 'LeadsList'],         // Schedule Follow-up
}

const activityTypeTargets: Record<string, [string, string]> = {
  lead: ['sales-crm', 'LeadDetail'],
  case: ['case-management', 'CaseDetail'],
  customer: ['customers', 'CustomerDetail'],
  invoice: ['accounts', 'AccountsList'],
  payment: ['accounts', 'AccountsList'],
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
