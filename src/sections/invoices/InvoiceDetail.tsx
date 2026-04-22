export function InvoiceDetail() {
  return (
    <div className="w-full h-full p-6 bg-stone-50 dark:bg-stone-900">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Invoice #001</h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">Invoice details and payment information</p>
        </div>

        {/* Invoice Card */}
        <div className="bg-white dark:bg-stone-950 rounded-lg border border-stone-200 dark:border-stone-800 p-6 space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-start pb-6 border-b border-stone-200 dark:border-stone-800">
            <div>
              <h2 className="font-semibold text-stone-900 dark:text-stone-100">From</h2>
              <p className="text-sm text-stone-600 dark:text-stone-400">Your Company Name</p>
              <p className="text-sm text-stone-600 dark:text-stone-400">123 Business St, City, ST 12345</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-stone-500 dark:text-stone-500 font-mono">Invoice Date</p>
              <p className="text-sm font-medium text-stone-900 dark:text-stone-100">2024-01-15</p>
            </div>
          </div>

          {/* Bill To Section */}
          <div className="space-y-2 pb-6 border-b border-stone-200 dark:border-stone-800">
            <h3 className="font-semibold text-stone-900 dark:text-stone-100">Bill To</h3>
            <p className="text-sm text-stone-700 dark:text-stone-300">Acme Corporation</p>
            <p className="text-sm text-stone-600 dark:text-stone-400">456 Client Ave, City, ST 67890</p>
          </div>

          {/* Items Section */}
          <div>
            <table className="w-full text-sm">
              <thead className="border-b border-stone-200 dark:border-stone-700">
                <tr>
                  <th className="text-left py-2 font-medium text-stone-900 dark:text-stone-100">Description</th>
                  <th className="text-right py-2 font-medium text-stone-900 dark:text-stone-100">Quantity</th>
                  <th className="text-right py-2 font-medium text-stone-900 dark:text-stone-100">Unit Price</th>
                  <th className="text-right py-2 font-medium text-stone-900 dark:text-stone-100">Total</th>
                </tr>
              </thead>
              <tbody className="text-stone-700 dark:text-stone-300">
                <tr className="border-b border-stone-200 dark:border-stone-800">
                  <td className="py-3">Website Design</td>
                  <td className="text-right">1</td>
                  <td className="text-right">$2,000</td>
                  <td className="text-right">$2,000</td>
                </tr>
                <tr className="border-b border-stone-200 dark:border-stone-800">
                  <td className="py-3">Revision rounds</td>
                  <td className="text-right">3</td>
                  <td className="text-right">$100</td>
                  <td className="text-right">$300</td>
                </tr>
                <tr>
                  <td className="py-3">Hosting setup</td>
                  <td className="text-right">1</td>
                  <td className="text-right">$100</td>
                  <td className="text-right">$100</td>
                </tr>
              </tbody>
            </table>

            {/* Summary */}
            <div className="mt-4 flex justify-end space-y-2 w-64">
              <div className="flex justify-between text-sm">
                <span className="text-stone-600 dark:text-stone-400">Subtotal:</span>
                <span className="text-stone-900 dark:text-stone-100">$2,400</span>
              </div>
              <div className="flex justify-between text-sm border-t border-stone-200 dark:border-stone-700 pt-2">
                <span className="font-semibold text-stone-900 dark:text-stone-100">Total:</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">$2,400</span>
              </div>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex justify-between items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-lime-100 dark:bg-lime-900/30 text-lime-900 dark:text-lime-200">
                Paid
              </span>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
                Download PDF
              </button>
              <button className="px-4 py-2 text-sm rounded-lg bg-lime-600 text-white hover:bg-lime-700 transition-colors">
                Mark as Paid
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
