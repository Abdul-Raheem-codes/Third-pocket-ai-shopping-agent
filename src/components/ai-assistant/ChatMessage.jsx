import RecommendedProductCard from './RecommendedProductCard.jsx'

const toolLabels = {
  search_products: 'Searched the catalogue',
  get_product_info: 'Looked up product details',
  check_stock: 'Checked catalogue stock',
  compare_products: 'Compared products',
  calculate_total: 'Calculated the total',
  add_to_cart: 'Added product to cart',
}

export default function ChatMessage({ message, onAdd, onRetry }) {
  const isUser = message.role === 'user'
  return (
    <article className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[92%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {!!message.activities?.length && (
          <ul className="mb-2 space-y-1 text-xs text-charcoal/60" aria-label="Assistant tool activity">
            {message.activities.map((activity) => (
              <li key={activity.id} className="flex items-center gap-1.5">
                <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${activity.status === 'error' ? 'bg-red-500' : 'bg-gold'}`} />
                {toolLabels[activity.tool] || 'Used a shopping tool'}
                {activity.status === 'waiting' ? '…' : activity.status === 'error' ? ' (could not complete)' : ''}
              </li>
            ))}
          </ul>
        )}
        <div className={`whitespace-pre-wrap break-words rounded px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser ? 'bg-forest text-ivory' : message.error ? 'border border-red-200 bg-white text-red-800' : 'border border-line bg-white'
        }`}>
          {message.content}
        </div>
        {message.error && <button type="button" onClick={onRetry} className="mt-2 text-xs font-medium text-forest underline">Retry</button>}
        {!!message.products?.length && (
          <div className="mt-2 grid w-full gap-2">
            {message.products.map((product) => <RecommendedProductCard key={product.id} product={product} onAdd={onAdd} />)}
          </div>
        )}
      </div>
    </article>
  )
}
