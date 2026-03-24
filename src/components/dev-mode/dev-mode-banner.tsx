'use client'

import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import { useDevMode } from './dev-mode-provider'

export function DevModeBanner() {
  const { devMode, toggle } = useDevMode()

  return (
    <AnimatePresence>
      {devMode && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="bg-primary/10 border-b border-primary/30 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono text-primary">Developer Mode Active</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-mono">
                Data elements highlighted — hover for Alva Skill attribution
              </span>
              <button
                onClick={toggle}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close developer mode"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
