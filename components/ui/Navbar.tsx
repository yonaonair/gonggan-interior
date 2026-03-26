'use client'

import { useEffect, useState } from 'react'

function LogoSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="22" width="32" height="28" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <polyline points="4,26 24,6 44,26" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="28" y="22" width="12" height="28" fill="currentColor" opacity="0.85" />
      <line x1="14" y1="22" x2="14" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="21" y1="22" x2="21" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="8" y1="32" x2="28" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="8" y1="40" x2="28" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="14" y1="44" x2="14" y2="50" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <rect x="16" y="27" width="4" height="4" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6" />
    </svg>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#services', label: '서비스' },
    { href: '#projects', label: '프로젝트' },
    { href: '#about', label: '소개' },
    { href: '#process', label: '진행과정' },
  ]

  return (
    <>
      <nav
        style={{ height: 'var(--nav-h)' }}
        className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-[5vw] border-b transition-all duration-[400ms] ${
          scrolled
            ? 'bg-brown-900/97 border-transparent'
            : 'bg-cream-100/92 backdrop-blur-[12px] border-brown-800/8'
        }`}
      >
        <a href="#hero" className="flex items-center gap-3 cursor-pointer">
          <LogoSvg
            className={`w-9 h-9 transition-colors ${scrolled ? 'text-cream-200' : 'text-brown-800'}`}
          />
          <span
            className={`font-serif-kr text-[1.1rem] font-semibold tracking-[0.05em] transition-colors ${
              scrolled ? 'text-cream-200' : 'text-brown-800'
            }`}
          >
            공간인테리어
          </span>
        </a>

        {/* 데스크톱 메뉴 */}
        <ul className="hidden sm:flex gap-10 items-center">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`text-[0.88rem] tracking-[0.08em] font-normal relative
                  after:content-[''] after:absolute after:bottom-[-3px] after:left-0
                  after:w-0 after:h-px after:bg-brown-500
                  hover:after:w-full after:transition-all after:duration-[400ms]
                  transition-colors ${scrolled ? 'text-cream-200' : 'text-[var(--text-mid)]'}`}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className={`px-[22px] py-[9px] rounded-sm text-[0.80rem] tracking-[0.1em] font-normal transition-all duration-[400ms] ${
                scrolled
                  ? 'bg-cream-200 text-brown-800 hover:bg-cream-100'
                  : 'bg-brown-800 text-cream-100 hover:bg-brown-700'
              }`}
            >
              문의하기
            </a>
          </li>
        </ul>

        {/* 햄버거 (모바일) */}
        <button
          className="sm:hidden flex flex-col gap-[5px] p-1 cursor-pointer bg-transparent border-0"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="메뉴 열기"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`block w-6 h-[1.5px] transition-all ${scrolled ? 'bg-cream-200' : 'bg-brown-800'}`}
            />
          ))}
        </button>
      </nav>

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <div
          style={{ top: 'var(--nav-h)' }}
          className="fixed left-0 right-0 z-[99] bg-brown-900 px-[5vw] py-8 flex flex-col gap-6 border-t border-white/8"
        >
          {[...links, { href: '#contact', label: '문의하기' }].map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-cream-200 text-[1.1rem] font-serif-kr tracking-[0.06em] py-2 border-b border-white/8"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </>
  )
}
