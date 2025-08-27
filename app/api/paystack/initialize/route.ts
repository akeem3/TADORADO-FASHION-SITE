import { NextRequest, NextResponse } from "next/server";
import {
  PAYSTACK_CONFIG,
  validatePaystackConfig,
  generateReference,
  formatAmount,
  createTransactionMetadata,
} from "@/lib/paystack";
import { PaymentData } from "@/lib/types";

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
    const body: PaymentData = await request.json();

    // Validate required fields
    if (!body.email || !body.amount || !body.customerName) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate unique reference
    const reference = generateReference();

    // Format amount for Paystack (convert to kobo for NGN)
    const amount = formatAmount(body.amount, body.currency || "NGN");

    // Create transaction metadata
    const metadata = createTransactionMetadata({
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      orderItems: body.orderItems,
      measurements: body.measurements,
      deliveryAddress: body.deliveryAddress,
    });

    // Prepare Paystack initialization data
    const paystackData = {
      email: body.email,
      amount: amount,
      reference: reference,
      currency: body.currency || "NGN",
      callback_url: `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/checkOut/success?reference=${reference}`,
      metadata: metadata,
    };

    // Initialize transaction with Paystack
    const response = await fetch(
      `${PAYSTACK_CONFIG.baseUrl}/transaction/initialize`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_CONFIG.secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paystackData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Paystack initialization error:", errorData);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to initialize payment",
          error: errorData.message || "Payment initialization failed",
        },
        { status: 400 }
      );
    }

    const paystackResponse = await response.json();

    if (paystackResponse.status) {
      return NextResponse.json({
        success: true,
        message: "Payment initialized successfully",
        data: {
          reference: reference,
          authorization_url: paystackResponse.data.authorization_url,
          access_code: paystackResponse.data.access_code,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Payment initialization failed",
          error: paystackResponse.message,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Payment initialization error:", error);
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
