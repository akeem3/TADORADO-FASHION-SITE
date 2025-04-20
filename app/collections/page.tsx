"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Filter, Heart, Eye, X, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Container from "@/app/Components/Container"
import Banner from "@/components/ui/banner"
import { useSearchParams } from "next/navigation"
import { products, type Product, maleCategories, femaleCategories } from "@/data/products"

export default function CollectionsPage() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const ageGroupParam = searchParams.get("ageGroup")

  const [activeTab, setActiveTab] = useState(tabParam === "female" ? "female" : "male")
  const [maleAgeGroup, setMaleAgeGroup] = useState(ageGroupParam || "all")
  const [femaleAgeGroup, setFemaleAgeGroup] = useState(ageGroupParam || "all")
  const [maleSubCategory, setMaleSubCategory] = useState("all")
  const [femaleSubCategory, setFemaleSubCategory] = useState("all")
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])

  // Get featured products on component mount
  useEffect(() => {
    setFeaturedProducts(products.filter((product) => product.isFeatured))

    // Set initial filters based on URL parameters
    if (tabParam) {
      setActiveTab(tabParam === "female" ? "female" : "male")
    }

    if (ageGroupParam) {
      if (tabParam === "female") {
        setFemaleAgeGroup(ageGroupParam)
      } else {
        setMaleAgeGroup(ageGroupParam)
      }
    }
  }, [tabParam, ageGroupParam])

  // Filter products based on active filters
  const filteredMaleProducts = products.filter((product) => {
    if (product.category !== "male") return false
    if (maleAgeGroup !== "all" && product.ageGroup !== maleAgeGroup) return false
    if (maleSubCategory !== "all" && product.subCategory !== maleSubCategory) return false
    return true
  })

  const filteredFemaleProducts = products.filter((product) => {
    if (product.category !== "female") return false
    if (femaleAgeGroup !== "all" && product.ageGroup !== femaleAgeGroup) return false
    if (femaleSubCategory !== "all" && product.subCategory !== femaleSubCategory) return false
    return true
  })

  return (
    <div>
      {/* Banner Section */}
      <Banner
        title="OUR COLLECTIONS"
        description="Discover our diverse range of traditional and modern outfits, 
        crafted with precision and care to celebrate your unique style and cultural heritage"
      />

      <Container>
        {/* Featured Collections */}
        {featuredProducts.length > 0 && (
          <section className="py-16 mb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl md:text-3xl font-bold text-[#46332E]">FEATURED COLLECTION</h2>
                {/* View All Button */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="w-full sm:w-auto text-center sm:text-left"
                >
                  <Link
                    href="#all-collections"
                    className="inline-flex items-center justify-center sm:w-auto px-4 py-3 text-lg sm:text-lg font-semibold 
                    text-[#46332E] rounded-2xl border-2 border-[#46332E] transition-all duration-300 
                    hover:scale-105 hover:shadow-lg"
                  >
                    View All
                    <ArrowDown className="ml-2 h-6 w-6 text-[#46332E] transition-all duration-300" />
                  </Link>
                </motion.div>
              </div>

              {/* Grid Layout: 2 Columns on Mobile, More on Larger Screens */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={`featured-${product.id}`} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Collections */}
        <section id="all-collections" className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl md:text-3xl font-bold text-[#46332E]">FULL COLLECTION</h2>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <TabsList className="w-full max-w-md grid grid-cols-2 bg-[#F5F3F0] rounded-xl p-1 mb-3">
                  <TabsTrigger
                    value="male"
                    className="text-base md:text-lg py-3 data-[state=active]:bg-[#46332E] data-[state=active]:text-white rounded-2xl"
                  >
                    Male Outfits
                  </TabsTrigger>
                  <TabsTrigger
                    value="female"
                    className="text-base md:text-lg py-3 data-[state=active]:bg-[#46332E] data-[state=active]:text-white rounded-2xl"
                  >
                    Female Outfits
                  </TabsTrigger>
                </TabsList>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMobileFilters(true)}
                  className="mt-4 md:mt-0 md:ml-4 flex items-center gap-2 lg:hidden"
                >
                  <Filter size={16} />
                  Filters
                </Button>
              </div>

              {/* Mobile Filters Drawer */}
              {showMobileFilters && (
                <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
                  <div className="absolute right-0 top-0 h-full w-[80%] max-w-md bg-white p-6 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold text-[#46332E]">Filters</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowMobileFilters(false)}
                        aria-label="Close filters"
                      >
                        <X size={24} />
                      </Button>
                    </div>

                    {activeTab === "male" ? (
                      <MobileFilters
                        ageGroup={maleAgeGroup}
                        setAgeGroup={setMaleAgeGroup}
                        subCategory={maleSubCategory}
                        setSubCategory={setMaleSubCategory}
                        categories={maleCategories}
                        ageGroups={["adult", "children", "baby"]}
                      />
                    ) : (
                      <MobileFilters
                        ageGroup={femaleAgeGroup}
                        setAgeGroup={setFemaleAgeGroup}
                        subCategory={femaleSubCategory}
                        setSubCategory={setFemaleSubCategory}
                        categories={femaleCategories}
                        ageGroups={["adult", "children"]}
                      />
                    )}

                    <div className="mt-8">
                      <Button
                        className="w-full bg-[#46332E] hover:bg-[#46332E]/90"
                        onClick={() => setShowMobileFilters(false)}
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col lg:flex-row gap-8">
                {/* Desktop Filters Sidebar */}
                <div className="hidden lg:block w-64 flex-shrink-0">
                  <div className="sticky top-24 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-[#46332E] mb-4">Filters</h3>

                    {activeTab === "male" ? (
                      <DesktopFilters
                        ageGroup={maleAgeGroup}
                        setAgeGroup={setMaleAgeGroup}
                        subCategory={maleSubCategory}
                        setSubCategory={setMaleSubCategory}
                        categories={maleCategories}
                        ageGroups={["adult", "children", "baby"]}
                      />
                    ) : (
                      <DesktopFilters
                        ageGroup={femaleAgeGroup}
                        setAgeGroup={setFemaleAgeGroup}
                        subCategory={femaleSubCategory}
                        setSubCategory={setFemaleSubCategory}
                        categories={femaleCategories}
                        ageGroups={["adult", "children"]}
                      />
                    )}
                  </div>
                </div>

                {/* Products Content */}
                <div className="flex-1">
                  <TabsContent value="male" className="animate-in fade-in-50 duration-300">
                    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredMaleProducts.length > 0 ? (
                        filteredMaleProducts.map((product) => <ProductCard key={product.id} product={product} />)
                      ) : (
                        <div className="col-span-full text-center py-12">
                          <p className="text-lg text-[#46332E]/70">No products found matching your filters.</p>
                          <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => {
                              setMaleAgeGroup("all")
                              setMaleSubCategory("all")
                            }}
                          >
                            Clear Filters
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="female" className="animate-in fade-in-50 duration-300">
                    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredFemaleProducts.length > 0 ? (
                        filteredFemaleProducts.map((product) => <ProductCard key={product.id} product={product} />)
                      ) : (
                        <div className="col-span-full text-center py-12">
                          <p className="text-lg text-[#46332E]/70">No products found matching your filters.</p>
                          <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => {
                              setFemaleAgeGroup("all")
                              setFemaleSubCategory("all")
                            }}
                          >
                            Clear Filters
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </div>
        </section>
      </Container>
    </div>
  )
}

// Product Card Component
function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false)

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
          {/* Product Image */}
          <Image
            src={isHovered && product.hoverImage ? product.hoverImage : product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Product Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && <Badge className="bg-[#46332E] hover:bg-[#46332E]/90 text-white rounded-2xl">New</Badge>}
            {product.salePrice && <Badge className="bg-red-600 hover:bg-red-700 rounded-2xl text-white">Sale</Badge>}
          </div>

          {/* Quick Actions */}
          <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9 rounded-full bg-white shadow-md"
              aria-label="Add to wishlist"
            >
              <Heart size={18} className="text-[#46332E]" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9 rounded-full bg-white shadow-md"
              aria-label="Quick view"
            >
              <Eye size={18} className="text-[#46332E]" />
            </Button>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/collections/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-[#46332E] mb-1 hover:text-[#46332E]/80 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-[#46332E]/70 text-sm mb-2">
          {product.category === "male"
            ? maleCategories[product.subCategory] || product.subCategory
            : femaleCategories[product.subCategory] || product.subCategory}
        </p>
        <div className="flex items-center gap-2">
          {product.salePrice ? (
            <>
              <p className="font-bold text-[#46332E]">${product.salePrice}</p>
              <p className="text-[#46332E]/60 line-through text-sm">${product.price}</p>
            </>
          ) : (
            <p className="font-bold text-[#46332E]">${product.price}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Mobile Filters Component
function MobileFilters({
  ageGroup,
  setAgeGroup,
  subCategory,
  setSubCategory,
  categories,
  ageGroups,
}: {
  ageGroup: string
  setAgeGroup: (value: string) => void
  subCategory: string
  setSubCategory: (value: string) => void
  categories: Record<string, string>
  ageGroups: string[]
}) {
  return (
    <div className="space-y-6">
      {/* Age Group Filter */}
      <div>
        <h3 className="font-medium text-[#46332E] mb-3">Age Group</h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="age-all-mobile"
              name="age-group-mobile"
              checked={ageGroup === "all"}
              onChange={() => setAgeGroup("all")}
              className="h-4 w-4 text-[#46332E] focus:ring-[#46332E]"
            />
            <label htmlFor="age-all-mobile" className="ml-2 text-[#46332E]">
              All
            </label>
          </div>

          {ageGroups.map((age) => (
            <div key={age} className="flex items-center">
              <input
                type="radio"
                id={`age-${age}-mobile`}
                name="age-group-mobile"
                checked={ageGroup === age}
                onChange={() => setAgeGroup(age)}
                className="h-4 w-4 text-[#46332E] focus:ring-[#46332E]"
              />
              <label htmlFor={`age-${age}-mobile`} className="ml-2 text-[#46332E]">
                {age.charAt(0).toUpperCase() + age.slice(1)}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Style Filter */}
      <div>
        <h3 className="font-medium text-[#46332E] mb-3">Style</h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="style-all-mobile"
              name="style-mobile"
              checked={subCategory === "all"}
              onChange={() => setSubCategory("all")}
              className="h-4 w-4 text-[#46332E] focus:ring-[#46332E]"
            />
            <label htmlFor="style-all-mobile" className="ml-2 text-[#46332E]">
              All
            </label>
          </div>

          {Object.entries(categories).map(([key, label]) => (
            <div key={key} className="flex items-center">
              <input
                type="radio"
                id={`style-${key}-mobile`}
                name="style-mobile"
                checked={subCategory === key}
                onChange={() => setSubCategory(key)}
                className="h-4 w-4 text-[#46332E] focus:ring-[#46332E]"
              />
              <label htmlFor={`style-${key}-mobile`} className="ml-2 text-[#46332E]">
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Desktop Filters Component
function DesktopFilters({
  ageGroup,
  setAgeGroup,
  subCategory,
  setSubCategory,
  categories,
  ageGroups,
}: {
  ageGroup: string
  setAgeGroup: (value: string) => void
  subCategory: string
  setSubCategory: (value: string) => void
  categories: Record<string, string>
  ageGroups: string[]
}) {
  return (
    <div className="space-y-6">
      {/* Age Group Filter */}
      <div>
        <h4 className="font-medium text-[#46332E] mb-3">Age Group</h4>
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="age-all"
              name="age-group"
              checked={ageGroup === "all"}
              onChange={() => setAgeGroup("all")}
              className="h-4 w-4 text-[#46332E] focus:ring-[#46332E]"
            />
            <label htmlFor="age-all" className="ml-2 text-[#46332E]">
              All
            </label>
          </div>

          {ageGroups.map((age) => (
            <div key={age} className="flex items-center">
              <input
                type="radio"
                id={`age-${age}`}
                name="age-group"
                checked={ageGroup === age}
                onChange={() => setAgeGroup(age)}
                className="h-4 w-4 text-[#46332E] focus:ring-[#46332E]"
              />
              <label htmlFor={`age-${age}`} className="ml-2 text-[#46332E]">
                {age.charAt(0).toUpperCase() + age.slice(1)}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Style Filter */}
      <div>
        <h4 className="font-medium text-[#46332E] mb-3">Style</h4>
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="style-all"
              name="style"
              checked={subCategory === "all"}
              onChange={() => setSubCategory("all")}
              className="h-4 w-4 text-[#46332E] focus:ring-[#46332E]"
            />
            <label htmlFor="style-all" className="ml-2 text-[#46332E]">
              All
            </label>
          </div>

          {Object.entries(categories).map(([key, label]) => (
            <div key={key} className="flex items-center">
              <input
                type="radio"
                id={`style-${key}`}
                name="style"
                checked={subCategory === key}
                onChange={() => setSubCategory(key)}
                className="h-4 w-4 text-[#46332E] focus:ring-[#46332E]"
              />
              <label htmlFor={`style-${key}`} className="ml-2 text-[#46332E]">
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            setAgeGroup("all")
            setSubCategory("all")
          }}
        >
          Clear All
        </Button>
      </div>
    </div>
  )
}
