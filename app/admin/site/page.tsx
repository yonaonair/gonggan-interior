import { getSiteImages } from '@/actions/site-images'
import SiteImageUploader from '@/components/admin/SiteImageUploader'

export default async function AdminSitePage() {
  const [heroImages, aboutImages] = await Promise.all([
    getSiteImages('hero'),
    getSiteImages('about'),
  ])

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="text-[1.5rem] font-semibold text-brown-900 mb-1">사이트 이미지 관리</h1>
        <p className="text-[0.82rem] text-(--text-light)">
          홈페이지에 표시되는 이미지를 등록·교체할 수 있습니다.
        </p>
      </div>

      {/* 히어로 슬라이드쇼 */}
      <div className="border-t border-brown-800/10 pt-8">
        <SiteImageUploader
          slot="hero"
          initialImages={heroImages}
          label="히어로 슬라이드쇼"
          hint="홈페이지 상단 우측에 페이드인으로 순환 표시됩니다. 여러 장 등록할수록 풍부하게 보입니다. 권장: 가로형(3:2 또는 4:3), 1MB 이하."
        />
      </div>

      {/* 소개 대표 사진 */}
      <div className="border-t border-brown-800/10 pt-8">
        <SiteImageUploader
          slot="about"
          initialImages={aboutImages}
          maxImages={1}
          label="소개 대표 사진"
          hint="'공간에 진심을 담습니다' 섹션 왼쪽에 표시됩니다. 1장만 등록됩니다. 권장: 세로형(3:4), 1MB 이하."
        />
      </div>
    </div>
  )
}
