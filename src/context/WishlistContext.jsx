import { createContext, useState, useEffect, useMemo } from 'react'
import { getProduct } from '../data/products.js'

export const WishlistContext = createContext(null)
const KEY = 'third-pocket-wishlist'

function load() {
  try { return (JSON.parse(localStorage.getItem(KEY)) || []).filter((id) => getProduct(id)) } catch { return [] }
}

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(load)
  const [isOpen, setOpen] = useState(false)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(ids)) } catch { /* storage unavailable */ } }, [ids])

  const value = useMemo(() => ({
    products: ids.map(getProduct), count: ids.length, isOpen,
    has: (id) => ids.includes(id),
    toggle: (id) => setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id])),
    remove: (id) => setIds((cur) => cur.filter((x) => x !== id)),
    open: () => setOpen(true), close: () => setOpen(false),
  }), [ids, isOpen])

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
