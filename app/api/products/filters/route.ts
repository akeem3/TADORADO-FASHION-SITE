import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.product.findMany({
      select: {
        category: true,
        ageGroup: true,
        subCategory: true,
      },
    });

    const filters = {
      male: {
        ageGroups: new Set<string>(),
        subCategories: new Set<string>(),
      },
      female: {
        ageGroups: new Set<string>(),
        subCategories: new Set<string>(),
      },
    };

    for (const item of data) {
      const { category, ageGroup, subCategory } = item;
      if (
        (category === "male" || category === "female") &&
        ageGroup &&
        subCategory
      ) {
        filters[category].ageGroups.add(ageGroup);
        filters[category].subCategories.add(subCategory);
      }
    }

    return NextResponse.json({
      male: {
        ageGroups: Array.from(filters.male.ageGroups),
        subCategories: Array.from(filters.male.subCategories),
      },
      female: {
        ageGroups: Array.from(filters.female.ageGroups),
        subCategories: Array.from(filters.female.subCategories),
      },
    });
  } catch (error) {
    console.error("❌ Error fetching filters:", error);
    return NextResponse.json(
      { error: "Failed to fetch filters" },
      { status: 500 }
    );
  }
}
