'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createCollection } from '@/src/actions/collections'

interface NewCollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DEFAULT_FORM = { name: '', description: '' }

export default function NewCollectionDialog({ open, onOpenChange }: NewCollectionDialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState(DEFAULT_FORM)

  function handleOpenChange(next: boolean) {
    if (!next) setForm(DEFAULT_FORM)
    onOpenChange(next)
  }

  function handleSubmit() {
    startTransition(async () => {
      const result = await createCollection({ name: form.name, description: form.description || undefined })
      if (result.success) {
        toast.success('Collection created')
        handleOpenChange(false)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  const isValid = form.name.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Collection</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="collection-name">Name <span className="text-destructive">*</span></Label>
            <Input
              id="collection-name"
              placeholder="My collection"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              onKeyDown={(e) => { if (e.key === 'Enter' && isValid) handleSubmit() }}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="collection-description">Description</Label>
            <Textarea
              id="collection-description"
              placeholder="What's this collection for?"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="ghost" disabled={isPending} />}>
            Cancel
          </DialogClose>
          <Button onClick={handleSubmit} disabled={!isValid || isPending}>
            {isPending ? 'Creating…' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
