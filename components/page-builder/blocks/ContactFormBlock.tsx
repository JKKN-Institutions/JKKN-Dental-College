'use client'

import React, { useState } from 'react'
import { applyBlockStyles } from './BlockRenderer'
import type { ContactFormBlockConfig } from '@/types/page-builder'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface ContactFormBlockProps {
  block: ContactFormBlockConfig
  isEditing?: boolean
}

export function ContactFormBlock({ block, isEditing }: ContactFormBlockProps) {
  const { config, styles } = block
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const data = Object.fromEntries(formData.entries())

      // TODO: Implement actual form submission logic
      console.log('Form data:', data)

      toast.success('Form submitted successfully!')
      e.currentTarget.reset()
    } catch (error) {
      toast.error('Failed to submit form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="my-8 p-8 bg-muted/50 rounded-lg" style={applyBlockStyles(styles)}>
      {config.title && <h3 className="text-2xl font-bold mb-2">{config.title}</h3>}
      {config.description && (
        <p className="text-muted-foreground mb-6">{config.description}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {config.fields.map((field, index) => (
          <div key={index}>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.type === 'textarea' ? (
              <Textarea
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
                rows={4}
              />
            ) : (
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                required={field.required}
              />
            )}
          </div>
        ))}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : config.submitButtonText || 'Submit'}
        </Button>
      </form>
    </div>
  )
}
