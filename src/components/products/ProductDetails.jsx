import { useState } from 'react'
import ProductImage from '../common/ProductImage.jsx'
import { useCart } from '../../hooks/useCart.js'
import { useWishlist } from '../../hooks/useWishlist.js'
import { productCategories } from '../../data/categories.js'
import { formatPrice } from '../../utils/formatPrice.js'

export default function ProductDetails({ product: p }) {
  const { addItem } = useCart()
  const { has, toggle } = useWishlist()
  const [color, setColor] = useState(p.colors[0])
  const [qty, setQty] = useState(1)
  const sale = p.originalPrice > p.price
  const out = p.stock <= 0
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <ProductImage src={p.image} alt={p.name} className="aspect-square w-full" tint="#DCE4D9" />
      <div>
        <p className="text-sm text-charcoal/60">{productCategories.find((c) => c.id === p.category)?.label}</p>
        <h1 className="mt-1 text-3xl sm:text-4xl">{p.name}</h1>
        <p className="mt-3 text-xl">
          {formatPrice(p.price)}
          {sale && <span className="ml-3 text-base text-charcoal/50 line-through">{formatPrice(p.originalPrice)}</span>}
        </p>
        <p className="mt-4 max-w-md leading-relaxed text-charcoal/80">{p.description}</p>
        <p className={`mt-4 text-sm ${out ? 'text-charcoal/60' : p.stock <= 5 ? 'text-gold' : 'text-forest'}`}>
          {out ? 'Sold out' : p.stock <= 5 ? `Only ${p.stock} left` : `In stock (${p.stock} available)`}
        </p>
        <fieldset className="mt-6">
          <legend className="mb-2 text-sm">Colour: {color}</legend>
          <div className="flex flex-wrap gap-2">
            {p.colors.map((c) => (
              <button key={c} onClick={() => setColor(c)} aria-pressed={c === color}
                className={`min-h-[44px] border px-4 text-sm ${c === color ? 'border-forest bg-forest text-ivory' : 'border-line bg-white'}`}>{c}</button>
            ))}
          </div>
        </fieldset>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center border border-line bg-white">
            <button aria-label="Decrease quantity" disabled={qty <= 1 || out} onClick={() => setQty(qty - 1)} className="h-11 w-11 disabled:opacity-40">−</button>
            <span className="w-10 text-center" aria-live="polite">{out ? 0 : qty}</span>
            <button aria-label="Increase quantity" disabled={qty >= p.stock} onClick={() => setQty(qty + 1)} className="h-11 w-11 disabled:opacity-40">+</button>
          </div>
          <button onClick={() => addItem(p.id, qty)} disabled={out}
            className="min-h-[44px] bg-forest px-8 text-sm font-medium text-ivory hover:bg-charcoal disabled:bg-line disabled:text-charcoal/50">
            {out ? 'Sold out' : 'Add to Cart'}
          </button>
          <button onClick={() => toggle(p.id)} aria-pressed={has(p.id)} className="min-h-[44px] border border-charcoal px-5 text-sm">
            {has(p.id) ? 'Saved' : 'Save for later'}
          </button>
        </div>
      </div>
    </div>
  )
}
