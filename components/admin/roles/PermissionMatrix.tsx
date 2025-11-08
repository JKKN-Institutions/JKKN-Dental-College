/**
 * PermissionMatrix Component
 * Interactive permission grid for role management
 */

'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  moduleMetadata,
  permissionModules,
  type Permissions,
  type PermissionModule,
  type PermissionAction,
} from '@/lib/validations/role'
import { CheckSquare, Square, Eye, Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface PermissionMatrixProps {
  value: Permissions
  onChange: (permissions: Permissions) => void
  disabled?: boolean
}

export function PermissionMatrix({ value, onChange, disabled }: PermissionMatrixProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>([
    'dashboard',
    'users',
  ])

  // Toggle a specific permission
  const togglePermission = (module: PermissionModule, action: PermissionAction) => {
    const newPermissions = { ...value }

    if (!newPermissions[module]) {
      newPermissions[module] = {}
    }

    newPermissions[module] = {
      ...newPermissions[module],
      [action]: !newPermissions[module]?.[action],
    }

    onChange(newPermissions)
  }

  // Select all permissions for a module
  const selectAllForModule = (module: PermissionModule) => {
    const newPermissions = { ...value }
    const moduleActions = moduleMetadata[module].actions

    newPermissions[module] = {}
    moduleActions.forEach((actionMeta) => {
      newPermissions[module]![actionMeta.action] = true
    })

    onChange(newPermissions)
  }

  // Deselect all permissions for a module
  const deselectAllForModule = (module: PermissionModule) => {
    const newPermissions = { ...value }
    delete newPermissions[module]
    onChange(newPermissions)
  }

  // Select only "view" permission for a module
  const selectViewOnlyForModule = (module: PermissionModule) => {
    const newPermissions = { ...value }
    const hasViewAction = moduleMetadata[module].actions.some(
      (a) => a.action === 'view'
    )

    if (hasViewAction) {
      newPermissions[module] = { view: true }
      onChange(newPermissions)
    }
  }

  // Check if module has all permissions selected
  const hasAllPermissions = (module: PermissionModule): boolean => {
    if (!value[module]) return false
    const moduleActions = moduleMetadata[module].actions
    return moduleActions.every((actionMeta) => value[module]?.[actionMeta.action] === true)
  }

  // Check if module has some permissions selected
  const hasSomePermissions = (module: PermissionModule): boolean => {
    if (!value[module]) return false
    const moduleActions = moduleMetadata[module].actions
    return moduleActions.some((actionMeta) => value[module]?.[actionMeta.action] === true)
  }

  // Get count of selected permissions for a module
  const getPermissionCount = (module: PermissionModule): number => {
    if (!value[module]) return 0
    return Object.values(value[module]!).filter((v) => v === true).length
  }

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
        <Info className="w-4 h-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground flex-1">
          Select permissions for each module. Use the quick actions to select all or view-only permissions.
        </p>
      </div>

      {/* Permission Grid */}
      <Accordion
        type="multiple"
        value={expandedModules}
        onValueChange={setExpandedModules}
        className="space-y-2"
      >
        {permissionModules.map((module) => {
          const metadata = moduleMetadata[module]
          const permissionCount = getPermissionCount(module)
          const totalPermissions = metadata.actions.length

          return (
            <AccordionItem
              key={module}
              value={module}
              className="border rounded-lg px-4"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {hasAllPermissions(module) ? (
                        <CheckSquare className="w-5 h-5 text-green-600" />
                      ) : hasSomePermissions(module) ? (
                        <CheckSquare className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{metadata.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {metadata.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {permissionCount > 0 && (
                      <span className="text-xs font-medium text-primary-green">
                        {permissionCount}/{totalPermissions}
                      </span>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  {/* Quick Actions for Module */}
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => selectAllForModule(module)}
                      disabled={disabled}
                    >
                      <CheckSquare className="w-3 h-3 mr-1" />
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => selectViewOnlyForModule(module)}
                      disabled={
                        disabled ||
                        !metadata.actions.some((a) => a.action === 'view')
                      }
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View Only
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => deselectAllForModule(module)}
                      disabled={disabled}
                    >
                      <Square className="w-3 h-3 mr-1" />
                      Clear All
                    </Button>
                  </div>

                  {/* Permission Checkboxes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {metadata.actions.map((actionMeta) => {
                      const isChecked = value[module]?.[actionMeta.action] === true

                      return (
                        <div
                          key={actionMeta.action}
                          className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox
                            id={`${module}-${actionMeta.action}`}
                            checked={isChecked}
                            onCheckedChange={() =>
                              togglePermission(module, actionMeta.action)
                            }
                            disabled={disabled}
                          />
                          <div className="flex-1 space-y-1">
                            <Label
                              htmlFor={`${module}-${actionMeta.action}`}
                              className="text-sm font-medium cursor-pointer"
                            >
                              {actionMeta.label}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              {actionMeta.description}
                            </p>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">{actionMeta.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      {/* Summary */}
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Total Permissions Selected:</strong>{' '}
          {Object.values(value).reduce((acc, modulePerms) => {
            return acc + Object.values(modulePerms || {}).filter((v) => v === true).length
          }, 0)}{' '}
          permissions across {Object.keys(value).length} modules
        </p>
      </div>
    </div>
  )
}
