'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { getPublicUrl } from '@/lib/r2'
import { addSiteImage, deleteSiteImage } from '@/actions/site-images'
import type { SiteSlot, SiteImage } from '@/actions/site-images'

interface Props {
  slot: SiteSlot
  initialImages?: SiteImage[]
  maxImages?: number
  label: string
  hint?: string
}

export default function SiteImageUploader({
  slot,
  initialImages = [],
  maxImages,
  label,
  hint,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<SiteImage[]>(initialImages)
  const [uploading, setUploading] = useState(false)

  const canAdd = maxImages === undefined || images.length < maxImages

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)

    for (const file of Array.from(files)) {
      if (maxImages !== undefined && images.length >= maxImages) break

      const ext = file.name.split('.').pop() ?? 'jpg'
      const key = `site/${slot}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      try {
        // 서버 API를 통해 R2에 직접 업로드 (CORS 우회)
        const form = new FormData()
        form.append('file', file)
        form.append('key', key)
        const res = await fetch('/api/upload', { method: 'POST', body: form })
        if (!res.ok) throw new Error('업로드 실패')

        const result = await addSiteImage(slot, key, images.length)

        if (!result.success) {
          alert(`DB 저장 실패: ${result.error}`)
        } else {
          setImages((prev) => [
            ...prev,
            { id: crypto.randomUUID(), slot, r2_key: key, sort_order: prev.length },
          ])
        }
      } catch (e) {
        console.error('Upload failed:', e)
        alert(`업로드 실패: ${e instanceof Error ? e.message : String(e)}`)
      }
    }

    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleDelete(img: SiteImage) {
    if (!confirm('이미지를 삭제할까요?')) return
    const result = await deleteSiteImage(img.id, img.r2_key)
    if (result.success) {
      setImages((prev) => prev.filter((i) => i.id !== img.id))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-[0.85rem] font-medium text-brown-900 mb-0.5">{label}</div>
        {hint && <div className="text-[0.78rem] text-(--text-light)">{hint}</div>}
      </div>

      {/* 이미지 미리보기 */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <div key={img.id} className="relative group">
              <div className="relative aspect-4/3 overflow-hidden bg-brown-800">
                <Image
                  src={getPublicUrl(img.r2_key)}
                  alt={`${label} ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[0.70rem] text-(--text-light)">
                  {slot === 'hero' ? `슬라이드 ${i + 1}` : '대표 사진'}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(img)}
                  className="text-[0.70rem] text-red-500 hover:text-red-700 min-h-6 px-1 cursor-pointer bg-transparent border-0"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 업로드 버튼 */}
      {canAdd && (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple={maxImages === undefined || maxImages > 1}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="min-h-11 px-6 py-2.5 border border-brown-800/20 bg-white text-[0.82rem] text-brown-900 hover:bg-cream-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {uploading ? '업로드 중…' : images.length === 0 ? '+ 사진 추가' : '+ 사진 추가'}
          </button>
          {maxImages !== undefined && (
            <span className="ml-3 text-[0.78rem] text-(--text-light)">
              {images.length} / {maxImages}
            </span>
          )}
        </div>
      )}

      {images.length === 0 && (
        <div className="border border-dashed border-brown-800/15 px-6 py-8 text-center text-[0.82rem] text-(--text-light)">
          등록된 이미지가 없습니다
        </div>
      )}
    </div>
  )
}
