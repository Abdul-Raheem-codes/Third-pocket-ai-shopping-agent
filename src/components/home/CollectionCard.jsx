import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import ProductImage from '../common/ProductImage.jsx'

// Folder-shaped card: a small tab sits above the body. Lifts on hover.
export default function CollectionCard({ collection }) {
  return (
    <motion.div className="group relative pt-4" initial="rest" whileHover="hover" whileFocus="hover"
      variants={{ rest: { y: 0 }, hover: { y: -8 } }} transition={{ duration: 0.25 }}>
      <div className="absolute left-0 top-0 h-5 w-24 rounded-t-md border border-b-0 border-line"
        style={{ backgroundColor: collection.tint }} aria-hidden="true" />
      <Link to={collection.to}
        className="block overflow-hidden rounded-b-md rounded-tr-md border border-line bg-white shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
        <div className="overflow-hidden">
          <ProductImage src={collection.image} alt={collection.title} tint={collection.tint}
            className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="flex items-center justify-between p-5">
          <div>
            <h3 className="text-xl">{collection.title}</h3>
            <p className="mt-1 text-sm text-charcoal/60">{collection.blurb}</p>
          </div>
          <ArrowRight size={20} className="text-forest transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  )
}
