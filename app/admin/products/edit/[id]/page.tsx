"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Container from "@/app/Components/Container";
import type { Product } from "@/data/products";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState<Omit<Product, "id">>({
    name: "",
    category: "male",
    subCategory: "",
    ageGroup: "adult",
    price: 0,
    salePrice: 0,
    isNew: false,
    isFeatured: false,
    image: "",
    hoverImage: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/products?id=${id}`)
      .then((res) => res.json())
      .then((data: Product) => {
        setForm(data);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    setSaving(true);
    await fetch(`/api/admin/products?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    router.push("/admin/products");
  };

  if (loading)
    return (
      <Container>
        <div className="py-10">Loading...</div>
      </Container>
    );

  return (
    <Container>
      <div className="py-10 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            value={form.name || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="category"
            placeholder="Category"
            value={form.category || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="subCategory"
            placeholder="Sub Category"
            value={form.subCategory || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="ageGroup"
            placeholder="Age Group"
            value={form.ageGroup || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price ?? 0}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="salePrice"
            type="number"
            placeholder="Sale Price"
            value={form.salePrice ?? 0}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            name="image"
            placeholder="Image URL"
            value={form.image || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="hoverImage"
            placeholder="Hover Image URL"
            value={form.hoverImage || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isNew"
              checked={form.isNew}
              onChange={handleChange}
            />{" "}
            New
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
            />{" "}
            Featured
          </label>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </Container>
  );
}
