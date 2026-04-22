import { ChevronDown, ChevronRight, Layout, PanelLeft } from 'lucide-react'
import { useState } from 'react'
import type { PreviewItem } from '@/lib/preview-helpers'
import { getGroupedPreviewItems, buildViewParam } from '@/lib/preview-helpers'

interface FullPreviewSidebarProps {
  selectedItem: PreviewItem | null
  onSelectItem: (item: PreviewItem) => void
}

export function FullPreviewSidebar({ selectedItem, onSelectItem }: FullPreviewSidebarProps) {
  const groups = getGroupedPreviewItems()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    // Expand the section containing the selected item by default
    if (selectedItem?.type === 'screen' && selectedItem?.sectionTitle) {
      return new Set([selectedItem.sectionTitle])
    }
    // Expand all sections by default
    return new Set(groups.filter((g) => g.type === 'section').map((g) => g.label))
  })

  const toggleSection = (label: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(label)) {
      newExpanded.delete(label)
    } else {
      newExpanded.add(label)
    }
    setExpandedSections(newExpanded)
  }

  const isItemSelected = (item: PreviewItem) => {
    if (!selectedItem) return false
    if (item.type === 'shell' && selectedItem.type === 'shell') return true
    if (
      item.type === 'screen' &&
      selectedItem.type === 'screen' &&
      item.sectionId === selectedItem.sectionId &&
      item.screenName === selectedItem.screenName
    ) {
      return true
    }
    return false
  }

  if (groups.length === 0) {
    return (
      <div className="w-80 border-r border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 p-6 flex items-center justify-center">
        <p className="text-sm text-stone-600 dark:text-stone-400">No content to preview</p>
      </div>
    )
  }

  return (
    <div className="w-80 border-r border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 overflow-y-auto">
      <nav className="p-4 space-y-1">
        {groups.map((group) => (
          <div key={group.label}>
            {/* Group Header (for sections, not shell) */}
            {group.type === 'section' && (
              <button
                onClick={() => toggleSection(group.label)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
              >
                {expandedSections.has(group.label) ? (
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                )}
                <span className="flex-1 text-left">{group.label}</span>
              </button>
            )}

            {/* Group Items (Shell or Screen Designs) */}
            {(group.type === 'shell' || expandedSections.has(group.label)) && (
              <div className={group.type === 'section' ? 'pl-2 space-y-1' : ''}>
                {group.items.map((item) => {
                  const isSelected = isItemSelected(item)
                  const isSection = group.type === 'section'
                  return (
                    <button
                      key={buildViewParam(item)}
                      onClick={() => onSelectItem(item)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isSection ? 'ml-2' : ''
                      } ${
                        isSelected
                          ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100 font-medium border-l-2 border-lime-500'
                          : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                      }`}
                    >
                      {item.type === 'shell' ? (
                        <PanelLeft className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <Layout className="w-4 h-4 flex-shrink-0" />
                      )}
                      <span className="flex-1 text-left">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}
