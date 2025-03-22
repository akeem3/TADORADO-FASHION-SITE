"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {  ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Container from "@/app/Components/Container";
import Banner from "@/components/ui/banner";
import AddToCartButton from "@/components/ui/AddToCartButton";

// Define the product types
type Product = {
  id: number;
  name: string;
  category: "male" | "female";
  subCategory: string;
  ageGroup: "adult" | "children" | "baby";
  price: number;
  salePrice?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  image: string;
  hoverImage?: string;
  description?: string;
};

// Sample product data with enhanced properties
const products: Product[] = [
  {
    id: 1,
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
      "Elegant traditional Agbada set crafted with premium fabric. Perfect for special occasions and cultural celebrations. Features intricate embroidery and a comfortable fit.",
  },
  {
    id: 2,
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
      "Vibrant Ankara shirt and trousers set made from authentic African print fabric. Combines traditional patterns with modern styling for a bold, fashionable look.",
  },
  {
    id: 3,
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
      "Stunning Owanbe gown designed for celebrations and special events. Features luxurious fabric with elegant detailing that ensures you stand out at any gathering.",
  },
  {
    id: 4,
    name: "Corset Dress",
    category: "female",
    subCategory: "corset",
    ageGroup: "adult",
    price: 80,
    isNew: true,
    image:
      "https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/corset%20dress.jpg?alt=media&token=824940a7-4951-4ddc-ab6e-57119a830b18",
    hoverImage:
      "https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/corset%20dress.jpg?alt=media&token=824940a7-4951-4ddc-ab6e-57119a830b18",
    description:
      "Sophisticated corset dress that accentuates your figure with its structured design. Perfect blend of traditional craftsmanship with contemporary fashion sensibilities.",
  },
  {
    id: 5,
    name: "Children's Ankara Set",
    category: "male",
    subCategory: "ankara",
    ageGroup: "children",
    price: 20,
    image:
      "https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/male%20children%20ankara%20set.jpg?alt=media&token=2d3c4f81-d1ba-4458-92d2-2963c573cf87",
    hoverImage:
      "https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/male%20children%20ankara%20set.jpg?alt=media&token=2d3c4f81-d1ba-4458-92d2-2963c573cf87",
    description:
      "Colorful Ankara set designed specifically for children. Made with soft, comfortable fabric featuring playful patterns that kids will love wearing for special occasions.",
  },
  {
    id: 6,
    name: "Baby Kaftan",
    category: "male",
    subCategory: "senator",
    ageGroup: "baby",
    price: 90,
    salePrice: 75,
    image: "/placeholder.svg?height=400&width=300",
    hoverImage: "/placeholder.svg?height=400&width=300",
    description:
      "Adorable baby kaftan made from gentle, skin-friendly fabric. Perfect for celebrations and family gatherings, ensuring your little one looks stylish while staying comfortable.",
  },
  {
    id: 7,
    name: "Elegant Iro and Buba",
    category: "female",
    subCategory: "iro",
    ageGroup: "adult",
    price: 20,
    isFeatured: true,
    image:
      "https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/iro%20and%20buba.jpg?alt=media&token=0565a811-03e8-4d42-8d2f-55dd6c5c59f8",
    hoverImage:
      "https://firebasestorage.googleapis.com/v0/b/tadorado-tailors.firebasestorage.app/o/iro%20and%20buba.jpg?alt=media&token=0565a811-03e8-4d42-8d2f-55dd6c5c59f8",
    description:
      "Traditional Iro and Buba ensemble crafted with attention to detail. Features classic styling with modern touches, perfect for cultural celebrations and formal events.",
  },
  {
    id: 8,
    name: "Corporate Shirt & Trousers",
    category: "male",
    subCategory: "corporate",
    ageGroup: "adult",
    price: 90,
    image: "/placeholder.svg?height=400&width=300",
    hoverImage: "/placeholder.svg?height=400&width=300",
    description:
      "Professional corporate attire tailored for the modern workplace. Combines sharp styling with comfortable fit, ensuring you look polished and feel confident throughout your day.",
  },
];

