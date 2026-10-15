import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange }) {
  return (
    <label className="relative block">
      <span className="sr-only">Search products</span>
      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/50" />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search by name, category or description"
        className="min-h-[44px] w-full border border-line bg-white pl-10 pr-3 text-sm" />
    </label>
  )
}
