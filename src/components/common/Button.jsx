import { motion } from 'motion/react'
import { Link } from 'react-router-dom'

const variants = {
  primary: 'bg-forest text-ivory hover:bg-charcoal',
  secondary: 'border border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory',
  gold: 'bg-gold text-charcoal hover:bg-charcoal hover:text-ivory',
}

const MotionLink = motion.create(Link)

export default function Button({ variant = 'primary', to, className = '', children, ...props }) {
  const classes = `inline-flex min-h-[44px] items-center justify-center gap-2 px-7 py-3 text-sm font-medium transition-colors ${variants[variant]} ${className}`
  if (to) {
    return (
      <MotionLink whileTap={{ scale: 0.97 }} to={to} className={classes} {...props}>
        {children}
      </MotionLink>
    )
  }
  return (
    <motion.button whileTap={{ scale: 0.97 }} className={classes} {...props}>
      {children}
    </motion.button>
  )
}
