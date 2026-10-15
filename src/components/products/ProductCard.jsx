import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { motion } from 'motion/react'
import ProductImage from '../common/ProductImage.jsx'
import { useCart } from '../../hooks/useCart.js'
import { useWishlist } from '../../hooks/useWishlist.js'
import { productCategories } from '../../data/categories.js'
import { formatPrice } from '../../utils/formatPrice.js'

export default function ProductCard({ product: p }) {
  const { addItem } = useCart()
  const { has, toggle } = useWishlist()
  const saved = has(p.id)
  const sale = p.originalPrice > p.price
  const badges = [p.isNew && 'New', p.isBestseller && 'Bestseller', sale && 'Sale'].filter(Boolean)
  const stock = p.stock <= 0 ? 'Sold out' : p.stock <= 5 ? `Only ${p.stock} left` : 'In stock'
  return (
    <motion.article className="group flex flex-col"
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.45, ease: 'easeOut' }}>
      <div className="relative overflow-hidden bg-sage/40">
        <Link to={`/product/${p.id}`} aria-label={`View ${p.name}`}>
          <ProductImage src={p.image} alt={p.name} className="aspect-square w-full transition-transform duration-500 group-hover:scale-105" />
        </Link>
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {badges.map((b) => <span key={b} className="bg-ivory px-2 py-1 text-xs">{b}</span>)}
        </div>
        <button onClick={() => toggle(p.id)} aria-pressed={saved} aria-label={saved ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`}
          className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center bg-ivory/90">
          <Heart size={18} className={saved ? 'fill-forest text-forest' : ''} />
        </button>
      </div>
      <div className="mt-3 flex-1">
        <p className="text-xs text-charcoal/60">{productCategories.find((c) => c.id === p.category)?.label}</p>
        <h3 className="mt-0.5 text-lg"><Link to={`/product/${p.id}`}>{p.name}</Link></h3>
        <p className="mt-1 text-sm">
          <span className="font-medium">{formatPrice(p.price)}</span>
          {sale && <span className="ml-2 text-charcoal/50 line-through">{formatPrice(p.originalPrice)}</span>}
        </p>
        <p className={`mt-1 text-xs ${p.stock <= 5 ? 'text-gold' : 'text-charcoal/60'}`}>{stock}</p>
      </div>
      <button onClick={() => addItem(p.id, 1)} disabled={p.stock <= 0}
        className="mt-3 min-h-[44px] bg-forest text-sm font-medium text-ivory transition-colors hover:bg-charcoal disabled:bg-line disabled:text-charcoal/50">
        {p.stock <= 0 ? 'Sold out' : 'Add to Cart'}
      </button>
    </motion.article>
  )
}
