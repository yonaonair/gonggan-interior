'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { togglePublished, deleteProject } from '@/actions/projects'
import type { Project } from '@/types'
import { useRouter } from 'next/navigation'

interface Props {
  project: Project
}

export default function ProjectAdminRow({ project }: Props) {
  const router = useRouter()
  const [published, setPublished] = useState(project.is_published)
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      const result = await togglePublished(project.id, !published)
      if (result.success) {
        setPublished((v) => !v)
      }
    })
  }

  function handleDelete() {
    if (!confirm(`"${project.title}"을(를) 삭제할까요? 이미지도 함께 삭제됩니다.`)) return
    startTransition(async () => {
      const result = await deleteProject(project.id)
      if (result.success) router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-brown-800/8 hover:border-brown-800/15 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-serif-kr text-[0.92rem] font-semibold text-brown-900 truncate">
            {project.title}
          </span>
          <span className="text-[0.72rem] text-(--text-light) tracking-widest">{project.category}</span>
          {project.year && (
            <span className="text-[0.72rem] text-(--text-light)">{project.year}년</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* 발행 토글 */}
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`min-h-9 px-3 text-[0.72rem] tracking-widest transition-colors border ${
            published
              ? 'bg-brown-900 text-cream-100 border-brown-900 hover:bg-brown-700'
              : 'bg-white text-brown-800/40 border-brown-800/15 hover:border-brown-500 hover:text-brown-500'
          } disabled:opacity-50`}
        >
          {published ? '발행됨' : '미발행'}
        </button>

        <Link
          href={`/admin/projects/${project.id}`}
          className="min-h-9 px-3 text-[0.72rem] tracking-widest text-(--text-light) border border-brown-800/15 hover:border-brown-500 hover:text-brown-500 transition-colors flex items-center"
        >
          수정
        </Link>

        <button
          onClick={handleDelete}
          disabled={isPending}
          className="min-h-9 px-3 text-[0.72rem] tracking-widest text-red-400 border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          삭제
        </button>
      </div>
    </div>
  )
}
