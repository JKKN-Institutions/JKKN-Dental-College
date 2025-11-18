'use client'

import React from 'react'
import { applyBlockStyles } from './BlockRenderer'
import type { TableBlockConfig } from '@/types/page-builder'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface TableBlockProps {
  block: TableBlockConfig
  isEditing?: boolean
}

export function TableBlock({ block, isEditing }: TableBlockProps) {
  const { config, styles } = block

  return (
    <div className="my-8 overflow-x-auto" style={applyBlockStyles(styles)}>
      <Table className={cn(config.bordered && 'border')}>
        <TableHeader>
          <TableRow>
            {config.headers.map((header, index) => (
              <TableHead key={index}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className={cn(config.striped && 'striped')}>
          {config.rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
