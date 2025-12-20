import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function StoreProductsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  // 1️⃣ Get business
  const { data: business } = await supabase
    .from("businesses")
    .select("id, name")
    .eq("slug", slug)
    .single();

  if (!business) return notFound();

  // 2️⃣ Get products (include image_url)
  const { data: products } = await supabase
  .from("products")
  .select("id, name, price, description, image_url")
  .eq("business_id", business.id);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/cart" className="underline">
  View Cart
</Link>

      <h1 className="text-3xl font-bold mb-6">{business.name}</h1>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/store/${slug}/products/${product.id}`}
              className="border p-4 rounded hover:shadow transition block"
            >
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-40 w-full object-cover rounded mb-3"
                />
              )}

              <h2 className="font-semibold">{product.name}</h2>

              {product.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.description}
                </p>
              )}

              <p className="mt-3 font-bold">
                ₦{Number(product.price).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products available</p>
      )}
    </div>
  );
}
