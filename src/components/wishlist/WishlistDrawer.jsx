import Drawer from '../common/Drawer.jsx'
import ProductImage from '../common/ProductImage.jsx'
import { useWishlist } from '../../hooks/useWishlist.js'
import { useCart } from '../../hooks/useCart.js'
import { formatPrice } from '../../utils/formatPrice.js'

export default function WishlistDrawer() {
  const { isOpen, close, products, remove } = useWishlist()
  const { addItem } = useCart()
  const moveToCart = (p) => { addItem(p.id, 1); remove(p.id) }
  return (
    <Drawer open={isOpen} onClose={close} title="Saved items">
      {products.length === 0 ? (
        <p className="py-10 text-charcoal/70">Nothing saved yet. Tap the heart on any product.</p>
      ) : (
        <ul>
          {products.map((p) => (
            <li key={p.id} className="flex gap-4 border-b border-line py-4">
              <ProductImage src={p.image} alt={p.name} className="h-20 w-20 shrink-0" />
              <div className="flex-1">
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-charcoal/60">{formatPrice(p.price)}</p>
                <div className="mt-2 flex gap-4 text-sm">
                  <button disabled={p.stock <= 0} onClick={() => moveToCart(p)} className="min-h-[36px] font-medium text-forest underline disabled:text-charcoal/40 disabled:no-underline">
                    {p.stock <= 0 ? 'Sold out' : 'Move to cart'}
                  </button>
                  <button onClick={() => remove(p.id)} className="min-h-[36px] text-charcoal/60 underline">Remove</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  )
}
