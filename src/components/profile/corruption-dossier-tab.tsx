'use client'

import type { Politician, Trade } from '@/types'

interface CorruptionDossierTabProps {
  politician: Politician
  trades: Trade[]
}

export function CorruptionDossierTab({ politician, trades }: CorruptionDossierTabProps) {
  return <div>Corruption Dossier — placeholder</div>
}
