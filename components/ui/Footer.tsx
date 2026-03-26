export default function Footer() {
  return (
    <footer className="bg-brown-900 px-[8vw] py-12 flex flex-wrap items-center justify-between gap-8 border-t border-white/5">
      <div className="flex items-center gap-2.5">
        <svg className="w-7 h-7" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="22" width="32" height="28" stroke="rgba(242,233,220,0.4)" strokeWidth="1.5" fill="none" />
          <polyline points="4,26 24,6 44,26" stroke="rgba(242,233,220,0.4)" strokeWidth="1.5" fill="none" />
          <rect x="28" y="22" width="12" height="28" fill="rgba(242,233,220,0.15)" />
          <line x1="14" y1="22" x2="14" y2="50" stroke="rgba(242,233,220,0.15)" strokeWidth="1" />
          <line x1="21" y1="22" x2="21" y2="50" stroke="rgba(242,233,220,0.15)" strokeWidth="1" />
          <line x1="8" y1="32" x2="28" y2="32" stroke="rgba(242,233,220,0.15)" strokeWidth="1" />
          <line x1="8" y1="40" x2="28" y2="40" stroke="rgba(242,233,220,0.15)" strokeWidth="1" />
        </svg>
        <span className="font-serif-kr text-[0.95rem] font-semibold text-cream-200 tracking-[0.05em]">
          공간인테리어
        </span>
      </div>
      <div className="font-display italic text-[0.80rem] text-cream-200/30">
        Space changes everything
      </div>
      <div className="text-[0.80rem] text-cream-200/25 tracking-[0.05em]">
        © 2025 공간인테리어 · 대표 안종선 · 전라남도 곡성
      </div>
    </footer>
  )
}
