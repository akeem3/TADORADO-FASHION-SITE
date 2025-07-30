import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();

    // Test a simple query
    const productCount = await prisma.product.count();

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      productCount,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      baseUrl: process.env.BASE_URL || "not set",
    });
  } catch (error) {
    console.error("❌ Health check failed:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        baseUrl: process.env.BASE_URL || "not set",
      },
      { status: 503 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
