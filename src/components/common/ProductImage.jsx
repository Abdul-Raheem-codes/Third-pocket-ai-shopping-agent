import { useState } from 'react'

// Shows a photo from /public/images. If the file is missing, shows a quiet tinted block with the name.
export default function ProductImage({ src, alt, tint = '#E5E2DB', className = '' }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div role="img" aria-label={alt} style={{ backgroundColor: tint }}
        className={`flex items-center justify-center p-4 text-center font-display text-lg text-charcoal/60 ${className}`}>
        {alt}
      </div>
    )
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />
}
