import { collections } from '../../data/categories.js'
import { motion } from 'motion/react'
import SectionHeading from '../common/SectionHeading.jsx'
import CollectionCard from './CollectionCard.jsx'

export default function CollectionSection() {
  return (
    <motion.section className="mx-auto max-w-7xl px-5 pt-20 sm:px-8"
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
      <SectionHeading title="Pieces Worth Keeping" subtitle="Start with the category you reach for every day." />
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => <CollectionCard key={c.id} collection={c} />)}
      </div>
    </motion.section>
  )
}
