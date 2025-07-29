"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, type CartProduct } from "@/components/ui/CartContext";
import { motion, AnimatePresence } from "framer-motion";

interface AddToCartButtonProps {
  product: {
    id: number;
    name: string;
    price: number;
    salePrice?: number;
    image: string;
    category: string;
    subCategory: string;
  };
  quantity?: number;
  showQuantity?: boolean;
  className?: string;
}

export default function AddToCartButton({
  product,
  quantity = 1,
  showQuantity = false,
  className = "",
}: AddToCartButtonProps) {
  const [localQuantity, setLocalQuantity] = useState(quantity);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const cartProduct: CartProduct = {
      ...product,
      quantity: localQuantity,
    };

    addToCart(cartProduct);
    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
      // Removed redirect to cart
    }, 1500);
  };

  return (
    <div className={`flex items-center ${className}`}>
      {showQuantity && (
        <div className="flex items-center mr-4 border rounded-md">
          <button
            onClick={() => setLocalQuantity((prev) => Math.max(1, prev - 1))}
            className="px-3 py-2 text-[#46332E] hover:bg-gray-100"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="px-3 py-2">{localQuantity}</span>
          <button
            onClick={() => setLocalQuantity((prev) => prev + 1)}
            className="px-3 py-2 text-[#46332E] hover:bg-gray-100"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {isAdded ? (
          <motion.div
            key="added"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <Button
              className="bg-green-600 hover:bg-green-700 text-white rounded-2xl transition-colors duration-200"
              disabled
            >
              <Check className="mr-2 h-4 w-4" />
              Added to Cart
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="add"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Button
              onClick={handleAddToCart}
              className="bg-[#46332E] hover:bg-[#46332E]/90 text-white rounded-2xl transition-colors duration-200"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
