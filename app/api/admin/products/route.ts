import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Product } from "@/data/products";

type ProductInput = Omit<Product, "id"> & { [key: string]: unknown };

function parseProductData(data: ProductInput) {
  return {
    name: data.name,
    category: data.category,
    subCategory: data.subCategory,
    ageGroup: data.ageGroup,
    price: Number(data.price),
    salePrice:
      typeof data.salePrice === "string"
        ? data.salePrice !== ""
          ? Number(data.salePrice)
          : undefined
        : typeof data.salePrice === "number"
        ? data.salePrice
        : undefined,
    isNew:
      (typeof data.isNew === "string" && data.isNew === "true") ||
      (typeof data.isNew === "boolean" && data.isNew),
    isFeatured:
      (typeof data.isFeatured === "string" && data.isFeatured === "true") ||
      (typeof data.isFeatured === "boolean" && data.isFeatured),
    image: data.image,
    hoverImage: data.hoverImage || undefined,
    description: data.description || undefined,
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    if (!product)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  }
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const productData = parseProductData(data);
  const product = await prisma.product.create({ data: productData });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const data = await req.json();
  const productData = parseProductData(data);
  const product = await prisma.product.update({
    where: { id: Number(id) },
    data: productData,
  });
  return NextResponse.json(product);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.product.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
