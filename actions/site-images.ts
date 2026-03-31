'use server'

import { createClient } from '@/lib/supabase/server'
import { deleteFile } from '@/lib/r2'
import { revalidatePath } from 'next/cache'

export type SiteSlot = 'hero' | 'about'

export interface SiteImage {
  id: string
  slot: SiteSlot
  r2_key: string
  sort_order: number
}

export async function getSiteImages(slot: SiteSlot): Promise<SiteImage[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_images')
    .select('id, slot, r2_key, sort_order')
    .eq('slot', slot)
    .order('sort_order', { ascending: true })
  return (data ?? []) as SiteImage[]
}

export async function addSiteImage(slot: SiteSlot, r2_key: string, sort_order: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '인증이 필요합니다.' }

  const { error } = await supabase
    .from('site_images')
    .insert({ slot, r2_key, sort_order })

  if (error) {
    console.error('[addSiteImage] DB error:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function deleteSiteImage(id: string, r2_key: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '인증이 필요합니다.' }

  await deleteFile(r2_key).catch(() => {})
  const { error } = await supabase.from('site_images').delete().eq('id', id)
  if (error) return { success: false, error: '삭제 중 오류가 발생했습니다.' }

  revalidatePath('/')
  return { success: true }
}
