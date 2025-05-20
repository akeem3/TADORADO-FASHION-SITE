// /scripts/seed.ts
import { prisma } from "../lib/prisma";

async function main() {
  await prisma.product.deleteMany(); // clear existing

  await prisma.product.createMany({
    data: [
      {
        name: "Traditional Agbada Set",
        category: "male",
        subCategory: "senator",
        ageGroup: "adult",
        price: 50,
        isNew: true,
        isFeatured: true,
        image:
          "https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/agbada.jpg?alt=media&token=fb644790-6e97-4820-b75c-088cb559223e",
        hoverImage:
          "https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/agbada.jpg?alt=media&token=fb644790-6e97-4820-b75c-088cb559223e",
        description:
          "Elegant traditional Agbada set crafted with premium fabric. Perfect for special occasions and cultural celebrations.",
      },
      {
        name: "Ankara Shirt & Trousers",
        category: "male",
        subCategory: "ankara",
        ageGroup: "adult",
        price: 80,
        salePrice: 50,
        image:
          "https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/ankara%20shirt%20and%20trousers%20men.jpg?alt=media&token=e1af5267-98de-468c-8f82-a0c6fabaeb3d",
        hoverImage:
          "https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/ankara%20shirt%20and%20trousers%20men.jpg?alt=media&token=e1af5267-98de-468c-8f82-a0c6fabaeb3d",
        description:
          "Vibrant Ankara shirt and trousers set made from authentic African print fabric.",
      },
      {
        name: "Owanbe Classical Gown",
        category: "female",
        subCategory: "owanbe",
        ageGroup: "adult",
        price: 20,
        isFeatured: true,
        image:
          "https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/Owambe%20gown.png?alt=media&token=c141d5fc-caaa-46c2-b733-5f15bc30bf93",
        hoverImage:
          "https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/Owambe%20gown.png?alt=media&token=c141d5fc-caaa-46c2-b733-5f15bc30bf93",
        description:
          "Stunning Owanbe gown designed for celebrations and special events.",
      },
    ],
  });

  console.log("✅ Products seeded!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
