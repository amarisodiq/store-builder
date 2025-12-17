"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const productId = params.id;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);

  // 1️⃣ Load product
  useEffect(() => {
    const loadProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("name, description, price")
        .eq("id", productId)
        .single();

      if (error || !data) {
        alert("Product not found");
        router.push("/dashboard/products");
        return;
      }

      setName(data.name);
      setDescription(data.description ?? "");
      setPrice(String(data.price));
      setLoading(false);
    };

    loadProduct();
  }, [productId, router]);

  // 2️⃣ Update product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from("products")
      .update({
        name,
        description,
        price: Number(price),
      })
      .eq("id", productId);

    if (error) {
      alert(error.message);
    } else {
      router.push("/dashboard/products");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-xl p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 w-full"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full"
        />

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="border p-2 w-full"
        />

        <div className="flex gap-4">
          <button className="bg-black text-white px-4 py-2">
            Save Changes
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard/products")}
            className="border px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
