"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

import Container from "@/app/Components/Container";
import Banner from "@/components/ui/banner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

export default function CollectionsPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Filters>({
    male: { ageGroups: [], subCategories: [] },
    female: { ageGroups: [], subCategories: [] },
  });

  const [activeTab, setActiveTab] = useState(
    tabParam === "female" ? "female" : "male"
  );
  const [maleAgeGroup, setMaleAgeGroup] = useState("all");
  const [femaleAgeGroup, setFemaleAgeGroup] = useState("all");
  const [maleSubCategory, setMaleSubCategory] = useState("all");
  const [femaleSubCategory, setFemaleSubCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => {
        // Optionally set an error state here
        console.error(err);
      })
      .finally(() => setIsLoading(false));

    fetch("/api/products/filters")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch filters");
        return res.json();
      })
      .then((data) => setFilters(data))
      .catch((err) => {
        // Optionally set an error state here
        console.error(err);
      });
  }, []);

  const featuredProducts = products.filter((p) => p.isFeatured);

  const filteredMaleProducts = products.filter((product) => {
    if (product.category !== "male") return false;
    if (maleAgeGroup !== "all" && product.ageGroup !== maleAgeGroup)
      return false;
    if (maleSubCategory !== "all" && product.subCategory !== maleSubCategory)
      return false;
    return true;
  });

  const filteredFemaleProducts = products.filter((product) => {
    if (product.category !== "female") return false;
    if (femaleAgeGroup !== "all" && product.ageGroup !== femaleAgeGroup)
      return false;
    if (
      femaleSubCategory !== "all" &&
      product.subCategory !== femaleSubCategory
    )
      return false;
    return true;
  });

  return (
    <div>
      <Banner
        title="OUR COLLECTIONS"
        description="Discover our diverse range of traditional and modern outfits, crafted with precision and care to celebrate your unique style and cultural heritage."
      />

      <Container>
        {/* Featured Section */}
        {featuredProducts.length > 0 && (
          <section className="py-16 mb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-[#46332E]">
                  FEATURED COLLECTION
                </h2>
                <Link
                  href="#all-collections"
                  className="inline-flex items-center text-[#46332E] border-2 border-[#46332E] px-4 py-2 rounded-2xl hover:scale-105 transition"
                >
                  View All <ArrowDown className="ml-2" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={`featured-${product.id}`}
                    product={product}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Full Collection Section */}
        <section id="all-collections" className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-[#46332E] mb-8">
              FULL COLLECTION
            </h2>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 max-w-md bg-[#F5F3F0] rounded-xl p-1 mb-6">
                <TabsTrigger
                  value="male"
                  className="py-3 data-[state=active]:bg-[#46332E] data-[state=active]:text-white rounded-2xl"
                >
                  Male Outfits
                </TabsTrigger>
                <TabsTrigger
                  value="female"
                  className="py-3 data-[state=active]:bg-[#46332E] data-[state=active]:text-white rounded-2xl"
                >
                  Female Outfits
                </TabsTrigger>
              </TabsList>

              {/* Male Filters */}
              {activeTab === "male" && (
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex flex-col">
                    <label
                      htmlFor="male-age"
                      className="mb-1 text-sm font-medium text-[#46332E]"
                    >
                      Age Group
                    </label>
                    <select
                      id="male-age"
                      value={maleAgeGroup}
                      onChange={(e) => setMaleAgeGroup(e.target.value)}
                      className="rounded-2xl border border-[#e2e2e2] bg-white px-4 py-2 text-[#46332E] focus:outline-none focus:ring-2 focus:ring-[#46332E]"
                    >
                      <option value="all">All</option>
                      <option value="adult">Adult</option>
                      <option value="children">Children</option>
                      <option value="baby">Baby</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="male-style"
                      className="mb-1 text-sm font-medium text-[#46332E]"
                    >
                      Style
                    </label>
                    <select
                      id="male-style"
                      value={maleSubCategory}
                      onChange={(e) => setMaleSubCategory(e.target.value)}
                      className="rounded-2xl border border-[#e2e2e2] bg-white px-4 py-2 text-[#46332E] focus:outline-none focus:ring-2 focus:ring-[#46332E]"
                    >
                      <option value="all">All</option>
                      {filters.male.subCategories.map((style) => (
                        <option key={style} value={style}>
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Female Filters */}
              {activeTab === "female" && (
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex flex-col">
                    <label
                      htmlFor="female-age"
                      className="mb-1 text-sm font-medium text-[#46332E]"
                    >
                      Age Group
                    </label>
                    <select
                      id="female-age"
                      value={femaleAgeGroup}
                      onChange={(e) => setFemaleAgeGroup(e.target.value)}
                      className="rounded-2xl border border-[#e2e2e2] bg-white px-4 py-2 text-[#46332E] focus:outline-none focus:ring-2 focus:ring-[#46332E]"
                    >
                      <option value="all">All</option>
                      <option value="adult">Adult</option>
                      <option value="kids">Kids</option>
                      <option value="baby">Baby</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="female-style"
                      className="mb-1 text-sm font-medium text-[#46332E]"
                    >
                      Style
                    </label>
                    <select
                      id="female-style"
                      value={femaleSubCategory}
                      onChange={(e) => setFemaleSubCategory(e.target.value)}
                      className="rounded-2xl border border-[#e2e2e2] bg-white px-4 py-2 text-[#46332E] focus:outline-none focus:ring-2 focus:ring-[#46332E]"
                    >
                      <option value="all">All</option>
                      {filters.female.subCategories.map((style) => (
                        <option key={style} value={style}>
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <TabsContent value="male">
                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {isLoading ? (
                    <p className="text-center text-[#46332E]/60 col-span-full">
                      Loading products...
                    </p>
                  ) : filteredMaleProducts.length > 0 ? (
                    filteredMaleProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  ) : (
                    <p className="text-center text-[#46332E]/60 col-span-full">
                      No products found.
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="female">
                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {isLoading ? (
                    <p className="text-center text-[#46332E]/60 col-span-full">
                      Loading products...
                    </p>
                  ) : filteredFemaleProducts.length > 0 ? (
                    filteredFemaleProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  ) : (
                    <p className="text-center text-[#46332E]/60 col-span-full">
                      No products found.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </Container>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/collections/product/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={
              isHovered && product.hoverImage
                ? product.hoverImage
                : product.image
            }
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-[#46332E] mb-1 hover:text-[#46332E]/80 transition-colors">
            {product.name}
          </h3>
          <p className="text-[#46332E]/70 text-sm capitalize">
            {product.subCategory}
          </p>
          <div className="flex items-center gap-2">
            <p className="font-bold text-[#46332E]">${product.price}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
