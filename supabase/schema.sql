-- 시공 사례
create table projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text unique not null,       -- URL용: "hansil-house-2024"
  category    text not null               -- 주거공간|상업공간|교육종교|신축증축
    check (category in ('주거공간','상업공간','교육·종교','신축·증축')),
  location    text,                       -- "전남 곡성"
  area_sqm    numeric,                    -- 시공 면적
  duration    text,                       -- "8주"
  year        int,
  description text,
  is_featured boolean default false,      -- 메인 히어로에 표시 여부
  is_published boolean default false,     -- 공개 여부
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- 프로젝트 이미지 (R2 키 저장)
create table project_images (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid references projects(id) on delete cascade,
  r2_key      text not null,              -- R2 오브젝트 키
  is_cover    boolean default false,      -- 썸네일 여부
  is_before   boolean default false,      -- before 이미지 여부 (before/after용)
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- 사이트 이미지 (히어로 슬라이드쇼, 소개 대표 사진 등)
create table site_images (
  id          uuid primary key default gen_random_uuid(),
  slot        text not null               -- 'hero' | 'about'
    check (slot in ('hero', 'about')),
  r2_key      text not null,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

alter table site_images enable row level security;

create policy "public read site_images"
  on site_images for select
  using (true);

-- 문의
create table inquiries (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text not null,
  category    text,
  location    text,
  message     text not null,
  is_read     boolean default false,
  created_at  timestamptz default now()
);

-- RLS 설정
alter table projects enable row level security;
alter table project_images enable row level security;
alter table inquiries enable row level security;

-- 공개 읽기 (published만)
create policy "public read projects"
  on projects for select
  using (is_published = true);

create policy "public read project_images"
  on project_images for select
  using (true);

-- 관리자: 전체 프로젝트 읽기 (미발행 포함)
create policy "auth read all projects"
  on projects for select
  to authenticated
  using (true);

-- 관리자: 프로젝트 생성/수정/삭제
create policy "auth insert projects"
  on projects for insert
  to authenticated
  with check (true);

create policy "auth update projects"
  on projects for update
  to authenticated
  using (true)
  with check (true);

create policy "auth delete projects"
  on projects for delete
  to authenticated
  using (true);

-- 관리자: 프로젝트 이미지 생성/삭제
create policy "auth insert project_images"
  on project_images for insert
  to authenticated
  with check (true);

create policy "auth delete project_images"
  on project_images for delete
  to authenticated
  using (true);

-- 관리자: 사이트 이미지 생성/삭제
create policy "auth insert site_images"
  on site_images for insert
  to authenticated
  with check (true);

create policy "auth delete site_images"
  on site_images for delete
  to authenticated
  using (true);

-- 문의는 누구나 insert, 읽기는 관리자만
create policy "anyone can insert inquiry"
  on inquiries for insert
  with check (true);

create policy "auth read inquiries"
  on inquiries for select
  to authenticated
  using (true);