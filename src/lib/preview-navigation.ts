/**
 * Preview navigation utilities
 * Enables screen-to-screen navigation in the fullscreen preview mode.
 *
 * Two modes:
 * 1. Inside an iframe (FullPreviewPage) → postMessage to parent to switch screen
 * 2. Standalone fullscreen URL → navigate directly via window.location
 */

/**
 * Map sidebar nav hrefs to their default screen view params
 */
const SECTION_DEFAULT_SCREENS: Record<string, string> = {
  '/dashboard-home': 'dashboard-home:DashboardHome',
  '/sales-crm': 'sales-crm:LeadsList',
  '/accounts': 'accounts:AccountsList',
  '/customers': 'customers:CustomerList',
  '/case-management': 'case-management:CaseList',
  '/partners': 'partners:WMList',
  '/team-management': 'team-management:TeamManagement',
  '/reports-analytics': 'reports-analytics:ReportsAnalytics',
  '/invoices': 'invoices:InvoiceList',
}

/**
 * Check if we're inside an iframe (FullPreviewPage)
 */
function isInIframe(): boolean {
  try {
    return window.self !== window.top
  } catch {
    return true // cross-origin means we're in an iframe
  }
}

/**
 * Build the fullscreen URL for a given view param (e.g. "sales-crm:LeadsList")
 */
function buildFullscreenUrl(view: string): string {
  const [sectionId, screenName] = view.split(':')
  return `/sections/${sectionId}/screen-designs/${screenName}/fullscreen`
}

/**
 * Navigate to a specific screen in the preview.
 * If inside an iframe, posts message to parent FullPreviewPage.
 * If standalone, navigates directly to the fullscreen URL.
 */
export function navigateToScreen(sectionId: string, screenName: string) {
  const view = `${sectionId}:${screenName}`

  if (isInIframe()) {
    window.parent.postMessage({ type: 'preview-navigate', view }, '*')
  } else {
    window.location.href = buildFullscreenUrl(view)
  }
}

/**
 * Navigate to a section's default screen via sidebar href.
 * Used by the AppShell's onNavigate callback.
 */
export function navigateToSection(href: string) {
  const view = SECTION_DEFAULT_SCREENS[href]
  if (view) {
    if (isInIframe()) {
      window.parent.postMessage({ type: 'preview-navigate', view }, '*')
    } else {
      window.location.href = buildFullscreenUrl(view)
    }
  }
}
