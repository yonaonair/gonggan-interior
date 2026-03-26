import { createClient } from '@/lib/supabase/server'
import { getUploadUrl } from '@/lib/r2'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  // 인증 확인
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { key, contentType } = await request.json()
  if (!key || !contentType) {
    return Response.json({ error: 'key and contentType are required' }, { status: 400 })
  }

  // key 검증: 경로 순회 방지
  if (key.includes('..') || key.startsWith('/')) {
    return Response.json({ error: 'Invalid key' }, { status: 400 })
  }

  const url = await getUploadUrl(key, contentType)
  return Response.json({ url })
}
