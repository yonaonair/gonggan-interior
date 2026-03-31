'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface Props {
  images: string[]
}

/** SVG fallback — 이미지 미등록 시 표시 */
function IllustrationFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-brown-800">
      <div suppressHydrationWarning className="absolute inset-0 bg-linear-to-br from-brown-900/60 to-transparent" />
      <div className="relative z-10">
        <svg
          viewBox="0 0 380 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: 'min(380px, 45vw)', filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.4))' }}
        >
          <rect x="50" y="120" width="220" height="180" stroke="rgba(242,233,220,0.3)" strokeWidth="1.5" fill="none" />
          <polyline points="30,125 160,20 290,125" stroke="rgba(242,233,220,0.4)" strokeWidth="1.5" fill="none" />
          <rect x="190" y="120" width="80" height="180" fill="rgba(242,233,220,0.06)" />
          <line x1="110" y1="120" x2="110" y2="300" stroke="rgba(242,233,220,0.12)" strokeWidth="1" />
          <line x1="155" y1="120" x2="155" y2="300" stroke="rgba(242,233,220,0.12)" strokeWidth="1" />
          <line x1="50" y1="175" x2="190" y2="175" stroke="rgba(242,233,220,0.12)" strokeWidth="1" />
          <line x1="50" y1="220" x2="190" y2="220" stroke="rgba(242,233,220,0.12)" strokeWidth="1" />
          <line x1="50" y1="260" x2="190" y2="260" stroke="rgba(242,233,220,0.12)" strokeWidth="1" />
          <rect x="64" y="135" width="32" height="28" stroke="rgba(242,233,220,0.2)" strokeWidth="1" fill="none" />
          <rect x="120" y="135" width="24" height="28" stroke="rgba(242,233,220,0.2)" strokeWidth="1" fill="none" />
          <rect x="205" y="140" width="20" height="20" fill="rgba(242,233,220,0.15)" />
          <rect x="235" y="140" width="20" height="20" fill="rgba(242,233,220,0.15)" />
          <rect x="72" y="248" width="28" height="52" stroke="rgba(242,233,220,0.25)" strokeWidth="1" fill="none" />
        </svg>
      </div>
    </div>
  )
}

const DISPLAY_MS = 5000  // 한 장 표시 시간
const FADE_MS    = 1200  // 크로스페이드 전환 시간

export default function HeroSlideshow({ images }: Props) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length)
    }, DISPLAY_MS)
  }, [images.length])

  useEffect(() => {
    if (images.length <= 1) return
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [images.length, startTimer])

  function goTo(index: number) {
    setCurrent(index)
    startTimer() // 수동 클릭 시 타이머 리셋
  }

  if (images.length === 0) return <IllustrationFallback />

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 이미지 레이어 — 전체 사전 렌더, opacity 교차 = 진짜 크로스페이드 */}
      {images.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            opacity: i === current ? 1 : 0,
            transition: `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            zIndex: i === current ? 1 : 0,
          }}
        >
          {/* Ken Burns: 활성 이미지에만 미세 줌 애니메이션 */}
          <div
            className="absolute inset-0"
            style={{
              animation: i === current ? `kenBurns ${DISPLAY_MS}ms ease-out forwards` : 'none',
              willChange: 'transform',
            }}
          >
            <Image
              src={src}
              alt="공간인테리어 시공 사례"
              fill
              className="object-cover"
              priority={i === 0}
              sizes="50vw"
            />
          </div>
        </div>
      ))}

      {/* 그라데이션 오버레이 — 항상 최상단 */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-r from-brown-900/55 via-brown-900/15 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-b from-brown-900/25 via-transparent to-brown-900/35" />
      </div>

      {/* 도트 인디케이터 */}
      {images.length > 1 && (
        <div className="absolute bottom-8 right-8 flex gap-2 z-20">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`슬라이드 ${i + 1}`}
              className="cursor-pointer border-0 p-0 bg-transparent"
              style={{
                width: i === current ? '16px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: i === current ? 'rgba(242,233,220,0.9)' : 'rgba(242,233,220,0.3)',
                transition: 'all 0.4s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
