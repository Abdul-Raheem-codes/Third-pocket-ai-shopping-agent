# Third Pocket

Premium men's accessories storefront (demo). React + Vite, Tailwind CSS 3, Motion, Lucide, React Router 6.

## Run
    npm install
    npm run dev
Do not run `npm audit fix --force`; it upgrades Vite, Tailwind and React Router to breaking majors.

## AI shopping assistant

The floating **Third Pocket AI** assistant uses Groq tool calling through a small Express API. The Groq key stays on the server and is never sent to Vite or the browser.

### Setup and start

1. Install dependencies with `npm install`. To add the API dependencies manually instead, run `npm install express groq-sdk dotenv cors express-rate-limit`.
2. Copy `.env.example` to `.env` in the project root and set `GROQ_API_KEY` to a key from your Groq account. Alternatively, copy `server/.env.example` to `server/.env`. Do not use a `VITE_` prefix or commit either `.env` file.
3. Set `GROQ_MODEL` to a model available to your account that supports tool calling. The default is `llama-3.3-70b-versatile`; change it in `.env` if needed. `AGENT_MAX_TOOL_ROUNDS` limits tool-call rounds (default 5, maximum 8).
4. Start the API in one terminal with `npm run server:dev`.
5. Start the website in another terminal with `npm run dev`.

The Vite development server proxies `/api` requests to `http://localhost:3001`. `PORT` changes the API port; update the proxy in `vite.config.js` if you use a different port. For a separate production frontend origin, configure `CORS_ORIGIN` as a comma-separated allowlist of exact origins.

### Tool-calling architecture

`server/agent/agentLoop.js` calls Groq with server-side instructions and JSON-schema tool definitions. An explicit allowlist dispatches to separate tool implementations under `server/agent/tools/`. Those tools import the same catalogue and existing filter function as the storefront; product details, availability, and totals come from that dataset rather than the model.

The agent can:

- Search products by text, category, budget, colour, and stock.
- Retrieve product details and check actual catalogue stock.
- Compare two to four products and calculate quantity-based totals, subject to stock limits.
- Request an explicit, unambiguous cart addition. The browser performs the existing cart action; the agent only confirms it after the browser reports success.

The assistant returns validated catalogue products for the UI to render as cards. Cart additions use a two-step handoff: the server validates an explicit add-to-cart request, then the browser calls the existing `CartContext` action and reports its actual result before the agent can confirm success. The API applies request-size and per-IP rate limits, restricts CORS, validates message and tool arguments, and bounds its tool loop.

### API and limits

- `GET /health` returns the API health status.
- `POST /api/agent/chat` accepts `{ "messages": [{ "role": "user" | "assistant", "content": "..." }], "productIds": ["..."] }`. Send 1–12 messages, each with non-empty content of at most 2,000 characters. `productIds` is optional and may contain up to eight valid catalogue IDs previously shown by the assistant.
- `POST /api/agent/continue` completes a pending cart handoff with `{ "actionId": "...", "result": { "success": true | false, "message": "..." } }`. The action ID is short-lived and only exists in the running server's memory; pending actions expire after five minutes and are lost if the API restarts.
- JSON request bodies are limited to 32 KB. The API allows 20 assistant requests per client IP per 15 minutes. The agent runs at most five tool-call rounds by default; `AGENT_MAX_TOOL_ROUNDS` can set this from 1 to 8.
- `CORS_ORIGIN` is a comma-separated list of exact allowed origins. By default, the API allows `http://localhost:5173` and `http://127.0.0.1:5173`. The Vite proxy forwards `/api` to port 3001; if `PORT` changes, update `vite.config.js` as well.

Try prompts such as “Find a black wallet under $60,” “Is the Travel Organiser in stock?”, “Compare the Field Automatic and Minimal Quartz,” or “Add the Everyday Cardholder to my cart.” Automated catalogue/tool checks and the production bundle can be run with:

    npm run test:agent
    npm run build

`npm run test:agent` runs the Node.js tests for catalogue tools, cart-intent validation, and conversation validation. It does not call Groq; a Groq API key is needed to run the assistant interactively.

The catalogue and stock are still frontend sample data. A production shop should move product and inventory reads to an authoritative server-side source before relying on these tool results. The cart action handoff is for this local-cart demo, not a substitute for authenticated checkout or order processing.

### Troubleshooting

- **Assistant cannot connect:** make sure `npm run server:dev` is running on the configured `PORT`, then restart Vite after changing its proxy target.
- **Groq key or model error:** check the root `.env`, confirm the key is valid, and select a tool-calling model enabled for your Groq account. Restart the API after editing `.env`.
- **CORS rejected:** access the site from an origin listed in `CORS_ORIGIN`; development defaults allow the localhost and 127.0.0.1 Vite origins.
- **Rate limited:** wait for the 15-minute window to pass; the demo permits 20 API requests per client IP in that window.

## Structure
- `src/data/` products (24), categories, hero slides. All content lives here.
- `src/utils/` `filterProducts`, `sortProducts`, `formatPrice`: pure functions, no UI.
- `src/context/` + `src/hooks/` cart and wishlist state, persisted to localStorage, stock-validated.
- `src/components/` layout, home, products, cart, wishlist, common.
- `src/pages/` Home, Shop, ProductPage.
- `server/` Groq API, allowlisted tools, and focused agent tests.

## Images
The demo uses sample photos served by Unsplash. Replace the image URLs in `src/data/heroSlides.js`, `src/data/categories.js` and `src/data/products.js` with local photos if preferred. Missing images show a tinted fallback with the product name.

## Features
Hero carousel (auto, manual, indicators, themes, pause, reduced motion), scroll-reveal section and product animations, collection cards, search, category/price/colour/stock/new/bestseller/sale filters, sorting, active filter chips, empty states, product page with colour and quantity, related products, cart and wishlist drawers with counts, toast, newsletter demo, mobile menu, and the Groq-powered shopping assistant.

## Limitations
No checkout, auth, or payments. The assistant API is not a full e-commerce backend; catalogue and stock data are sample frontend data. No 360-degree view (needs multi-angle photos). Brand filter not included (single brand).
