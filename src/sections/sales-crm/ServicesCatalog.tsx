import data from '@/../product/sections/sales-crm/data.json'
import { ServicesCatalog } from './components/ServicesCatalog'

/**
 * Preview wrapper for Design OS.
 * Shows the full Services Catalog with all services including the inactive one.
 */
export default function ServicesCatalogPreview() {
  return (
    <ServicesCatalog
      services={data.services as any}
      onCreate={() => console.log('Create new service')}
      onEdit={(id) => console.log('Edit service:', id)}
      onToggle={(id) => console.log('Toggle service:', id)}
    />
  )
}
