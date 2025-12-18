import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProductList from "./ProductList";

export default async function ProductsPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("id, slug")
    .eq("owner_id", user.id)
    .single();

  if (!business) redirect("/dashboard/create-business");

  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, description, image_url")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 max-w-4xl m-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/dashboard/products/new"
          className="bg-black text-white px-4 py-2"
        >
          Add Product
        </Link>
         <a
          href={`/store/${business.slug}/products`}
          className="bg-black text-white px-4 py-2 rounded"
        >
          View Store
        </a>
      </div>

      <ProductList products={products ?? []} />
    </div>
  );
}
