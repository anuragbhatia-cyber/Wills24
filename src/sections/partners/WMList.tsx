import data from '@/../product/sections/partners/data.json'
import { WMList } from './components/WMList'
import { navigateToScreen } from '@/lib/preview-navigation'

export default function WMListPreview() {
  return (
    <WMList
      wealthManagers={data.wealthManagers as any[]}
      kpiStats={data.kpiStats as any}
      statusCounts={data.statusCounts as any}
      tierCounts={data.tierCounts as any}
      onView={() => navigateToScreen('partners', 'WMDetail')}
      onEdit={(id) => console.log('Edit WM:', id)}
      onToggleStatus={(id) => console.log('Toggle status:', id)}
      onViewCustomers={() => navigateToScreen('customers', 'CustomerList')}
      onViewPackages={(id) => console.log('View packages:', id)}
      onCreate={() => navigateToScreen('partners', 'AddWMForm')}
    />
  )
}
