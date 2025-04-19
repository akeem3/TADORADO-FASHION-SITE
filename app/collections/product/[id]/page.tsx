"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Container from "@/app/Components/Container";
// import Banner from "@/components/ui/banner";
import AddToCartButton from "@/components/ui/AddToCartButton";
import { products, maleCategories, femaleCategories,Product  } from "@/data/products";



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
      {/* <Banner
        title={product.name}
        description={`Discover our premium ${categoryLabel} collection, crafted with care and attention to detail.`}
      /> */}

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
                  <Button className="mt-1 bg-[#46332E] hover:bg-[#56453c] text-white  py-4 rounded-2xl text-lg flex-1">
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
