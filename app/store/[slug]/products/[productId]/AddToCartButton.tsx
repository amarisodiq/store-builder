// "use client";

// import { useCart } from "@/app/context/CartContext";

// export default function AddToCartButton({ product }: any) {
//   const { addToCart } = useCart();

//   return (
//     <button
//       type="button"
//       onClick={() => {
//         console.log("ADD TO CART CLICKED"); // 🔥 debug
//         addToCart({
//           productId: product.id,
//           name: product.name,
//           price: product.price,
//           quantity: 1,
//           image_url: product.image_url ?? undefined,
//         });
//       }}
//       className="bg-black text-white px-6 py-3 rounded"
//     >
//       Add to cart
//     </button>
//   );
// }

// "use client";

// import { useCart } from "@/app/context/CartContext";

// export default function AddToCartButton({ product }: any) {
//   const { addToCart } = useCart();

//   return (
//     <button
//       type="button"
//       onClick={() => {
//         console.log("CLICKED");
//         addToCart({
//           productId: product.id,
//           name: product.name,
//           price: product.price,
//           quantity: 1,
//           image_url: product.image_url ?? undefined,
//         });
//       }}
//       className="bg-black text-white px-6 py-3 rounded"
//     >
//       Add to cart
//     </button>
//   );
// }

"use client";

import { useCart } from "@/app/context/CartContext";

export default function AddToCartButton({ product }: any) {
  const { addToCart } = useCart();

  return (
    <button
      type="button"
      onClick={() => {
        const cartItem = {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image_url: product.image_url ?? undefined,
        };
      
        console.log("ADD TO CART", cartItem);
        addToCart(cartItem);
            
      }}
      className="bg-black text-white px-6 py-3 rounded"
    >
      Add to cart
    </button>
  );
}
