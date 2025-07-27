"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Container from "@/app/Components/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowLeft, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import AddToCartButton from "@/components/ui/AddToCartButton";
import { useCart } from "@/components/ui/CartContext";

type Product = {
  id: number;
  name: string;
  category: string;
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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setSelectedImage(data.image);
        setIsLoading(false);
      });
  }, [params.id]);

  if (isLoading || !product) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-[#46332E]">Loading product...</div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="outline"
          className="mb-8"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Collections
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative w-full h-[600px] overflow-hidden rounded-xl border">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.isNew && (
                  <Badge className="bg-[#46332E] text-white">New</Badge>
                )}
                {product.salePrice && (
                  <Badge className="bg-red-600 text-white">Sale</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-[#46332E]">
              {product.name}
            </h1>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 text-yellow-400 fill-yellow-400"
                />
              ))}
              <span className="text-sm ml-2 text-[#46332E]/70">
                (24 reviews)
              </span>
            </div>
            <p className="text-lg font-bold text-[#46332E]">
              {product.salePrice ? (
                <>
                  <span className="text-3xl">${product.salePrice}</span>
                  <span className="text-lg line-through ml-2 text-[#46332E]/60">
                    ${product.price}
                  </span>
                </>
              ) : (
                `$${product.price}`
              )}
            </p>
            <p className="text-base text-[#46332E]/80">{product.description}</p>

            <div className="pt-6 border-t border-gray-200 flex gap-4">
              <Button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                -
              </Button>
              <span className="text-xl px-4">{quantity}</span>
              <Button onClick={() => setQuantity(quantity + 1)}>+</Button>
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  salePrice: product.salePrice,
                  image: product.image,
                  category: product.category,
                  subCategory: product.subCategory,
                }}
                quantity={quantity}
                showQuantity={false}
                redirectToCart={true}
                className="flex-1"
              />
              <Button
                className="bg-[#46332E] text-white flex-1"
                onClick={() => {
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    salePrice: product.salePrice,
                    image: product.image,
                    category: product.category,
                    subCategory: product.subCategory,
                    quantity,
                  });
                  router.push("/checkOut");
                }}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
