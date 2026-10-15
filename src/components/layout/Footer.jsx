import { Link } from 'react-router-dom'
import { navLinks } from '../../data/categories.js'

export default function Footer() {
  return (
    <footer className="mt-24 bg-charcoal text-ivory">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:justify-between">
        <div className="max-w-xs">
          <p className="font-display text-2xl">Third Pocket</p>
          <p className="mt-3 text-sm leading-relaxed text-ivory/70">Men's accessories, thoughtfully selected.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          {navLinks.map((l) => (
            <Link key={l.label} to={l.to} className="text-ivory/80 hover:text-gold">{l.label}</Link>
          ))}
        </nav>
      </div>
      <p className="border-t border-ivory/10 px-5 py-5 text-center text-xs text-ivory/60">
        © {new Date().getFullYear()} Third Pocket
      </p>
    </footer>
  )
}
