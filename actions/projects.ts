'use server'

import { createClient } from '@/lib/supabase/server'
import { deleteFile } from '@/lib/r2'
import { revalidatePath } from 'next/cache'
import type { ProjectCategory } from '@/types'

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '인증이 필요합니다.' }

  const title = (formData.get('title') as string).trim()
  const category = formData.get('category') as ProjectCategory
  const location = (formData.get('location') as string | null)?.trim() || null
  const area_sqm = formData.get('area_sqm') ? Number(formData.get('area_sqm')) : null
  const duration = (formData.get('duration') as string | null)?.trim() || null
  const year = formData.get('year') ? Number(formData.get('year')) : null
  const description = (formData.get('description') as string | null)?.trim() || null
  const is_featured = formData.get('is_featured') === 'true'
  const is_published = formData.get('is_published') === 'true'

  if (!title || !category) return { success: false, error: '제목과 카테고리는 필수입니다.' }

  const slug = slugify(title) + '-' + Date.now()

  const { data, error } = await supabase
    .from('projects')
    .insert({ title, slug, category, location, area_sqm, duration, year, description, is_featured, is_published })
    .select('id')
    .single()

  if (error) return { success: false, error: '저장 중 오류가 발생했습니다.' }

  revalidatePath('/projects')
  revalidatePath('/')
  return { success: true, id: data.id }
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '인증이 필요합니다.' }

  const title = (formData.get('title') as string).trim()
  const category = formData.get('category') as ProjectCategory
  const location = (formData.get('location') as string | null)?.trim() || null
  const area_sqm = formData.get('area_sqm') ? Number(formData.get('area_sqm')) : null
  const duration = (formData.get('duration') as string | null)?.trim() || null
  const year = formData.get('year') ? Number(formData.get('year')) : null
  const description = (formData.get('description') as string | null)?.trim() || null
  const is_featured = formData.get('is_featured') === 'true'
  const is_published = formData.get('is_published') === 'true'

  if (!title || !category) return { success: false, error: '제목과 카테고리는 필수입니다.' }

  const { error } = await supabase
    .from('projects')
    .update({ title, category, location, area_sqm, duration, year, description, is_featured, is_published, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { success: false, error: '저장 중 오류가 발생했습니다.' }

  revalidatePath('/projects')
  revalidatePath('/')
  return { success: true }
}

export async function togglePublished(id: string, is_published: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '인증이 필요합니다.' }

  const { error } = await supabase
    .from('projects')
    .update({ is_published, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { success: false, error: '오류가 발생했습니다.' }

  revalidatePath('/projects')
  revalidatePath('/')
  return { success: true }
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '인증이 필요합니다.' }

  // 이미지 R2 삭제
  const { data: images } = await supabase
    .from('project_images')
    .select('r2_key')
    .eq('project_id', id)

  if (images) {
    await Promise.all(images.map((img) => deleteFile(img.r2_key).catch(() => {})))
  }

  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) return { success: false, error: '삭제 중 오류가 발생했습니다.' }

  revalidatePath('/projects')
  revalidatePath('/')
  return { success: true }
}

export async function addProjectImage(
  projectId: string,
  r2_key: string,
  options: { is_cover?: boolean; is_before?: boolean; sort_order?: number } = {}
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '인증이 필요합니다.' }

  const { error } = await supabase.from('project_images').insert({
    project_id: projectId,
    r2_key,
    is_cover: options.is_cover ?? false,
    is_before: options.is_before ?? false,
    sort_order: options.sort_order ?? 0,
  })

  if (error) return { success: false, error: '이미지 저장 중 오류가 발생했습니다.' }
  return { success: true }
}

export async function deleteProjectImage(imageId: string, r2_key: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '인증이 필요합니다.' }

  await deleteFile(r2_key).catch(() => {})
  const { error } = await supabase.from('project_images').delete().eq('id', imageId)
  if (error) return { success: false, error: '삭제 중 오류가 발생했습니다.' }
  return { success: true }
}
