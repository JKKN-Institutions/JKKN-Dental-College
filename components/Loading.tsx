'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className='fixed inset-0 bg-white z-50 flex items-center justify-center'>
      {/* Loading Animation */}
      <div className='text-center'>
        {/* Logo or Loading Image */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='mb-8'
        >
          <div className='w-32 h-32 mx-auto bg-primary-green rounded-full flex items-center justify-center shadow-2xl'>
            <span className='text-white text-4xl font-bold'>JKKN</span>
          </div>
        </motion.div>

        {/* Loading Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className='w-16 h-16 mx-auto border-4 border-primary-green/20 border-t-primary-green rounded-full'
        />

        {/* Loading Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className='mt-6 text-gray-600 font-medium'
        >
          Loading...
        </motion.p>
      </div>
    </div>
  );
}
