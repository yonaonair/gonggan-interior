# 공간인테리어 — 2차 인수인계 (집에서 이어받기)

> 작성일: 2026-03-26
> 현황: 공개 페이지 기반 파일 완성, 조립·관리자 패널 미완

---

## 1. 현재 완료된 것

| 파일 | 상태 |
|---|---|
| `app/globals.css` | ✅ Tailwind v4 `@theme` 토큰 (폰트·컬러) |
| `app/layout.tsx` | ✅ Metadata, next/font (Noto Serif KR, Cormorant), Pretendard CDN |
| `tsconfig.json` | ✅ `@/*` → `./*` (루트 기준) 수정 완료 |
| `types/index.ts` | ✅ Project, ProjectImage, Inquiry 타입 |
| `lib/supabase/client.ts` | ✅ 브라우저 클라이언트 |
| `lib/supabase/server.ts` | ✅ **async** createClient (Next.js 16 cookies() 대응) |
| `lib/r2.ts` | ✅ getUploadUrl, deleteFile, getPublicUrl |
| `lib/resend.ts` | ✅ sendInquiryAlert |
| `actions/inquiries.ts` | ✅ submitInquiry (Supabase 저장 + Resend 이메일) |
| `components/ui/Navbar.tsx` | ✅ 스크롤 효과, 모바일 메뉴 |
| `components/ui/Footer.tsx` | ✅ |
| `components/public/HeroSection.tsx` | ✅ |
| `components/public/ServicesSection.tsx` | ✅ |
| `components/public/ProjectsSection.tsx` | ✅ Client Component, 카테고리 필터 |
| `components/public/AboutSection.tsx` | ✅ |
| `components/public/ProcessSection.tsx` | ✅ |
| `components/public/ContractSection.tsx` | ✅ 문의 폼 (useTransition + submitInquiry) |

---

## 2. 남은 작업 (집에서 이 순서대로)

### 2-1. `app/(public)/layout.tsx` — Navbar + Footer 감싸기

```tsx
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
```

### 2-2. `app/(public)/page.tsx` — 메인 페이지 조립

```tsx
import HeroSection from '@/components/public/HeroSection'
import ServicesSection from '@/components/public/ServicesSection'
import ProjectsSection from '@/components/public/ProjectsSection'
import AboutSection from '@/components/public/AboutSection'
import ProcessSection from '@/components/public/ProcessSection'
import ContractSection from '@/components/public/ContractSection'
import { createClient } from '@/lib/supabase/server'
import type { Project } from '@/types'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(6)

  // reveal 스크롤 애니메이션 (IntersectionObserver)
  // globals.css에 .reveal 클래스 정의되어 있음.
  // 이 스크립트를 layout.tsx에 추가하거나 별도 RevealScript 컴포넌트로 분리.

  return (
    <>
      <HeroSection />
      <ServicesSection />
      <ProjectsSection projects={(projects as Project[]) ?? []} />
      <AboutSection />
      <ProcessSection />
      <ContractSection />
    </>
  )
}
```

> **주의**: `reveal` 클래스 IntersectionObserver는 `app/(public)/layout.tsx`에 `<script>` 또는 아래 컴포넌트로 추가.

```tsx
// components/ui/RevealScript.tsx  (새로 만들기)
'use client'
import { useEffect } from 'react'

export default function RevealScript() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          obs.unobserve(e.target)
        }
      }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])
  return null
}
```

그리고 `app/(public)/layout.tsx`에서 `<RevealScript />` 렌더링.

---

### 2-3. `app/page.tsx` — 루트를 (public)으로 리다이렉트

기존 `app/page.tsx`는 create-next-app 기본 템플릿. 아래로 교체:

```tsx
import { redirect } from 'next/navigation'
export default function RootPage() {
  redirect('/')
}
```

또는 그냥 지우고 `app/(public)/page.tsx`가 `/` 역할을 하도록 둠 (이미 그렇게 되어 있음).
`app/page.tsx`는 삭제해도 됨.

---

### 2-4. `app/(public)/projects/page.tsx` — 전체 포트폴리오

```tsx
import { createClient } from '@/lib/supabase/server'
import ProjectsSection from '@/components/public/ProjectsSection'
import type { Project } from '@/types'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <ProjectsSection projects={(data as Project[]) ?? []} />
    </div>
  )
}
```

---

### 2-5. `app/(public)/projects/[slug]/page.tsx` — 상세 페이지

