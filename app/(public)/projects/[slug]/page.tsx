import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublicUrl } from '@/lib/r2'
import type { Project } from '@/types'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('projects')
    .select('title, description')
    .eq('slug', slug)
    .single()
  if (!data) return {}
  return {
    title: `${data.title} | 공간인테리어`,
    description: data.description ?? undefined,
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: project } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .eq('slug', slug)
    .single()

  if (!project) notFound()

  const p = project as Project & { is_published: boolean }
  const sorted = [...(p.project_images ?? [])].sort((a, b) => a.sort_order - b.sort_order)
  const beforeImages = sorted.filter((img) => img.is_before)
  const afterImages = sorted.filter((img) => !img.is_before)

  return (
    <main className="min-h-screen bg-cream-100" style={{ paddingTop: 'var(--nav-h)' }}>
      {/* 미발행 안내 (관리자 미리보기용) */}
      {!p.is_published && (
        <div className="bg-amber-50 border-b border-amber-200 px-[8vw] py-3 text-[0.80rem] text-amber-700 tracking-wide">
          ⚠ 미발행 상태입니다 — 관리자만 볼 수 있습니다.{' '}
          <Link href="/admin/projects" className="underline underline-offset-2 hover:text-amber-900">
            관리자 페이지로
          </Link>
        </div>
      )}
      {/* 헤더 */}
      <div className="bg-brown-900 px-[8vw] py-16">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-[0.80rem] text-cream-200/50 tracking-widest hover:text-cream-200 transition-colors mb-10"
        >
          ← 전체 사례
        </Link>
        <p className="font-display italic text-[0.85rem] text-brown-300 tracking-[0.15em] mb-4">
          {p.category}
        </p>
        <h1 className="font-serif-kr text-[clamp(1.8rem,4vw,3rem)] font-semibold text-cream-100 leading-[1.3] mb-6">
          {p.title}
        </h1>
        <div className="flex flex-wrap gap-6 text-[0.80rem] text-cream-200/40 tracking-widest">
          {p.location && <span>{p.location}</span>}
          {p.area_sqm && <span>{p.area_sqm}㎡</span>}
          {p.duration && <span>{p.duration}</span>}
          {p.year && <span>{p.year}년</span>}
        </div>
      </div>

      <div className="px-[8vw] py-16">
        {p.description && (
          <p className="text-[0.95rem] text-(--text-mid) leading-loose mb-16 max-w-180 break-keep whitespace-pre-wrap">
            {p.description}
          </p>
        )}

        {afterImages.length > 0 && (
          <div className="mb-16">
            <h2 className="font-serif-kr text-[1rem] font-semibold text-brown-900 tracking-widest mb-6">
              시공 후
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1.5px] bg-brown-300/20">
              {afterImages.map((img) => (
                <div key={img.id} className="relative aspect-4/3 overflow-hidden bg-brown-800">
                  <Image
                    src={getPublicUrl(img.r2_key)}
                    alt={p.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {beforeImages.length > 0 && (
          <div className="mb-16">
            <h2 className="font-serif-kr text-[1rem] font-semibold text-brown-900 tracking-widest mb-6">
              시공 전
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1.5px] bg-brown-300/20">
              {beforeImages.map((img) => (
                <div key={img.id} className="relative aspect-4/3 overflow-hidden bg-brown-800">
                  <Image
                    src={getPublicUrl(img.r2_key)}
                    alt={`${p.title} 시공 전`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {sorted.length === 0 && (
          <div className="py-24 text-center text-(--text-light) font-display italic">
            시공 사진 준비 중입니다
          </div>
        )}

        <div className="pt-8 border-t border-brown-800/10">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[0.85rem] text-(--text-light) hover:text-brown-500 transition-colors"
          >
            ← 전체 시공 사례 보기
          </Link>
        </div>
      </div>
    </main>
  )
}
