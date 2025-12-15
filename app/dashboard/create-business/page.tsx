'use client'

import { useState } from 'react'
import { supabase } from "@/lib/supabase/client";
import { useRouter } from 'next/navigation'

export default function CreateBusiness() {
  const [name, setName] = useState('')
  const router = useRouter()

  const createBusiness = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return alert('Not authenticated')

    const slug = name.toLowerCase().replace(/\s+/g, '-')

    const { error } = await supabase.from('businesses').insert({
      name,
      slug,
      owner_id: user.id,
    })

    if (error) {
      alert(error.message)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="p-6 max-w-md">
      <h1 className="text-xl font-semibold mb-4">Create your store</h1>

      <input
        type="text"
        placeholder="Store name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={createBusiness}
        className="bg-black text-white px-4 py-2 w-full"
      >
        Create Store
      </button>
    </div>
  )
}
