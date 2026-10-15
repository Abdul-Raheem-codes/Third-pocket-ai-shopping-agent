// Sample catalogue. Photos live in public/images/products/<id>.jpg (a tinted fallback shows if missing).
// Row: [name, category, price, originalPrice, colors, stock, isNew, isBestseller, description]
const sampleImages = {
  watches: ['photo-1523275335684-37898b6baf30', 'photo-1524592094714-0f0654e20314'],
  wallets: ['photo-1627123424574-724758594e93', 'photo-1622560480654-d96214fdc887'],
  sunglasses: ['photo-1511499767150-a48a237f0083', 'photo-1572635196237-14b3f281503f'],
  belts: ['photo-1627123424574-724758594e93', 'photo-1548036328-c9fa89d128fa'],
  bags: ['photo-1553062407-98eeb64c6a62', 'photo-1548036328-c9fa89d128fa'],
  bracelets: ['photo-1611591437281-460bfbe1220a'],
  rings: ['photo-1605100804763-247f67b3557e'],
  caps: ['photo-1521369909029-2afed882baee'],
}

const rows = [
  ['Field Automatic', 'watches', 285, null, ['Steel', 'Black'], 8, false, true, 'Automatic movement, brushed steel case and sapphire glass on a leather strap.'],
  ['Minimal Quartz', 'watches', 165, null, ['Silver', 'Black'], 14, true, false, 'A thin three-hand quartz watch with a clean ivory dial.'],
  ['Chronograph Steel', 'watches', 340, 395, ['Steel'], 3, false, false, 'Stainless steel chronograph with a tachymeter bezel.'],
  ['Slim Bifold Wallet', 'wallets', 95, null, ['Brown', 'Black'], 20, false, true, 'Full-grain leather with six card slots and a flat profile.'],
  ['Everyday Cardholder', 'wallets', 55, null, ['Tan', 'Black'], 30, true, false, 'Four-slot cardholder that fits a front pocket without bulk.'],
  ['Travel Organiser', 'wallets', 120, null, ['Brown'], 0, false, false, 'Passport, cards and boarding pass in one zip-around case.'],
  ['Meridian Aviator', 'sunglasses', 145, null, ['Gold', 'Black'], 12, false, true, 'Lightweight metal frame with polarised lenses.'],
  ['Matte Wayfarer', 'sunglasses', 120, 150, ['Black', 'Olive'], 9, false, false, 'Matte acetate frame with UV400 lenses.'],
  ['Round Tortoise', 'sunglasses', 135, null, ['Tortoise'], 6, true, false, 'Round acetate frames in a warm tortoiseshell finish.'],
  ['Classic Leather Belt', 'belts', 70, null, ['Brown', 'Black'], 25, false, true, 'Vegetable-tanned leather with a solid brass buckle.'],
  ['Woven Belt', 'belts', 55, null, ['Navy', 'Olive'], 18, false, false, 'Flexible woven belt for casual wear.'],
  ['Reversible Dress Belt', 'belts', 85, null, ['Black', 'Brown'], 10, true, false, 'Black on one side, brown on the other, with a rotating buckle.'],
  ['Structured Weekender', 'bags', 320, null, ['Olive', 'Charcoal'], 5, false, false, 'Waxed canvas body with leather trim, sized for two days away.'],
  ['Everyday Backpack', 'bags', 180, null, ['Black', 'Navy'], 16, false, true, 'Padded laptop sleeve, water-resistant fabric and a clean silhouette.'],
  ['Leather Messenger', 'bags', 240, null, ['Brown'], 4, true, false, 'Slim messenger bag in soft full-grain leather.'],
  ['Braided Leather Bracelet', 'bracelets', 45, null, ['Brown', 'Black'], 40, false, false, 'Hand-braided leather with a magnetic steel clasp.'],
  ['Steel Cuff', 'bracelets', 65, null, ['Silver'], 15, true, false, 'A polished stainless steel cuff with an open back.'],
  ['Onyx Bead Bracelet', 'bracelets', 50, 65, ['Black'], 11, false, false, 'Matte onyx beads on stretch cord.'],
  ['Signet Ring', 'rings', 110, null, ['Silver', 'Gold'], 7, false, false, 'Oval signet ring in solid sterling silver.'],
  ['Band Ring', 'rings', 80, null, ['Silver', 'Gold'], 22, false, true, 'A narrow brushed band, made to wear every day.'],
  ['Textured Steel Ring', 'rings', 70, null, ['Steel'], 13, true, false, 'Hammered-texture stainless steel ring.'],
  ['Wool Flat Cap', 'caps', 60, null, ['Grey', 'Olive'], 12, false, false, 'Eight-panel flat cap in soft wool tweed.'],
  ['Six-Panel Cap', 'caps', 40, null, ['Navy', 'Tan', 'Black'], 35, false, true, 'Cotton twill cap with an adjustable leather strap.'],
  ['Waxed Bucket Hat', 'caps', 55, null, ['Olive'], 0, true, false, 'Water-resistant waxed cotton bucket hat.'],
]

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const categoryImageIndexes = {}

export const products = rows.map(([name, category, price, originalPrice, colors, stock, isNew, isBestseller, description], i) => {
  const images = sampleImages[category]
  const imageIndex = categoryImageIndexes[category] ?? 0
  categoryImageIndexes[category] = imageIndex + 1

  return {
    id: slug(name), name, category, price, originalPrice, colors, stock, isNew, isBestseller, description,
    brand: 'Third Pocket',
    image: `https://images.unsplash.com/${images[imageIndex % images.length]}?auto=format&fit=crop&w=900&q=85`,
    addedAt: new Date(2026, 8, 30 - i).toISOString(),
  }
})

export const getProduct = (id) => products.find((p) => p.id === id)
