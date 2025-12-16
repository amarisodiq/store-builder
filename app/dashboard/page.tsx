import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (!business) {
    redirect('/dashboard/create-business')
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

      <div className="border rounded p-4 mb-6">
        <h2 className="text-lg font-medium">{business.name}</h2>
        <p className="text-sm text-gray-500">Slug: {business.slug}</p>
      </div>

      <div className="flex gap-3">
        <a
          href={`/store/${business.slug}`}
          className="bg-black text-white px-4 py-2 rounded"
        >
          View Store
        </a>

        <button className="border px-4 py-2 rounded">
          Store Settings
        </button>
      </div>
    </div>
  )
}
