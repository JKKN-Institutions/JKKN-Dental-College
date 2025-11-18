'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  GripVertical,
  Settings,
  Copy,
  Trash,
  Eye,
  EyeOff,
} from 'lucide-react'
import type { PageBlock } from '@/types/page-builder'
import { BlockRenderer } from '@/components/page-builder/blocks/BlockRenderer'
import { cn } from '@/lib/utils'

interface EditorCanvasProps {
  blocks: PageBlock[]
  selectedBlockId?: string
  onSelectBlock: (block: PageBlock) => void
  onUpdateBlock: (block: PageBlock) => void
  onDeleteBlock: (blockId: string) => void
  onDuplicateBlock: (blockId: string) => void
}

export function EditorCanvas({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  onDuplicateBlock,
}: EditorCanvasProps) {
  if (blocks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md p-8">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-xl font-semibold mb-2">Start Building Your Page</h3>
          <p className="text-muted-foreground">
            Choose blocks from the left sidebar to start creating your page content.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-4">
      {blocks.map((block) => (
        <SortableBlock
          key={block.id}
          block={block}
          isSelected={selectedBlockId === block.id}
          onSelect={() => onSelectBlock(block)}
          onUpdate={onUpdateBlock}
          onDelete={() => onDeleteBlock(block.id)}
          onDuplicate={() => onDuplicateBlock(block.id)}
        />
      ))}
    </div>
  )
}

interface SortableBlockProps {
  block: PageBlock
  isSelected: boolean
  onSelect: () => void
  onUpdate: (block: PageBlock) => void
  onDelete: () => void
  onDuplicate: () => void
}

function SortableBlock({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
}: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleToggleVisibility = () => {
    onUpdate({
      ...block,
      visibility: block.visibility === 'visible' ? 'hidden' : 'visible',
    })
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative rounded-lg transition-all',
        isSelected && 'ring-2 ring-primary',
        isDragging && 'opacity-50',
        block.visibility === 'hidden' && 'opacity-50'
      )}
      onClick={onSelect}
    >
      {/* Block Controls - Only show on hover or when selected */}
      <div
        className={cn(
          'absolute -top-3 left-1/2 -translate-x-1/2 z-10',
          'flex items-center gap-1 bg-background border rounded-lg shadow-lg p-1',
          'opacity-0 group-hover:opacity-100 transition-opacity',
          isSelected && 'opacity-100'
        )}
      >
        <TooltipProvider>
          {/* Drag Handle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 cursor-grab active:cursor-grabbing"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Drag to reorder</TooltipContent>
          </Tooltip>

          {/* Configure */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect()
                }}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Configure block</TooltipContent>
          </Tooltip>

          {/* Toggle Visibility */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggleVisibility()
                }}
              >
                {block.visibility === 'visible' ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {block.visibility === 'visible' ? 'Hide' : 'Show'} block
            </TooltipContent>
          </Tooltip>

          {/* Duplicate */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  onDuplicate()
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Duplicate block</TooltipContent>
          </Tooltip>

          {/* Delete */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm('Are you sure you want to delete this block?')) {
                    onDelete()
                  }
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete block</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Block Content */}
      <div
        className={cn(
          'border rounded-lg overflow-hidden',
          isSelected && 'border-primary',
          'hover:border-primary/50 transition-colors'
        )}
      >
        <BlockRenderer block={block} isEditing={true} />
      </div>

      {/* Block Type Label */}
      <div className="absolute bottom-2 right-2 px-2 py-1 bg-background/90 border rounded text-xs font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        {block.type}
      </div>
    </div>
  )
}
