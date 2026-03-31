'use client'

import { useState } from 'react'
import ProjectForm from '@/components/admin/ProjectForm'
import ImageUploader from '@/components/admin/ImageUploader'

export default function AdminNewProjectPage() {
  const [createdId, setCreatedId] = useState<string | null>(null)

  return (
    <div>
      <h1 className="text-[1.5rem] font-semibold text-brown-900 mb-1">
        새 시공 사례 등록
      </h1>
      <p className="text-[0.82rem] text-(--text-light) mb-8">
        기본 정보를 저장하면 사진을 추가할 수 있습니다.
      </p>

      <div className="flex flex-col gap-10">
        {/* STEP 1 — 기본 정보 */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-6 rounded-full bg-brown-900 text-cream-100 text-[0.72rem] font-semibold flex items-center justify-center shrink-0">
              1
            </span>
            <h2 className="text-[0.82rem] tracking-widest text-(--text-light)">기본 정보</h2>
          </div>
          <ProjectForm onCreated={(id) => setCreatedId(id)} />
        </div>

        {/* STEP 2 — 사진 */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className={`w-6 h-6 rounded-full text-[0.72rem] font-semibold flex items-center justify-center shrink-0 ${
              createdId ? 'bg-brown-900 text-cream-100' : 'bg-brown-800/20 text-brown-800/40'
            }`}>
              2
            </span>
            <h2 className={`text-[0.82rem] tracking-widest ${createdId ? 'text-(--text-light)' : 'text-brown-800/30'}`}>
              시공 사진
            </h2>
          </div>

          {createdId ? (
            <ImageUploader projectId={createdId} />
          ) : (
            <div className="border border-dashed border-brown-800/15 px-8 py-10 text-center text-[0.82rem] text-(--text-light)">
              기본 정보를 먼저 저장해 주세요
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
