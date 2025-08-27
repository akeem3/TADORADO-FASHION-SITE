import { NextRequest, NextResponse } from "next/server";
import {
  PAYSTACK_CONFIG,
  validatePaystackConfig,
  parseAmount,
} from "@/lib/paystack";

export async function POST(request: NextRequest) {
  try {
    // Validate Paystack configuration
    if (!validatePaystackConfig()) {
      return NextResponse.json(
        { success: false, message: "Paystack configuration error" },
        { status: 500 }
      );
    }

    // Parse request body
    const { reference } = await request.json();

    if (!reference) {
      return NextResponse.json(
        { success: false, message: "Payment reference is required" },
        { status: 400 }
      );
    }

    // Verify transaction with Paystack
    const response = await fetch(
      `${PAYSTACK_CONFIG.baseUrl}/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_CONFIG.secretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Paystack verification error:", errorData);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to verify payment",
          error: errorData.message || "Payment verification failed",
        },
        { status: 400 }
      );
    }

    const paystackResponse = await response.json();

    if (paystackResponse.status && paystackResponse.data) {
      const transaction = paystackResponse.data;

      // Check if payment was successful
      if (transaction.status === "success") {
        // Parse amount from kobo to Naira
        const amount = parseAmount(transaction.amount, transaction.currency);

        return NextResponse.json({
          success: true,
          message: "Payment verified successfully",
          data: {
            id: transaction.id,
            reference: transaction.reference,
            amount: amount,
            currency: transaction.currency,
            status: transaction.status,
            customer: transaction.customer,
            metadata: transaction.metadata,
            paid_at: transaction.paid_at,
            created_at: transaction.created_at,
          },
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            message: "Payment not successful",
            data: {
              status: transaction.status,
              gateway_response: transaction.gateway_response,
            },
          },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Payment verification failed",
          error: paystackResponse.message,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
