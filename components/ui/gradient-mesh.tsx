'use client';

import { motion } from 'framer-motion';

interface GradientMeshProps {
    variant?: 'hero' | 'why-choose' | 'custom';
    animate?: boolean;
    className?: string;
}

export function GradientMesh({
    variant = 'hero',
    animate = false,
    className
}: GradientMeshProps) {
    const meshStyles = {
        hero: {
            background: `
        radial-gradient(at 0% 0%, rgba(11, 109, 65, 0.20) 0px, transparent 50%),
        radial-gradient(at 50% 0%, rgba(255, 222, 89, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(11, 109, 65, 0.15) 0px, transparent 50%)
      `,
        },
        'why-choose': {
            background: `
        radial-gradient(at 0% 100%, rgba(11, 109, 65, 0.15) 0px, transparent 50%),
        radial-gradient(at 50% 100%, rgba(255, 222, 89, 0.10) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(251, 251, 238, 0.20) 0px, transparent 50%)
      `,
        },
        custom: {}
    };

    return (
        <motion.div
            className={`absolute inset-0 -z-10 ${className}`}
            style={meshStyles[variant]}
            animate={animate ? {
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            } : undefined}
            transition={animate ? {
                duration: 20,
                repeat: Infinity,
                ease: 'linear'
            } : undefined}
        />
    );
}
