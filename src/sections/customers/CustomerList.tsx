import { useState, useMemo } from 'react'
import data from '@/../product/sections/customers/data.json'
import { CustomerList } from './components/CustomerList'
import { navigateToScreen } from '@/lib/preview-navigation'
import { toast } from '@/components/ui/toaster'
import type { Customer, KpiStats, StatusCounts } from '@/../product/sections/customers/types'

/**
 * Preview wrapper for Design OS.
 * Shows the Customer List View with all 6 sample customers, KPI cards,
 * and status filter tabs.
 */
export default function CustomerListPreview() {
  const [customers, setCustomers] = useState<Customer[]>(data.customers as Customer[])

  const kpiStats = useMemo<KpiStats>(() => ({
    totalCustomers: customers.length,
    activeCases: customers.reduce((sum, c) => sum + (c.activeCases ?? 0), 0),
    servicesAvailed: customers.reduce((sum, c) => sum + (c.servicesAvailed?.length ?? 0), 0),
    revenueGenerated: customers.reduce((sum, c) => sum + (c.totalPayments ?? 0), 0),
  }), [customers])

  const statusCounts = useMemo<StatusCounts>(() => ({
    all: customers.length,
    active: customers.filter((c) => c.status === 'active').length,
    inactive: customers.filter((c) => c.status === 'inactive').length,
  }), [customers])

  return (
    <CustomerList
      customers={customers}
      kpiStats={kpiStats}
      statusCounts={statusCounts}
      onView={() => navigateToScreen('customers', 'CustomerDetail')}
      onEdit={(id) => console.log('Edit customer:', id)}
      onSendQuotation={(id) => console.log('Send quotation:', id)}
      onViewCases={() => navigateToScreen('case-management', 'CaseList')}
      onViewDocuments={(id) => console.log('View documents:', id)}
      onCreate={(customer) => {
        setCustomers((prev) => [customer, ...prev])
        toast.success('Customer added', `${customer.name} added to your customer list`)
      }}
    />
  )
}
