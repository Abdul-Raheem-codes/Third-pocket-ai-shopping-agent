import { products } from '../../data/products.js'
import CategoryFilters from './CategoryFilters.jsx'
import PriceFilter from './PriceFilter.jsx'

const allColors = [...new Set(products.flatMap((p) => p.colors))].sort()
const toggle = (list, v) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

function Check({ label, checked, onChange }) {
  return (
    <label className="flex min-h-[36px] cursor-pointer items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-forest" />{label}
    </label>
  )
}

export default function ShopFilters({ filters, update }) {
  return (
    <div className="space-y-7">
      <CategoryFilters selected={filters.categories} onToggle={(id) => update({ categories: toggle(filters.categories, id) })} />
      <PriceFilter min={filters.min} max={filters.max} onChange={update} />
      <fieldset>
        <legend className="mb-2 font-display text-lg">Colour</legend>
        {allColors.map((c) => <Check key={c} label={c} checked={filters.colors.includes(c)} onChange={() => update({ colors: toggle(filters.colors, c) })} />)}
      </fieldset>
      <fieldset>
        <legend className="mb-2 font-display text-lg">Availability</legend>
        <Check label="In stock only" checked={filters.inStock} onChange={() => update({ inStock: !filters.inStock })} />
        <Check label="New arrivals" checked={filters.isNew} onChange={() => update({ isNew: !filters.isNew })} />
        <Check label="Bestsellers" checked={filters.bestseller} onChange={() => update({ bestseller: !filters.bestseller })} />
        <Check label="On sale" checked={filters.sale} onChange={() => update({ sale: !filters.sale })} />
      </fieldset>
    </div>
  )
}
