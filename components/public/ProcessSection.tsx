const steps = [
  { num: '01', name: '무료 상담', desc: '현장 방문 또는 전화·이메일로 요구사항을 파악합니다' },
  { num: '02', name: '현장 실측', desc: '정확한 면적과 구조를 측정하여 설계에 반영합니다' },
  { num: '03', name: '견적 및 계획', desc: '투명한 견적과 상세 시공 계획을 제안합니다' },
  { num: '04', name: '시공 진행', desc: '숙련된 기술진이 일정에 맞추어 시공합니다' },
  { num: '05', name: '완공 · AS', desc: '완공 후 점검 및 사후 A/S를 책임집니다' },
]

export default function ProcessSection() {
  return (
    <section id="process" className="bg-brown-900 py-28 px-[8vw]">
      <p className="reveal inline-flex items-center gap-3 font-display italic text-[0.85rem] text-brown-300 tracking-[0.15em] mb-5 before:block before:w-7 before:h-px before:bg-brown-300">
        Our Process
      </p>
      <h2 className="reveal font-serif-kr text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold text-cream-100 leading-[1.3] mb-3">
        시공 진행 과정
      </h2>
      <p className="reveal text-[0.95rem] text-cream-200/50 break-keep mb-16">
        상담부터 완공까지, 고객이 안심할 수 있도록 체계적으로 진행합니다.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-12 xl:gap-0 relative">
        {/* 연결선 (데스크톱) */}
        <div className="hidden xl:block absolute top-7 left-[10%] right-[10%] h-px bg-white/10" />

        {steps.map((s, i) => (
          <div
            key={s.num}
            className={`reveal flex flex-col items-center text-center px-4 relative z-10 ${
              i > 0 ? `reveal-delay-${i}` : ''
            }`}
          >
            <div className="group w-14 h-14 border border-cream-200/20 flex items-center justify-center mb-6 bg-brown-900 hover:bg-brown-700 hover:border-brown-500 transition-all duration-400">
              <span className="font-display text-[1.1rem] font-light text-cream-300">{s.num}</span>
            </div>
            <div className="font-serif-kr text-[0.92rem] font-semibold text-cream-100 mb-2">{s.name}</div>
            <div className="text-[0.85rem] text-cream-200/40 leading-[1.7] break-keep">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
