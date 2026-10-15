import { MessageSquarePlus, X } from 'lucide-react'

export default function ChatHeader({ onClose, onNewConversation, disabled }) {
  return (
    <header className="flex items-center justify-between border-b border-line bg-white px-4 py-3">
      <div>
        <h2 className="font-display text-xl">Third Pocket AI</h2>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-charcoal/65">
          <span className="h-2 w-2 rounded-full bg-forest" aria-hidden="true" />
          Your personal shopping assistant
        </p>
      </div>
      <div className="flex items-center">
        <button type="button" onClick={onNewConversation} disabled={disabled} aria-label="Start a new conversation"
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-ivory disabled:opacity-50">
          <MessageSquarePlus size={18} />
        </button>
        <button type="button" onClick={onClose} aria-label="Close shopping assistant"
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-ivory">
          <X size={20} />
        </button>
      </div>
    </header>
  )
}
