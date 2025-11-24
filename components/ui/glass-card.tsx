'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    intensity?: 'light' | 'medium' | 'strong';
}

export function GlassCard({
    children,
    className,
    hover = true,
    intensity = 'light'
}: GlassCardProps) {
    const blurClasses = {
        light: 'backdrop-blur-sm lg:backdrop-blur-md',
        medium: 'backdrop-blur-md lg:backdrop-blur-lg',
        strong: 'backdrop-blur-lg lg:backdrop-blur-xl'
    };

    return (
        <motion.div
            whileHover={hover ? { y: -4 } : undefined}
            className={cn(
                'relative rounded-2xl',
                'bg-white/10 border border-white/18',
                blurClasses[intensity],
                'shadow-[0_8px_32px_0_rgba(11,109,65,0.08)]',
                'p-6 lg:p-8',
                'transition-all duration-300 ease-in-out',
                hover && 'hover:bg-white/15 hover:shadow-[0_12px_40px_0_rgba(11,109,65,0.12)]',
                className
            )}
        >
            {children}
        </motion.div>
    );
}
