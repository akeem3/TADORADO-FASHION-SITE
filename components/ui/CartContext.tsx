"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the product type
export type CartProduct = {
  id: number;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  quantity: number;
  category: string;
  subCategory: string;
  slug?: string;
};

interface CartStore {
  items: CartProduct[];
  addItem: (product: CartProduct) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getShipping: () => number;
  getFinalTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (
      set: (fn: (state: CartStore) => CartStore | Partial<CartStore>) => void,
      get: () => CartStore
    ) => ({
      items: [],

      addItem: (product: CartProduct) => {
        set((state: CartStore) => {
          const existingItem = state.items.find(
            (item: CartProduct) => item.id === product.id
          );

          if (existingItem) {
            // Update quantity if item exists
            return {
              items: state.items.map((item: CartProduct) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + product.quantity }
                  : item
              ),
            };
          } else {
            // Add new item
            return {
              items: [...state.items, product],
            };
          }
        });
      },

      removeItem: (productId: number) => {
        set((state: CartStore) => ({
          items: state.items.filter(
            (item: CartProduct) => item.id !== productId
          ),
        }));
      },

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state: CartStore) => ({
          items: state.items.map((item: CartProduct) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.reduce(
          (total: number, item: CartProduct) => total + item.quantity,
          0
        );
      },

      getSubtotal: () => {
        return get().items.reduce((total: number, item: CartProduct) => {
          const price = item.salePrice || item.price;
          return total + price * item.quantity;
        }, 0);
      },

      getTax: () => {
        // Calculate tax (example: 8.5% tax rate)
        const subtotal = get().getSubtotal();
        return subtotal * 0.085;
      },

      getShipping: () => {
        // Free shipping over $50, otherwise $5.99
        const subtotal = get().getSubtotal();
        return subtotal >= 50 ? 0 : 5.99;
      },

      getTotalPrice: () => {
        return get().getSubtotal();
      },

      getFinalTotal: () => {
        const subtotal = get().getSubtotal();
        const tax = get().getTax();
        const shipping = get().getShipping();
        return subtotal + tax + shipping;
      },
    }),
    {
      name: "cart-storage",

      partialize: (state) => ({ items: state.items }),
    }
  )
);

// Legacy context for backward compatibility
import type React from "react";
import { createContext, useContext } from "react";

type CartContextType = {
  cartItems: CartProduct[];
  addToCart: (product: CartProduct) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartCount: 0,
  cartTotal: 0,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    items: cartItems,
    addItem: addToCart,
    removeItem: removeFromCart,
    updateQuantity,
    clearCart,
    getItemCount,
    getTotalPrice,
  } = useCartStore();

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount: getItemCount(),
        cartTotal: getTotalPrice(),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  return context;
};
