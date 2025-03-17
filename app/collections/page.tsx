"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Filter, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Container from "@/app/Components/Container"

// Define the product types
type Product = {
  id: number
  name: string
  category: "male" | "female"
  subCategory: string
  ageGroup: "adult" | "children" | "baby"
  price: number
  image: string
}

// Sample product data
const products: Product[] = [
  {
    id: 1,
    name: "Traditional Agbada Set",
    category: "male",
    subCategory: "senator",
    ageGroup: "adult",
    price: 250,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 2,
    name: "Ankara Shirt & Trousers",
    category: "male",
    subCategory: "ankara",
    ageGroup: "adult",
    price: 180,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 3,
    name: "Owanbe Classical Gown",
    category: "female",
    subCategory: "owanbe",
    ageGroup: "adult",
    price: 320,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 4,
    name: "Corset Dress",
    category: "female",
    subCategory: "corset",
    ageGroup: "adult",
    price: 280,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 5,
    name: "Children's Ankara Set",
    category: "male",
    subCategory: "ankara",
    ageGroup: "children",
    price: 120,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 6,
    name: "Baby Kaftan",
    category: "male",
    subCategory: "senator",
    ageGroup: "baby",
    price: 90,
    image: "/placeholder.svg?height=400&width=300",
  },
]

// Category definitions
const maleCategories = {
  senator: "Senator (Owanbe)",
  ankara: "Ankara",
  corporate: "Corporate",
  vintage: "Vintage",
}

const femaleCategories = {
  owanbe: "Owanbe Classical",
  bridal: "Bridal/Ankara",
  corset: "Corset/Padded",
  gowns: "Gowns",
  blouse: "Blouse",
  skirts: "Skirts",
  iro: "Iro and Buba",
  corporate: "Corporate",
  vintage: "Vintage",
  boubou: "Boubou dress",
  baby: "Baby Gown",
}

