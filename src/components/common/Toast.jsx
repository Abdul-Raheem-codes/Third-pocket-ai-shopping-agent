import { motion, AnimatePresence } from 'motion/react'
import { useCart } from '../../hooks/useCart.js'

export default function Toast() {
  const { notice } = useCart()
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
      <AnimatePresence>
        {notice && (
          <motion.p key={notice} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            className="bg-charcoal px-5 py-3 text-sm text-ivory shadow-lg">{notice}</motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
