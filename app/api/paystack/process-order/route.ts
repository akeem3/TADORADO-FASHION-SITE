import { NextRequest, NextResponse } from "next/server";
import { sendEmail, createAdminOrderNotificationEmail } from "@/lib/email";
import { OrderWithPayment } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: OrderWithPayment = await request.json();

    // Validate required fields
    if (!body.customerInfo || !body.cartItems || !body.totalAmount) {
      return NextResponse.json(
        { success: false, message: "Missing required order information" },
        { status: 400 }
      );
    }

    // Prepare order data for email
    const orderItems = body.cartItems
      .map(
        (item) => `${item.name} (${item.quantity}x) - ₦${item.price.toFixed(2)}`
      )
      .join("\n");

    const measurements = body.measurements
      .map(
        (m, index) =>
          `Person ${index + 1} (${m.label || m.gender}):\n` +
          `  Height: ${m.height} ${m.measurementUnit}\n` +
          `  Shoulder: ${m.shoulder} ${m.measurementUnit}\n` +
          `  Waist: ${m.waist} ${m.measurementUnit}\n` +
          `  Hip: ${m.hip} ${m.measurementUnit}\n` +
          `  Sleeve: ${m.sleeve} ${m.measurementUnit}\n` +
          `  Outfit Type: ${m.outfitType}\n` +
          `  Extra Notes: ${m.extraNote || "None"}`
      )
      .join("\n\n");

    const deliveryAddress =
      `${body.customerInfo.address}\n` +
      `${body.customerInfo.city}, ${body.customerInfo.state}\n` +
      `${body.customerInfo.country}${
        body.customerInfo.postalCode ? `, ${body.customerInfo.postalCode}` : ""
      }`;

    // Generate order reference (you can use the payment reference if available)
    const orderReference = body.paymentReference || `TAD_${Date.now()}`;

    // Create admin email notification
    const adminEmail = createAdminOrderNotificationEmail({
      customerName: body.customerInfo.fullName,
      customerEmail: body.customerInfo.email,
      customerPhone: body.customerInfo.phone,
      orderReference: orderReference,
      totalAmount: body.totalAmount + body.shippingCost,
      orderItems: orderItems,
      measurements: measurements,
      deliveryAddress: deliveryAddress,
      paymentStatus: body.paymentInfo.status,
    });

    // Send admin email notification
    const emailSent = await sendEmail(adminEmail);

    if (!emailSent) {
      console.error("Failed to send admin email notification");
      // Don't fail the order process if email fails
    }

    // Prepare order data for Google Sheets export
    const orderData = {
      customerInfo: body.customerInfo,
      measurements: body.measurements,
      paymentInfo: {
        ...body.paymentInfo,
        reference: orderReference,
      },
      cartItems: body.cartItems,
      totalAmount: body.totalAmount,
      shippingCost: body.shippingCost,
      taxAmount: body.taxAmount,
      notes: body.notes,
      paymentReference: orderReference,
    };

    // Send order to existing orders API for Google Sheets export
    const ordersResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/api/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      }
    );

    if (!ordersResponse.ok) {
      console.error("Failed to export order to Google Sheets");
      // Don't fail the order process if Google Sheets export fails
    }

    return NextResponse.json({
      success: true,
      message: "Order processed successfully",
      data: {
        orderReference: orderReference,
        emailSent: emailSent,
        googleSheetsExported: ordersResponse.ok,
      },
    });
  } catch (error) {
    console.error("Order processing error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process order",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
