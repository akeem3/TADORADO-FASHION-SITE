"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Define the product type
export type CartProduct = {
  id: number
  name: string
  price: number
  salePrice?: number
  image: string
  quantity: number
  category: string
  subCategory: string
}

type CartContextType = {
  cartItems: CartProduct[]
  addToCart: (product: CartProduct) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  cartCount: number
  cartTotal: number
}

// Initialize with default values to avoid undefined errors
const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartCount: 0,
  cartTotal: 0,
})

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartProduct[]>([])
  const [cartCount, setCartCount] = useState(0)
  const [cartTotal, setCartTotal] = useState(0)

  // Load cart from localStorage on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart")
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart)
          setCartItems(parsedCart)
        } catch (error) {
          console.error("Failed to parse cart from localStorage:", error)
        }
      }
    }
  }, [])

  // Update localStorage and cart metrics whenever cartItems changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cartItems))
    }

    // Calculate cart count and total
    const count = cartItems.reduce((total, item) => total + item.quantity, 0)
    const total = cartItems.reduce((sum, item) => {
      const price = item.salePrice || item.price
      return sum + price * item.quantity
    }, 0)

    setCartCount(count)
    setCartTotal(total)
  }, [cartItems])

  const addToCart = (product: CartProduct) => {
    setCartItems((prevItems) => {
      // Check if product already exists in cart
      const existingItemIndex = prevItems.findIndex((item) => item.id === product.id)

      if (existingItemIndex >= 0) {
        // Update quantity if product already exists
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += product.quantity
        return updatedItems
      } else {
        // Add new product to cart
        return [...prevItems, product]
      }
    })
  }

  const removeFromCart = (productId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems((prevItems) => prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCartItems([])
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  return context
}
