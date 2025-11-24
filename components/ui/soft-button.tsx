'use client';

import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SoftButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'neutral';
    size?: 'sm' | 'md' | 'lg';
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
}

export function SoftButton({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    className,
    ...props
}: SoftButtonProps) {
    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    };

    const variantClasses = {
        primary: 'text-[#0b6d41]',
        secondary: 'text-[#0b6d41] before:bg-[#ffde59]/20',
        neutral: 'text-gray-700'
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className={cn(
                'btn-neuro',
                'inline-flex items-center justify-center gap-2',
                'font-medium',
                sizeClasses[size],
                variantClasses[variant],
                className
            )}
            {...props}
        >
            {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
            {children}
            {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
        </motion.button>
    );
}
