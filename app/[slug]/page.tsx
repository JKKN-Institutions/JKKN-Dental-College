import { notFound } from 'next/navigation'
import { PageService } from '@/lib/services/page-builder/page-service'
import { BlockRenderer } from '@/components/page-builder/blocks/BlockRenderer'
import type { PageBlock } from '@/types/page-builder'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await PageService.getPageBySlug(slug)

  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }

  return {
    title: page.seo_metadata?.title || page.title,
    description: page.seo_metadata?.description || page.description,
    openGraph: {
      title: page.seo_metadata?.title || page.title,
      description: page.seo_metadata?.description || page.description,
      images: page.seo_metadata?.og_image ? [page.seo_metadata.og_image] : [],
    },
    keywords: page.seo_metadata?.keywords,
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const page = await PageService.getPageBySlug(slug)

  if (!page || page.status !== 'published') {
    notFound()
  }

  // Use published_blocks if available, otherwise fall back to blocks
  const blocks = (page.published_blocks || page.blocks) as PageBlock[]

  return (
    <main className="min-h-screen">
      <article>
        {blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </article>
    </main>
  )
}
