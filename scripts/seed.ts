// /scripts/seed.ts
import { prisma } from "../lib/prisma";
import { products } from "../data/products";

// Simple slugify function
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  await prisma.product.deleteMany(); // clear existing

  // Convert products to database format with prices in tens of thousands
  const productsData = products.map((product) => ({
    name: product.name,
    slug: slugify(product.name),
    category: product.category,
    subCategory: product.subCategory,
    ageGroup: product.ageGroup,
    price: product.price * 1000, // Convert to tens of thousands (multiply by 1000)
    isNew: product.isNew || false,
    isFeatured: product.isFeatured || false,
    image: product.image,
    hoverImage: product.hoverImage || product.image,
    description: product.description || "",
  }));

  await prisma.product.createMany({
    data: productsData,
  });

  console.log(
    `✅ ${productsData.length} products seeded with prices in tens of thousands!`
  );
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
