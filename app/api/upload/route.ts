import { createClient } from '@/lib/supabase/server'
import { uploadFile } from '@/lib/r2'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const key = formData.get('key') as string | null

  if (!file || !key) {
    return Response.json({ error: 'file and key are required' }, { status: 400 })
  }

  if (key.includes('..') || key.startsWith('/')) {
    return Response.json({ error: 'Invalid key' }, { status: 400 })
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    await uploadFile(key, buffer, file.type)
    return Response.json({ key })
  } catch (err) {
    console.error('[upload] R2 error:', err)
    return Response.json(
      { error: err instanceof Error ? err.message : 'R2 upload failed' },
      { status: 500 },
    )
  }
}
