'use client'

import { toPng } from 'html-to-image'
import { useRef, useState, useCallback } from 'react'

export function useShareCard() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [generating, setGenerating] = useState(false)

  const generate = useCallback(async (): Promise<string | null> => {
    if (!cardRef.current) return null
    setGenerating(true)
    try {
      const opts = { pixelRatio: 2, cacheBust: true, quality: 0.95 }
      // iOS Safari blank-image workaround: prime with 2 discarded calls
      await toPng(cardRef.current, opts)
      await toPng(cardRef.current, opts)
      const dataUrl = await toPng(cardRef.current, opts)
      return dataUrl
    } finally {
      setGenerating(false)
    }
  }, [])

  return { cardRef, generate, generating }
}

export function downloadImage(dataUrl: string, filename: string): void {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export async function shareImage(dataUrl: string, title: string): Promise<void> {
  if (navigator.canShare) {
    try {
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      const file = new File([blob], 'share.png', { type: 'image/png' })
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ title, files: [file] })
        return
      }
    } catch {
      // Fall through to download fallback
    }
  }
  downloadImage(dataUrl, 'fantasy-congress-share.png')
}
