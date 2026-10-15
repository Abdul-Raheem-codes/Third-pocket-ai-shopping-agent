import { Minus, Plus, Trash2 } from 'lucide-react'
import ProductImage from '../common/ProductImage.jsx'
import { useCart } from '../../hooks/useCart.js'
import { formatPrice } from '../../utils/formatPrice.js'

export default function CartItem({ line }) {
  const { setQty, removeItem } = useCart()
  const { product, qty } = line
  const btn = 'flex h-9 w-9 items-center justify-center border border-line disabled:opacity-40'
  return (
    <li className="flex gap-4 border-b border-line py-4">
      <ProductImage src={product.image} alt={product.name} className="h-20 w-20 shrink-0" />
      <div className="flex-1">
        <p className="font-medium">{product.name}</p>
        <p className="text-sm text-charcoal/60">{formatPrice(product.price)}</p>
        <div className="mt-2 flex items-center gap-2">
          <button className={btn} aria-label="Decrease quantity" onClick={() => setQty(product.id, qty - 1)}><Minus size={14} /></button>
          <span className="w-6 text-center text-sm" aria-live="polite">{qty}</span>
          <button className={btn} aria-label="Increase quantity" disabled={qty >= product.stock} onClick={() => setQty(product.id, qty + 1)}><Plus size={14} /></button>
          <button className="ml-2 flex h-9 w-9 items-center justify-center text-charcoal/60 hover:text-charcoal" aria-label={`Remove ${product.name}`} onClick={() => removeItem(product.id)}><Trash2 size={16} /></button>
        </div>
      </div>
      <p className="text-sm font-medium">{formatPrice(product.price * qty)}</p>
    </li>
  )
}
