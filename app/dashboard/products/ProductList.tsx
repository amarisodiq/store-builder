"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function ProductList({ products }: { products: any[] }) {
  const deleteProduct = async (id: string) => {
    const ok = confirm("Delete this product?");
    if (!ok) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
    } else {
      location.reload();
    }
  };

  return (
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

          <div className="flex items-center gap-4 text-sm">
            <Link
              href={`/dashboard/products/${product.id}/edit`}
              className="underline"
            >
              Edit
            </Link>

            <button
              onClick={() => deleteProduct(product.id)}
              className="text-red-600 underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
