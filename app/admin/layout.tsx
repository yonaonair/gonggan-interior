import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import SignOutButton from '@/components/admin/SignOutButton'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''

  // 로그인 페이지는 네비 없이 그대로 렌더링 (proxy.ts가 인증 보호 담당)
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-cream-100">
      <header className="bg-brown-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="font-serif-kr text-[1rem] font-semibold text-cream-200 tracking-[0.05em]">
            공간인테리어 관리자
          </span>
          <nav className="hidden sm:flex gap-6">
            <Link
              href="/admin/projects"
              className="text-[0.82rem] text-cream-200/60 hover:text-cream-100 tracking-widest transition-colors"
            >
              시공 사례
            </Link>
            <Link
              href="/admin/inquiries"
              className="text-[0.82rem] text-cream-200/60 hover:text-cream-100 tracking-widest transition-colors"
            >
              문의 목록
            </Link>
          </nav>
        </div>
        <SignOutButton />
      </header>
      <main className="px-6 py-8 max-w-300 mx-auto">{children}</main>
    </div>
  )
}
