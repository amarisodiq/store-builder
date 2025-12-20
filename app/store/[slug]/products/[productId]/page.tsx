import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
// import AddToCartButton from "./AddToCartButton";
import AddToCartButton from "@/app/components/AddToCartButton";


export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string; productId: string }>;
}) {
  const { slug, productId } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!business) return notFound();

  const { data: product } = await supabase
    .from("products")
    .select("id, name, price, description, image_url")
    .eq("id", productId)
    .eq("business_id", business.id)
    .single();

  if (!product) return notFound();

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-64 object-cover rounded"
        />
      )}

      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

      <p className="text-xl mb-4">
        ₦{Number(product.price).toLocaleString()}
      </p>

      {product.description && (
        <p className="text-gray-600 mb-6">{product.description}</p>
      )}

      {/* ✅ CLIENT BUTTON */}
      <AddToCartButton product={product} />
    </div>
  );
}
