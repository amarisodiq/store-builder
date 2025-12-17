import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProductsPage() {
  const supabase = await createSupabaseServerClient();

  // 1️⃣ Get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 2️⃣ Get user's business
  const { data: business } = await supabase
    .from("businesses")
    .select("id, name")
    .eq("owner_id", user.id)
    .single();

  if (!business) redirect("/dashboard/create-business");

  // 3️⃣ Get products
  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, created_at")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/dashboard/products/new"
          className="bg-black text-white px-4 py-2"
        >
          Add Product
        </Link>
      </div>

      {products && products.length > 0 ? (
        <div className="border rounded">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4 border-b last:border-b-0"
            >
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">
                  ₦{Number(product.price).toLocaleString()}
                </p>
              </div>

              <div className="text-sm text-gray-500">
                {new Date(product.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products yet.</p>
      )}
    </div>
  );
}
