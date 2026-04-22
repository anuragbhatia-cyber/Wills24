/**
 * Preview helper utilities for full preview functionality
 * Manages preview items (shell + screen designs) and navigation
 */

import {
  getAllSectionIds,
  getSectionScreenDesigns,
} from './section-loader'
import { hasShell } from './shell-loader'
import { loadProductData } from './product-loader'

/**
 * Convert PascalCase to readable string
 * "InvoiceList" → "Invoice List"
 * "UserDashboard" → "User Dashboard"
 */
export function formatComponentName(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
    .replace(/^\\s+/, '') // Remove leading space
    .trim()
}

/**
 * Represents a previewable item (shell or screen design)
 */
export interface PreviewItem {
  type: 'shell' | 'screen'
  label: string // Display name
  iframeSrc: string // URL for iframe src
  sectionId?: string
  screenName?: string
  sectionTitle?: string
  sectionOrder?: number
}

/**
 * Parse view query parameter to identify item
 * Returns null if parameter is invalid
 *
 * Examples:
 * "shell" → { type: 'shell' }
 * "invoices:InvoiceList" → { type: 'screen', sectionId: 'invoices', screenName: 'InvoiceList' }
 */
export function parseViewParam(
  view: string | null
): {
  type: 'shell' | 'screen'
  sectionId?: string
  screenName?: string
} | null {
  if (!view) return null

  if (view === 'shell') {
    return { type: 'shell' }
  }

  const match = view.match(/^([^:]+):(.+)$/)
  if (match) {
    return {
      type: 'screen',
      sectionId: match[1],
      screenName: match[2],
    }
  }

  return null
}

/**
 * Build view query parameter from preview item
 */
export function buildViewParam(item: PreviewItem): string {
  if (item.type === 'shell') {
    return 'shell'
  }
  return `${item.sectionId}:${item.screenName}`
}

/**
 * Check if any previewable content exists
 */
export function hasPreviewableContent(): boolean {
  const hasShellContent = hasShell()
  const sections = getAllSectionIds()
  return hasShellContent || sections.length > 0
}

/**
 * Get all preview items in hierarchical order
 */
export function getAllPreviewItems(): PreviewItem[] {
  const items: PreviewItem[] = []

  // Add shell first if it exists
  if (hasShell()) {
    items.push({
      type: 'shell',
      label: 'Application Shell',
      iframeSrc: '/shell/design/fullscreen',
    })
  }

  // Get sections in order from roadmap
  const productData = loadProductData()
  const sections = productData.roadmap?.sections || []

  // Add sections with their screen designs
  for (const section of sections) {
    const screenDesigns = getSectionScreenDesigns(section.id)

    if (screenDesigns.length > 0) {
      for (const screen of screenDesigns) {
        items.push({
          type: 'screen',
          label: formatComponentName(screen.name),
          iframeSrc: `/sections/${section.id}/screen-designs/${screen.name}/fullscreen`,
          sectionId: section.id,
          screenName: screen.name,
          sectionTitle: section.title,
          sectionOrder: section.order,
        })
      }
    }
  }

  return items
}

/**
 * Get all preview items organized by section (for sidebar grouping)
 */
export interface PreviewItemGroup {
  type: 'shell' | 'section'
  label: string
  order?: number
  items: PreviewItem[]
}

export function getGroupedPreviewItems(): PreviewItemGroup[] {
  const groups: PreviewItemGroup[] = []

  // Add shell first if it exists
  if (hasShell()) {
    groups.push({
      type: 'shell',
      label: 'Application Shell',
      items: [
        {
          type: 'shell',
          label: 'Application Shell',
          iframeSrc: '/shell/design/fullscreen',
        },
      ],
    })
  }

  // Get sections in order from roadmap
  const productData = loadProductData()
  const sections = productData.roadmap?.sections || []

  // Add each section with its screen designs
  for (const section of sections) {
    const screenDesigns = getSectionScreenDesigns(section.id)

    if (screenDesigns.length > 0) {
      const screenItems: PreviewItem[] = screenDesigns.map((screen) => ({
        type: 'screen',
        label: formatComponentName(screen.name),
        iframeSrc: `/sections/${section.id}/screen-designs/${screen.name}/fullscreen`,
        sectionId: section.id,
        screenName: screen.name,
        sectionTitle: section.title,
        sectionOrder: section.order,
      }))

      groups.push({
        type: 'section',
        label: section.title,
        order: section.order,
        items: screenItems,
      })
    }
  }

  return groups
}

/**
 * Find a preview item by view parameter
 * Returns the item if found, otherwise returns first available item
 */
export function findPreviewItem(
  view: string | null
): PreviewItem | null {
  const parsed = parseViewParam(view)
  if (!parsed) {
    return getDefaultPreviewItem()
  }

  const allItems = getAllPreviewItems()

  if (parsed.type === 'shell') {
    return allItems.find((item) => item.type === 'shell') || null
  }

  return (
    allItems.find(
      (item) =>
        item.type === 'screen' &&
        item.sectionId === parsed.sectionId &&
        item.screenName === parsed.screenName
    ) || null
  )
}

/**
 * Get the default preview item (shell if available, otherwise first section)
 */
export function getDefaultPreviewItem(): PreviewItem | null {
  const allItems = getAllPreviewItems()
  return allItems.length > 0 ? allItems[0] : null
}
