import { useContext } from 'react'
import { WishlistContext } from '../context/WishlistContext.jsx'
export const useWishlist = () => useContext(WishlistContext)
