import { useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage.jsx'

const prompts = [
  'Find watches under $100.',
  'Show me black leather wallets.',
  'Recommend accessories for everyday use.',
  'Compare two watches.',
  'Check the availability of a product.',
]

export default function ChatMessages({ messages, isLoading, onPrompt, onAdd, onRetry }) {
  const bottomRef = useRef(null)
  const showPrompts = messages.length === 1 && !isLoading

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4">
      <div className="space-y-4" aria-live="polite" aria-relevant="additions text">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} onAdd={onAdd} onRetry={onRetry} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-charcoal/65" role="status" aria-label="Assistant is thinking">
            <span className="flex gap-1" aria-hidden="true">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold [animation-delay:300ms]" />
            </span>
            Thinking…
          </div>
        )}
        {showPrompts && (
          <div className="pt-1">
            <p className="mb-2 text-xs text-charcoal/60">Try asking</p>
            <div className="flex flex-wrap gap-2">
              {prompts.map((prompt) => (
                <button type="button" key={prompt} onClick={() => onPrompt(prompt)}
                  className="rounded-full border border-line bg-white px-3 py-2 text-left text-xs transition-colors hover:border-forest">
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div ref={bottomRef} />
    </div>
  )
}
