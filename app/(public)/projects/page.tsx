import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { getPublicUrl } from '@/lib/r2'
import type { Project } from '@/types'

export const metadata = {
  title: '시공 사례 | 공간인테리어',
  description: '공간인테리어의 주거·상업·교육·신축 시공 사례를 확인하세요.',
}

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  const items = (projects ?? []) as Project[]

  return (
    <main className="min-h-screen bg-cream-100" style={{ paddingTop: 'var(--nav-h)' }}>
      <div className="py-20 px-[8vw]">
        <p className="inline-flex items-center gap-3 font-display italic text-[0.85rem] text-brown-500 tracking-[0.15em] mb-5 before:block before:w-7 before:h-px before:bg-brown-500">
          Portfolio
        </p>
        <h1 className="font-serif-kr text-[clamp(2rem,4vw,3rem)] font-semibold text-brown-900 leading-[1.3] mb-3">
          전체 시공 사례
        </h1>
        <p className="text-[0.95rem] text-(--text-light) mb-14">
          총 {items.length}건의 시공 사례를 소개합니다.
        </p>

        {items.length === 0 ? (
          <div className="text-center py-32 text-(--text-light) font-display italic">
            등록된 프로젝트가 없습니다
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1.5px] bg-brown-300/30 border-[1.5px] border-brown-300/30">
            {items.map((p) => {
              const cover = p.project_images?.find((img) => img.is_cover) ?? p.project_images?.[0]
              return (
                <Link
                  key={p.id}
                  href={`/projects/${p.slug}`}
                  className="group relative overflow-hidden bg-brown-800 block"
                  style={{ aspectRatio: '4/3' }}
                >
                  {cover ? (
                    <Image
                      src={getPublicUrl(cover.r2_key)}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-brown-700">
                      <span className="font-display italic text-[0.75rem] text-cream-200/30 tracking-[0.15em]">
                        사진 준비 중
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-brown-900/85 to-transparent px-6 py-5">
                    <div className="text-[0.80rem] text-brown-300 tracking-[0.12em] mb-1">{p.category}</div>
                    <div className="font-serif-kr text-[0.95rem] font-semibold text-cream-100">{p.title}</div>
                    {p.year && (
                      <div className="text-[0.75rem] text-cream-200/45 mt-0.5">{p.year}년</div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
