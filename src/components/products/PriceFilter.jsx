export default function PriceFilter({ min, max, onChange }) {
  const input = 'min-h-[44px] w-full border border-line bg-white px-3 text-sm'
  return (
    <fieldset>
      <legend className="mb-2 font-display text-lg">Price (USD)</legend>
      <div className="flex gap-2">
        <input type="number" min="0" inputMode="numeric" placeholder="Min" aria-label="Minimum price" value={min} onChange={(e) => onChange({ min: e.target.value })} className={input} />
        <input type="number" min="0" inputMode="numeric" placeholder="Max" aria-label="Maximum price" value={max} onChange={(e) => onChange({ max: e.target.value })} className={input} />
      </div>
    </fieldset>
  )
}
