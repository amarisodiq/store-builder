import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function StorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  // 1️⃣ Get the business
  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (businessError || !business) {
    return notFound();
  }

  // 2️⃣ Get products for this business
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{business.name}</h1>
      <p className="text-gray-600 mb-8">Store is live 🚀</p>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 shadow-sm"
            >
              <h2 className="text-xl font-semibold">{product.name}</h2>
              {product.description && (
                <p className="text-gray-600 mt-2">
                  {product.description}
                </p>
              )}
              <p className="mt-4 font-bold">
                ₦{Number(product.price).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products yet.</p>
      )}
    </div>
  );
}
