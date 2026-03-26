'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-[0.80rem] text-cream-200/40 hover:text-cream-200/80 tracking-widest transition-colors min-h-11 px-3"
    >
      로그아웃
    </button>
  )
}
