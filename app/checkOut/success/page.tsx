"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Container from "@/app/Components/Container"

export default function CheckoutSuccessPage() {
  const router = useRouter()

  // Generate a random order number
  const orderNumber = `TD-${Math.floor(100000 + Math.random() * 900000)}`

  // Redirect if user refreshes this page (in a real app, you'd check if there was a recent order)
  useEffect(() => {
    const timer = setTimeout(() => {
      // This is just to prevent users from refreshing the success page
      // In a real app, you'd check if there was a recent order
      const hasRecentOrder = sessionStorage.getItem("recentOrder")
      if (!hasRecentOrder) {
        router.push("/")
      } else {
        // Clear after first load
        sessionStorage.removeItem("recentOrder")
      }
    }, 300)

    // Set flag for first load
    sessionStorage.setItem("recentOrder", "true")

    return () => clearTimeout(timer)
  }, [router])

  return (
    <Container>
      <div className="py-16 max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-20 w-20 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold text-[#46332E] mb-4">Order Successful!</h1>

        <p className="text-lg text-[#46332E]/80 mb-8">
          Thank you for your order. We&#39;ve received your request and will begin crafting your custom outfit soon.
        </p>

        <div className="bg-[#F5F3F0] p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-[#46332E] mb-4">Order Details</h2>

          <div className="flex justify-between mb-2">
            <span className="font-medium">Order Number:</span>
            <span>{orderNumber}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span className="font-medium">Date:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Estimated Delivery:</span>
            <span>7-14 business days</span>
          </div>
        </div>

        <p className="text-[#46332E]/80 mb-8">
          We&#39;ve sent a confirmation email with all the details of your order. If you have any questions, please contact
          our customer service.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push("/collections")}
            variant="outline"
            className="border-[#46332E] text-[#46332E]"
          >
            Continue Shopping
          </Button>

          <Button onClick={() => router.push("/")} className="bg-[#46332E] hover:bg-[#46332E]/90 text-white">
            Return to Home
          </Button>
        </div>
      </div>
    </Container>
  )
}
