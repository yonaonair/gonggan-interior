'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    startTransition(async () => {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.')
        return
      }
      router.push('/admin/projects')
      router.refresh()
    })
  }

  const inputClass =
    'w-full px-4 py-3 border border-brown-800/20 bg-white text-[0.88rem] text-brown-900 outline-none focus:border-brown-500 transition-colors'

  return (
    <div className="min-h-screen bg-brown-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="font-display italic text-[0.85rem] text-brown-300 tracking-[0.2em] mb-3">
            Admin
          </p>
          <h1 className="font-serif-kr text-[1.8rem] font-semibold text-cream-100">
            공간인테리어
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.78rem] tracking-widest text-cream-200/50">이메일</label>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.78rem] tracking-widest text-cream-200/50">비밀번호</label>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={inputClass}
            />
          </div>

          {error && (
            <p className="text-[0.82rem] text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 min-h-11 bg-cream-200 text-brown-900 text-[0.85rem] tracking-[0.12em] hover:bg-cream-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? '로그인 중…' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}
