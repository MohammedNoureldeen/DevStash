'use server'

import { z } from 'zod'
import { auth } from '@/src/auth'
import {
  createCollection as dbCreateCollection,
  updateCollection as dbUpdateCollection,
  deleteCollection as dbDeleteCollection,
  toggleFavoriteCollection as dbToggleFavoriteCollection,
} from '@/src/lib/db/collections'
import type { CollectionWithDetails } from '@/src/lib/db/collections'

const createCollectionSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  description: z.string().trim().optional(),
})

const updateCollectionSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, 'Name is required').optional(),
  description: z.string().trim().nullable().optional(),
})

type CreateCollectionResult =
  | { success: true; data: CollectionWithDetails }
  | { success: false; error: string }

type UpdateCollectionResult =
  | { success: true; data: CollectionWithDetails }
  | { success: false; error: string }

type DeleteCollectionResult =
  | { success: true }
  | { success: false; error: string }

type ToggleFavoriteResult =
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

export async function updateCollection(payload: unknown): Promise<UpdateCollectionResult> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

  const parsed = updateCollectionSchema.safeParse(payload)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  const { id, ...data } = parsed.data

  try {
    const collection = await dbUpdateCollection(id, session.user.id, data)
    if (!collection) return { success: false, error: 'Collection not found' }
    return { success: true, data: collection }
  } catch {
    return { success: false, error: 'Failed to update collection' }
  }
}

export async function deleteCollection(id: string): Promise<DeleteCollectionResult> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

  try {
    const deleted = await dbDeleteCollection(id, session.user.id)
    if (!deleted) return { success: false, error: 'Collection not found' }
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to delete collection' }
  }
}

export async function toggleFavoriteCollection(id: string): Promise<ToggleFavoriteResult> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

  try {
    const collection = await dbToggleFavoriteCollection(id, session.user.id)
    if (!collection) return { success: false, error: 'Collection not found' }
    return { success: true, data: collection }
  } catch {
    return { success: false, error: 'Failed to toggle favorite' }
  }
}
