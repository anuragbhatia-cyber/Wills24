export function InvoiceList() {
  return (
    <div className="w-full h-full p-6 bg-stone-50 dark:bg-stone-900">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Invoices</h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">Manage your customer invoices</p>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-stone-950 rounded-lg border border-stone-200 dark:border-stone-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-100 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-stone-900 dark:text-stone-100">Invoice #</th>
                <th className="px-6 py-4 text-left font-medium text-stone-900 dark:text-stone-100">Customer</th>
                <th className="px-6 py-4 text-left font-medium text-stone-900 dark:text-stone-100">Amount</th>
                <th className="px-6 py-4 text-left font-medium text-stone-900 dark:text-stone-100">Status</th>
                <th className="px-6 py-4 text-left font-medium text-stone-900 dark:text-stone-100">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: '001', customer: 'Acme Corp', amount: '$2,400', status: 'Paid', date: '2024-01-15' },
                { id: '002', customer: 'Tech Solutions', amount: '$1,800', status: 'Pending', date: '2024-02-01' },
                { id: '003', customer: 'Design Studio', amount: '$3,200', status: 'Overdue', date: '2024-01-20' },
              ].map((invoice) => (
                <tr key={invoice.id} className="border-b border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors">
                  <td className="px-6 py-4 text-stone-900 dark:text-stone-100 font-medium">{invoice.id}</td>
                  <td className="px-6 py-4 text-stone-700 dark:text-stone-300">{invoice.customer}</td>
                  <td className="px-6 py-4 text-stone-900 dark:text-stone-100">{invoice.amount}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'Paid'
                          ? 'bg-lime-100 dark:bg-lime-900/30 text-lime-900 dark:text-lime-200'
                          : invoice.status === 'Pending'
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-200'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-200'
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-stone-700 dark:text-stone-300">{invoice.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
