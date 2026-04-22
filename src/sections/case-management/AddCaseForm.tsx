import { useState } from 'react'
import data from '@/../product/sections/case-management/data.json'
import { AddCaseForm } from './components/AddCaseForm'
import { navigateToScreen } from '@/lib/preview-navigation'

// Store edit data globally so CaseDetail can pass it
let pendingEditData: any = null
export function setEditCaseData(d: any) { pendingEditData = d }
export function consumeEditCaseData() { const d = pendingEditData; pendingEditData = null; return d }

export default function AddCaseFormPreview() {
  const [editData] = useState(() => consumeEditCaseData())

  return (
    <AddCaseForm
      customers={data.customers as any[]}
      lawyers={data.lawyers as any[]}
      initialData={editData ?? undefined}
      onSubmit={() => navigateToScreen('case-management', editData ? 'CaseDetail' : 'CaseList')}
      onCancel={() => navigateToScreen('case-management', editData ? 'CaseDetail' : 'CaseList')}
    />
  )
}
