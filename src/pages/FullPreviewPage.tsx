import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, GripVertical, Maximize2, Monitor, Smartphone, Tablet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { FullPreviewSidebar } from '@/components/FullPreviewSidebar'
import { findPreviewItem, buildViewParam } from '@/lib/preview-helpers'

const MIN_WIDTH = 320
const DEFAULT_WIDTH_PERCENT = 100

export function FullPreviewPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [widthPercent, setWidthPercent] = useState(DEFAULT_WIDTH_PERCENT)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  // Listen for navigation messages from iframe screens
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'preview-navigate' && event.data.view) {
        setSearchParams({ view: event.data.view })
        setWidthPercent(DEFAULT_WIDTH_PERCENT)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [setSearchParams])

  // Get current selected item from URL or use default
  const viewParam = searchParams.get('view')
  const selectedItem = findPreviewItem(viewParam)

  if (!selectedItem) {
    return (
      <div className="h-screen bg-stone-100 dark:bg-stone-900 flex flex-col items-center justify-center">
        <p className="text-stone-600 dark:text-stone-400 text-center max-w-md">
          No preview content available. Please add screen designs to get started.
        </p>
      </div>
    )
  }

  // Handle sidebar item selection
  const handleSelectItem = (item: typeof selectedItem) => {
    const newView = buildViewParam(item)
    setSearchParams({ view: newView })
    setWidthPercent(DEFAULT_WIDTH_PERCENT) // Reset width when changing screens
  }

  // Handle resize drag
  const handleMouseDown = useCallback(() => {
    isDragging.current = true

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const containerWidth = containerRect.width
      const containerCenter = containerRect.left + containerWidth / 2

      // Calculate distance from center
      const distanceFromCenter = Math.abs(e.clientX - containerCenter)
      const maxDistance = containerWidth / 2

      // Convert to percentage (distance from center * 2 = total width)
      let newWidthPercent = (distanceFromCenter / maxDistance) * 100

      // Clamp between min width and 100%
      const minPercent = (MIN_WIDTH / containerWidth) * 100
      newWidthPercent = Math.max(minPercent, Math.min(100, newWidthPercent))

      setWidthPercent(newWidthPercent)
    }

    const handleMouseUp = () => {
      isDragging.current = false
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'ew-resize'
    document.body.style.userSelect = 'none'
  }, [])

  const previewWidth = `${widthPercent}%`

  // Build breadcrumb
  let breadcrumb = ''
  if (selectedItem.type === 'shell') {
    breadcrumb = 'Application Shell'
  } else if (selectedItem.sectionTitle) {
    breadcrumb = `${selectedItem.sectionTitle} / ${selectedItem.label}`
  }

  // Build fullscreen URL
  const fullscreenUrl = selectedItem.iframeSrc

  return (
    <div className="h-screen bg-stone-100 dark:bg-stone-900 animate-fade-in flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 shrink-0 z-50">
        <div className="px-4 py-2 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.5} />
            Back
          </Button>
          <div className="h-4 w-px bg-stone-200 dark:bg-stone-700" />
          <div className="flex-1">
            <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
              {breadcrumb || 'Full Preview'}
            </span>
          </div>

          {/* Width indicator and device presets */}
          <div className="flex items-center gap-4">
            {/* Device size presets */}
            <div className="flex items-center gap-1 border-r border-stone-200 dark:border-stone-700 pr-4">
              <button
                onClick={() => setWidthPercent(30)}
                className={`p-1.5 rounded transition-colors ${
                  widthPercent <= 40
                    ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100'
                    : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
                title="Mobile (30%)"
              >
                <Smartphone className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setWidthPercent(60)}
                className={`p-1.5 rounded transition-colors ${
                  widthPercent > 40 && widthPercent <= 60
                    ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100'
                    : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
                title="Tablet (60%)"
              >
                <Tablet className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setWidthPercent(100)}
                className={`p-1.5 rounded transition-colors ${
                  widthPercent > 60
                    ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100'
                    : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
                title="Desktop (100%)"
              >
                <Monitor className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-mono w-10 text-right">
              {Math.round(widthPercent)}%
            </span>
            <ThemeToggle />
            <a
              href={fullscreenUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" strokeWidth={1.5} />
              Fullscreen
            </a>
          </div>
        </div>
      </header>

      {/* Main content area with sidebar and preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <FullPreviewSidebar selectedItem={selectedItem} onSelectItem={handleSelectItem} />

        {/* Preview area with resizable container */}
        <div
          ref={containerRef}
          className="flex-1 overflow-hidden flex items-stretch justify-center p-6"
        >
          {/* Left resize handle */}
          <div
            className="w-4 flex items-center justify-center cursor-ew-resize group shrink-0"
            onMouseDown={handleMouseDown}
          >
            <div className="w-1 h-16 rounded-full bg-stone-300 dark:bg-stone-600 group-hover:bg-stone-400 dark:group-hover:bg-stone-500 transition-colors flex items-center justify-center">
              <GripVertical className="w-3 h-3 text-stone-500 dark:text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
            </div>
          </div>

          {/* Preview container using iframe for true isolation */}
          <div
            className="bg-white dark:bg-stone-950 rounded-lg shadow-xl border border-stone-200 dark:border-stone-700 overflow-hidden"
            style={{ width: previewWidth, minWidth: MIN_WIDTH, maxWidth: '100%' }}
          >
            <iframe src={selectedItem.iframeSrc} className="w-full h-full border-0" title="Preview" />
          </div>

          {/* Right resize handle */}
          <div
            className="w-4 flex items-center justify-center cursor-ew-resize group shrink-0"
            onMouseDown={handleMouseDown}
          >
            <div className="w-1 h-16 rounded-full bg-stone-300 dark:bg-stone-600 group-hover:bg-stone-400 dark:group-hover:bg-stone-500 transition-colors flex items-center justify-center">
              <GripVertical className="w-3 h-3 text-stone-500 dark:text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
