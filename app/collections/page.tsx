import Container from "@/app/Components/Container";
import Banner from "@/components/ui/banner";
import CollectionsClient from "./CollectionsClient";

// Force dynamic rendering and prevent static generation
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

type Product = {
  id: number;
  name: string;
  category: "male" | "female";
  subCategory: string;
  ageGroup: string;
  price: number;
  salePrice?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  image: string;
  hoverImage?: string;
  description?: string;
};

type Filters = {
  male: {
    ageGroups: string[];
    subCategories: string[];
  };
  female: {
    ageGroups: string[];
    subCategories: string[];
  };
};

export default async function CollectionsPage() {
  let products: Product[] = [];
  let filters: Filters = {
    male: { ageGroups: [], subCategories: [] },
    female: { ageGroups: [], subCategories: [] },
  };

  try {
    const productRes = await fetch(
      `${process.env.BASE_URL || "http://localhost:3000"}/api/products`,
      {
        cache: "no-store",
      }
    );
    const filterRes = await fetch(
      `${process.env.BASE_URL || "http://localhost:3000"}/api/products/filters`,
      {
        cache: "no-store",
      }
    );

    if (productRes.ok) {
      const data = await productRes.json();
      products = Array.isArray(data) ? data : [];
    }
    if (filterRes.ok) {
      const data = await filterRes.json();
      filters = data || {
        male: { ageGroups: [], subCategories: [] },
        female: { ageGroups: [], subCategories: [] },
      };
    }
  } catch (error) {
    console.error("Error fetching products or filters:", error);
  }

  // Validate data to prevent build crashes
  if (!Array.isArray(products)) {
    products = [];
  }

  return (
    <div>
      <Banner
        title="OUR COLLECTIONS"
        description="Discover our diverse range of traditional and modern outfits, crafted with precision and care to celebrate your unique style and cultural heritage."
      />

      <Container>
        <CollectionsClient products={products} filters={filters} />
      </Container>
    </div>
  );
}
