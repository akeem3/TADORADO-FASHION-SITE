"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Package, Mail, MapPin } from "lucide-react";
import Container from "@/app/Components/Container";

interface PaymentVerification {
  success: boolean;
  message: string;
  data?: {
    reference: string;
    amount: number;
    status: string;
    customer: {
      email: string;
    };
  };
}

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] =
    useState<PaymentVerification | null>(null);
  const [orderProcessed, setOrderProcessed] = useState(false);

  const reference = searchParams.get("reference");
  const trxref = searchParams.get("trxref");

  useEffect(() => {
    if (reference || trxref) {
      verifyPayment();
    } else {
      setIsVerifying(false);
    }
  }, [reference, trxref]);

  const verifyPayment = async () => {
    try {
      // Get order data from session storage
      const orderData = sessionStorage.getItem("pendingOrder");
      if (!orderData) {
        console.error("No pending order data found");
        setIsVerifying(false);
        return;
      }

      const order = JSON.parse(orderData);
      const paymentRef = reference || trxref;

      // Verify payment with Paystack
      const verifyResponse = await fetch("/api/paystack/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: paymentRef }),
      });

      const verifyResult: PaymentVerification = await verifyResponse.json();
      setVerificationResult(verifyResult);

      if (verifyResult.success && verifyResult.data?.status === "success") {
        // Process the order
        await processOrder(order, paymentRef);
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
  };

  const processOrder = async (orderData: any, paymentRef: string) => {
    try {
      // Prepare order data for processing
      const orderPayload = {
        ...orderData,
        paymentInfo: {
          method: "paystack",
          status: "success",
          reference: paymentRef,
        },
        paymentReference: paymentRef,
      };

      // Process order with admin email and Google Sheets export
      const processResponse = await fetch("/api/paystack/process-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (processResponse.ok) {
        setOrderProcessed(true);
        // Clear pending order from session storage
        sessionStorage.removeItem("pendingOrder");
      }
    } catch (error) {
      console.error("Order processing error:", error);
    }
  };

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
            Thank you for your order. We're excited to create your custom
            outfit!
          </p>
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
                  <strong>Reference:</strong>{" "}
                  {verificationResult.data?.reference}
                </p>
                <p>
                  <strong>Amount:</strong> ₦
                  {verificationResult.data?.amount?.toFixed(2)}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="text-green-600 font-semibold">Paid</span>
                </p>
              </div>
            </div>

            <div className="bg-[#F5F3F0] rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Mail className="h-6 w-6 text-[#46332E] mr-3" />
                <h3 className="text-lg font-semibold text-[#46332E]">
                  What's Next?
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <p>✅ Payment confirmed</p>
                <p>📧 Admin notification sent</p>
                <p>📋 Order added to Google Sheets</p>
                <p>✂️ Crafting begins soon</p>
              </div>
            </div>
          </div>

          {orderProcessed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4"
            >
              <div className="flex items-center text-green-700">
                <Check className="h-5 w-5 mr-2" />
                <span className="font-medium">
                  Order processed successfully!
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-r from-[#F5F3F0] to-[#E8E4E0] rounded-2xl p-8 text-center"
        >
          <h3 className="text-xl font-semibold text-[#46332E] mb-4">
            What Happens Next?
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="flex flex-col items-center">
              <div className="bg-[#46332E] text-white rounded-full h-12 w-12 flex items-center justify-center mb-3">
                1
              </div>
              <p className="text-[#46332E]/80">
                Our team reviews your measurements
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-[#46332E] text-white rounded-full h-12 w-12 flex items-center justify-center mb-3">
                2
              </div>
              <p className="text-[#46332E]/80">Your custom outfit is crafted</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-[#46332E] text-white rounded-full h-12 w-12 flex items-center justify-center mb-3">
                3
              </div>
              <p className="text-[#46332E]/80">We ship to your address</p>
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
            className="bg-[#46332E] text-white px-8 py-3 rounded-xl hover:bg-[#46332E]/90 transition-colors mr-4"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => router.push("/contact")}
            className="bg-white text-[#46332E] border border-[#46332E] px-8 py-3 rounded-xl hover:bg-[#46332E] hover:text-white transition-colors"
          >
            Contact Support
          </button>
        </motion.div>
      </div>
    </Container>
  );
}
