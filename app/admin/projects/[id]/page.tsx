import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProjectForm from '@/components/admin/ProjectForm'
import ImageUploader from '@/components/admin/ImageUploader'
import type { Project } from '@/types'

export default async function AdminEditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .eq('id', id)
    .single()

  if (!data) notFound()

  const project = data as Project
  const images = (project.project_images ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((img) => ({
      id: img.id,
      r2_key: img.r2_key,
      is_cover: img.is_cover,
      is_before: img.is_before,
      sort_order: img.sort_order,
    }))

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-[1.5rem] font-semibold text-brown-900 mb-1">
          시공 사례 수정
        </h1>
        <p className="text-[0.82rem] text-(--text-light)">{project.title}</p>
      </div>

      {/* 기본 정보 */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="w-6 h-6 rounded-full bg-brown-900 text-cream-100 text-[0.72rem] font-semibold flex items-center justify-center shrink-0">
            1
          </span>
          <h2 className="text-[0.82rem] tracking-widest text-(--text-light)">기본 정보</h2>
        </div>
        <div className="max-w-xl">
          <ProjectForm project={project} />
        </div>
      </div>

      {/* 시공 사진 */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="w-6 h-6 rounded-full bg-brown-900 text-cream-100 text-[0.72rem] font-semibold flex items-center justify-center shrink-0">
            2
          </span>
          <h2 className="text-[0.82rem] tracking-widest text-(--text-light)">
            시공 사진
            <span className="ml-2 text-brown-800/30">({images.length}장)</span>
          </h2>
        </div>
        <ImageUploader projectId={id} initialImages={images} />
      </div>
    </div>
  )
}
