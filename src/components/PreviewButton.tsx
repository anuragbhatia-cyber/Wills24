import { useNavigate } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { hasPreviewableContent } from '@/lib/preview-helpers'

export function PreviewButton() {
  const navigate = useNavigate()

  // Only show button if there's content to preview
  if (!hasPreviewableContent()) {
    return null
  }

  const handleClick = () => {
    navigate('/preview')
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className="w-8 h-8 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
      title="Full Preview"
    >
      <Eye className="w-4 h-4" strokeWidth={1.5} />
    </Button>
  )
}
