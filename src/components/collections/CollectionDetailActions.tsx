'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Star, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EditCollectionDialog from '@/src/components/collections/EditCollectionDialog'
import DeleteCollectionDialog from '@/src/components/collections/DeleteCollectionDialog'
import { toggleFavoriteCollection } from '@/src/actions/collections'

interface CollectionDetailActionsProps {
  collection: {
    id: string
    name: string
    description: string | null
    isFavorite: boolean
    itemCount: number,
    borderColor: string
  }
}

export default function CollectionDetailActions({ collection }: CollectionDetailActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isFavorite, setIsFavorite] = useState(collection.isFavorite)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  function handleToggleFavorite() {
    startTransition(async () => {
      const result = await toggleFavoriteCollection(collection.id)
      if (result.success) {
        setIsFavorite(result.data.isFavorite)
        toast.success(result.data.isFavorite ? 'Added to favorites' : 'Removed from favorites')
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleFavorite}
          disabled={isPending}
          className={isFavorite ? 'text-amber-400' : ''}
        >
          <Star className={`h-4 w-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          {isFavorite ? 'Favorited' : 'Favorite'}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setEditOpen(true)}>
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>

      <EditCollectionDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        collection={{ id: collection.id, name: collection.name, description: collection.description }}
      />

      <DeleteCollectionDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        collection={{ id: collection.id, name: collection.name }}
      />
    </>
  )
}