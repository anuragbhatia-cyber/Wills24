import data from '@/../product/sections/case-management/data.json'
import { CaseList } from './components/CaseList'
import { navigateToScreen } from '@/lib/preview-navigation'

export default function CaseListPreview() {
  return (
    <CaseList
      cases={data.cases as any}
      kpiStats={data.kpiStats as any}
      statusCounts={data.statusCounts as any}
      onView={() => navigateToScreen('case-management', 'CaseDetail')}
      onEdit={(id) => console.log('Edit case:', id)}
      onCreate={() => navigateToScreen('case-management', 'AddCaseForm')}
    />
  )
}
