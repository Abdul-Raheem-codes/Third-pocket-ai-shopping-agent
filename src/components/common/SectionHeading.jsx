export default function SectionHeading({ title, subtitle, align = 'left' }) {
  const alignment = align === 'center' ? 'text-center mx-auto' : ''
  return (
    <header className={`max-w-xl ${alignment}`}>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-charcoal/70">{subtitle}</p>}
    </header>
  )
}
