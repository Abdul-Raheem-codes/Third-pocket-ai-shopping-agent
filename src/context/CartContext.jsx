import { createContext, useReducer, useEffect, useState, useMemo, useCallback } from 'react'
import { getProduct } from '../data/products.js'

export const CartContext = createContext(null)
const KEY = 'third-pocket-cart'

const clamp = (id, qty) => { const p = getProduct(id); return p ? Math.max(0, Math.min(qty, p.stock)) : 0 }

function load() {
  try {
    return (JSON.parse(localStorage.getItem(KEY)) || [])
      .map((i) => ({ id: i.id, qty: clamp(i.id, i.qty) })).filter((i) => i.qty > 0)
  } catch { return [] }
}

function reducer(state, a) {
  switch (a.type) {
    case 'add': {
      const qty = clamp(a.id, (state.find((i) => i.id === a.id)?.qty || 0) + a.qty)
      if (!qty) return state
      return state.some((i) => i.id === a.id) ? state.map((i) => (i.id === a.id ? { ...i, qty } : i)) : [...state, { id: a.id, qty }]
    }
    case 'set': {
      const qty = clamp(a.id, a.qty)
      return qty ? state.map((i) => (i.id === a.id ? { ...i, qty } : i)) : state.filter((i) => i.id !== a.id)
    }
    case 'remove': return state.filter((i) => i.id !== a.id)
    default: return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, [], load)
  const [isOpen, setOpen] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(items)) } catch { /* storage unavailable */ } }, [items])
  useEffect(() => { if (!notice) return; const t = setTimeout(() => setNotice(''), 2500); return () => clearTimeout(t) }, [notice])

  const addItem = useCallback((id, qty = 1) => {
    const p = getProduct(id)
    const inCart = items.find((i) => i.id === id)?.qty || 0
    if (!p || p.stock <= 0) {
      const message = 'This item is sold out'
      setNotice(message)
      return { success: false, message }
    }
    if (inCart + qty > p.stock) {
      const message = `Only ${p.stock} in stock. Cart updated to the maximum.`
      setNotice(message)
      dispatch({ type: 'add', id, qty })
      return { success: false, message }
    }
    setNotice(`${p.name} added to cart`)
    dispatch({ type: 'add', id, qty })
    return { success: true, message: `${p.name} added to cart` }
  }, [items])

  const value = useMemo(() => {
    const lines = items.map((i) => ({ ...i, product: getProduct(i.id) }))
    return {
      lines, isOpen, notice, addItem,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.qty * l.product.price, 0),
      setQty: (id, qty) => dispatch({ type: 'set', id, qty }),
      removeItem: (id) => dispatch({ type: 'remove', id }),
      open: () => setOpen(true), close: () => setOpen(false),
    }
  }, [items, isOpen, notice, addItem])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
