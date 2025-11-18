'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { DndContext, DragEndEvent, DragOverlay, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  Save,
  Eye,
  Upload,
  ArrowLeft,
  Settings,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import type { Page, PageBlock } from '@/types/page-builder'
import { PageService } from '@/lib/services/page-builder/page-service'
import { BlockPalette } from './block-palette'
import { EditorCanvas } from './editor-canvas'
import { BlockConfigPanel } from './block-config/BlockConfigPanel'
import { SEOConfigPanel } from './seo-config-panel'
import { PublishDialog } from './publish-dialog'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

interface PageEditorProps {
  page: Page
}

export function PageEditor({ page: initialPage }: PageEditorProps) {
  const router = useRouter()
  const [page, setPage] = useState<Page>(initialPage)
  const [blocks, setBlocks] = useState<PageBlock[]>(initialPage.blocks as PageBlock[])
  const [selectedBlock, setSelectedBlock] = useState<PageBlock | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date>(new Date(initialPage.last_saved_at))
  const [showSEOPanel, setShowSEOPanel] = useState(false)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!hasUnsavedChanges) return

    const autoSaveTimer = setTimeout(() => {
      handleAutoSave()
    }, 30000)

    return () => clearTimeout(autoSaveTimer)
  }, [blocks, hasUnsavedChanges])

  // Handle auto-save
  const handleAutoSave = useCallback(async () => {
    try {
      setIsSaving(true)
      await PageService.autoSavePage(page.id, blocks, 'current-user-id') // TODO: Get actual user ID
      setLastSaved(new Date())
      setHasUnsavedChanges(false)
      toast.success('Draft auto-saved', { duration: 2000 })
    } catch (error) {
      console.error('Auto-save failed:', error)
    } finally {
      setIsSaving(false)
    }
  }, [page.id, blocks])

  // Handle manual save
  const handleSave = async () => {
    try {
      setIsSaving(true)
      await PageService.updatePage({
        id: page.id,
        blocks,
        updated_by: 'current-user-id', // TODO: Get actual user ID
      })
      setLastSaved(new Date())
      setHasUnsavedChanges(false)
      toast.success('Page saved successfully!')
    } catch (error) {
      toast.error('Failed to save page')
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    if (active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id)
      const newIndex = blocks.findIndex((block) => block.id === over.id)

      const newBlocks = [...blocks]
      const [movedBlock] = newBlocks.splice(oldIndex, 1)
      newBlocks.splice(newIndex, 0, movedBlock)

      // Update order values
      const updatedBlocks = newBlocks.map((block, index) => ({
        ...block,
        order: index,
      }))

      setBlocks(updatedBlocks)
      setHasUnsavedChanges(true)
    }

    setActiveId(null)
  }

  // Handle add block
  const handleAddBlock = (blockType: string) => {
    const newBlock = createBlockTemplate(blockType, blocks.length)
    setBlocks([...blocks, newBlock])
    setHasUnsavedChanges(true)
    toast.success('Block added')
  }

  // Handle update block
  const handleUpdateBlock = (updatedBlock: PageBlock) => {
    const updatedBlocks = blocks.map((block) =>
      block.id === updatedBlock.id ? updatedBlock : block
    )
    setBlocks(updatedBlocks)
    setHasUnsavedChanges(true)
  }

  // Handle delete block
  const handleDeleteBlock = (blockId: string) => {
    const updatedBlocks = blocks
      .filter((block) => block.id !== blockId)
      .map((block, index) => ({ ...block, order: index }))
    setBlocks(updatedBlocks)
    setSelectedBlock(null)
    setHasUnsavedChanges(true)
    toast.success('Block deleted')
  }

  // Handle duplicate block
  const handleDuplicateBlock = (blockId: string) => {
    const blockToDuplicate = blocks.find((block) => block.id === blockId)
    if (!blockToDuplicate) return

    const newBlock = {
      ...blockToDuplicate,
      id: `${blockToDuplicate.type}_${Date.now()}`,
      order: blocks.length,
    }

    setBlocks([...blocks, newBlock])
    setHasUnsavedChanges(true)
    toast.success('Block duplicated')
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Block Palette Sidebar */}
      <BlockPalette onAddBlock={handleAddBlock} />

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Toolbar */}
        <div className="border-b bg-card">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin/pages">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-lg font-semibold">{page.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    `Last saved ${formatDistanceToNow(lastSaved, { addSuffix: true })}`
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={page.status === 'published' ? 'default' : 'outline'}>
                {page.status}
              </Badge>
              <Separator orientation="vertical" className="h-8" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSEOPanel(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                SEO
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <Link href={`/${page.slug}`} target="_blank">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={isSaving || !hasUnsavedChanges}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                size="sm"
                onClick={() => setShowPublishDialog(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>

        {/* Editor Canvas */}
        <div className="flex-1 overflow-auto">
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={(event) => setActiveId(event.active.id as string)}
          >
            <SortableContext
              items={blocks.map((block) => block.id)}
              strategy={verticalListSortingStrategy}
            >
              <EditorCanvas
                blocks={blocks}
                selectedBlockId={selectedBlock?.id}
                onSelectBlock={(block) => setSelectedBlock(block)}
                onUpdateBlock={handleUpdateBlock}
                onDeleteBlock={handleDeleteBlock}
                onDuplicateBlock={handleDuplicateBlock}
              />
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                <div className="bg-primary/10 border-2 border-primary rounded-lg p-4">
                  Dragging...
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {/* Block Configuration Panel */}
      {selectedBlock && (
        <BlockConfigPanel
          block={selectedBlock}
          onUpdate={handleUpdateBlock}
          onClose={() => setSelectedBlock(null)}
        />
      )}

      {/* SEO Configuration Dialog */}
      {showSEOPanel && (
        <SEOConfigPanel
          page={page}
          onUpdate={(seoData) => {
            setPage({ ...page, seo_metadata: seoData })
            setHasUnsavedChanges(true)
          }}
          onClose={() => setShowSEOPanel(false)}
        />
      )}

      {/* Publish Dialog */}
      {showPublishDialog && (
        <PublishDialog
          page={page}
          onPublish={() => {
            setShowPublishDialog(false)
            router.push('/admin/pages')
          }}
          onClose={() => setShowPublishDialog(false)}
        />
      )}
    </div>
  )
}

// Helper function to create block templates
function createBlockTemplate(blockType: string, order: number): PageBlock {
  const baseConfig = {
    id: `${blockType}_${Date.now()}`,
    type: blockType as PageBlock['type'],
    order,
    visibility: 'visible' as const,
  }

  switch (blockType) {
    case 'hero':
      return {
        ...baseConfig,
        type: 'hero',
        config: {
          title: 'Hero Title',
          subtitle: 'Hero subtitle goes here',
          backgroundType: 'gradient',
          gradient: { start: '#0b6d41', end: '#1a5f4a' },
          ctaButtons: [],
        },
      }
    case 'heading':
      return {
        ...baseConfig,
        type: 'heading',
        config: { text: 'Heading Text', level: 2 },
      }
    case 'paragraph':
      return {
        ...baseConfig,
        type: 'paragraph',
        config: { content: 'Paragraph text goes here...', fontSize: 'base' },
      }
    case 'image':
      return {
        ...baseConfig,
        type: 'image',
        config: {
          src: '/placeholder.jpg',
          alt: 'Image description',
          aspectRatio: '16/9',
        },
      }
    case 'cta':
      return {
        ...baseConfig,
        type: 'cta',
        config: {
          heading: 'Call to Action',
          description: 'Description text',
          buttons: [
            { label: 'Get Started', href: '#', variant: 'primary' },
          ],
        },
      }
    // Add more block templates as needed
    default:
      return {
        ...baseConfig,
        type: 'paragraph',
        config: { content: 'New block', fontSize: 'base' },
      } as PageBlock
  }
}
