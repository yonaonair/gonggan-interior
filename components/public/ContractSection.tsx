'use client'

import { useRef, useState, useTransition } from 'react'
import { submitInquiry } from '@/actions/inquiries'

function ContactIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-9 h-9 bg-brown-900 flex items-center justify-center shrink-0 mt-0.5">
      {children}
    </div>
  )
}

export default function ContractSection() {
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function handleAction(formData: FormData) {
    startTransition(async () => {
      const result = await submitInquiry(formData)
      if (result.success) {
        setStatus('success')
        formRef.current?.reset()
      } else {
        setStatus('error')
        setErrorMsg(result.error ?? '오류가 발생했습니다.')
      }
    })
  }

  const inputClass =
    'w-full px-4 py-3 border border-brown-800/15 bg-transparent text-[0.85rem] text-text-dark outline-none focus:border-brown-500 transition-colors duration-400 rounded-none appearance-none'

  return (
    <section id="contact" className="bg-cream-100 py-28 px-[8vw] grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
      {/* 연락처 정보 */}
      <div>
        <p className="reveal inline-flex items-center gap-3 font-display italic text-[0.85rem] text-brown-500 tracking-[0.15em] mb-5 before:block before:w-7 before:h-px before:bg-brown-500">
          Contact
        </p>
        <h2 className="reveal font-serif-kr text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold text-brown-900 leading-[1.3] mb-8">
          문의하기
        </h2>
        <p className="reveal text-[0.95rem] text-text-light leading-[1.9] break-keep mb-10">
          시공 상담은 전화, 이메일 모두 가능합니다.<br />
          부담 없이 연락 주세요.
        </p>

        <div className="flex flex-col gap-6">
          <div className="reveal flex gap-4 items-start">
            <ContactIcon>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14 10.7c-1 0-2-.2-3-.5-.3-.1-.6 0-.8.2l-1.3 1.3C7 10.8 5.2 9 4.3 7L5.6 5.7c.2-.2.3-.5.2-.8C5.5 4 5.3 3 5.3 2c0-.5-.5-1-1-1H2c-.5 0-1 .5-1 1C1 9.2 6.8 15 14 15c.5 0 1-.5 1-1v-2.3c0-.5-.5-1-1-1z" stroke="rgba(232,216,196,0.8)" strokeWidth="1" fill="none" />
              </svg>
            </ContactIcon>
            <div>
              <div className="text-[0.80rem] tracking-[0.12em] text-text-light mb-1">PHONE</div>
              <div className="font-serif-kr text-[0.95rem] text-brown-900">
                <a href="tel:01056255751" className="hover:text-brown-500 transition-colors duration-400">010.5625.5751</a>
              </div>
            </div>
          </div>

          <div className="reveal reveal-delay-1 flex gap-4 items-start">
            <ContactIcon>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="3" width="14" height="10" rx="1" stroke="rgba(232,216,196,0.8)" strokeWidth="1" fill="none" />
                <polyline points="1,3 8,9 15,3" stroke="rgba(232,216,196,0.8)" strokeWidth="1" fill="none" />
              </svg>
            </ContactIcon>
            <div>
              <div className="text-[0.80rem] tracking-[0.12em] text-text-light mb-1">EMAIL</div>
              <div className="font-serif-kr text-[0.95rem] text-brown-900">
                <a href="mailto:612057ekp@naver.com" className="hover:text-brown-500 transition-colors duration-400">612057ekp@naver.com</a>
              </div>
            </div>
          </div>

          <div className="reveal reveal-delay-2 flex gap-4 items-start">
            <ContactIcon>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1C5.2 1 3 3.2 3 6c0 3.8 5 9 5 9s5-5.2 5-9c0-2.8-2.2-5-5-5z" stroke="rgba(232,216,196,0.8)" strokeWidth="1" fill="none" />
                <circle cx="8" cy="6" r="1.5" stroke="rgba(232,216,196,0.8)" strokeWidth="1" fill="none" />
              </svg>
            </ContactIcon>
            <div>
              <div className="text-[0.80rem] tracking-[0.12em] text-text-light mb-1">ADDRESS</div>
              <div className="font-serif-kr text-[0.95rem] text-brown-900">
                전라남도 곡성군 석곡면 능파 2길 46 302호
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 문의 폼 */}
      <form ref={formRef} action={handleAction} className="reveal reveal-delay-2 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.80rem] tracking-widest text-text-light">성함 *</label>
            <input name="name" type="text" placeholder="홍길동" required className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.80rem] tracking-widest text-text-light">연락처 *</label>
            <input name="phone" type="tel" placeholder="010-0000-0000" required className={inputClass} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.80rem] tracking-widest text-text-light">문의 분야</label>
          <select name="category" className={inputClass}>
            <option value="">선택해 주세요</option>
            <option>실내인테리어</option>
            <option>주거공간 리모델링</option>
            <option>상업공간 인테리어</option>
            <option>신축 · 증축</option>
            <option>기타</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.80rem] tracking-widest text-text-light">시공 예정 지역</label>
          <input name="location" type="text" placeholder="예: 전남 곡성, 전남 광주 등" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.80rem] tracking-widest text-text-light">문의 내용 *</label>
          <textarea
            name="message"
            placeholder="시공 면적, 원하시는 스타일, 예산 등 자유롭게 적어 주세요."
            required
            className={`${inputClass} h-30 resize-y`}
          />
        </div>

        {status === 'success' && (
          <p className="text-[0.88rem] text-brown-500">
            문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.
          </p>
        )}
        {status === 'error' && (
          <p className="text-[0.88rem] text-red-600">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="self-start min-w-40 min-h-11 px-8 py-3.75 bg-brown-900 text-cream-100 text-[0.85rem] tracking-[0.12em] border-0 cursor-pointer hover:bg-brown-700 transition-colors duration-400 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? '전송 중…' : '문의 보내기'}
        </button>
      </form>
    </section>
  )
}
