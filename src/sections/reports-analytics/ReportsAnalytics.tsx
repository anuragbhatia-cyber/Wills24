import data from '@/../product/sections/reports-analytics/data.json'
import { ReportsAnalytics } from './components/ReportsAnalytics'

export default function ReportsAnalyticsPreview() {
  return (
    <ReportsAnalytics
      dateRange={data.dateRange}
      sales={data.sales as any}
      cases={data.cases as any}
      accounts={data.accounts as any}
      wmPerformance={data.wmPerformance as any}
      documents={data.documents as any}
      onDateRangeChange={(range) => console.log('Date range:', range)}
      onCompareToggle={(enabled) => console.log('Compare:', enabled)}
      onExportExcel={(tab) => console.log('Export Excel:', tab)}
      onExportPdf={(tab) => console.log('Export PDF:', tab)}
      onExportAll={(format) => console.log('Export all:', format)}
    />
  )
}
