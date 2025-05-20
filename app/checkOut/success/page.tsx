"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/app/Components/Container";
import { ArrowLeft } from "lucide-react";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const orderNumber = `TD-${Math.floor(100000 + Math.random() * 900000)}`;

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasRecentOrder = sessionStorage.getItem("recentOrder");
      if (!hasRecentOrder) {
        router.push("/");
      } else {
        sessionStorage.removeItem("recentOrder");
      }
    }, 300);

    sessionStorage.setItem("recentOrder", "true");
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Container>
      <div className="py-20 max-w-2xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-20 w-20 text-green-500" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-[#46332E] mb-4">
          Order Successful!
        </h1>

        <p className="text-lg text-[#46332E]/80 mb-10">
          Thank you for your order. We&#39;ve received your request and will
          begin crafting your custom outfit soon.
        </p>

        <div className="bg-[#F5F3F0] p-6 sm:p-8 rounded-2xl shadow-sm border border-[#e0dcd7] mb-10 text-left">
          <h2 className="text-xl font-semibold text-[#46332E] mb-5">
            Order Details
          </h2>

          <div className="space-y-3 text-[#46332E]/90 text-sm sm:text-base">
            <div className="flex justify-between">
              <span className="font-medium">Order Number:</span>
              <span>{orderNumber}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Estimated Delivery:</span>
              <span>7–14 business days</span>
            </div>
          </div>
        </div>

        <p className="text-[#46332E]/80 text-sm sm:text-base mb-10">
          A confirmation email with your order details has been sent. If you
          have any questions, feel free to reach out to our customer support
          team.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push("/collections")}
            variant="outline"
            className="rounded-xl border border-[#d6ccc2] text-[#46332E] hover:bg-[#f5f3f0] px-6 py-3 transition-all duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>

          <Button
            onClick={() => router.push("/")}
            className="rounded-xl bg-[#46332E] hover:bg-[#46332E]/90 text-white px-6 py-3 transition-all duration-300"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </Container>
  );
}
