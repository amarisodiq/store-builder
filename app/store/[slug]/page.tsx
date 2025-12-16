// import { notFound } from 'next/navigation'
// import { createSupabaseServerClient } from '@/lib/supabase/server'

// export default async function StorePage({
//   params,
// }: {
//   params: { slug: string }
// }) {
//   const supabase = await createSupabaseServerClient()

//   const { data: business } = await supabase
//     .from('businesses')
//     .select('*')
//     .eq('slug', params.slug)
//     .single()

//   if (!business) notFound()

//   return (
//     <div className="p-8 max-w-3xl mx-auto">
//       <h1 className="text-3xl font-bold">{business.name}</h1>
//       <p className="text-gray-600">
//         Store is live 🚀
//       </p>
//     </div>
//   )
// }

import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function StorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createSupabaseServerClient();

  const { data: business, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !business) {
    return notFound();
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
       <h1 className="text-3xl font-bold">{business.name}</h1>
       <p className="text-gray-600">
         Store is live 🚀
       </p>
     </div>
  );
}
