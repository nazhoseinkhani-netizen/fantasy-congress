import { readFile } from 'fs/promises'
import path from 'path'
import type { Politician } from '@/types'
import { PoliticianProfileClient } from '@/components/profile/politician-profile-client'

export const dynamicParams = false

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), 'public/data/politicians.json')
  const raw = await readFile(filePath, 'utf-8')
  const politicians: Politician[] = JSON.parse(raw)
  return politicians.map((p) => ({ bioguideId: p.bioguideId }))
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ bioguideId: string }>
}) {
  const { bioguideId } = await params
  return <PoliticianProfileClient bioguideId={bioguideId} />
}
