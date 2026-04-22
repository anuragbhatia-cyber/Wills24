import { AddWMForm } from './components/AddWMForm'
import { navigateToScreen } from '@/lib/preview-navigation'

export default function AddWMFormPreview() {
  return (
    <AddWMForm
      onSubmit={() => navigateToScreen('partners', 'WMList')}
      onCancel={() => navigateToScreen('partners', 'WMList')}
    />
  )
}
