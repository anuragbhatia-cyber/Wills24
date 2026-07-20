import { useState, useRef, useEffect } from 'react'
import { Plus, ChevronDown, UserPlus, Briefcase, FileText, Scale, Handshake } from 'lucide-react'
import { navigateToScreen } from '@/lib/preview-navigation'

const ACTIONS = [
  { id: 'qa-1', label: 'New Lead', icon: UserPlus, section: 'sales-crm', screen: 'LeadForm' },
  { id: 'qa-2', label: 'New Case', icon: Briefcase, section: 'case-management', screen: 'AddCaseForm' },
  { id: 'qa-3', label: 'New Quotation', icon: FileText, section: 'sales-crm', screen: 'LeadsList' },
  { id: 'qa-4', label: 'Assign Lawyer', icon: Scale, section: 'case-management', screen: 'CaseList' },
  { id: 'qa-5', label: 'New Partner', icon: Handshake, section: 'partners', screen: 'AddWMForm' },
]

export default function QuickActionsMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKey)
      return () => document.removeEventListener('keydown', handleKey)
    }
  }, [isOpen])

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-500 px-2.5 py-1.5 text-[12px] font-semibold text-white shadow-sm hover:bg-yellow-600 transition-colors cursor-pointer"
        aria-label="Quick create"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <Plus size={13} strokeWidth={2.5} />
        New
        <ChevronDown
          size={12}
          strokeWidth={2.5}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl shadow-neutral-900/5 dark:border-neutral-700 dark:bg-neutral-800"
        >
          <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-700">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              Quick create
            </p>
          </div>
          <div className="py-1">
            {ACTIONS.map((a) => {
              const Icon = a.icon
              return (
                <button
                  key={a.id}
                  role="menuitem"
                  onClick={() => {
                    setIsOpen(false)
                    navigateToScreen(a.section, a.screen)
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] text-neutral-700 dark:text-neutral-200 transition-colors hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-700 dark:hover:text-yellow-300 cursor-pointer"
                >
                  <Icon size={14} strokeWidth={2} className="text-neutral-500 dark:text-neutral-400" />
                  {a.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
