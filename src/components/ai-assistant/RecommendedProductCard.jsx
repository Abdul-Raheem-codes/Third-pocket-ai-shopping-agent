import { Link } from 'react-router-dom'
import { productCategories } from '../../data/categories.js'
import { getProduct } from '../../data/products.js'
import { formatPrice } from '../../utils/formatPrice.js'
import ProductImage from '../common/ProductImage.jsx'

export default function RecommendedProductCard({ product: result, onAdd }) {
  const product = result && getProduct(result.id)
  if (!product) return null
  const stock = product.stock <= 0 ? 'Sold out' : product.stock <= 5 ? `Only ${product.stock} left` : 'In stock'

  return (
    <article className="overflow-hidden rounded border border-line bg-white">
      <Link to={`/product/${product.id}`} className="block">
        <ProductImage src={product.image} alt={product.name} className="aspect-[2/1] w-full object-cover" />
      </Link>
      <div className="p-3">
        <p className="text-xs text-charcoal/60">{productCategories.find(({ id }) => id === product.category)?.label || product.category}</p>
        <h3 className="mt-1 text-base font-medium">{product.name}</h3>
        <div className="mt-1 flex items-center justify-between gap-2 text-sm">
          <span className="font-medium">{formatPrice(product.price)}</span>
          <span className="text-xs text-charcoal/65">{stock}</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link to={`/product/${product.id}`} className="flex min-h-10 items-center justify-center border border-line px-2 text-xs hover:bg-ivory">View Product</Link>
          <button type="button" onClick={() => onAdd(product.id)} disabled={product.stock <= 0}
            className="min-h-10 bg-forest px-2 text-xs text-ivory hover:bg-charcoal disabled:bg-line disabled:text-charcoal/50">
            {product.stock <= 0 ? 'Sold out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  )
}
