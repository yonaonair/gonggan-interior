export default function HeroSection() {
  return (
    <section
      id="hero"
      className="min-h-screen bg-brown-900 grid grid-cols-1 md:grid-cols-2 items-center relative overflow-hidden"
      style={{ paddingTop: 'var(--nav-h)' }}
    >
      {/* 배경 그리드 텍스처 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.015) 60px, rgba(255,255,255,0.015) 61px),
            repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.015) 60px, rgba(255,255,255,0.015) 61px)
          `,
        }}
      />

      {/* 히어로 좌측 텍스트 */}
      <div
        className="relative z-10 px-[8vw] py-[8vh] md:pl-[8vw] md:pr-[6vw]"
        style={{ animation: 'fadeUp 1s ease both' }}
      >
        <p className="font-display italic text-[0.9rem] text-brown-300 tracking-[0.2em] mb-8 flex items-center gap-4 before:block before:w-10 before:h-px before:bg-brown-300">
          Interior &amp; Architecture
        </p>
        <h1 className="font-serif-kr text-[clamp(2.6rem,5vw,4.2rem)] font-semibold text-cream-100 leading-[1.25] mb-8 break-keep">
          공간이 삶을<br />바꿉니다
          <em className="block not-italic text-cream-300 font-light text-[0.75em]">
            Space changes everything
          </em>
        </h1>
        <p className="text-[1.0rem] text-cream-200/65 leading-[1.9] mb-12 max-w-[440px] break-keep">
          실내인테리어부터 신축증축까지,<br />
          주거공간과 상업공간 모두를 아우르는<br />
          공간인테리어의 정성 어린 시공을 경험해 보세요.
        </p>
        <div className="flex gap-4 flex-wrap">
          <a
            href="#projects"
            className="px-8 py-[14px] bg-cream-200 text-brown-900 text-[0.85rem] font-medium tracking-[0.08em] rounded-sm hover:bg-white hover:-translate-y-0.5 transition-all duration-[400ms]"
          >
            시공 사례 보기
          </a>
          <a
            href="#contact"
            className="px-8 py-[14px] bg-transparent text-cream-300 text-[0.85rem] tracking-[0.08em] border border-cream-200/30 rounded-sm hover:border-cream-300 hover:text-cream-100 transition-all duration-[400ms]"
          >
            무료 상담 신청
          </a>
        </div>
      </div>

      {/* 히어로 우측 일러스트 (데스크톱만) */}
      <div
        className="hidden md:block relative h-full min-h-screen overflow-hidden"
        style={{ animation: 'fadeIn 1.2s ease 0.3s both' }}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-brown-800">
          <div className="absolute inset-0 bg-gradient-to-br from-brown-900/60 to-transparent" />
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
              <line x1="145" y1="250" x2="145" y2="290" stroke="rgba(242,233,220,0.2)" strokeWidth="1" />
              <line x1="165" y1="250" x2="165" y2="290" stroke="rgba(242,233,220,0.2)" strokeWidth="1" />
              <line x1="140" y1="250" x2="170" y2="250" stroke="rgba(242,233,220,0.2)" strokeWidth="1.5" />
              <line x1="140" y1="265" x2="170" y2="265" stroke="rgba(242,233,220,0.15)" strokeWidth="1" />
              <line x1="126" y1="290" x2="126" y2="265" stroke="rgba(242,233,220,0.18)" strokeWidth="1" />
              <ellipse cx="120" cy="260" rx="8" ry="10" stroke="rgba(242,233,220,0.15)" strokeWidth="1" fill="none" />
              <ellipse cx="132" cy="258" rx="6" ry="8" stroke="rgba(242,233,220,0.15)" strokeWidth="1" fill="none" />
              <line x1="310" y1="120" x2="310" y2="300" stroke="rgba(242,233,220,0.08)" strokeWidth="1" />
              <line x1="306" y1="120" x2="314" y2="120" stroke="rgba(242,233,220,0.08)" strokeWidth="1" />
              <line x1="306" y1="300" x2="314" y2="300" stroke="rgba(242,233,220,0.08)" strokeWidth="1" />
              <text x="320" y="215" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="10" fill="rgba(242,233,220,0.12)" transform="rotate(90, 320, 215)">elevation</text>
            </svg>
          </div>
        </div>
      </div>

      {/* 하단 통계 바 */}
      <div className="absolute bottom-0 left-0 right-0 grid grid-cols-3 bg-brown-900/70 backdrop-blur-[8px] border-t border-white/6 z-10">
        {[
          { num: '15+', label: 'Years of Experience' },
          { num: '200+', label: 'Projects Completed' },
          { num: '4', label: 'Service Categories' },
        ].map((s, i) => (
          <div key={i} className={`py-[1.4rem] text-center ${i < 2 ? 'border-r border-white/6' : ''}`}>
            <div className="font-display text-[2rem] font-light text-cream-200 leading-none mb-1">{s.num}</div>
            <div className="text-[0.80rem] text-cream-200/50 tracking-[0.1em]">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
