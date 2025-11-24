'use client';

import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

// Types
export interface SubModule {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  badge?: number;
}

export interface ParentModule {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
  badge?: number;
  subModules?: SubModule[];
}

interface HorizontalNavVerticalSubProps {
  modules: ParentModule[];
  activeModuleId?: string;
  activeSubModuleId?: string;
  onModuleClick?: (moduleId: string) => void;
  onSubModuleClick?: (moduleId: string, subModuleId: string) => void;
  className?: string;
}

export function HorizontalNavVerticalSub({
  modules,
  activeModuleId,
  activeSubModuleId,
  onModuleClick,
  onSubModuleClick,
  className = '',
}: HorizontalNavVerticalSubProps) {
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState(activeModuleId || modules[0]?.id);
  const [activeSubModule, setActiveSubModule] = useState(activeSubModuleId);

  const expandedModule = modules.find((m) => m.id === expandedModuleId);
  const expandedModuleIndex = modules.findIndex((m) => m.id === expandedModuleId);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedModuleId(null);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleModuleClick = useCallback((module: ParentModule) => {
    if (module.subModules && module.subModules.length > 0) {
      setExpandedModuleId((prev) => (prev === module.id ? null : module.id));
    } else {
      setActiveModule(module.id);
      setActiveSubModule(undefined);
      setExpandedModuleId(null);
      onModuleClick?.(module.id);
    }
  }, [onModuleClick]);

  const handleSubModuleClick = useCallback((moduleId: string, subModule: SubModule) => {
    setActiveModule(moduleId);
    setActiveSubModule(subModule.id);
    setExpandedModuleId(null);
    onSubModuleClick?.(moduleId, subModule.id);
    subModule.onClick?.();
  }, [onSubModuleClick]);

  return (
    <>
      {/* Backdrop when expanded */}
      {expandedModuleId && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setExpandedModuleId(null)}
        />
      )}

      {/* Vertical Floating Submodules with Icons + Labels */}
      {expandedModule && expandedModule.subModules && (
        <div 
          className="fixed z-50 flex flex-col-reverse gap-2"
          style={{
            bottom: '6rem',
            left: `calc(${(expandedModuleIndex + 0.5) * (100 / modules.length)}%)`,
            transform: 'translateX(-50%)',
          }}
        >
          {expandedModule.subModules.map((subModule, index) => {
            const SubIcon = subModule.icon;
            const isActive = activeSubModule === subModule.id && activeModule === expandedModule.id;

            return (
              <button
                key={subModule.id}
                onClick={() => handleSubModuleClick(expandedModule.id, subModule)}
                className={`
                  relative flex items-center gap-3 px-4 py-3 rounded-2xl
                  min-w-[180px] shadow-xl border
                  transition-all duration-300 ease-out
                  ${isActive
                    ? `${expandedModule.color || 'bg-blue-500'} text-white border-transparent shadow-lg`
                    : 'bg-white text-gray-700 border-gray-100 hover:bg-gray-50 hover:shadow-2xl hover:scale-105'
                  }
                `}
                style={{
                  animation: `floatUp 0.3s ease-out ${index * 0.05}s both`,
                }}
              >
                {/* Icon Container */}
                <div className={`
                  flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                  ${isActive 
                    ? 'bg-white/20' 
                    : 'bg-gray-100'
                  }
                `}>
                  <SubIcon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                </div>
                
                {/* Label */}
                <span className={`font-semibold text-sm flex-1 text-left ${isActive ? 'text-white' : 'text-gray-700'}`}>
                  {subModule.label}
                </span>
                
                {/* Badge */}
                {subModule.badge !== undefined && subModule.badge > 0 && (
                  <span className={`
                    min-w-6 h-6 px-2 text-xs rounded-full flex items-center justify-center font-bold
                    ${isActive ? 'bg-white/30 text-white' : 'bg-red-500 text-white'}
                  `}>
                    {subModule.badge > 99 ? '99+' : subModule.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Header with module name and close button */}
          <div 
            className={`flex items-center justify-between px-4 py-2.5 rounded-xl ${expandedModule.color || 'bg-blue-500'}`}
            style={{
              animation: `floatUp 0.3s ease-out ${expandedModule.subModules.length * 0.05}s both`,
            }}
          >
            <div className="flex items-center gap-2">
              <expandedModule.icon className="w-4 h-4 text-white" />
              <span className="text-sm font-bold text-white">
                {expandedModule.label}
              </span>
            </div>
            <button
              onClick={() => setExpandedModuleId(null)}
              className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Horizontal Bottom Navigation Bar - Floating with Rounded Corners */}
      <nav
        className={`fixed bottom-4 left-4 right-4 z-50 ${className}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-xl rounded-3xl">
          <div className="flex items-center justify-around px-4 h-16">
            {modules.map((module) => {
              const Icon = module.icon;
              const isActive = activeModule === module.id;
              const isExpanded = expandedModuleId === module.id;
              const hasSubModules = module.subModules && module.subModules.length > 0;

              return (
                <button
                  key={module.id}
                  onClick={() => handleModuleClick(module)}
                  className={`
                    relative flex flex-col items-center justify-center
                    flex-1 py-2 min-h-[56px]
                    transition-all duration-200
                    ${isActive || isExpanded
                      ? module.color?.replace('bg-', 'text-') || 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                  aria-current={isActive && !hasSubModules ? 'page' : undefined}
                  aria-expanded={hasSubModules ? isExpanded : undefined}
                >
                  <div className="relative">
                    <Icon className={`w-6 h-6 transition-transform ${isActive || isExpanded ? 'scale-110' : ''}`} />
                    {module.badge !== undefined && module.badge > 0 && (
                      <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                        {module.badge > 9 ? '9+' : module.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs mt-1 ${isActive || isExpanded ? 'font-semibold' : 'font-medium'}`}>
                    {module.label}
                  </span>

                  {/* Active/Expanded indicator */}
                  {(isActive || isExpanded) && (
                    <div className={`absolute bottom-1 h-1 rounded-full ${module.color || 'bg-blue-500'} ${isExpanded ? 'w-6' : 'w-1'} transition-all`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes floatUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}

export default HorizontalNavVerticalSub;
