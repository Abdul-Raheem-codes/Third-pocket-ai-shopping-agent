import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { products } from '../data/products.js'
import { productCategories } from '../data/categories.js'
import { emptyFilters, filterProducts } from '../utils/filterProducts.js'
import { sortProducts } from '../utils/sortProducts.js'
import ProductGrid from '../components/products/ProductGrid.jsx'
import ShopFilters from '../components/products/ShopFilters.jsx'
import SearchBar from '../components/products/SearchBar.jsx'
import SortDropdown from '../components/products/SortDropdown.jsx'

function fromParams(params) {
  const flag = params.get('filter')
  return {
    ...emptyFilters,
    categories: (params.get('category') || '').split(',').filter(Boolean),
    isNew: flag === 'new', bestseller: flag === 'bestsellers', sale: flag === 'sale',
  }
}

export default function Shop() {
  const [params] = useSearchParams()
  const [filters, setFilters] = useState(() => fromParams(params))
  const [showFilters, setShowFilters] = useState(false)
  const update = (patch) => setFilters((f) => ({ ...f, ...patch }))

  // Links from the navbar and collection cards change the URL while this page is mounted.
  useEffect(() => { setFilters((f) => ({ ...fromParams(params), search: f.search, sort: f.sort })) }, [params])
  useEffect(() => { document.title = 'Shop | Third Pocket' }, [])

  const results = useMemo(() => sortProducts(filterProducts(products, filters), filters.sort), [filters])

  const chips = [
    ...filters.categories.map((id) => ({ label: productCategories.find((c) => c.id === id)?.label || id, clear: () => update({ categories: filters.categories.filter((x) => x !== id) }) })),
    ...filters.colors.map((c) => ({ label: c, clear: () => update({ colors: filters.colors.filter((x) => x !== c) }) })),
    filters.min !== '' && { label: `Min $${filters.min}`, clear: () => update({ min: '' }) },
    filters.max !== '' && { label: `Max $${filters.max}`, clear: () => update({ max: '' }) },
    filters.inStock && { label: 'In stock', clear: () => update({ inStock: false }) },
    filters.isNew && { label: 'New arrivals', clear: () => update({ isNew: false }) },
    filters.bestseller && { label: 'Bestsellers', clear: () => update({ bestseller: false }) },
    filters.sale && { label: 'On sale', clear: () => update({ sale: false }) },
    filters.search && { label: `"${filters.search}"`, clear: () => update({ search: '' }) },
  ].filter(Boolean)

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <h1 className="text-4xl sm:text-5xl">Shop</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
        <SearchBar value={filters.search} onChange={(search) => update({ search })} />
        <SortDropdown value={filters.sort} onChange={(sort) => update({ sort })} />
      </div>
      <button onClick={() => setShowFilters((s) => !s)} aria-expanded={showFilters}
        className="mt-4 flex min-h-[44px] items-center gap-2 border border-charcoal px-4 text-sm lg:hidden">
        <SlidersHorizontal size={16} /> {showFilters ? 'Hide filters' : 'Show filters'}
      </button>
      <div className="mt-6 grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside aria-label="Filters" className={`${showFilters ? 'block' : 'hidden'} lg:block`}><ShopFilters filters={filters} update={update} /></aside>
        <section aria-label="Products">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <p className="mr-2 text-sm text-charcoal/70" aria-live="polite">{results.length} {results.length === 1 ? 'product' : 'products'}</p>
            {chips.map((c) => (
              <button key={c.label} onClick={c.clear} aria-label={`Remove filter ${c.label}`}
                className="flex min-h-[36px] items-center gap-1 border border-line bg-white px-3 text-sm">{c.label}<X size={14} /></button>
            ))}
            {chips.length > 0 && (
              <button onClick={() => setFilters((f) => ({ ...emptyFilters, sort: f.sort }))} className="min-h-[36px] px-2 text-sm underline">Clear All Filters</button>
            )}
          </div>
          {results.length ? <ProductGrid products={results} /> : (
            <div className="border border-line bg-white p-10 text-center">
              <p className="font-display text-2xl">No products match</p>
              <p className="mt-2 text-charcoal/70">Try removing a filter or searching for something else.</p>
              <button onClick={() => setFilters((f) => ({ ...emptyFilters, sort: f.sort }))} className="mt-5 min-h-[44px] bg-forest px-6 text-sm text-ivory">Clear All Filters</button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
