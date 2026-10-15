import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { heroSlides } from '../../data/heroSlides.js'
import HeroSlide from './HeroSlide.jsx'

const INTERVAL_MS = 6000

export default function HeroCarousel() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)
  const reduceMotion = useReducedMotion()
  const slide = heroSlides[index]
  const { theme } = slide

  const go = (next, dir) => {
    setDirection(dir)
    setIndex((next + heroSlides.length) % heroSlides.length)
  }

  // Auto-advance. Re-runs on every index change, so manual navigation restarts the timer.
  // Disabled while the user hovers/focuses the hero, and under reduced motion.
  useEffect(() => {
    if (paused || reduceMotion) return
    const t = setTimeout(() => go(index + 1, 1), INTERVAL_MS)
    return () => clearTimeout(t)
  }, [index, paused, reduceMotion])

  const arrow = 'flex h-11 w-11 items-center justify-center border transition-colors hover:opacity-70'

  return (
    <motion.section className="relative isolate min-h-[85svh] overflow-hidden"
      aria-roledescription="carousel" aria-label="Featured products"
      animate={{ backgroundColor: theme.bg, color: theme.text }} transition={{ duration: 0.8 }}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}>
      <AnimatePresence initial={false}>
        <motion.div key={slide.id} aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ backgroundImage: `linear-gradient(120deg, ${theme.bg}, ${theme.bgEnd})` }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.8, ease: 'easeInOut' }} />
      </AnimatePresence>
      <div className="relative z-10 mx-auto flex min-h-[85svh] w-full max-w-7xl flex-col justify-center px-5 py-6 sm:px-8 md:py-8">
        <div aria-live={paused ? 'polite' : 'off'}>
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <HeroSlide key={slide.id} slide={slide} direction={direction} />
          </AnimatePresence>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <button onClick={() => go(index - 1, -1)} aria-label="Previous product" className={arrow}
            style={{ borderColor: theme.text }}><ChevronLeft size={20} /></button>
          <button onClick={() => go(index + 1, 1)} aria-label="Next product" className={arrow}
            style={{ borderColor: theme.text }}><ChevronRight size={20} /></button>
          <div className="ml-2 flex gap-1">
            {heroSlides.map((s, i) => (
              <button key={s.id} onClick={() => go(i, i > index ? 1 : -1)} aria-label={`Show ${s.name}`}
                aria-current={i === index} className="flex h-11 w-8 items-center justify-center">
                <span className="block h-[3px] w-6 transition-opacity"
                  style={{ backgroundColor: theme.text, opacity: i === index ? 1 : 0.3 }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
