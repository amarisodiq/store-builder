"use client";

import { useCart } from "@/app/context/CartContext";

export default function CartPage() {
  const { items, increaseQuantity, decreaseQuantity, removeFromCart } =
    useCart();

  if (items.length === 0) {
    return <p className="p-8">Your cart is empty</p>;
  }

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {items.map((item) => (
        <div key={item.productId} className="flex gap-4 border-b py-4">
          {/* Image */}
          {item.image_url && (
            <img
              src={item.image_url}
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />
          )}

          {/* Info */}
          <div className="flex-1">
            <p className="font-semibold">{item.name}</p>
            <p className="text-gray-600">₦{item.price.toLocaleString()}</p>

            {/* Quantity controls */}
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => decreaseQuantity(item.productId)}
                className="px-3 py-1 border rounded"
              >
                −
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() => increaseQuantity(item.productId)}
                className="px-3 py-1 border rounded"
              >
                +
              </button>
            </div>
          </div>

          {/* Remove */}
          <button
            onClick={() => removeFromCart(item.productId)}
            className="text-red-500"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="mt-6 text-right">
        <p className="text-xl font-bold">Total: ₦{total.toLocaleString()}</p>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          className="bg-black text-white px-6 py-3 rounded hover:opacity-90"
          onClick={() => alert("Checkout coming next")}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
