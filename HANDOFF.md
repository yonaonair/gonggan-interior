# 공간인테리어 홈페이지 — Claude Code 인수인계 문서

> 작성일: 2026-03-26  
> 작성자: Claude (claude.ai 대화 기반)  
> 목적: Claude Code에서 이어서 개발하기 위한 전체 컨텍스트 전달

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|---|---|
| 클라이언트 | 공간인테리어 (대표: 안종선) |
| 업종 | 실내인테리어 · 주거공간 · 상업공간 · 신축증축 |
| 목적 | 홍보용 홈페이지 + 시공 사례 기록 관리 |
| 주요 시공 분야 | 개인 주택 리모델링, 대학교·교회 리모델링 |
| 연락처 | 010.5625.5751 / 612057ekp@naver.com |
| 주소 | 전라남도 곡성군 석곡면 능파 2길 46 302호 |

---

## 2. 기술 스택

| 레이어 | 기술 |
|---|---|
| 프레임워크 | Next.js 15 (App Router, TypeScript) |
| 스타일링 | Tailwind CSS |
| DB / Auth | Supabase (PostgreSQL + Row Level Security) |
| 이미지 스토리지 | Cloudflare R2 (S3 호환 API) |
| 이메일 알림 | Resend |
| 배포 | Vercel |
| DNS / CDN | Cloudflare |

### 폰트 (브랜드 기준 선정)

| 용도 | 폰트 | 비고 |
|---|---|---|
| 한국어 헤드라인 | Noto Serif KR | next/font/google |
| 한국어 본문 | Pretendard Variable | CDN (jsdelivr) |
| 영문 장식·이탤릭 | Cormorant Garamond | next/font/google |

### 컬러 토큰 (명함 기반)

```
brown-900: #2a1a0e  (배경 다크)
brown-800: #3a2218  (카드 다크)
brown-700: #4e2e1e  (호버)
brown-500: #7a4a30  (액센트)
brown-300: #b08060  (서브 액센트)
cream-100: #faf6f0  (배경 라이트)
cream-200: #f2e9dc  (카드 라이트)
cream-300: #e8d8c4  (보더/서브)
```

---

## 3. 완료된 세팅 현황

- [x] `npx create-next-app@latest gonggan-interior --typescript --app --tailwind --eslint --src-dir --import-alias "@/*"`
- [x] 패키지 설치: `@supabase/ssr`, `@supabase/supabase-js`, `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`, `resend`, `next-themes`
- [x] Supabase 프로젝트 생성 (Region: Northeast Asia Seoul)
- [x] Supabase SQL Editor에서 스키마 실행 완료
- [x] Cloudflare R2 버킷 생성 (`gonggan-interior`) + Public Access 활성화
- [x] Cloudflare R2 API Token 발급
- [x] Resend 가입 + API Key 발급
- [x] `.env.local` 작성 완료
- [x] `npm run dev` 로컬 확인 완료

### 미완료 (Claude Code에서 처음 해야 할 것)

- [ ] `tailwind.config.ts` 에 폰트·컬러 토큰 추가 (아래 섹션 6 참조)
- [ ] `app/layout.tsx` 폰트 설정
- [ ] 프로젝트 디렉토리 구조 생성
- [ ] 각 섹션 컴포넌트 구현
- [ ] Supabase 클라이언트 lib 파일 생성
- [ ] R2 유틸 lib 파일 생성
- [ ] 문의 폼 Server Action + Resend 연동
- [ ] 관리자 패널 (로그인 + 프로젝트 CRUD + 문의 목록)
- [ ] Vercel 배포

---

## 4. 환경변수 구조 (.env.local)

> 실제 값은 이미 로컬에 작성되어 있음. 아래는 키 이름 참조용.

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # 서버 전용, 클라이언트 노출 금지

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=gonggan-interior
R2_PUBLIC_URL=                    # https://pub-xxxx.r2.dev

