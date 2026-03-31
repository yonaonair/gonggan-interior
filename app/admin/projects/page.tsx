import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ProjectAdminRow from '@/components/admin/ProjectAdminRow'
import type { Project } from '@/types'

export default async function AdminProjectsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('projects')
    .select('id, title, slug, category, year, is_published, is_featured, created_at')
    .order('created_at', { ascending: false })

  const projects = (data ?? []) as Project[]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[1.5rem] font-semibold text-brown-900">시공 사례</h1>
        <Link
          href="/admin/projects/new"
          className="min-h-11 px-6 py-2.5 bg-brown-900 text-cream-100 text-[0.82rem] tracking-widest hover:bg-brown-700 transition-colors"
        >
          + 새 사례 등록
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-center py-20 text-(--text-light) font-display italic">
          등록된 프로젝트가 없습니다
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {projects.map((p) => (
            <ProjectAdminRow key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  )
}
