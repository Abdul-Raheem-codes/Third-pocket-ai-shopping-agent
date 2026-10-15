// Navigation categories and the "Pieces Worth Keeping" collection cards.
const unsplash = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=85`

export const navLinks = [
  { label: 'Shop', to: '/shop' },
  { label: 'Watches', to: '/shop?category=watches' },
  { label: 'Wallets', to: '/shop?category=wallets' },
  { label: 'Sunglasses', to: '/shop?category=sunglasses' },
  { label: 'Bags', to: '/shop?category=bags' },
]

export const collections = [
  { id: 'watches', title: 'Watches', blurb: 'Everyday timepieces', image: unsplash('photo-1523275335684-37898b6baf30'), to: '/shop?category=watches', tint: '#DCE4D9' },
  { id: 'leather', title: 'Leather essentials', blurb: 'Wallets and belts', image: unsplash('photo-1627123424574-724758594e93'), to: '/shop?category=wallets,belts', tint: '#EFE6D3' },
  { id: 'sunglasses', title: 'Sunglasses', blurb: 'Frames for bright days', image: unsplash('photo-1511499767150-a48a237f0083'), to: '/shop?category=sunglasses', tint: '#DCE4D9' },
  { id: 'carry', title: 'Everyday carry', blurb: 'Bags, caps and more', image: unsplash('photo-1553062407-98eeb64c6a62'), to: '/shop?category=bags,caps', tint: '#EFE6D3' },
  { id: 'new', title: 'New arrivals', blurb: 'Just added', image: unsplash('photo-1548036328-c9fa89d128fa'), to: '/shop?filter=new', tint: '#DCE4D9' },
]

export const productCategories = [
  { id: 'watches', label: 'Watches' }, { id: 'wallets', label: 'Wallets' },
  { id: 'sunglasses', label: 'Sunglasses' }, { id: 'belts', label: 'Belts' },
  { id: 'bags', label: 'Bags and Backpacks' }, { id: 'bracelets', label: 'Bracelets' },
  { id: 'rings', label: 'Rings' }, { id: 'caps', label: 'Caps and Hats' },
]
