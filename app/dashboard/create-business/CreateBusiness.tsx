'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function CreateBusiness() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const createBusiness = async () => {
    if (!name.trim()) {
      alert('Store name is required')
      return
    }

    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert('Not authenticated')
      setLoading(false)
      return
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')

    const { error } = await supabase.from('businesses').insert({
      name,
      slug,
      owner_id: user.id,
    })

    setLoading(false)

    if (error) {
      if (error.code === '23505') {
        // 👇 correct message for ONE store per user
        alert('You already have a store')
      } else {
        alert(error.message)
      }
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
        disabled={loading}
        className="bg-black text-white px-4 py-2 w-full disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Store'}
      </button>
    </div>
  )
}
