'use client';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface IconContainerProps {
    icon: LucideIcon;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'flat' | 'neuro' | 'glass';
    className?: string;
}

export function IconContainer({
    icon: Icon,
    size = 'md',
    variant = 'neuro',
    className
}: IconContainerProps) {
    const sizeClasses = {
        sm: 'w-10 h-10',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-20 h-20'
    };

    const iconSizes = {
        sm: 'w-5 h-5',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-10 h-10'
    };

    const variantClasses = {
        flat: 'bg-gradient-to-br from-[#0b6d41] to-[#0a5d37]',
        neuro: 'btn-neuro',
        glass: 'bg-white/10 backdrop-blur-sm border border-white/18'
    };

    return (
        <div className={cn(
            'flex items-center justify-center rounded-full',
            sizeClasses[size],
            variantClasses[variant],
            className
        )}>
            <Icon className={cn(
                iconSizes[size],
                variant === 'neuro' ? 'text-[#0b6d41]' : 'text-white'
            )} />
        </div>
    );
}