Supabase에서 slug로 단일 프로젝트 조회 + 이미지 갤러리 (before/after 구분).

---

### 2-6. 관리자 패널 (`app/admin/`)

#### `app/admin/layout.tsx` — 인증 체크

```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')
  return <>{children}</>
}
```

#### `app/admin/login/page.tsx` — Supabase Auth 로그인 폼

'use client', `signInWithPassword` 사용.

#### `app/admin/projects/page.tsx` — 사례 목록

`service_role` 키로 전체 프로젝트 조회 (발행/미발행 모두).
발행 토글 버튼 → Server Action.

#### `app/admin/projects/new/page.tsx` + `components/admin/ImageUploader.tsx`

- `/api/upload/route.ts`에서 R2 presigned URL 발급
- 클라이언트에서 `fetch(presignedUrl, { method: 'PUT', body: file })`
- `<input accept="image/*" capture="environment">` — 모바일 카메라 직접 촬영
- before/after 체크박스

#### `app/admin/inquiries/page.tsx`

문의 목록, 읽음 처리, 전화 연결 링크.

---

### 2-7. `app/api/upload/route.ts` — Presigned URL 발급

```ts
import { NextRequest, NextResponse } from 'next/server'
import { getUploadUrl } from '@/lib/r2'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { key, contentType } = await req.json()
  const url = await getUploadUrl(key, contentType)
  return NextResponse.json({ url })
}
```

---

## 3. 중요한 기술 메모 (잊지 말 것)

### Next.js 16 + Tailwind v4 파괴적 변경

| 항목 | 변경 사항 |
|---|---|
| `cookies()` | **async** — 반드시 `await cookies()` |
| `tailwind.config.ts` | **없음** — `globals.css`의 `@theme inline {}` 블록이 대체 |
| `bg-gradient-to-t` | **→ `bg-linear-to-t`** |
| `duration-[400ms]` | **→ `duration-400`** |
| `[word-break:keep-all]` | **→ `break-keep`** |
| `text-[var(--foo)]` | **→ `text-(--foo)` 또는 @theme에 등록 후 `text-foo`** |
| `FormEvent` from React | **deprecated in React 19** — `useTransition` + `action={fn}` 패턴 사용 |
| `@/` alias | `tsconfig.json`에서 `./src/*` → `./*` 로 수정 완료 |

### 폰트 CSS 변수 구조

```
next/font 주입       →  HTML 요소 클래스에 CSS var
--next-serif-kr       →  @theme inline에서 --font-serif-kr로 매핑
--next-display        →  @theme inline에서 --font-display로 매핑
```

Tailwind 클래스: `font-serif-kr`, `font-display`, `font-sans`

### 컬러 클래스 예시

```
bg-brown-900  text-cream-100  border-brown-300
text-text-light  text-text-mid  text-text-dark
```

---

## 4. 실행 방법

```bash
cd g:/workspace/gonggan-interior   # 또는 집 PC의 clone 경로
npm install
npm run dev
# → http://localhost:3000
```

`.env.local`은 회사 PC에 있음. 집 PC에서 작업하려면 `.env.local` 값을 별도로 옮길 것.

---

## 5. 아직 미구현 파일 목록

```
app/(public)/layout.tsx          ← 비어있음 (2-1)
app/(public)/page.tsx            ← 비어있음 (2-2)
app/(public)/projects/page.tsx   ← 비어있음 (2-4)
app/(public)/projects/[slug]/page.tsx ← 비어있음 (2-5)
app/admin/layout.tsx             ← 비어있음 (2-6)
app/admin/login/page.tsx         ← 비어있음 (2-6)
app/admin/projects/page.tsx      ← 없음 (2-6)
app/admin/projects/new/page.tsx  ← 비어있음 (2-6)
app/admin/projects/[id]/page.tsx ← 비어있음 (2-6)
app/admin/inquiries/page.tsx     ← 비어있음 (2-6)
app/api/upload/route.ts          ← 비어있음 (2-7)
actions/projects.ts              ← 비어있음 (2-6)
components/admin/ImageUploader.tsx ← 비어있음 (2-6)
components/admin/InquiryCard.tsx ← 비어있음 (2-6)
components/ui/RevealScript.tsx   ← 없음 (2-2에서 생성)
```

---

*이 문서는 2026-03-26 Claude Code 세션 기준. 계속 이어서 작업 시 Claude에게 이 파일을 컨텍스트로 붙여넣으면 됨.*
