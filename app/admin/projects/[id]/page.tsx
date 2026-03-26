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
    <div>
      <h1 className="font-serif-kr text-[1.5rem] font-semibold text-brown-900 mb-8">
        시공 사례 수정
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h2 className="text-[0.82rem] tracking-widest text-(--text-light) mb-4">기본 정보</h2>
          <ProjectForm project={project} />
        </div>
        <div>
          <h2 className="text-[0.82rem] tracking-widest text-(--text-light) mb-4">시공 사진</h2>
          <ImageUploader projectId={id} initialImages={images} />
        </div>
      </div>
    </div>
  )
}
