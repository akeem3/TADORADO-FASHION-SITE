"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Container from "@/app/Components/Container";
import type { Product } from "@/data/products";
import { maleCategories, femaleCategories } from "@/data/products";

const ageGroups = ["adult", "children", "baby"] as const;
const categories = ["male", "female"] as const;

type ProductFormState = Omit<
  Product,
  "id" | "isNew" | "isFeatured" | "salePrice"
> & {
  isNew: "true" | "false";
  isFeatured: "true" | "false";
  salePrice: string;
};

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormState>({
    name: "",
    category: "male",
    subCategory: "senator",
    ageGroup: "adult",
    price: 0,
    salePrice: "",
    isNew: "false",
    isFeatured: "false",
    image: "",
    hoverImage: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get subcategories based on selected category
  const subCategoryOptions =
    form.category === "male"
      ? Object.entries(maleCategories)
      : Object.entries(femaleCategories);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const target = e.target;
    if (type === "checkbox" && target instanceof HTMLInputElement) {
      setForm((prev) => ({ ...prev, [name]: target.checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Prepare data with correct types
    const payload: Omit<Product, "id"> = {
      ...form,
      price: Number(form.price),
      salePrice: form.salePrice !== "" ? Number(form.salePrice) : undefined,
      isNew: form.isNew === "true",
      isFeatured: form.isFeatured === "true",
    };
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Failed to add product. " + (await res.text()));
      return;
    }
    router.push("/admin/products");
  };

  return (
    <Container>
      <div className="py-10 max-w-xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white p-6 rounded-xl shadow"
        >
          <div>
            <label className="block mb-1 font-medium" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              placeholder="Name"
              value={form.name || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="block mb-1 font-medium">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="subCategory" className="block mb-1 font-medium">
              Sub Category
            </label>
            <select
              id="subCategory"
              name="subCategory"
              value={form.subCategory}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              {subCategoryOptions.map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ageGroup" className="block mb-1 font-medium">
              Age Group
            </label>
            <select
              id="ageGroup"
              name="ageGroup"
              value={form.ageGroup}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              {ageGroups.map((ag) => (
                <option key={ag} value={ag}>
                  {ag.charAt(0).toUpperCase() + ag.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="price">
              Price
            </label>
            <input
              id="price"
              name="price"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              min={0}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="salePrice">
              Sale Price
            </label>
            <input
              id="salePrice"
              name="salePrice"
              type="number"
              placeholder="Sale Price"
              value={form.salePrice}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min={0}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="image">
              Image URL
            </label>
            <input
              id="image"
              name="image"
              placeholder="Image URL"
              value={form.image || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="hoverImage">
              Hover Image URL
            </label>
            <input
              id="hoverImage"
              name="hoverImage"
              placeholder="Hover Image URL"
              value={form.hoverImage || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Description"
              value={form.description || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="isNew" className="block mb-1 font-medium">
                New?
              </label>
              <select
                id="isNew"
                name="isNew"
                value={form.isNew}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="isFeatured" className="block mb-1 font-medium">
                Featured?
              </label>
              <select
                id="isFeatured"
                name="isFeatured"
                value={form.isFeatured}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>
          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-xl"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </Button>
        </form>
      </div>
    </Container>
  );
}
