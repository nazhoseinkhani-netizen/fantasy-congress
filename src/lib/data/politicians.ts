import type { Politician } from '@/types'

let cachedPoliticians: Politician[] | null = null

export async function loadPoliticians(): Promise<Politician[]> {
  if (cachedPoliticians) return cachedPoliticians
  const res = await fetch('/data/politicians.json')
  if (!res.ok) throw new Error(`Failed to load politicians: ${res.status}`)
  cachedPoliticians = (await res.json()) as Politician[]
  return cachedPoliticians
}

export async function loadPoliticianById(bioguideId: string): Promise<Politician | undefined> {
  const politicians = await loadPoliticians()
  return politicians.find((p) => p.bioguideId === bioguideId)
}

export async function loadPoliticiansByIds(ids: string[]): Promise<Politician[]> {
  const politicians = await loadPoliticians()
  const idSet = new Set(ids)
  return politicians.filter((p) => idSet.has(p.bioguideId))
}

export function clearPoliticiansCache(): void {
  cachedPoliticians = null
}
