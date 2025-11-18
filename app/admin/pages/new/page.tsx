import { CreatePageForm } from '@/components/admin/pages/create-page-form'

export const metadata = {
  title: 'Create Page | Admin',
  description: 'Create a new custom page',
}

export default function NewPagePage() {
  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Page</h1>
        <p className="text-muted-foreground mt-2">
          Start by giving your page a title and URL slug
        </p>
      </div>
      <CreatePageForm />
    </div>
  )
}
