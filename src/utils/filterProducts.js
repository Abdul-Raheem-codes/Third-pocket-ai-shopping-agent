import { productCategories } from '../data/categories.js'

export const emptyFilters = {
  search: '', categories: [], min: '', max: '', colors: [],
  inStock: false, isNew: false, bestseller: false, sale: false, sort: 'featured',
}

const labelOf = (id) => productCategories.find((c) => c.id === id)?.label || id

export function filterProducts(list, f) {
  const q = f.search.trim().toLowerCase()
  const min = f.min === '' ? 0 : Number(f.min)
  const max = f.max === '' ? Infinity : Number(f.max)
  return list.filter((p) => {
    if (q && ![p.name, p.brand, p.category, labelOf(p.category), p.description].join(' ').toLowerCase().includes(q)) return false
    if (f.categories.length && !f.categories.includes(p.category)) return false
    if (p.price < min || p.price > max) return false
    if (f.colors.length && !p.colors.some((c) => f.colors.includes(c))) return false
    if (f.inStock && p.stock <= 0) return false
    if (f.isNew && !p.isNew) return false
    if (f.bestseller && !p.isBestseller) return false
    if (f.sale && !(p.originalPrice > p.price)) return false
    return true
  })
}
