import { useState } from 'react'
import { Send } from 'lucide-react'

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('')

  const submit = (event) => {
    event.preventDefault()
    if (disabled || !value.trim()) return
    onSend(value)
    setValue('')
  }

  return (
    <form onSubmit={submit} className="border-t border-line bg-white p-3">
      <label htmlFor="assistant-message" className="sr-only">Message Third Pocket AI</label>
      <div className="flex items-end gap-2">
        <textarea id="assistant-message" rows={1} maxLength={2000} value={value} disabled={disabled} autoFocus
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              event.currentTarget.form?.requestSubmit()
            }
          }}
          placeholder="Ask about products, prices, or stock…"
          className="max-h-28 min-h-11 flex-1 resize-y rounded border border-line px-3 py-2.5 text-sm outline-none focus:border-gold disabled:bg-ivory" />
        <button type="submit" disabled={disabled || !value.trim()} aria-label="Send message"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-forest text-ivory hover:bg-charcoal disabled:bg-line disabled:text-charcoal/50">
          <Send size={17} />
        </button>
      </div>
      <p className="mt-1.5 text-[10px] text-charcoal/50">AI suggestions use the current sample catalogue and stock data.</p>
    </form>
  )
}
