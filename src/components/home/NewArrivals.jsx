import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { products } from '../../data/products.js'
import SectionHeading from '../common/SectionHeading.jsx'
import ProductGrid from '../products/ProductGrid.jsx'

export default function NewArrivals() {
  return (
    <motion.section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8"
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading title="New Arrivals" />
        <Link to="/shop?filter=new" className="text-sm underline">View all new arrivals</Link>
      </div>
      <div className="mt-8"><ProductGrid products={products.filter((p) => p.isNew).slice(0, 4)} /></div>
    </motion.section>
  )
}
