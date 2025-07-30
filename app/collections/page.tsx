import Container from "@/app/Components/Container";
import Banner from "@/components/ui/banner";
import CollectionsClient from "./CollectionsClient";

// Disable static generation (for SSR)
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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  let products: Product[] = [];
  let filters: Filters = {
    male: { ageGroups: [], subCategories: [] },
    female: { ageGroups: [], subCategories: [] },
  };

  try {
    console.log("🔍 Fetching data from:", baseUrl);

    const [productRes, filterRes] = await Promise.all([
      fetch(`${baseUrl}/api/products`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/products/filters`, { cache: "no-store" }),
    ]);

    if (!productRes.ok) {
      console.error("❌ Products API failed:", productRes.statusText);
    } else {
      const data = await productRes.json();
      if (Array.isArray(data)) {
        products = data;
        console.log(`✅ Loaded ${products.length} products`);
      } else {
        console.warn("⚠️ Unexpected products format");
      }
    }

    if (!filterRes.ok) {
      console.error("❌ Filters API failed:", filterRes.statusText);
    } else {
      const data = await filterRes.json();
      if (data?.male && data?.female) {
        filters = data;
        console.log("✅ Loaded filters successfully");
      } else {
        console.warn("⚠️ Unexpected filters format");
      }
    }
  } catch (error) {
    console.error("❌ Error fetching products or filters:", error);
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
