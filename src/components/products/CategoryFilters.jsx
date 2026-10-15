import { productCategories } from '../../data/categories.js'

export default function CategoryFilters({ selected, onToggle }) {
  return (
    <fieldset>
      <legend className="mb-2 font-display text-lg">Category</legend>
      {productCategories.map((c) => (
        <label key={c.id} className="flex min-h-[36px] cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={selected.includes(c.id)} onChange={() => onToggle(c.id)} className="h-4 w-4 accent-forest" />
          {c.label}
        </label>
      ))}
    </fieldset>
  )
}
