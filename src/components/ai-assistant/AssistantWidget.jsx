import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MessageCircle } from 'lucide-react'
import { useCart } from '../../hooks/useCart.js'
import useShoppingAssistant from '../../hooks/useShoppingAssistant.js'
import ChatHeader from './ChatHeader.jsx'
import ChatInput from './ChatInput.jsx'
import ChatMessages from './ChatMessages.jsx'

export default function AssistantWidget() {
  const [open, setOpen] = useState(false)
  const launcherRef = useRef(null)
  const { addItem } = useCart()
  const assistant = useShoppingAssistant(addItem)

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        launcherRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  const closeAssistant = () => {
    setOpen(false)
    requestAnimationFrame(() => launcherRef.current?.focus())
  }

  return (
    <>
      <button ref={launcherRef} type="button" onClick={() => setOpen((current) => !current)}
        aria-label={open ? 'Close shopping assistant' : 'Open Third Pocket shopping assistant'}
        aria-expanded={open} aria-controls="third-pocket-assistant"
        className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-forest text-ivory shadow-lg transition-colors hover:bg-charcoal focus-visible:outline-offset-4">
        <MessageCircle size={23} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.aside id="third-pocket-assistant" role="dialog" aria-label="Third Pocket AI shopping assistant"
            initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }} transition={{ duration: 0.18 }}
            className="fixed inset-x-2 bottom-2 z-50 flex h-[min(760px,calc(100dvh-1rem))] flex-col overflow-hidden rounded-lg border border-line bg-ivory shadow-2xl sm:inset-x-auto sm:bottom-24 sm:right-5 sm:h-[min(680px,calc(100dvh-7rem))] sm:w-[min(420px,calc(100vw-2.5rem))]">
            <ChatHeader onClose={closeAssistant} onNewConversation={assistant.newConversation} disabled={assistant.isLoading} />
            <ChatMessages messages={assistant.messages} isLoading={assistant.isLoading}
              onPrompt={assistant.submit} onAdd={(id) => addItem(id, 1)} onRetry={assistant.retry} />
            <ChatInput onSend={assistant.submit} disabled={assistant.isLoading} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