export default function CollectionsPage() {
  const [activeTab, setActiveTab] = useState("male")
  const [maleAgeGroup, setMaleAgeGroup] = useState("all")
  const [femaleAgeGroup, setFemaleAgeGroup] = useState("all")
  const [maleSubCategory, setMaleSubCategory] = useState("all")
  const [femaleSubCategory, setFemaleSubCategory] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

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
    <Container>
      {/* Header Section */}
      <section className="py-12 lg:py-16">
        <motion.div
          className="text-center max-w-3xl mx-auto px-4 sm:px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#46332E] mb-6">Our Collections</h1>
          <p className="text-lg text-[#46332E]/80 mb-8">
            Discover our diverse range of traditional and modern outfits, crafted with precision and care to celebrate
            your unique style and cultural heritage.
          </p>
        </motion.div>
      </section>

      {/* Collections Section */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-8 bg-[#F5F3F0]">
              <TabsTrigger
                value="male"
                className="text-lg py-3 data-[state=active]:bg-[#46332E] data-[state=active]:text-white"
              >
                Male Outfits
              </TabsTrigger>
              <TabsTrigger
                value="female"
                className="text-lg py-3 data-[state=active]:bg-[#46332E] data-[state=active]:text-white"
              >
                Female Outfits
              </TabsTrigger>
            </TabsList>

            {/* Male Tab Content */}
            <TabsContent value="male" className="animate-in fade-in-50 duration-300">
              {/* Mobile Filters Toggle */}
              <div className="flex justify-between items-center mb-6 md:hidden">
                <h2 className="text-xl font-semibold text-[#46332E]">Male Outfits</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter size={16} />
                  Filters
                  <ChevronDown size={16} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
                </Button>
              </div>

              {/* Filters */}
              <div className={`md:flex gap-6 mb-8 ${showFilters ? "block" : "hidden md:flex"}`}>
                {/* Age Group Filter */}
                <div className="mb-4 md:mb-0">
                  <h3 className="text-sm font-medium text-[#46332E] mb-2">Age Group</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={maleAgeGroup === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMaleAgeGroup("all")}
                      className={maleAgeGroup === "all" ? "bg-[#46332E]" : ""}
                    >
                      All
                    </Button>
                    {["adult", "children", "baby"].map((age) => (
                      <Button
                        key={age}
                        variant={maleAgeGroup === age ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMaleAgeGroup(age as "adult" | "children" | "baby")}
                        className={maleAgeGroup === age ? "bg-[#46332E]" : ""}
                      >
                        {age.charAt(0).toUpperCase() + age.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Style Filter */}
                <div>
                  <h3 className="text-sm font-medium text-[#46332E] mb-2">Style</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={maleSubCategory === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMaleSubCategory("all")}
                      className={maleSubCategory === "all" ? "bg-[#46332E]" : ""}
                    >
                      All
                    </Button>
                    {Object.entries(maleCategories).map(([key, label]) => (
                      <Button
                        key={key}
                        variant={maleSubCategory === key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMaleSubCategory(key)}
                        className={maleSubCategory === key ? "bg-[#46332E]" : ""}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                {filteredMaleProducts.length > 0 ? (
                  filteredMaleProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Link href={`/collections/${product.id}`}>
                        <div className="relative aspect-[3/4] overflow-hidden">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-[#46332E] mb-1">{product.name}</h3>
                          <p className="text-[#46332E]/70 text-sm mb-2">
                            {maleCategories[product.subCategory as keyof typeof maleCategories]}
                          </p>
                          <p className="font-bold text-[#46332E]">${product.price}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))
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

            {/* Female Tab Content */}
            <TabsContent value="female" className="animate-in fade-in-50 duration-300">
              {/* Mobile Filters Toggle */}
              <div className="flex justify-between items-center mb-6 md:hidden">
                <h2 className="text-xl font-semibold text-[#46332E]">Female Outfits</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter size={16} />
                  Filters
                  <ChevronDown size={16} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
                </Button>
              </div>

              {/* Filters */}
              <div className={`md:flex gap-6 mb-8 ${showFilters ? "block" : "hidden md:flex"}`}>
                {/* Age Group Filter */}
                <div className="mb-4 md:mb-0">
                  <h3 className="text-sm font-medium text-[#46332E] mb-2">Age Group</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={femaleAgeGroup === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFemaleAgeGroup("all")}
                      className={femaleAgeGroup === "all" ? "bg-[#46332E]" : ""}
                    >
                      All
                    </Button>
                    {["adult", "children"].map((age) => (
                      <Button
                        key={age}
                        variant={femaleAgeGroup === age ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFemaleAgeGroup(age as "adult" | "children")}
                        className={femaleAgeGroup === age ? "bg-[#46332E]" : ""}
                      >
                        {age.charAt(0).toUpperCase() + age.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Style Filter */}
                <div>
                  <h3 className="text-sm font-medium text-[#46332E] mb-2">Style</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={femaleSubCategory === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFemaleSubCategory("all")}
                      className={femaleSubCategory === "all" ? "bg-[#46332E]" : ""}
                    >
                      All
                    </Button>
                    {Object.entries(femaleCategories).map(([key, label]) => (
                      <Button
                        key={key}
                        variant={femaleSubCategory === key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFemaleSubCategory(key)}
                        className={femaleSubCategory === key ? "bg-[#46332E]" : ""}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                {filteredFemaleProducts.length > 0 ? (
                  filteredFemaleProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Link href={`/collections/${product.id}`}>
                        <div className="relative aspect-[3/4] overflow-hidden">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-[#46332E] mb-1">{product.name}</h3>
                          <p className="text-[#46332E]/70 text-sm mb-2">
                            {femaleCategories[product.subCategory as keyof typeof femaleCategories]}
                          </p>
                          <p className="font-bold text-[#46332E]">${product.price}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))
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
          </Tabs>
        </div>
      </section>
    </Container>
  )
}

