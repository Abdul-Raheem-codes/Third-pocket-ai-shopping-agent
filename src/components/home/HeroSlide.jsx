import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { Link } from 'react-router-dom'
import ProductImage from '../common/ProductImage.jsx'
import { formatPrice } from '../../utils/formatPrice.js'

// One product panel. Remounted (via key) on each change so image and text animate in.
export default function HeroSlide({ slide, direction }) {
  const { theme } = slide
  const reduceMotion = useReducedMotion()
  const targetRotateX = useMotionValue(0)
  const targetRotateY = useMotionValue(0)
  const rotateX = useSpring(targetRotateX, { stiffness: 180, damping: 22 })
  const rotateY = useSpring(targetRotateY, { stiffness: 180, damping: 22 })

  const tiltImage = (event) => {
    if (reduceMotion || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    targetRotateX.set(-y * 12)
    targetRotateY.set(x * 12)
  }

  const resetTilt = () => {
    targetRotateX.set(0)
    targetRotateY.set(0)
  }

  return (
    <motion.div className="grid items-center gap-6 md:grid-cols-2 md:gap-10"
      initial={{ opacity: 0, x: 40 * direction }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 * direction }} transition={{ duration: 0.5, ease: 'easeOut' }}>
      <div className="order-2 md:order-1">
        <h1 className="max-w-xl text-4xl leading-[1.05] sm:text-5xl">The Details Make the Man.</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed opacity-80 sm:text-base">
          Thoughtfully selected accessories. Timeless design. Everyday distinction.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/shop" className="inline-flex min-h-[44px] items-center px-6 text-sm font-medium"
            style={{ backgroundColor: theme.accent, color: theme.bg }}>Shop Collection</Link>
          <Link to="/shop?filter=bestsellers" className="inline-flex min-h-[44px] items-center border px-6 text-sm font-medium"
            style={{ borderColor: theme.text }}>Explore Bestsellers</Link>
        </div>
        <div className="mt-6 border-t pt-5" style={{ borderColor: `${theme.text}33` }}>
        <p className="text-sm" style={{ color: theme.accent }}>{slide.category}</p>
        <h2 className="mt-1 text-2xl sm:text-3xl">{slide.name}</h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed opacity-80">{slide.note}</p>
        <Link to={slide.to} className="mt-4 inline-block border-b pb-1 text-sm font-medium"
          style={{ borderColor: theme.accent }}>
          {formatPrice(slide.price)} · View {slide.category.toLowerCase()}
        </Link>
        </div>
      </div>
      <div className="order-1 md:order-2 [perspective:1100px]">
        <motion.div className="relative"
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          onPointerMove={tiltImage} onPointerLeave={resetTilt}
          whileHover={reduceMotion ? undefined : { y: -8, scale: 1.025 }}
          transition={{ type: 'spring', stiffness: 180, damping: 20 }}>
          <div aria-hidden="true" className="absolute -inset-4 -z-10 rounded-full opacity-20 blur-3xl"
            style={{ backgroundColor: theme.accent }} />
          <ProductImage src={slide.image} alt={slide.name} tint={theme.accent + '33'}
            className="aspect-[4/3] w-full rounded-sm shadow-2xl md:aspect-[16/10]" />
        </motion.div>
      </div>
    </motion.div>
  )
}
