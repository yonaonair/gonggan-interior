import { createClient } from '@/lib/supabase/server'
import HeroSection from '@/components/public/HeroSection'
import ServicesSection from '@/components/public/ServicesSection'
import ProjectsSection from '@/components/public/ProjectsSection'
import AboutSection from '@/components/public/AboutSection'
import ProcessSection from '@/components/public/ProcessSection'
import ContractSection from '@/components/public/ContractSection'
import RevealObserver from '@/components/ui/RevealObserver'
import type { Project } from '@/types'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <>
      <RevealObserver />
      <HeroSection />
      <ServicesSection />
      <ProjectsSection projects={(projects ?? []) as Project[]} />
      <AboutSection />
      <ProcessSection />
      <ContractSection />
    </>
  )
}
