export default function AboutSection() {
  return (
    <section
      id="about"
      className="bg-cream-200 py-28 px-[8vw] grid grid-cols-1 md:grid-cols-2 gap-24 items-center"
    >
      {/* 좌측: 대표 사진 영역 */}
      <div className="reveal relative">
        <div className="w-full aspect-[3/4] bg-brown-800 relative overflow-hidden">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-brown-700">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" opacity={0.2}>
              <circle cx="40" cy="30" r="16" stroke="rgba(242,233,220,0.8)" strokeWidth="1.5" fill="none" />
              <path d="M12 68 C12 52 28 42 40 42 C52 42 68 52 68 68" stroke="rgba(242,233,220,0.8)" strokeWidth="1.5" fill="none" />
            </svg>
            <span className="font-display italic text-[0.80rem] text-cream-200/30 tracking-[0.15em]">
              대표 사진으로 교체
            </span>
          </div>
        </div>
        {/* 경력 배지 */}
        <div className="absolute bottom-[-20px] right-[-20px] w-[120px] h-[120px] bg-brown-900 flex flex-col items-center justify-center gap-1 md:right-[-20px]">
          <div className="font-display text-[2.4rem] font-light text-cream-200 leading-none">15+</div>
          <div className="text-[0.78rem] text-cream-200/50 tracking-widest text-center leading-tight">Years<br />Experience</div>
        </div>
      </div>

      {/* 우측: 소개 텍스트 */}
      <div>
        <p className="reveal inline-flex items-center gap-3 font-display italic text-[0.85rem] text-brown-500 tracking-[0.15em] mb-5 before:block before:w-7 before:h-px before:bg-brown-500">
          About Us
        </p>
        <h2 className="reveal font-serif-kr text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold text-brown-900 leading-[1.3] mb-8 break-keep">
          공간에 진심을<br />담습니다
        </h2>
        <blockquote className="reveal font-display italic text-[1.3rem] text-brown-700 leading-[1.6] mb-8 pl-6 border-l-2 border-brown-500 break-keep">
          &ldquo;좋은 공간은 단순히 아름다운 것이 아니라,<br />
          그 안에서 살아가는 사람을 편안하게 합니다.&rdquo;
        </blockquote>
        <p className="reveal text-[0.88rem] text-(--text-mid) leading-loose mb-10 break-keep">
          공간인테리어는 전라남도를 중심으로 실내인테리어, 주거공간, 상업공간, 신축증축 전반을 다루어 왔습니다.
          개인 주택 리모델링에서 대학교 강의동, 교회 리모델링에 이르기까지 다양한 현장 경험을 바탕으로
          고객 한 분 한 분의 공간에 진심을 담아 시공합니다.
          <br /><br />
          단순한 시공업체가 아닌 공간 파트너로서, 상담부터 완공까지 전 과정을 밀착 관리합니다.
        </p>
        <div className="reveal pt-6 border-t border-brown-800/12 flex flex-col gap-1">
          <div className="font-serif-kr text-[1.15rem] font-semibold text-brown-900 tracking-[0.1em]">
            안 &nbsp; 종 &nbsp; 선
          </div>
          <div className="text-[0.80rem] text-(--text-light) tracking-widest">대표 · 공간인테리어</div>
        </div>
      </div>
    </section>
  )
}
