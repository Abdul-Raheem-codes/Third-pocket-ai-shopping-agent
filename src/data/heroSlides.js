// Hero slides: product details plus the colour theme applied while the slide is active.
const unsplash = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`

export const heroSlides = [
  {
    id: 'watch',
    name: 'Field Automatic',
    category: 'Watches',
    price: 285,
    note: 'Brushed steel case, sapphire glass, horween-style leather strap.',
    image: unsplash('photo-1523275335684-37898b6baf30'),
    to: '/shop?category=watches',
    theme: { bg: '#0F1B2D', bgEnd: '#2B4570', text: '#F7F5F0', accent: '#D4B26A' },
  },
  {
    id: 'wallet',
    name: 'Slim Bifold Wallet',
    category: 'Wallets',
    price: 95,
    note: 'Full-grain leather with six card slots and a flat profile.',
    image: unsplash('photo-1627123424574-724758594e93'),
    to: '/shop?category=wallets',
    theme: { bg: '#3A1418', bgEnd: '#7A3238', text: '#F7F5F0', accent: '#E0BC80' },
  },
  {
    id: 'sunglasses',
    name: 'Meridian Aviator',
    category: 'Sunglasses',
    price: 145,
    note: 'Lightweight metal frame with polarised lenses.',
    image: unsplash('photo-1511499767150-a48a237f0083'),
    to: '/shop?category=sunglasses',
    theme: { bg: '#E6D2B0', bgEnd: '#F7F5F0', text: '#252824', accent: '#7A4E1D' },
  },
  {
    id: 'bag',
    name: 'Structured Weekender',
    category: 'Bags and Backpacks',
    price: 320,
    note: 'Waxed canvas body, leather trim, room for two days away.',
    image: unsplash('photo-1553062407-98eeb64c6a62'),
    to: '/shop?category=bags',
    theme: { bg: '#1E2A33', bgEnd: '#4A6477', text: '#F7F5F0', accent: '#E0A878' },
  },
]
