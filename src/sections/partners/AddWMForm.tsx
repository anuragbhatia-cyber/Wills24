import { AddWMForm } from './components/AddWMForm'
import { navigateToScreen } from '@/lib/preview-navigation'
import { toast } from '@/components/ui/toaster'

export default function AddWMFormPreview() {
  return (
    <AddWMForm
      onSubmit={(data) => {
        toast.success('Partner added', data?.name ? `${data.name} onboarded successfully` : undefined)
        navigateToScreen('partners', 'WMList')
      }}
      onCancel={() => navigateToScreen('partners', 'WMList')}
    />
  )
}
