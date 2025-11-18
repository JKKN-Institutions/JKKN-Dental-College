import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageEditor } from '@/components/admin/pages/page-editor'

interface EditPageProps {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Edit Page | Admin',
  description: 'Edit custom page with drag-and-drop blocks',
}

async function getPage(id: string) {
  const supabase = await createClient()

  const { data: page, error } = await supabase
    .from('pages')
    .select(`
      *,
      creator:profiles!created_by(id, full_name, email),
      publisher:profiles!published_by(id, full_name, email)
    `)
    .eq('id', id)
    .single()

  if (error || !page) {
    return null
  }

  return page
}

export default async function EditPagePage({ params }: EditPageProps) {
  const { id } = await params
  const page = await getPage(id)

  if (!page) {
    notFound()
  }

  return <PageEditor page={page} />
}
