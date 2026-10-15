import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProduct, products } from '../data/products.js'
import ProductDetails from '../components/products/ProductDetails.jsx'
import ProductGrid from '../components/products/ProductGrid.jsx'
import SectionHeading from '../components/common/SectionHeading.jsx'

export default function ProductPage() {
  const { id } = useParams()
  const product = getProduct(id)
  useEffect(() => { window.scrollTo(0, 0); if (product) document.title = `${product.name} | Third Pocket` }, [id, product])

  if (!product) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <h1 className="text-3xl">Product not found</h1>
        <Link to="/shop" className="mt-4 inline-block underline">Back to the shop</Link>
      </main>
    )
  }
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <ProductDetails key={product.id} product={product} />
      {related.length > 0 && (
        <section className="mt-20">
          <SectionHeading title="You may also like" />
          <div className="mt-8"><ProductGrid products={related} /></div>
        </section>
      )}
    </main>
  )
}
