import type { Metadata } from 'next'
import { Noto_Serif_KR, Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const notoSerifKr = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--next-serif-kr',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--next-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '공간인테리어 | 실내인테리어 · 주거공간 · 상업공간 · 신축증축',
  description: '전라남도 곡성, 공간인테리어 대표 안종선. 실내인테리어·주거공간·상업공간·신축증축 전문 시공업체.',
  keywords: ['인테리어', '곡성', '리모델링', '주거공간', '상업공간', '신축', '증축'],
  openGraph: {
    title: '공간인테리어',
    description: '공간이 삶을 바꿉니다',
    locale: 'ko_KR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${notoSerifKr.variable} ${cormorant.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
