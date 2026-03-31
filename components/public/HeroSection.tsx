import HeroSlideshow from "./HeroSlideshow";

interface Props {
    heroImages?: string[];
}

export default function HeroSection({ heroImages = [] }: Props) {
    return (
        <section
            suppressHydrationWarning
            id="hero"
            className="min-h-screen bg-brown-900 grid grid-cols-1 md:grid-cols-2 items-center relative overflow-hidden"
            style={{ paddingTop: "var(--nav-h)" }}
        >
            {/* 배경 그리드 텍스처 */}
            <div
                suppressHydrationWarning
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
                style={{ animation: "fadeUp 1s ease both" }}
            >
                <p className="font-display italic text-[0.9rem] text-brown-300 tracking-[0.2em] mb-8 flex items-center gap-4 before:block before:w-10 before:h-px before:bg-brown-300">
                    Interior &amp; Architecture
                </p>
                <h1 className="font-serif-kr text-[clamp(2.6rem,5vw,4.2rem)] font-semibold text-cream-100 leading-[1.25] mb-8 break-keep">
                    공간이 삶을
                    <br />
                    바꿉니다
                    <em className="block not-italic text-cream-300 font-light text-[0.75em]">
                        Space changes everything
                    </em>
                </h1>
                <p className="text-[1.0rem] text-cream-200/65 leading-[1.9] mb-12 max-w-[440px] break-keep">
                    실내인테리어부터 신축증축까지,
                    <br />
                    주거공간과 상업공간 모두를 아우르는
                    <br />
                    공간인테리어의 정성 어린 시공을 경험해 보세요.
                </p>
                <div className="flex gap-4 flex-wrap">
                    <a
                        href="#projects"
                        className="px-8 py-[14px] bg-cream-200 text-brown-900 text-[0.85rem] font-medium tracking-[0.08em] rounded-sm hover:bg-white hover:-translate-y-0.5 transition-all duration-400"
                    >
                        시공 사례 보기
                    </a>
                    <a
                        href="#contact"
                        className="px-8 py-[14px] bg-transparent text-cream-300 text-[0.85rem] tracking-[0.08em] border border-cream-200/30 rounded-sm hover:border-cream-300 hover:text-cream-100 transition-all duration-400"
                    >
                        무료 상담 신청
                    </a>
                </div>
            </div>

            {/* 히어로 우측 — 슬라이드쇼 or SVG fallback (데스크톱만) */}
            <div
                className="hidden md:block relative h-full min-h-screen overflow-hidden"
                style={{ animation: "fadeIn 1.2s ease 0.3s both" }}
            >
                <HeroSlideshow images={heroImages} />
            </div>

            {/* 하단 통계 바 */}
            <div className="absolute bottom-0 left-0 right-0 grid grid-cols-3 bg-brown-900/70 backdrop-blur-[8px] border-t border-white/6 z-10">
                {[
                    { num: "20+", label: "Years of Experience" },
                    { num: "200+", label: "Projects Completed" },
                    { num: "4", label: "Service Categories" },
                ].map((s, i) => (
                    <div
                        key={i}
                        className={`py-[1.4rem] text-center ${i < 2 ? "border-r border-white/6" : ""}`}
                    >
                        <div className="font-display text-[2rem] font-light text-cream-200 leading-none mb-1">
                            {s.num}
                        </div>
                        <div className="text-[0.80rem] text-cream-200/50 tracking-[0.1em]">
                            {s.label}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
