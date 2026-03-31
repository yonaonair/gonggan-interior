import { createClient } from '@/lib/supabase/server'
import HeroSection from '@/components/public/HeroSection'
import ServicesSection from '@/components/public/ServicesSection'
import ProjectsSection from '@/components/public/ProjectsSection'
import AboutSection from '@/components/public/AboutSection'
import ProcessSection from '@/components/public/ProcessSection'
import ContractSection from '@/components/public/ContractSection'
import RevealObserver from '@/components/ui/RevealObserver'
import { getPublicUrl } from '@/lib/r2'
import type { Project } from '@/types'

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: projects }, { data: siteImages }] = await Promise.all([
    supabase
      .from('projects')
      .select('*, project_images(*)')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(6),
    supabase
      .from('site_images')
      .select('slot, r2_key, sort_order')
      .order('sort_order', { ascending: true }),
  ])

  const heroImages = (siteImages ?? [])
    .filter((img) => img.slot === 'hero')
    .map((img) => getPublicUrl(img.r2_key))

  const aboutImage = (siteImages ?? [])
    .filter((img) => img.slot === 'about')
    .map((img) => getPublicUrl(img.r2_key))[0]

  return (
    <>
      <RevealObserver />
      <HeroSection heroImages={heroImages} />
      <ServicesSection />
      <ProjectsSection projects={(projects ?? []) as Project[]} />
      <AboutSection aboutImage={aboutImage} />
      <ProcessSection />
      <ContractSection />
    </>
  )
}
