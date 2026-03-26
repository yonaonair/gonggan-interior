'use client'

import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProject, updateProject } from '@/actions/projects'
import type { Project, ProjectCategory } from '@/types'

const CATEGORIES: ProjectCategory[] = ['주거공간', '상업공간', '교육·종교', '신축·증축']

interface Props {
  project?: Project
}

export default function ProjectForm({ project }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const inputClass =
    'w-full px-4 py-2.5 border border-brown-800/15 bg-white text-[0.85rem] text-brown-900 outline-none focus:border-brown-500 transition-colors'
  const labelClass = 'text-[0.78rem] tracking-widest text-(--text-light)'

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setError('')

    startTransition(async () => {
      const result = project
        ? await updateProject(project.id, formData)
        : await createProject(formData)

      if (!result.success) {
        setError(result.error ?? '오류가 발생했습니다.')
        return
      }

      if (!project && 'id' in result) {
        router.push(`/admin/projects/${result.id}`)
      } else {
        router.refresh()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>제목 *</label>
        <input
          name="title"
          type="text"
          required
          defaultValue={project?.title}
          placeholder="예: 곡성 단독주택 리모델링"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>카테고리 *</label>
        <select name="category" required defaultValue={project?.category} className={inputClass}>
          <option value="">선택</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>시공 지역</label>
          <input
            name="location"
            type="text"
            defaultValue={project?.location ?? ''}
            placeholder="예: 전남 곡성"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>시공 연도</label>
          <input
            name="year"
            type="number"
            defaultValue={project?.year ?? ''}
            placeholder="예: 2024"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>면적 (㎡)</label>
          <input
            name="area_sqm"
            type="number"
            step="0.1"
            defaultValue={project?.area_sqm ?? ''}
            placeholder="예: 85"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>공사 기간</label>
          <input
            name="duration"
            type="text"
            defaultValue={project?.duration ?? ''}
            placeholder="예: 3주"
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>설명</label>
        <textarea
          name="description"
          rows={5}
          defaultValue={project?.description ?? ''}
          placeholder="시공 내용, 특이사항 등을 자유롭게 입력하세요."
          className={`${inputClass} resize-y`}
        />
      </div>

      <div className="flex gap-6 pt-1">
        <label className="flex items-center gap-2 cursor-pointer text-[0.82rem] text-brown-900">
          <input
            name="is_published"
            type="checkbox"
            value="true"
            defaultChecked={project?.is_published}
            className="accent-brown-500 w-4 h-4"
          />
          발행
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-[0.82rem] text-brown-900">
          <input
            name="is_featured"
            type="checkbox"
            value="true"
            defaultChecked={project?.is_featured}
            className="accent-brown-500 w-4 h-4"
          />
          대표 사례
        </label>
      </div>

      {error && <p className="text-[0.82rem] text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="self-start min-h-11 px-8 bg-brown-900 text-cream-100 text-[0.82rem] tracking-widest hover:bg-brown-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? '저장 중…' : project ? '수정 저장' : '등록하기'}
      </button>
    </form>
  )
}
