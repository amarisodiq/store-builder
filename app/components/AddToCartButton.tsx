"use client";

import { useCart } from "@/app/context/CartContext";

type Props = {
  product: {
    id: string;
    name: string;
    price: number;
    image_url?: string | null;
  };
};

export default function AddToCartButton({ product }: Props) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() =>
        addToCart({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image_url: product.image_url ?? undefined,
        })
      }
      className="bg-black text-white px-6 py-3 rounded"
    >
      Add to cart
    </button>
  );
}
