import { NextResponse } from "next/server";
import { appendOrderToSheet } from "@/lib/googleSheets";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // ✅ Debug logging for order tracking
    console.log("Orders API - Received order data:", {
      hasCustomerInfo: !!data.customerInfo,
      hasCartItems: !!data.cartItems,
      cartItemsLength: data.cartItems?.length,
      totalAmount: data.totalAmount,
      buyNowMode: data.buyNowMode,
      customerEmail: data.customerInfo?.email,
      customerName: data.customerInfo?.fullName,
    });

    // Map incoming data to the 23-column schema
    const cartItems = (data.cartItems ?? []) as Array<Record<string, unknown>>;

    // Format date and time
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-CA"); // YYYY-MM-DD
    const timeStr = now.toLocaleTimeString("en-GB", { hour12: false }); // HH:MM:SS
    const orderDate = `Date: ${dateStr}\nTime: ${timeStr}`;

    // Format measurements vertically for better readability
    const formatMeasurements = (
      measurements: Array<{
        gender: "male" | "female";
        height: string;
        shoulder: string;
        chest?: string;
        bust?: string;
        waist: string;
        hip: string;
        sleeve: string;
        inseam?: string;
        neck?: string;
        extraNote?: string;
        measurementUnit: "inches" | "cm";
        label?: string;
        outfitType: "shirt" | "pants" | "dress" | "jacket" | "skirt" | "blazer";
      }>
    ) => {
      if (!measurements || measurements.length === 0) return "";

      return measurements
        .map((measurement, index) => {
          const personLabel = measurement.label || `Person ${index + 1}`;
          const gender = measurement.gender || "Not specified";
          const unit = measurement.measurementUnit || "inches";

          const measurementFields = [
            `Height: ${measurement.height || "Not provided"}`,
            `Shoulder: ${measurement.shoulder || "Not provided"}`,
            measurement.gender === "male"
              ? `Chest: ${measurement.chest || "Not provided"}`
              : `Bust: ${measurement.bust || "Not provided"}`,
            `Waist: ${measurement.waist || "Not provided"}`,
            `Hip: ${measurement.hip || "Not provided"}`,
            `Sleeve: ${measurement.sleeve || "Not provided"}`,
            measurement.gender === "male"
              ? `Inseam: ${measurement.inseam || "Not provided"}`
              : "",
            measurement.gender === "male"
              ? `Neck: ${measurement.neck || "Not provided"}`
              : "",
            measurement.extraNote ? `Notes: ${measurement.extraNote}` : "",
          ].filter((field) => field !== ""); // Remove empty fields

          return [
            `--- ${personLabel} (${gender}) ---`,
            `Unit: ${unit}`,
            ...measurementFields,
          ].join("\n");
        })
        .join("\n\n");
    };

    const orderRow = {
      orderNumber:
        data.orderNumber || `TD-${Math.floor(100000 + Math.random() * 900000)}`,
      orderDate,
      orderStatus: "pending",
      totalAmount: data.totalAmount,
      shippingCost: data.shippingCost,
      taxAmount: data.taxAmount,
      productName: cartItems.map((item) => item.name).join("\n"),
      productImage: cartItems.map((item) => item.image).join("\n"),
      productCategory: cartItems.map((item) => item.category).join("\n"),
      productSubCategory: cartItems.map((item) => item.subCategory).join("\n"),
      productPrice: cartItems.map((item) => item.price).join("; "),
      productQuantity: cartItems.map((item) => item.quantity).join("; "),
      customerName: data.customerInfo?.fullName,
      customerEmail: data.customerInfo?.email,
      customerPhone: data.customerInfo?.phone,
      deliveryAddress: data.customerInfo?.address,
      deliveryCity: data.customerInfo?.city,
      deliveryState: data.customerInfo?.state,
      deliveryZipCode: data.customerInfo?.postalCode,
      deliveryCountry: data.customerInfo?.country,
      measurements: formatMeasurements(data.measurements),
      notes: data.notes || "",
    };

    // ✅ Debug logging for Google Sheets export
    console.log("Orders API - Attempting Google Sheets export:", {
      orderNumber: orderRow.orderNumber,
      customerName: orderRow.customerName,
      productCount: cartItems.length,
      totalAmount: orderRow.totalAmount,
    });

    const result = await appendOrderToSheet(orderRow);

    // ✅ Debug logging for export result
    console.log("Orders API - Google Sheets export result:", {
      success: result.success,
      error: result.error,
      orderNumber: orderRow.orderNumber,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Order exported to Google Sheets.",
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("Order API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
