import ProjectForm from '@/components/admin/ProjectForm'

export default function AdminNewProjectPage() {
  return (
    <div>
      <h1 className="font-serif-kr text-[1.5rem] font-semibold text-brown-900 mb-8">
        새 시공 사례 등록
      </h1>
      <ProjectForm />
    </div>
  )
}
