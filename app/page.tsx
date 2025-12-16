// import Image from "next/image";

// export default function Home() {
//   return (
//     <main className="flex min-h-screen items-center justify-center">
//       <h1 className="text-2xl font-bold">
//         Store Builder – Day One
//       </h1>
//     </main>
//   );
// }

"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col min-h-screen items-center justify-center gap-6">
      <h1 className="text-2xl font-bold">
        Store Builder – Day One
      </h1>

      {/* Login Button */}
      <button
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={() => router.push("/login")} // navigate to /login page
      >
        Login
      </button>
    </main>
  );
}
