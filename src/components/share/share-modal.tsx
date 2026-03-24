'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Download, Copy, Share2 } from 'lucide-react'
import { downloadImage, shareImage } from './use-share-card'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string | null
  title: string
  filename: string
}

export function ShareModal({ isOpen, onClose, imageUrl, title, filename }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleDownload() {
    if (imageUrl) downloadImage(imageUrl, filename)
  }

  function handleShare() {
    if (imageUrl) shareImage(imageUrl, title)
  }

  return (
    <AnimatePresence>
      {isOpen && imageUrl && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview image */}
            <img
              src={imageUrl}
              alt={title}
              className="w-full rounded-lg border border-border mb-4"
            />

            {/* Action buttons */}
            <div className="flex gap-2">
              {/* Download */}
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm font-medium transition-colors"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy Link'}
              </button>

              {/* Native Share — only if Web Share API is available */}
              {typeof navigator !== 'undefined' && typeof navigator.canShare === 'function' && (
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm font-medium transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
