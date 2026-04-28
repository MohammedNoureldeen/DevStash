'use server'

import { z } from 'zod'
import { auth } from '@/src/auth'
import { updateItem as dbUpdateItem } from '@/src/lib/db/items'
import type { ItemWithType } from '@/src/lib/db/items'

const updateItemSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  url: z
    .string()
    .url('Must be a valid URL')
    .nullable()
    .optional()
    .or(z.literal('').transform(() => null)),
  language: z.string().nullable().optional(),
  tags: z.array(z.string().trim().min(1)),
})

type UpdateItemResult =
  | { success: true; data: ItemWithType }
  | { success: false; error: string }

export async function updateItem(
  itemId: string,
  payload: unknown,
): Promise<UpdateItemResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }

  const parsed = updateItemSchema.safeParse(payload)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const { title, description, content, url, language, tags } = parsed.data

  try {
    const item = await dbUpdateItem(itemId, session.user.id, {
      title,
      description: description ?? null,
      content: content ?? null,
      url: url ?? null,
      language: language ?? null,
      tags,
    })
    return { success: true, data: item }
  } catch {
    return { success: false, error: 'Failed to update item' }
  }
}
