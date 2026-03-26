'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Inquiry } from '@/types'

interface Props {
  inquiry: Inquiry
}

export default function InquiryCard({ inquiry }: Props) {
  const [isRead, setIsRead] = useState(inquiry.is_read)
  const [isPending, startTransition] = useTransition()

  function toggleRead() {
    startTransition(async () => {
      const supabase = createClient()
      const { error } = await supabase
        .from('inquiries')
        .update({ is_read: !isRead })
        .eq('id', inquiry.id)
      if (!error) setIsRead((v) => !v)
    })
  }

  const date = new Date(inquiry.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  return (
    <div
      className={`p-5 border flex flex-col gap-3 transition-colors ${
        isRead ? 'border-brown-800/10 bg-white' : 'border-brown-500/30 bg-cream-200'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-serif-kr text-[0.95rem] font-semibold text-brown-900">
              {inquiry.name}
            </span>
            {!isRead && (
              <span className="text-[0.68rem] bg-brown-500 text-cream-100 px-2 py-0.5 tracking-widest">
                NEW
              </span>
            )}
            {inquiry.category && (
              <span className="text-[0.75rem] text-(--text-light) tracking-widest">
                {inquiry.category}
              </span>
            )}
          </div>
          <div className="text-[0.75rem] text-(--text-light) mt-1">{date}</div>
        </div>
        <button
          onClick={toggleRead}
          disabled={isPending}
          className="shrink-0 text-[0.75rem] text-(--text-light) hover:text-brown-500 transition-colors min-h-9 px-2"
        >
          {isRead ? '읽음' : '읽음 처리'}
        </button>
      </div>

      <div className="flex flex-wrap gap-6 text-[0.82rem]">
        <a
          href={`tel:${inquiry.phone.replace(/\D/g, '')}`}
          className="flex items-center gap-2 text-brown-500 hover:text-brown-700 transition-colors min-h-9"
        >
          📞 {inquiry.phone}
        </a>
        {inquiry.location && (
          <span className="text-(--text-light)">{inquiry.location}</span>
        )}
      </div>

      <p className="text-[0.85rem] text-(--text-mid) leading-[1.8] whitespace-pre-wrap break-keep">
        {inquiry.message}
      </p>
    </div>
  )
}
