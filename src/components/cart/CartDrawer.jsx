import Drawer from '../common/Drawer.jsx'
import CartItem from './CartItem.jsx'
import { useCart } from '../../hooks/useCart.js'
import { formatPrice } from '../../utils/formatPrice.js'

export default function CartDrawer() {
  const { isOpen, close, lines, subtotal } = useCart()
  return (
    <Drawer open={isOpen} onClose={close} title="Your cart">
      {lines.length === 0 ? (
        <p className="py-10 text-charcoal/70">Your cart is empty. Browse the shop to add something.</p>
      ) : (
        <>
          <ul>{lines.map((l) => <CartItem key={l.id} line={l} />)}</ul>
          <div className="mt-6 flex justify-between text-lg"><span>Subtotal</span><span className="font-medium">{formatPrice(subtotal)}</span></div>
          <p className="mt-3 text-sm text-charcoal/60">Checkout is not part of this demo.</p>
        </>
      )}
    </Drawer>
  )
}
