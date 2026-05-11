import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

/**
 * Visible affordance for the global command palette.
 * The palette itself listens for Cmd/Ctrl+K; this button just simulates the
 * same keystroke so users discover the feature.
 */
export default function CommandPaletteTrigger() {
  const [isMac, setIsMac] = useState(false)
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes('MAC'))
  }, [])

  function open() {
    const isMacNow = navigator.platform.toUpperCase().includes('MAC')
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: isMacNow,
        ctrlKey: !isMacNow,
        bubbles: true,
      }),
    )
  }

  return (
    <button
      onClick={open}
      className="hidden md:inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-[12px] text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 cursor-pointer"
      aria-label="Open command palette"
    >
      <Search size={13} />
      <span>Search…</span>
      <kbd className="ml-1 rounded border border-neutral-200 bg-white px-1 py-0.5 font-mono text-[10px] text-neutral-500 dark:border-neutral-600 dark:bg-neutral-900">
        {isMac ? '⌘K' : 'Ctrl K'}
      </kbd>
    </button>
  )
}
