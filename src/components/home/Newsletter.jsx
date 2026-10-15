import { useState } from 'react'
import { motion } from 'motion/react'
import SectionHeading from '../common/SectionHeading.jsx'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const submit = (e) => { e.preventDefault(); setDone(true); setEmail('') }
  return (
    <motion.section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8"
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
      <SectionHeading title="Stay in the loop" subtitle="New pieces and restocks, occasionally." />
      <form onSubmit={submit} className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
        <label className="flex-1"><span className="sr-only">Email address</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
            className="min-h-[44px] w-full border border-line bg-white px-3 text-sm" /></label>
        <button type="submit" className="min-h-[44px] bg-forest px-6 text-sm font-medium text-ivory hover:bg-charcoal">Subscribe</button>
      </form>
      <p role="status" className="mt-3 text-sm text-charcoal/70">{done ? 'Thanks. This is a demo form, so nothing was sent.' : ''}</p>
    </motion.section>
  )
}
