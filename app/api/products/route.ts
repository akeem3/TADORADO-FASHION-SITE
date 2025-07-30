// app/api/products/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test database connection first
    await prisma.$connect();
    console.log("✅ Database connected successfully in products API");

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    console.log(`✅ Found ${products.length} products`);
    return NextResponse.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);

    // Check if it's a database connection error
    if (error instanceof Error && error.message.includes("connect")) {
      return NextResponse.json(
        { error: "Database connection failed", details: error.message },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to fetch products",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
