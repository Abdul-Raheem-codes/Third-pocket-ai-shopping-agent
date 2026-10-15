import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import CartDrawer from './components/cart/CartDrawer.jsx'
import WishlistDrawer from './components/wishlist/WishlistDrawer.jsx'
import Toast from './components/common/Toast.jsx'
import AssistantWidget from './components/ai-assistant/AssistantWidget.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import ProductPage from './pages/ProductPage.jsx'

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="*" element={<main className="mx-auto max-w-7xl px-5 py-24 sm:px-8"><h1 className="text-3xl">Page not found</h1></main>} />
        </Routes>
        <Footer />
        <CartDrawer />
        <WishlistDrawer />
        <Toast />
        <AssistantWidget />
      </WishlistProvider>
    </CartProvider>
  )
}
