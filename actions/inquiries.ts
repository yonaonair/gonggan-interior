'use server'

import { createClient } from '@/lib/supabase/server'
import { sendInquiryAlert } from '@/lib/resend'

export async function submitInquiry(formData: FormData) {
  const data = {
    name:     (formData.get('name')     as string).trim(),
    phone:    (formData.get('phone')    as string).trim(),
    category: (formData.get('category') as string).trim(),
    location: (formData.get('location') as string).trim(),
    message:  (formData.get('message')  as string).trim(),
  }

  if (!data.name || !data.phone || !data.message) {
    return { success: false, error: '필수 항목을 모두 입력해 주세요.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.from('inquiries').insert(data)
  if (error) return { success: false, error: '저장 중 오류가 발생했습니다.' }

  try {
    await sendInquiryAlert(data)
  } catch (e) {
    console.error('Email send failed:', e)
  }

  return { success: true }
}
