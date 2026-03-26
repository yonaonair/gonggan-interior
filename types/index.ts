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
