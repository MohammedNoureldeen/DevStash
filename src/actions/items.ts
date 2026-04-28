'use server'

import { z } from 'zod'
import { auth } from '@/src/auth'
import {
  updateItem as dbUpdateItem,
  createItem as dbCreateItem,
  getItemTypeByName,
} from '@/src/lib/db/items'
import type { ItemWithType } from '@/src/lib/db/items'
import type { ContentType } from '@/generated/prisma/client'

const ALLOWED_TYPES = ['snippet', 'prompt', 'command', 'note', 'link', 'file', 'image'] as const
type AllowedType = (typeof ALLOWED_TYPES)[number]

const CONTENT_TYPE_MAP: Record<AllowedType, ContentType> = {
  snippet: 'TEXT',
  prompt: 'TEXT',
  command: 'TEXT',
  note: 'TEXT',
  link: 'URL',
  file: 'FILE',
  image: 'FILE',
}

const createItemSchema = z
  .object({
    type: z.enum(ALLOWED_TYPES),
    title: z.string().trim().min(1, 'Title is required'),
    description: z.string().optional(),
    content: z.string().optional(),
    language: z.string().optional(),
    url: z.string().optional(),
    fileKey: z.string().optional(),
    fileName: z.string().optional(),
    fileSize: z.number().optional(),
    tags: z.array(z.string().trim().min(1)).optional().default([]),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'link') {
      if (!data.url?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'URL is required', path: ['url'] })
      } else {
        const result = z.string().url('Must be a valid URL').safeParse(data.url.trim())
        if (!result.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Must be a valid URL',
            path: ['url'],
          })
        }
      }
    }
    if (data.type === 'file' || data.type === 'image') {
      if (!data.fileKey?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'File is required',
          path: ['fileKey'],
        })
      }
    }
  })

type CreateItemResult =
  | { success: true; data: ItemWithType }
  | { success: false; error: string }

export async function createItem(payload: unknown): Promise<CreateItemResult> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

  const parsed = createItemSchema.safeParse(payload)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  const { type, title, description, content, language, url, fileKey, fileName, fileSize, tags } =
    parsed.data

  const itemType = await getItemTypeByName(type)
  if (!itemType) return { success: false, error: 'Invalid item type' }

  try {
    const item = await dbCreateItem(session.user.id, {
      title,
      description: description?.trim() || null,
      contentType: CONTENT_TYPE_MAP[type],
      content: content?.trim() || null,
      url: url?.trim() || null,
      fileUrl: fileKey ?? null,
      fileName: fileName ?? null,
      fileSize: fileSize ?? null,
      language: language?.trim() || null,
      itemTypeId: itemType.id,
      tags: tags ?? [],
    })
    return { success: true, data: item }
  } catch {
    return { success: false, error: 'Failed to create item' }
  }
}

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
