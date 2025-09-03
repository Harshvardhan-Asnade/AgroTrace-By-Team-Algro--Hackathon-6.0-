
'use client';

import { motion } from 'framer-motion';
import { Logo } from './Logo';

export default function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 0.2,
          duration: 0.8,
          ease: 'easeOut',
        }}
      >
        <Logo />
      </motion.div>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: 0.8,
          duration: 0.6,
          ease: 'easeOut',
        }}
        className="mt-4 text-lg text-muted-foreground"
      >
        by Team Agro
      </motion.p>
    </motion.div>
  );
}