// Category definitions
const maleCategories: Record<string, string> = {
  senator: "Senator (Owanbe)",
  ankara: "Ankara",
  corporate: "Corporate",
  vintage: "Vintage",
};

const femaleCategories: Record<string, string> = {
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
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const productId = Number(params.id);
    const foundProduct = products.find((p) => p.id === productId);

    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedImage(foundProduct.image);
      setIsLoading(false);
    } else {
      router.push("/collections");
    }
  }, [params.id, router]);

  if (isLoading || !product) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-[#46332E]">Loading product...</div>
        </div>
      </Container>
    );
  }

  const categoryLabel =
    product.category === "male"
      ? maleCategories[product.subCategory] || product.subCategory
      : femaleCategories[product.subCategory] || product.subCategory;

  return (
    <>
      <Banner
        title={product.name}
        description={`Discover our premium ${categoryLabel} collection, crafted with care and attention to detail.`}
      />

      <Container>
        <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button
            variant="outline"
            className="mb-8"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Collections
          </Button>

          {/* Grid Layout for Product */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative w-full h-[450px] sm:h-[550px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-xl border">
                <Image
                  src={selectedImage || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover object-center transition-transform duration-500"
                  priority
                />

                {/* Product Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.isNew && (
                    <Badge className="bg-[#46332E] hover:bg-[#46332E]/90 text-white rounded-2xl">
                      New
                    </Badge>
                  )}
                  {product.salePrice && (
                    <Badge className="bg-red-600 hover:bg-red-700 rounded-2xl text-white">
                      Sale
                    </Badge>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-3">
                <button
                  className={`relative w-20 h-20 rounded-md border overflow-hidden ${
                    selectedImage === product.image
                      ? "ring-2 ring-[#46332E]"
                      : ""
                  }`}
                  onClick={() => setSelectedImage(product.image)}
                  aria-label="View main product image"
                >
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </button>

                {product.hoverImage && product.hoverImage !== product.image && (
                  <button
                    className={`relative w-20 h-20 rounded-md border overflow-hidden ${
                      selectedImage === product.hoverImage
                        ? "ring-2 ring-[#46332E]"
                        : ""
                    }`}
                    onClick={() => setSelectedImage(product.hoverImage!)}
                    aria-label="View alternate product image"
                  >
                    <Image
                      src={product.hoverImage || "/placeholder.svg"}
                      alt={`${product.name} - alternate view`}
                      fill
                      className="object-cover"
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Title & Category */}
              <div>
                <h1 className="text-4xl font-bold text-[#46332E]">
                  {product.name}
                </h1>
                <p className="text-[#46332E]/70 mt-1 text-lg">
                  {categoryLabel}
                </p>
              </div>

              {/* Ratings */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-5 w-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
                <span className="text-sm text-[#46332E]/70 ml-2">
                  (24 reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                {product.salePrice ? (
                  <>
                    <span className="text-3xl font-bold text-[#46332E]">
                      ${product.salePrice}
                    </span>
                    <span className="text-lg text-[#46332E]/60 line-through">
                      ${product.price}
                    </span>
                    <Badge className="bg-red-600 text-white ml-2">
                      {Math.round(
                        (1 - product.salePrice / product.price) * 100
                      )}
                      % OFF
                    </Badge>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-[#46332E]">
                    ${product.price}
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold text-[#46332E] mb-2">
                  Description
                </h2>
                <p className="text-[#46332E]/80 leading-relaxed text-lg">
                  {product.description ||
                    "No description available for this product."}
                </p>
              </div>

              {/* Quantity and Buttons */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center border rounded-md px-3">
                    <button
                      onClick={() =>
                        setQuantity((prev) => Math.max(1, prev - 1))
                      }
                      className="px-4 py-2 text-[#46332E] hover:bg-gray-100"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="px-4 py-2 text-[#46332E] hover:bg-gray-100"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <AddToCartButton
                    product={product}
                    quantity={quantity}
                    redirectToCart={false}
                    className="flex-1"
                  />

                  {/* Buy Now Button */}
                  <Button className="bg-[#46332E] hover:bg-[#2e211b] text-white px-6 py-4 rounded-xl text-lg flex-1">
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
