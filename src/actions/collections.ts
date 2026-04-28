'use server'

import { z } from 'zod'
import { auth } from '@/src/auth'
import { createCollection as dbCreateCollection } from '@/src/lib/db/collections'
import type { CollectionWithDetails } from '@/src/lib/db/collections'

const createCollectionSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  description: z.string().trim().optional(),
})

type CreateCollectionResult =
  | { success: true; data: CollectionWithDetails }
  | { success: false; error: string }

export async function createCollection(payload: unknown): Promise<CreateCollectionResult> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

  const parsed = createCollectionSchema.safeParse(payload)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  const { name, description } = parsed.data

  try {
    const collection = await dbCreateCollection(session.user.id, {
      name,
      description: description || null,
    })
    return { success: true, data: collection }
  } catch {
    return { success: false, error: 'Failed to create collection' }
  }
}