# Resend
RESEND_API_KEY=
ALERT_EMAIL=612057ekp@naver.com   # 문의 수신 이메일
```

---

## 5. Supabase 스키마 (이미 실행 완료)

```sql
-- 시공 사례
create table projects (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text unique not null,
  category     text not null check (
    category in ('주거공간','상업공간','교육·종교','신축·증축')
  ),
  location     text,
  area_sqm     numeric,
  duration     text,
  year         int,
  description  text,
  is_featured  boolean default false,
  is_published boolean default false,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- 프로젝트 이미지 (R2 오브젝트 키 저장)
create table project_images (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid references projects(id) on delete cascade,
  r2_key      text not null,
  is_cover    boolean default false,
  is_before   boolean default false,   -- before/after 구분용
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- 문의
create table inquiries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  phone      text not null,
  category   text,
  location   text,
  message    text not null,
  is_read    boolean default false,
  created_at timestamptz default now()
);

-- RLS
alter table projects       enable row level security;
alter table project_images enable row level security;
alter table inquiries      enable row level security;

create policy "public read projects"   on projects       for select using (is_published = true);
create policy "public read images"     on project_images for select using (true);
create policy "anyone insert inquiry"  on inquiries      for insert with check (true);
```

---

## 6. 목표 디렉토리 구조

```
src/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx          # Nav + Footer 포함
│   │   ├── page.tsx            # 메인 랜딩 (모든 섹션)
│   │   └── projects/
│   │       ├── page.tsx        # 포트폴리오 전체 목록
│   │       └── [slug]/
│   │           └── page.tsx    # 프로젝트 상세 + before/after 갤러리
│   ├── admin/
│   │   ├── layout.tsx          # 관리자 레이아웃 (인증 체크 미들웨어)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx        # 사례 목록
│   │   │   ├── new/page.tsx    # 사례 등록 (이미지 업로드)
│   │   │   └── [id]/page.tsx   # 사례 수정
│   │   └── inquiries/
│   │       └── page.tsx        # 문의 목록 (읽음 처리)
│   ├── api/
│   │   └── upload/
│   │       └── route.ts        # R2 presigned URL 발급
│   ├── globals.css
│   └── layout.tsx              # 루트 레이아웃 (폰트 주입)
├── actions/
│   ├── projects.ts             # 프로젝트 Server Actions
│   └── inquiries.ts            # 문의 Server Action + Resend 호출
├── components/
│   ├── public/
│   │   ├── HeroSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── ProcessSection.tsx
│   │   └── ContactSection.tsx
│   ├── admin/
│   │   ├── ImageUploader.tsx   # R2 presigned 업로드 + 모바일 카메라 지원
│   │   └── InquiryCard.tsx
│   └── ui/
│       ├── Navbar.tsx
│       └── Footer.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # 브라우저용 클라이언트
│   │   └── server.ts           # 서버용 클라이언트 (Server Actions)
│   ├── r2.ts                   # R2 presigned URL 발급 + 삭제 + 공개 URL
│   └── resend.ts               # 이메일 발송 유틸
└── types/
    └── index.ts                # Project, Inquiry, ProjectImage 타입
```

---

## 7. 핵심 파일 코드 (Claude Code에서 그대로 생성)

### `tailwind.config.ts` (폰트·컬러 추가)

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        'serif-kr': ['var(--font-serif-kr)', 'serif'],
        'display':  ['var(--font-display)', 'serif'],
        'sans':     ['Pretendard Variable', 'Pretendard', 'sans-serif'],
      },
      colors: {
        brown: {
          900: '#2a1a0e',
          800: '#3a2218',
          700: '#4e2e1e',
          500: '#7a4a30',
          300: '#b08060',
        },
        cream: {
          100: '#faf6f0',
          200: '#f2e9dc',
          300: '#e8d8c4',
        },
      },
    },
  },
  plugins: [],
}

export default config
```

### `src/app/layout.tsx` (루트 레이아웃)

```tsx
import type { Metadata } from 'next'
import { Noto_Serif_KR, Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const notoSerifKr = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-serif-kr',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
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
        {/* Pretendard — Google Fonts 미등록, CDN 사용 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
```

### `src/lib/supabase/server.ts`

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

### `src/lib/supabase/client.ts`

```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### `src/lib/r2.ts`

```ts
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

// 클라이언트가 직접 R2에 업로드할 수 있는 presigned URL 발급 (유효 5분)
export async function getUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
  })
  return getSignedUrl(r2, command, { expiresIn: 300 })
}

