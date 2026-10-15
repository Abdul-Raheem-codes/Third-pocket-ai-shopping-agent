export function sortProducts(list, sort) {
  const copy = [...list]
  switch (sort) {
    case 'newest': return copy.sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    case 'price-asc': return copy.sort((a, b) => a.price - b.price)
    case 'price-desc': return copy.sort((a, b) => b.price - a.price)
    default: return copy
  }
}
