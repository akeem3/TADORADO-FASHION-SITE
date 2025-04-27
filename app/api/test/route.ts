import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ message: "✅ MongoDB Connected Successfully!" });
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    return NextResponse.json({ error: "❌ MongoDB Connection Failed" }, { status: 500 });
  }
}
