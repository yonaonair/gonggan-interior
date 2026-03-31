'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/types'
import { getPublicUrl } from '@/lib/r2'

type FilterCategory = '전체' | '주거공간' | '상업공간' | '교육·종교' | '신축·증축'

const FILTERS: FilterCategory[] = ['전체', '주거공간', '상업공간', '교육·종교', '신축·증축']

function ProjectPlaceholder() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-brown-700">
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" opacity={0.2}>
        <path d="M6 32 L30 10 L54 32" stroke="rgba(242,233,220,0.8)" strokeWidth="1.5" fill="none" />
        <rect x="10" y="32" width="40" height="22" stroke="rgba(242,233,220,0.8)" strokeWidth="1.5" fill="none" />
        <rect x="24" y="38" width="12" height="16" fill="rgba(242,233,220,0.3)" />
      </svg>
      <span className="font-display italic text-[0.75rem] text-cream-200/30 tracking-[0.15em]">
        시공 사진으로 교체 예정
      </span>
    </div>
  )
}

interface Props {
  projects: Project[]
}

export default function ProjectsSection({ projects }: Props) {
  const [active, setActive] = useState<FilterCategory>('전체')

  const filtered = active === '전체'
    ? projects
    : projects.filter((p) => p.category === active)

  return (
    <section id="projects" className="bg-brown-900 py-28 px-[8vw]">
      {/* 헤더 + 필터 */}
      <div className="flex flex-wrap items-end justify-between gap-8 mb-14">
        <div>
          <p className="inline-flex items-center gap-3 font-display italic text-[0.85rem] text-brown-300 tracking-[0.15em] mb-5 before:block before:w-7 before:h-px before:bg-brown-300">
            Portfolio
          </p>
          <h2 className="font-serif-kr text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold text-cream-100 leading-[1.3]">
            시공 사례
          </h2>
          <p className="text-[0.95rem] text-cream-200/50 mt-2">직접 완성한 공간들을 소개합니다.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-4.5 py-2 text-[0.80rem] tracking-[0.08em] rounded-sm border transition-all duration-400 cursor-pointer ${
                active === f
                  ? 'bg-cream-200 text-brown-900 border-cream-200'
                  : 'bg-transparent text-cream-200/50 border-cream-200/20 hover:bg-cream-200 hover:text-brown-900 hover:border-cream-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* 프로젝트 그리드 */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-cream-200/30 font-display italic text-lg">
          등록된 프로젝트가 없습니다
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1.5px] bg-white/5 border-[1.5px] border-white/5">
          {filtered.map((p, i) => {
            const coverImage = p.project_images?.find((img) => img.is_cover) ?? p.project_images?.[0]
            const isFeatured = p.is_featured && i === 0

            return (
              <Link
                key={p.id}
                href={`/projects/${p.slug}`}
                className={`group relative overflow-hidden block bg-brown-800 ${
                  isFeatured ? 'lg:col-span-2' : ''
                }`}
                style={{ aspectRatio: isFeatured ? 'auto' : '4/3' }}
              >
                <div className="w-full h-full min-h-60 transition-transform duration-600 group-hover:scale-[1.03]">
                  {coverImage ? (
                    <Image
                      src={getPublicUrl(coverImage.r2_key)}
                      alt={p.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <ProjectPlaceholder />
                  )}
                </div>

                {/* 항상 보이는 하단 정보 */}
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-brown-900/80 to-transparent px-6 py-5">
                  <div className="font-serif-kr text-[0.9rem] font-semibold text-cream-200">{p.title}</div>
                  <div className="text-[0.80rem] text-cream-200/45 tracking-widest">
                    {p.category}{p.year ? ` · ${p.year}` : ''}
                  </div>
                </div>

                {/* 호버 오버레이 */}
                <div className="absolute inset-0 bg-linear-to-t from-brown-900/95 via-brown-900/30 to-transparent px-7 py-7 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                  <div className="text-[0.80rem] tracking-[0.15em] text-brown-300 mb-2">{p.category}</div>
                  <div className="font-serif-kr text-[1rem] font-semibold text-cream-100 mb-1">{p.title}</div>
                  {(p.location || p.area_sqm || p.duration) && (
                    <div className="text-[0.78rem] text-cream-200/60">
                      {[p.location, p.area_sqm ? `${p.area_sqm}㎡` : null, p.duration].filter(Boolean).join(' · ')}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* 더보기 링크 */}
      <div className="text-center mt-12">
        <Link
          href="/projects"
          className="inline-flex items-center gap-3 text-[0.88rem] text-cream-200/50 tracking-widest hover:text-cream-200 transition-colors duration-400"
        >
          전체 시공 사례 보기
          <span className="text-lg">→</span>
        </Link>
      </div>
    </section>
  )
}
