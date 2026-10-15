import { useState, useCallback } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, Heart, ShoppingBag } from 'lucide-react'
import { useCart } from '../../hooks/useCart.js'
import { useWishlist } from '../../hooks/useWishlist.js'
import { navLinks } from '../../data/categories.js'
import MobileMenu from './MobileMenu.jsx'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const cart = useCart()
  const wish = useWishlist()
  const icon = 'relative flex h-11 w-11 items-center justify-center'
  const badge = 'absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center bg-forest px-1 text-[10px] text-ivory'
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ivory/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="font-display text-2xl font-semibold tracking-tight text-forest">Third Pocket</Link>
        <nav aria-label="Main" className="hidden gap-8 md:flex">
          {navLinks.map((l) => (
            <NavLink key={l.label} to={l.to} className="py-2 text-sm text-charcoal/80 transition-colors hover:text-forest">
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center">
          <button onClick={wish.open} aria-label={`Saved items, ${wish.count}`} className={icon}>
            <Heart size={20} />{wish.count > 0 && <span className={badge}>{wish.count}</span>}
          </button>
          <button onClick={cart.open} aria-label={`Cart, ${cart.count} items`} className={icon}>
            <ShoppingBag size={20} />{cart.count > 0 && <span className={badge}>{cart.count}</span>}
          </button>
          <button onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} aria-controls="mobile-menu" className={`${icon} md:hidden`}>
            <Menu size={22} />
          </button>
        </div>
      </div>
      <MobileMenu open={open} onClose={close} />
    </header>
  )
}
