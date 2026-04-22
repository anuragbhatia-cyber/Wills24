import data from '@/../product/sections/partners/data.json'
import { WMDetail } from './components/WMDetail'
import { navigateToScreen } from '@/lib/preview-navigation'

export default function WMDetailPreview() {
  // Use WPAT-00001 (Rakesh Mehra) — Gold tier, active, has follow-ups, wallet txns, team members
  const wm = data.wealthManagers[0]
  const followUps = data.wmFollowUps.filter((fu: any) => fu.wmId === wm.id)
  const walletTransactions = data.wmWalletTransactions.filter((txn: any) => txn.wmId === wm.id)
  const teamMembers = data.wmTeamMembers.filter((tm: any) => tm.wmId === wm.id)
  const customers = data.wmCustomers.filter((c: any) => c.wmId === wm.id)
  const packages = data.wmPackages.filter((p: any) => p.wmId === wm.id)

  return (
    <WMDetail
      wealthManager={wm as any}
      followUps={followUps as any[]}
      walletTransactions={walletTransactions as any[]}
      teamMembers={teamMembers as any[]}
      customers={customers as any[]}
      packages={packages as any[]}
      onEdit={() => console.log('Edit WM:', wm.id)}
      onToggleStatus={() => console.log('Toggle status:', wm.id)}
      onAddFollowUp={() => console.log('Add follow-up')}
      onViewCustomer={() => navigateToScreen('customers', 'CustomerDetail')}
      onAddTeamMember={() => console.log('Add team member')}
      onBack={() => navigateToScreen('partners', 'WMList')}
    />
  )
}
