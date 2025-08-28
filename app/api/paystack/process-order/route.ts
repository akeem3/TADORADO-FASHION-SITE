import { NextRequest, NextResponse } from "next/server";
import { sendEmail, createAdminOrderNotificationEmail } from "@/lib/email";
import { OrderWithPayment } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: OrderWithPayment = await request.json();

    // Debug logging to see what we're receiving
    console.log("Process-order API - Received body:", {
      hasCustomerInfo: !!body.customerInfo,
      hasCartItems: !!body.cartItems,
      cartItemsLength: body.cartItems?.length,
      cartItems: body.cartItems?.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        priceType: typeof item.price
      })),
      totalAmount: body.totalAmount,
      totalAmountType: typeof body.totalAmount
    });

    // Validate required fields
    if (!body.customerInfo || !body.cartItems || !body.totalAmount) {
      console.error("Process-order API - Missing required fields:", {
        hasCustomerInfo: !!body.customerInfo,
        hasCartItems: !!body.cartItems,
        hasTotalAmount: !!body.totalAmount
      });
      return NextResponse.json(
        { success: false, message: "Missing required order information" },
        { status: 400 }
      );
    }

    // Prepare order data for email with proper type checking
    const orderItems = body.cartItems
      .map((item) => {
        const price = typeof item.price === 'number' ? item.price : 0;
        const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
        const name = item.name || 'Unknown Product';
        return `${name} (${quantity}x) - ₦${price.toFixed(2)}`;
      })
      .join("\n");

    console.log("Process-order API - Generated orderItems:", orderItems);

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

    console.log("Process-order API - Creating admin email with:", {
      customerName: body.customerInfo.fullName,
      customerEmail: body.customerInfo.email,
      orderReference,
      totalAmount: body.totalAmount + body.shippingCost
    });

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
    let emailSent = false;
    try {
      emailSent = await sendEmail(adminEmail);
      if (!emailSent) {
        console.error("Failed to send admin email notification");
      }
    } catch (emailError) {
      console.error("Email sending error:", emailError);
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

    console.log("Process-order API - Sending to Google Sheets:", {
      orderDataKeys: Object.keys(orderData),
      cartItemsCount: orderData.cartItems?.length
    });

    // Send order to existing orders API for Google Sheets export
    const host = request.headers.get("host");
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const baseUrl = host
      ? `${protocol}://${host}`
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    let googleSheetsExported = false;
    let sheetsError = null;
    
    try {
      const ordersResponse = await fetch(`${baseUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (ordersResponse.ok) {
        const ordersResult = await ordersResponse.json();
        googleSheetsExported = ordersResult.success;
        if (!ordersResult.success) {
          sheetsError = ordersResult.error || "Google Sheets export failed";
        }
      } else {
        sheetsError = `HTTP ${ordersResponse.status}: ${ordersResponse.statusText}`;
      }
    } catch (sheetsError) {
      console.error("Google Sheets export error:", sheetsError);
      sheetsError = sheetsError instanceof Error ? sheetsError.message : "Google Sheets export failed";
    }

    // Determine overall success
    const overallSuccess = emailSent && googleSheetsExported;

    // Log the results for debugging
    console.log("Order processing results:", {
      orderReference,
      emailSent,
      googleSheetsExported,
      overallSuccess,
      sheetsError,
    });

    return NextResponse.json({
      success: overallSuccess,
      message: overallSuccess 
        ? "Order processed successfully" 
        : "Order processing completed with some issues",
      data: {
        orderReference: orderReference,
        emailSent: emailSent,
        googleSheetsExported: googleSheetsExported,
        errors: {
          email: emailSent ? null : "Failed to send admin email",
          sheets: sheetsError,
        },
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
