import data from '@/../product/sections/case-management/data.json'
import { CaseDetail } from './components/CaseDetail'
import { navigateToScreen } from '@/lib/preview-navigation'
import { setEditCaseData } from './AddCaseForm'

export default function CaseDetailPreview() {
  // Use W24-CASE-00001 (Prakash Jain) — high priority, court-filing, 4 follow-ups, 2 docs, 1 note
  const caseData = data.cases[0] as any
  const followUps = data.caseFollowUps.filter(fu => fu.caseId === caseData.id) as any[]
  const notes = data.caseNotes.filter(n => n.caseId === caseData.id) as any[]
  const documents = data.caseDocuments.filter(d => d.caseId === caseData.id) as any[]

  return (
    <CaseDetail
      caseData={caseData}
      followUps={followUps}
      notes={notes}
      documents={documents}
      lawyers={data.lawyers as any[]}
      onEdit={() => {
        setEditCaseData({
          caseId: caseData.id,
          customerId: caseData.customerId,
          serviceType: caseData.serviceType,
          lawyerId: caseData.lawyerId,
          priority: caseData.priority,
          description: caseData.description,
        })
        navigateToScreen('case-management', 'AddCaseForm')
      }}
      onAddFollowUp={() => console.log('Add follow-up to:', caseData.id)}
      onAddNote={() => console.log('Add note to:', caseData.id)}
      onAssignLawyer={(lawyerId) => console.log('Assign lawyer:', lawyerId, 'to case:', caseData.id)}
      onDownloadDocument={(docId) => console.log('Download document:', docId)}
      onBack={() => navigateToScreen('case-management', 'CaseList')}
    />
  )
}
