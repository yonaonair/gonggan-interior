import { createClient } from '@/lib/supabase/server'
import InquiryCard from '@/components/admin/InquiryCard'
import type { Inquiry } from '@/types'

export default async function AdminInquiriesPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })

  const inquiries = (data ?? []) as Inquiry[]
  const unreadCount = inquiries.filter((i) => !i.is_read).length

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[1.5rem] font-semibold text-brown-900">문의 목록</h1>
          {unreadCount > 0 && (
            <p className="text-[0.82rem] text-brown-500 mt-1">읽지 않은 문의 {unreadCount}건</p>
          )}
        </div>
      </div>

      {inquiries.length === 0 ? (
        <p className="text-center py-20 text-(--text-light) font-display italic">
          접수된 문의가 없습니다
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {inquiries.map((inquiry) => (
            <InquiryCard key={inquiry.id} inquiry={inquiry} />
          ))}
        </div>
      )}
    </div>
  )
}
