export default function SortDropdown({ value, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span>Sort by</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="min-h-[44px] border border-line bg-white px-3">
        <option value="featured">Featured</option>
        <option value="newest">Newest</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
      </select>
    </label>
  )
}
