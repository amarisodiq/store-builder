"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();

  const [businessId, setBusinessId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  // Image states
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadBusiness = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: business } = await supabase
        .from("businesses")
        .select("id")
        .eq("owner_id", user.id)
        .single();

      if (!business) {
        router.push("/dashboard/create-business");
        return;
      }

      setBusinessId(business.id);
    };

    loadBusiness();
  }, [router]);

  // Upload image to Supabase Storage
  const uploadImage = async (file: File) => {
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${businessId}/${Date.now()}.${fileExt}`; // unique file name

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      alert(uploadError.message);
      setUploading(false);
      return null;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    setUploading(false);
    return data.publicUrl;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setImageFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) return;

    setLoading(true);

    let uploadedImageUrl = imageUrl;

    if (imageFile) {
      uploadedImageUrl = await uploadImage(imageFile);
    }

    const { error } = await supabase.from("products").insert({
      business_id: businessId,
      name,
      description,
      price: Number(price),
      image_url: uploadedImageUrl || null,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-xl p-6">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 w-full"
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full"
        />

        <input
          type="number"
          placeholder="Price (₦)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="border p-2 w-full"
        />

        <div className="space-y-2">
          <label className="block font-medium">Product Image</label>
          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Product image"
              className="h-32 w-32 object-cover rounded border"
            />
          )}
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
        </div>

        <button
          disabled={loading || uploading}
          className="bg-black text-white px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
