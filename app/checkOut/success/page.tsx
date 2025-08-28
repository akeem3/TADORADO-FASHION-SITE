"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Package, Truck, CreditCard } from "lucide-react";
import Container from "@/app/Components/Container";
import { useCart } from "@/components/ui/CartContext";

interface PaymentVerification {
  success: boolean;
  message: string;
  data?: {
    status: string;
    amount: number;
    reference: string;
  };
}

interface OrderProcessingResult {
  success: boolean;
  message: string;
  data?: {
    orderReference: string;
    emailSent: boolean;
    googleSheetsExported: boolean;
  };
}

function SuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  const [verificationResult, setVerificationResult] =
    useState<PaymentVerification | null>(null);
  const [orderProcessed, setOrderProcessed] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  const reference = searchParams.get("reference");
  const trxref = searchParams.get("trxref");

  const processOrder = useCallback(
    async (orderData: unknown, paymentRef: string) => {
      try {
        // Debug logging to see what we're receiving from sessionStorage
        console.log(
          "Success page - Received orderData from sessionStorage:",
          orderData
        );

        // Prepare order data for processing
        const baseOrder =
          orderData && typeof orderData === "object"
            ? (orderData as Record<string, unknown>)
            : {};

        console.log("Success page - Base order structure:", {
          hasCustomerInfo: !!baseOrder.customerInfo,
          hasCartItems: !!baseOrder.cartItems,
          cartItemsLength: Array.isArray(baseOrder.cartItems)
            ? baseOrder.cartItems.length
            : "not array",
          cartItems: baseOrder.cartItems,
          totalAmount: baseOrder.totalAmount,
          totalAmountType: typeof baseOrder.totalAmount,
        });

        const orderPayload = {
          ...baseOrder,
          paymentInfo: {
            method: "paystack",
            status: "success",
            reference: paymentRef,
          },
          paymentReference: paymentRef,
        };

        const payload = orderPayload as Record<string, unknown>;
        console.log("Success page - Sending orderPayload to process-order:", {
          hasCustomerInfo: !!payload.customerInfo,
          hasCartItems: !!payload.cartItems,
          cartItemsLength: Array.isArray(payload.cartItems)
            ? payload.cartItems.length
            : "not array",
          totalAmount: payload.totalAmount,
        });

        // Process order with admin email and Google Sheets export
        const processResponse = await fetch("/api/paystack/process-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        });

        const processResult: OrderProcessingResult =
          await processResponse.json();

        if (processResponse.ok && processResult.success) {
          // ✅ Clear cart after confirmed successful processing
          clearCart();
          sessionStorage.removeItem("pendingOrder");
          setOrderProcessed(true);
        } else {
          // Handle specific backend failures
          const errorDetails = [];
          if (processResult.data) {
            if (!processResult.data.emailSent) {
              errorDetails.push("admin email notification");
            }
            if (!processResult.data.googleSheetsExported) {
              errorDetails.push("Google Sheets export");
            }
          }

          const errorMessage =
            errorDetails.length > 0
              ? `Order processing failed: ${errorDetails.join(", ")} failed`
              : processResult.message || "Order processing failed";

          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error("Order processing error:", error);
        setProcessingError(
          error instanceof Error ? error.message : "Order processing failed"
        );
      }
    },
    [clearCart]
  );

  const verifyPayment = useCallback(async () => {
    try {
      const paymentRef = (reference ?? trxref) as string | null;
      if (!paymentRef) {
        setVerificationResult({
          success: false,
          message: "No payment reference found",
        });
        return;
      }

      // Verify payment with Paystack
      const verifyResponse = await fetch("/api/paystack/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: paymentRef as string }),
      });

      const verifyResult: PaymentVerification = await verifyResponse.json();
      setVerificationResult(verifyResult);

      if (verifyResult.success && verifyResult.data?.status === "success") {
        // Payment verified successfully, now process the order
        const orderData = sessionStorage.getItem("pendingOrder");
        if (orderData) {
          await processOrder(JSON.parse(orderData), paymentRef as string);
        }
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setVerificationResult({
        success: false,
        message: "Failed to verify payment",
      });
    } finally {
      setIsVerifying(false);
    }
  }, [reference, trxref, processOrder]);

  useEffect(() => {
    verifyPayment();
  }, [verifyPayment]);

  if (isVerifying) {
    return (
      <Container>
        <div className="py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#46332E] mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-[#46332E] mb-4">
              Verifying Payment...
            </h2>
            <p className="text-[#46332E]/70">
              Please wait while we confirm your payment.
            </p>
          </div>
        </div>
      </Container>
    );
  }

  if (!verificationResult?.success) {
    return (
      <Container>
        <div className="py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-red-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold text-[#46332E] mb-4">
              Payment Verification Failed
            </h2>
            <p className="text-[#46332E]/70 mb-8">
              {verificationResult?.message ||
                "We couldn't verify your payment. Please contact support."}
            </p>
            <button
              onClick={() => router.push("/checkOut")}
              className="bg-[#46332E] text-white px-6 py-3 rounded-xl hover:bg-[#46332E]/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </Container>
    );
  }

  if (processingError) {
    return (
      <Container>
        <div className="py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-yellow-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-yellow-600 text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-[#46332E] mb-4">
              Payment Successful, Order Processing Issue
            </h2>
            <p className="text-[#46332E]/70 mb-8">
              Your payment was successful, but we encountered an issue
              processing your order: {processingError}
            </p>
            <p className="text-sm text-[#46332E]/60 mb-8">
              Please contact support with your payment reference to ensure your
              order is processed.
            </p>
            <button
              onClick={() => router.push("/contact")}
              className="bg-[#46332E] text-white px-6 py-3 rounded-xl hover:bg-[#46332E]/90 transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-16 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-[#46332E] mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-[#46332E]/70">
            Thank you for your order. We&#39;re excited to create your custom
            outfit!
          </p>
          {orderProcessed && (
            <p className="text-sm text-green-600 mt-2">
              ✅ Your order has been processed and your cart has been cleared.
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-semibold text-[#46332E] mb-6 text-center">
            Order Confirmation
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#F5F3F0] rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Package className="h-6 w-6 text-[#46332E] mr-3" />
                <h3 className="text-lg font-semibold text-[#46332E]">
                  Order Details
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Order Number:</span>{" "}
                  {verificationResult.data?.reference || "Processing..."}
                </p>
                <p>
                  <span className="font-medium">Amount Paid:</span> ₦
                  {verificationResult.data?.amount
                    ? (verificationResult.data.amount / 100).toFixed(2)
                    : "Processing..."}
                </p>
                <p>
                  <span className="font-medium">Payment Method:</span> Paystack
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span className="text-green-600 font-medium">Paid</span>
                </p>
              </div>
            </div>

            <div className="bg-[#F5F3F0] rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Truck className="h-6 w-6 text-[#46332E] mr-3" />
                <h3 className="text-lg font-semibold text-[#46332E]">
                  What&#39;s Next?
                </h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <div className="bg-[#46332E] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    1
                  </div>
                  <p>We&#39;ll review your measurements and order details</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-[#46332E] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    2
                  </div>
                  <p>Our team will start crafting your custom outfit</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-[#46332E] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    3
                  </div>
                  <p>We&#39;ll contact you with updates on your order</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="flex items-center mb-6">
            <CreditCard className="h-6 w-6 text-[#46332E] mr-3" />
            <h3 className="text-xl font-semibold text-[#46332E]">
              Payment Confirmation
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center text-green-600">
              <Check className="h-5 w-5 mr-2" />
              <span>Payment processed successfully</span>
            </div>
            <div className="flex items-center text-green-600">
              <Check className="h-5 w-5 mr-2" />
              <span>Order added to Google Sheets</span>
            </div>
            <div className="flex items-center text-green-600">
              <Check className="h-5 w-5 mr-2" />
              <span>Admin notification sent</span>
            </div>
            <div className="flex items-center text-green-600">
              <Check className="h-5 w-5 mr-2" />
              <span>Cart cleared</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-8"
        >
          <button
            onClick={() => router.push("/collections")}
            className="bg-[#46332E] text-white px-8 py-3 rounded-xl hover:bg-[#46332E]/90 transition-colors"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    </Container>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <Container>
          <div className="py-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#46332E] mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-[#46332E] mb-4">
                Loading...
              </h2>
            </div>
          </div>
        </Container>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}
