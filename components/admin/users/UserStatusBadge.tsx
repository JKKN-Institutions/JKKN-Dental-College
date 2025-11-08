/**
 * UserStatusBadge Component
 * Displays user status with appropriate color coding
 */

import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'

interface UserStatusBadgeProps {
  status: 'active' | 'blocked' | 'pending'
  className?: string
}

export function UserStatusBadge({ status, className }: UserStatusBadgeProps) {
  const statusConfig = {
    active: {
      label: 'Active',
      variant: 'default' as const,
      className: 'bg-green-100 text-green-700 hover:bg-green-100',
      icon: CheckCircle2,
    },
    blocked: {
      label: 'Blocked',
      variant: 'destructive' as const,
      className: 'bg-red-100 text-red-700 hover:bg-red-100',
      icon: XCircle,
    },
    pending: {
      label: 'Pending',
      variant: 'secondary' as const,
      className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
      icon: Clock,
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={`${config.className} ${className || ''}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  )
}
