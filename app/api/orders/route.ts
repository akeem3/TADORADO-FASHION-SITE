import { NextResponse } from "next/server";
import { appendOrderToSheet } from "@/lib/googleSheets";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    // Map incoming data to the 23-column schema
    const cartItems = (data.cartItems ?? []) as Array<Record<string, unknown>>;
    const orderRow = {
      orderNumber:
        data.orderNumber || `TD-${Math.floor(100000 + Math.random() * 900000)}`,
      orderDate: new Date().toISOString(),
      orderStatus: "pending",
      totalAmount: data.totalAmount,
      shippingCost: data.shippingCost,
      taxAmount: data.taxAmount,
      productName: cartItems.map((item) => item.name).join("; "),
      productImage: cartItems.map((item) => item.image).join("; "),
      productCategory: cartItems.map((item) => item.category).join("; "),
      productSubCategory: cartItems.map((item) => item.subCategory).join("; "),
      productPrice: cartItems.map((item) => item.price).join("; "),
      productSalePrice: cartItems
        .map((item) => item.salePrice || "")
        .join("; "),
      productQuantity: cartItems.map((item) => item.quantity).join("; "),
      customerName: data.customerInfo?.fullName,
      customerEmail: data.customerInfo?.email,
      customerPhone: data.customerInfo?.phone,
      deliveryAddress: data.customerInfo?.address,
      deliveryCity: data.customerInfo?.city,
      deliveryState: data.customerInfo?.state,
      deliveryZipCode: data.customerInfo?.postalCode,
      deliveryCountry: data.customerInfo?.country,
      measurements: JSON.stringify(data.measurements),
      notes: data.notes || "",
    };
    const result = await appendOrderToSheet(orderRow);
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
