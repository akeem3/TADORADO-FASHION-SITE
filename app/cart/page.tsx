"use client"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react"
import { motion } from "framer-motion"
import Container from "@/app/Components/Container"
import Banner from "@/components/ui/banner"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/ui/CartContext"

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart()
  const router = useRouter()

  // Improve the empty cart state
  if (cartItems.length === 0) {
    return (
      <>
        <Banner title="YOUR CART" description="Your shopping cart is currently empty." />
        <Container>
          <div className="py-16 text-center px-4">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-[#F5F3F0] rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-8 w-8 text-[#46332E]" />
              </div>
              <h2 className="text-2xl font-bold text-[#46332E] mb-4">Your cart is empty</h2>
              <p className="text-[#46332E]/70 mb-8">Looks like you haven`&#39;`t added any items to your cart yet.</p>
              <Button
                onClick={() => router.push("/collections")}
                className="bg-[#46332E] hover:bg-[#46332E]/90 transition-all duration-300"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </Container>
      </>
    )
  }

  return (
    <>
      <Banner title="YOUR CART" description="Review your items and proceed to checkout when you're ready." />
      <Container>
        <div className="py-12 max-w-7xl mx-auto">
          <Button variant="outline" className="mb-8" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-[#46332E] mb-4">Shopping Cart ({cartItems.length} items)</h2>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex flex-col sm:flex-row gap-4 p-4 ${
                      index !== cartItems.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    {/* Product Image */}
                    <div className="relative w-full sm:w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <h3 className="font-medium text-[#46332E]">
                            <Link href={`/collections/product/${item.id}`} className="hover:underline">
                              {item.name}
                            </Link>
                          </h3>
                          <p className="text-sm text-[#46332E]/70">{item.category}</p>
                        </div>
                        <div className="mt-2 sm:mt-0 text-right">
                          {item.salePrice ? (
                            <div>
                              <span className="font-bold text-[#46332E]">${item.salePrice}</span>
                              <span className="text-sm text-[#46332E]/60 line-through ml-2">${item.price}</span>
                            </div>
                          ) : (
                            <span className="font-bold text-[#46332E]">${item.price}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 text-[#46332E] hover:bg-gray-100 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-3 py-1">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 text-[#46332E] hover:bg-gray-100 transition-colors"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 flex items-center transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          <span className="text-sm">Remove</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                  onClick={clearCart}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-[#46332E] mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-[#46332E]/70">Subtotal</span>
                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#46332E]/70">Shipping</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#46332E]/70">Tax</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-[#46332E] hover:bg-[#46332E]/90 py-6 text-lg"
                  onClick={() => router.push("/checkout")}
                >
                  Proceed to Checkout
                </Button>

                <p className="text-xs text-center text-[#46332E]/60 mt-4">
                  Shipping, taxes, and discounts calculated at checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

export default CartPage
