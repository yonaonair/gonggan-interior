'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { getPublicUrl } from '@/lib/r2'
import { addProjectImage, deleteProjectImage } from '@/actions/projects'

interface UploadedImage {
  id: string
  r2_key: string
  is_cover: boolean
  is_before: boolean
  sort_order: number
}

interface Props {
  projectId: string
  initialImages?: UploadedImage[]
}

export default function ImageUploader({ projectId, initialImages = [] }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<UploadedImage[]>(initialImages)
  const [uploading, setUploading] = useState(false)
  const [isBefore, setIsBefore] = useState(false)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop() ?? 'jpg'
      const key = `projects/${projectId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      try {
        // presigned URL 발급
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, contentType: file.type }),
        })
        if (!res.ok) throw new Error('presigned URL 발급 실패')
        const { url } = await res.json()

        // R2에 직접 업로드
        const uploadRes = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        })
        if (!uploadRes.ok) throw new Error('R2 업로드 실패')

        // DB 저장
        const result = await addProjectImage(projectId, key, {
          is_cover: images.length === 0 && !isBefore,
          is_before: isBefore,
          sort_order: images.length,
        })

        if (result.success) {
          setImages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              r2_key: key,
              is_cover: images.length === 0 && !isBefore,
              is_before: isBefore,
              sort_order: prev.length,
            },
          ])
        }
      } catch (e) {
        console.error('Upload failed:', e)
        alert('업로드에 실패했습니다.')
      }
    }

    setUploading(false)
  }

  async function handleDelete(img: UploadedImage) {
    if (!confirm('이미지를 삭제할까요?')) return
    const result = await deleteProjectImage(img.id, img.r2_key)
    if (result.success) {
      setImages((prev) => prev.filter((i) => i.id !== img.id))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 업로드 타입 선택 */}
      <div className="flex gap-4 text-[0.82rem]">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={!isBefore}
            onChange={() => setIsBefore(false)}
            className="accent-brown-500"
          />
          <span className="text-brown-900">시공 후 (After)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={isBefore}
            onChange={() => setIsBefore(true)}
            className="accent-brown-500"
          />
          <span className="text-brown-900">시공 전 (Before)</span>
        </label>
      </div>

      {/* 업로드 버튼 */}
      <div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="min-h-11 px-6 py-2.5 border border-brown-800/20 bg-white text-[0.82rem] text-brown-900 hover:bg-cream-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {uploading ? '업로드 중…' : '사진 추가'}
        </button>
      </div>

      {/* 이미지 미리보기 */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative group">
              <div className="relative aspect-4/3 overflow-hidden bg-brown-800">
                <Image
                  src={getPublicUrl(img.r2_key)}
                  alt="시공 사진"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[0.70rem] text-(--text-light)">
                  {img.is_before ? '시공 전' : img.is_cover ? '대표' : '시공 후'}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(img)}
                  className="text-[0.70rem] text-red-500 hover:text-red-700 min-h-6 px-1"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
