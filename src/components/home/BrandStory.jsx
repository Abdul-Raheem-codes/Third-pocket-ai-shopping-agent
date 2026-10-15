import { motion } from 'motion/react'
import SectionHeading from '../common/SectionHeading.jsx'

export default function BrandStory() {
  return (
    <motion.section className="mt-24 bg-sage/60"
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.65, ease: 'easeOut' }}>
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-20 sm:px-8 md:grid-cols-2">
        <SectionHeading title="Less, But Better." />
        <p className="max-w-lg text-lg leading-relaxed text-charcoal/80">
          Third Pocket is a small, considered range of men's accessories. We choose fewer pieces, in materials that wear well and shapes that stay out of the way, so the things you carry every day are the ones you never think twice about.
        </p>
      </div>
    </motion.section>
  )
}