export async function deleteFile(key: string) {
  await r2.send(new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
  }))
}

// R2 public URL 조합
export function getPublicUrl(key: string) {
  return `${process.env.R2_PUBLIC_URL}/${key}`
}
```

### `src/lib/resend.ts`

```ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface InquiryData {
  name: string
  phone: string
  category: string
  location: string
  message: string
}

export async function sendInquiryAlert(data: InquiryData) {
  return resend.emails.send({
    from: 'onboarding@resend.dev',   // 도메인 인증 후 변경
    to: process.env.ALERT_EMAIL!,
    subject: `[공간인테리어] 새 문의 — ${data.name} / ${data.category}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2a1a0e; border-bottom: 2px solid #b08060; padding-bottom: 8px;">
          새 문의가 접수되었습니다
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr><td style="padding: 8px 0; color: #7a4a30; width: 80px;">성함</td><td>${data.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #7a4a30;">연락처</td><td><a href="tel:${data.phone}">${data.phone}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #7a4a30;">분야</td><td>${data.category}</td></tr>
          <tr><td style="padding: 8px 0; color: #7a4a30;">지역</td><td>${data.location}</td></tr>
          <tr><td style="padding: 8px 0; color: #7a4a30; vertical-align: top;">내용</td><td style="white-space: pre-wrap;">${data.message}</td></tr>
        </table>
        <p style="margin-top: 24px; font-size: 12px; color: #9a7a62;">
          공간인테리어 홈페이지 자동 발송 메일입니다.
        </p>
      </div>
    `,
  })
}
```

### `src/actions/inquiries.ts`

```ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { sendInquiryAlert } from '@/lib/resend'

export async function submitInquiry(formData: FormData) {
  const data = {
    name:     (formData.get('name')     as string).trim(),
    phone:    (formData.get('phone')    as string).trim(),
    category: (formData.get('category') as string).trim(),
    location: (formData.get('location') as string).trim(),
    message:  (formData.get('message')  as string).trim(),
  }

  // 필수 필드 검증
  if (!data.name || !data.phone || !data.message) {
    return { success: false, error: '필수 항목을 모두 입력해 주세요.' }
  }

  const supabase = createClient()

  // 1. DB 저장
  const { error } = await supabase.from('inquiries').insert(data)
  if (error) return { success: false, error: '저장 중 오류가 발생했습니다.' }

  // 2. 이메일 알림
  try {
    await sendInquiryAlert(data)
  } catch (e) {
    // 이메일 실패해도 문의 접수는 성공 처리
    console.error('Email send failed:', e)
  }

  return { success: true }
}
```

### `src/types/index.ts`

```ts
export type ProjectCategory = '주거공간' | '상업공간' | '교육·종교' | '신축·증축'

export interface Project {
  id: string
  title: string
  slug: string
  category: ProjectCategory
  location: string | null
  area_sqm: number | null
  duration: string | null
  year: number | null
  description: string | null
  is_featured: boolean
  is_published: boolean
  created_at: string
  updated_at: string
  project_images?: ProjectImage[]
}

export interface ProjectImage {
  id: string
  project_id: string
  r2_key: string
  is_cover: boolean
  is_before: boolean
  sort_order: number
  created_at: string
}

