import { useState, useEffect, useMemo, useRef } from 'react'
import { Search, UserPlus, Briefcase, Users, Handshake, ArrowRight, Plus } from 'lucide-react'
import { navigateToScreen } from '@/lib/preview-navigation'
import leadsData from '@/../product/sections/sales-crm/data.json'
import casesData from '@/../product/sections/case-management/data.json'
import customersData from '@/../product/sections/customers/data.json'
import partnersData from '@/../product/sections/partners/data.json'

type IndexEntry = {
  id: string
  type: 'lead' | 'case' | 'customer' | 'partner' | 'action'
  title: string
  subtitle?: string
  section: string
  screen: string
  searchKey: string
}

const TYPE_ICON = {
  lead: UserPlus,
  case: Briefcase,
  customer: Users,
  partner: Handshake,
  action: Plus,
} as const

const TYPE_LABEL = {
  lead: 'Lead',
  case: 'Case',
  customer: 'Customer',
  partner: 'Partner',
  action: 'Action',
} as const

const TYPE_COLOR = {
  lead: 'text-yellow-600 dark:text-yellow-400',
  case: 'text-blue-600 dark:text-blue-400',
  customer: 'text-emerald-600 dark:text-emerald-400',
  partner: 'text-violet-600 dark:text-violet-400',
  action: 'text-neutral-500 dark:text-neutral-400',
} as const

const QUICK_ACTIONS: IndexEntry[] = [
  { id: 'qa-lead', type: 'action', title: 'New Lead', subtitle: 'Add a lead to the pipeline', section: 'sales-crm', screen: 'LeadForm', searchKey: 'new lead add create' },
  { id: 'qa-case', type: 'action', title: 'New Case', subtitle: 'Open a new case', section: 'case-management', screen: 'AddCaseForm', searchKey: 'new case add create' },
  { id: 'qa-partner', type: 'action', title: 'New Partner', subtitle: 'Onboard a wealth manager', section: 'partners', screen: 'AddWMForm', searchKey: 'new partner add create wealth manager' },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Build search index once
  const index = useMemo<IndexEntry[]>(() => {
    const entries: IndexEntry[] = []

    for (const lead of (leadsData.leads ?? []) as Array<{ id: string; name: string; phone?: string; email?: string; company?: string }>) {
      entries.push({
        id: lead.id,
        type: 'lead',
        title: lead.name,
        subtitle: [lead.company, lead.phone].filter(Boolean).join(' · ') || lead.email,
        section: 'sales-crm',
        screen: 'LeadDetail',
        searchKey: `${lead.name} ${lead.id} ${lead.phone ?? ''} ${lead.email ?? ''} ${lead.company ?? ''}`.toLowerCase(),
      })
    }

    for (const c of (casesData.cases ?? []) as Array<{ id: string; customerName: string; serviceType: string }>) {
      entries.push({
        id: c.id,
        type: 'case',
        title: c.customerName,
        subtitle: c.serviceType,
        section: 'case-management',
        screen: 'CaseDetail',
        searchKey: `${c.customerName} ${c.id} ${c.serviceType}`.toLowerCase(),
      })
    }

    for (const cu of (customersData.customers ?? []) as Array<{ id: string; name: string; phone?: string; email?: string; company?: string }>) {
      entries.push({
        id: cu.id,
        type: 'customer',
        title: cu.name,
        subtitle: [cu.company, cu.phone].filter(Boolean).join(' · ') || cu.email,
        section: 'customers',
        screen: 'CustomerDetail',
        searchKey: `${cu.name} ${cu.id} ${cu.phone ?? ''} ${cu.email ?? ''} ${cu.company ?? ''}`.toLowerCase(),
      })
    }

    for (const wm of (partnersData.wealthManagers ?? []) as Array<{ id: string; name: string; email?: string; phone?: string; company?: { name?: string } }>) {
      entries.push({
        id: wm.id,
        type: 'partner',
        title: wm.name,
        subtitle: [wm.company?.name, wm.phone].filter(Boolean).join(' · ') || wm.email,
        section: 'partners',
        screen: 'WMDetail',
        searchKey: `${wm.name} ${wm.id} ${wm.phone ?? ''} ${wm.email ?? ''} ${wm.company?.name ?? ''}`.toLowerCase(),
      })
    }

    return entries
  }, [])

  // Filter
  const results = useMemo(() => {
    if (!query.trim()) {
      return [...QUICK_ACTIONS]
    }
    const q = query.toLowerCase()
    const matches = index.filter((e) => e.searchKey.includes(q))
    const actionMatches = QUICK_ACTIONS.filter((a) => a.searchKey.includes(q))
    return [...actionMatches, ...matches].slice(0, 30)
  }, [query, index])

  // Global Cmd+K / Ctrl+K
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().includes('MAC')
      const modifier = isMac ? e.metaKey : e.ctrlKey
      if (modifier && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      } else if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  // Reset state on open
  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  // Arrow nav
  function handleInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[activeIndex]) {
      e.preventDefault()
      selectResult(results[activeIndex])
    }
  }

  function selectResult(entry: IndexEntry) {
    setOpen(false)
    navigateToScreen(entry.section, entry.screen)
  }

  // Scroll active row into view
  useEffect(() => {
    if (!listRef.current) return
    const el = listRef.current.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[150] bg-neutral-900/40 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Palette */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="fixed left-1/2 top-[18vh] z-[151] -translate-x-1/2 w-[min(640px,calc(100vw-2rem))] rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 animate-in fade-in slide-in-from-top-4 duration-200"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800 px-4 py-3">
          <Search size={16} className="text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKey}
            placeholder="Search leads, cases, customers, partners…"
            className="flex-1 bg-transparent text-[14px] text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none border-none focus:ring-0"
            aria-label="Search"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10px] font-mono text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-1">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-[13px] text-neutral-500 dark:text-neutral-400">
              No results for <span className="font-semibold">"{query}"</span>
            </div>
          ) : (
            results.map((entry, i) => {
              const Icon = TYPE_ICON[entry.type]
              const color = TYPE_COLOR[entry.type]
              const isActive = i === activeIndex
              return (
                <button
                  key={`${entry.type}-${entry.id}`}
                  data-index={i}
                  onClick={() => selectResult(entry)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                    isActive ? 'bg-yellow-50 dark:bg-yellow-950/30' : ''
                  }`}
                >
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 ${color}`}>
                    <Icon size={13} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-neutral-900 dark:text-neutral-100 truncate">
                      {entry.title}
                    </p>
                    {entry.subtitle && (
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                        {entry.subtitle}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 shrink-0">
                    {TYPE_LABEL[entry.type]}
                  </span>
                  {isActive && <ArrowRight size={12} className="text-yellow-500 shrink-0" />}
                </button>
              )
            })
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 px-4 py-2 text-[10px] text-neutral-400 dark:text-neutral-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-neutral-200 bg-neutral-50 px-1 py-0.5 font-mono text-[9px] dark:border-neutral-700 dark:bg-neutral-800">↑</kbd>
              <kbd className="rounded border border-neutral-200 bg-neutral-50 px-1 py-0.5 font-mono text-[9px] dark:border-neutral-700 dark:bg-neutral-800">↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-neutral-200 bg-neutral-50 px-1 py-0.5 font-mono text-[9px] dark:border-neutral-700 dark:bg-neutral-800">↵</kbd>
              select
            </span>
          </div>
          <span className="font-mono">{results.length} results</span>
        </div>
      </div>
    </>
  )
}
