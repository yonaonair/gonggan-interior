const services = [
  {
    num: '01',
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10">
        <rect x="4" y="8" width="32" height="24" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <line x1="4" y1="20" x2="36" y2="20" stroke="currentColor" strokeWidth="1.5" />
        <line x1="18" y1="8" x2="18" y2="32" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    name: '실내인테리어',
    desc: '공간의 목적과 사용자의 라이프스타일을 깊이 이해하여 최적의 실내 환경을 설계합니다.',
    items: ['바닥재 · 벽지 · 도장', '조명 설계 및 시공', '가구 배치 · 홈스타일링', '욕실 · 주방 리모델링'],
  },
  {
    num: '02',
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10">
        <path d="M4 22 L20 8 L36 22" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="8" y="22" width="24" height="12" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="16" y="26" width="8" height="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    name: '주거공간',
    desc: '개인 주택 · 아파트 · 빌라 등 삶의 터전을 편안하고 아름답게 새롭게 만들어 드립니다.',
    items: ['단독주택 풀리모델링', '아파트 인테리어', '빌라 · 오피스텔', '부분 개보수'],
  },
  {
    num: '03',
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10">
        <rect x="4" y="14" width="32" height="22" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <polyline points="4,14 8,6 32,6 36,14" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <line x1="16" y1="36" x2="16" y2="24" stroke="currentColor" strokeWidth="1.5" />
        <line x1="24" y1="36" x2="24" y2="24" stroke="currentColor" strokeWidth="1.5" />
        <line x1="16" y1="24" x2="24" y2="24" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    name: '상업공간',
    desc: '브랜드 아이덴티티와 고객 동선을 고려한 매력적인 상업 공간을 구성합니다.',
    items: ['카페 · 음식점', '사무공간 · 오피스', '교육시설 · 강의실', '종교시설 · 교회'],
  },
  {
    num: '04',
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10">
        <rect x="4" y="20" width="15" height="16" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="21" y="12" width="15" height="24" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <line x1="4" y1="36" x2="36" y2="36" stroke="currentColor" strokeWidth="1.5" />
        <polyline points="7,20 12,10 17,20" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <polyline points="24,12 29,4 34,12" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    name: '신축 · 증축',
    desc: '설계 단계부터 완공까지, 새로운 공간의 탄생과 기존 공간의 확장을 책임집니다.',
    items: ['소규모 신축 건축', '건물 증축 · 개축', '옥탑 · 별채 시공', '리모델링 전체 관리'],
  },
]

export default function ServicesSection() {
  return (
    <section id="services" className="bg-cream-100 py-[7rem] px-[8vw]">
      {/* 헤더 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-end mb-16">
        <div>
          <p className="section-tag reveal inline-flex items-center gap-3 font-display italic text-[0.85rem] text-brown-500 tracking-[0.15em] mb-5 before:block before:w-7 before:h-px before:bg-brown-500">
            Services
          </p>
          <h2 className="reveal font-serif-kr text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold text-brown-900 leading-[1.3] break-keep">
            무엇이든<br />공간이 됩니다
          </h2>
        </div>
        <p className="reveal text-[0.95rem] text-[var(--text-light)] leading-[1.9] break-keep">
          주거공간의 아늑함부터 상업공간의 기능성까지,<br />
          신축과 증축에 이르는 전 과정을<br />
          공간인테리어가 함께합니다.
        </p>
      </div>

      {/* 서비스 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[1.5px] bg-brown-300 border-[1.5px] border-brown-300">
        {services.map((s, i) => (
          <div
            key={s.num}
            className={`reveal group bg-cream-100 px-8 py-11 cursor-default relative overflow-hidden transition-colors duration-[400ms] hover:bg-brown-900 ${
              i > 0 ? `reveal-delay-${i}` : ''
            }`}
          >
            {/* 하단 슬라이드 보더 */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-cream-300 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-[400ms]" />

            <div className="font-display text-[0.80rem] tracking-[0.15em] text-[var(--text-light)] group-hover:text-cream-200/20 transition-colors duration-[400ms] mb-6">
              {s.num}
            </div>
            <div className="text-brown-700 group-hover:text-cream-300 transition-colors duration-[400ms] mb-6">
              {s.icon}
            </div>
            <h3 className="font-serif-kr text-[1.1rem] font-semibold text-brown-900 group-hover:text-cream-100 transition-colors duration-[400ms] mb-3">
              {s.name}
            </h3>
            <p className="text-[0.92rem] text-[var(--text-light)] group-hover:text-cream-200/50 transition-colors duration-[400ms] leading-[1.8] mb-5 break-keep">
              {s.desc}
            </p>
            <ul className="flex flex-col gap-1">
              {s.items.map((item) => (
                <li
                  key={item}
                  className="text-[0.85rem] text-[var(--text-light)] group-hover:text-cream-200/60 transition-colors duration-[400ms] pl-4 relative before:content-['·'] before:absolute before:left-0"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