export interface Inquiry {
  id: string
  name: string
  phone: string
  category: string | null
  location: string | null
  message: string
  is_read: boolean
  created_at: string
}
```

---

## 8. 디자인 레퍼런스 (기존 HTML에서 이식)

기존에 claude.ai에서 만든 단일 HTML 파일(`gonggan-interior.html`)이 있음.  
이 파일을 섹션별로 분리해서 각 컴포넌트로 이식하면 됨.

### 폰트 크기 교정 기준 (기존 HTML에서 너무 작았던 값들 반드시 수정)

| 위치 | 기존 | 수정값 |
|---|---|---|
| 서비스 설명 | 0.80rem (12.8px) | 0.92rem |
| 서비스 항목 li | 0.75rem (12.0px) | 0.85rem |
| 네비 링크 | 0.82rem | 0.88rem |
| 진행과정 설명 | 0.75rem | 0.85rem |
| 프로젝트 카테고리 라벨 | 0.72rem | 0.80rem |
| 연락처 라벨 | 0.72rem | 0.80rem |
| 푸터 카피라이트 | 0.72rem | 0.80rem |
| Hero 설명 | 0.92rem | 1.0rem |
| 섹션 서브텍스트 | 0.90rem | 0.95rem |

**최소 기준**: 한국어 본문 15px 이상, 보조 텍스트 13px 이상.

### 섹션 구성 순서

1. Hero — 브랜드 메시지 + 경력 통계 3개
2. Services — 4개 카드 (실내인테리어 / 주거공간 / 상업공간 / 신축증축)
3. Projects — 카테고리 필터 + 그리드 (Supabase에서 fetch)
4. About — 대표 소개 + 경력 뱃지
5. Process — 5단계 (상담→실측→견적→시공→완공·AS)
6. Contact — 연락처 정보 + 문의 폼 (submitInquiry Server Action 연결)

---

## 9. 관리자 패널 요구사항

- `/admin/login` — Supabase Auth 이메일 로그인
- `/admin/projects` — 시공 사례 목록 + 발행/미발행 토글
- `/admin/projects/new` — 제목·카테고리·설명 입력 + R2 이미지 업로드
  - 모바일에서 카메라 직접 연동: `<input accept="image/*" capture="environment">`
  - before/after 이미지 구분 체크박스
- `/admin/inquiries` — 문의 목록, 읽음 처리, 전화 연결 링크
- 모든 버튼 터치 영역 최소 44×44px (모바일 사용 고려)

---

## 10. 배포 순서 (개발 완료 후)

```
1. GitHub 레포 생성 → push
2. Vercel 프로젝트 연결 (GitHub import)
3. Vercel 환경변수 등록 (.env.local 내용 그대로)
4. Cloudflare에서 도메인 구매 (예: gonggan-interior.com)
5. Cloudflare DNS → Vercel 커스텀 도메인 연결
6. Resend에서 도메인 DNS 인증 → 발신 이메일 변경
7. R2 CORS 설정 (Vercel 도메인 허용)
```

### R2 CORS 설정 (버킷 Settings → CORS)

```json
[
  {
    "AllowedOrigins": ["https://your-domain.com", "http://localhost:3000"],
    "AllowedMethods": ["GET", "PUT"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

---

## 11. 다음 작업 우선순위

Claude Code에서 이 순서대로 진행 권장:

```
1. tailwind.config.ts + app/layout.tsx 폰트·컬러 세팅
2. src/types/index.ts 타입 파일
3. src/lib/ 전체 (supabase/client, supabase/server, r2, resend)
4. src/actions/inquiries.ts
5. 공개 컴포넌트 이식 (HeroSection → ContactSection 순서)
6. app/(public)/layout.tsx + page.tsx 조립
7. 문의 폼 연동 테스트 (로컬에서 Resend 이메일 수신 확인)
8. 관리자 패널 구현
9. Vercel 배포
```

---

*이 문서는 claude.ai와의 대화를 바탕으로 작성되었습니다. 질문이나 맥락이 필요할 때는 이 문서를 컨텍스트로 첨부하세요.*
