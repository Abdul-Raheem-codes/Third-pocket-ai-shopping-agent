import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import { navLinks } from '../../data/categories.js'

export default function MobileMenu({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-40 bg-charcoal/50" onClick={onClose}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.nav id="mobile-menu" aria-label="Mobile" role="dialog" aria-modal="true"
            className="fixed inset-y-0 right-0 z-50 flex w-[80%] max-w-sm flex-col bg-ivory p-6"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}>
            <button onClick={onClose} aria-label="Close menu" className="mb-8 flex h-11 w-11 items-center justify-center self-end">
              <X size={22} />
            </button>
            {navLinks.map((l) => (
              <Link key={l.label} to={l.to} onClick={onClose}
                className="border-b border-line py-4 font-display text-2xl">{l.label}</Link>
            ))}
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}
