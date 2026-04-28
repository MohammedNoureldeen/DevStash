'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import UserAvatar from '@/src/components/ui/UserAvatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { ProfileData, ProfileStats } from '@/src/lib/db/profile'

interface ProfileContentProps {
  profile: ProfileData
  stats: ProfileStats
}

export default function ProfileContent({ profile, stats }: ProfileContentProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <UserInfoSection profile={profile} />
      <StatsSection stats={stats} />
      <ActionsSection profile={profile} />
    </div>
  )
}

function UserInfoSection({ profile }: { profile: ProfileData }) {
  const joinedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(profile.createdAt))

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-sm font-medium text-muted-foreground mb-4">Account</h2>
      <div className="flex items-center gap-4">
        <UserAvatar name={profile.name} image={profile.image} size={64} />
        <div>
          <p className="text-lg font-semibold text-foreground">{profile.name ?? 'No name set'}</p>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
          <p className="text-xs text-muted-foreground mt-1">Member since {joinedDate}</p>
        </div>
      </div>
    </section>
  )
}

function StatsSection({ stats }: { stats: ProfileStats }) {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-sm font-medium text-muted-foreground mb-4">Usage</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard label="Total Items" value={stats.totalItems} />
        <StatCard label="Collections" value={stats.totalCollections} />
      </div>
      <div className="space-y-2">
        {stats.itemTypeBreakdown.map(type => (
          <div key={type.name} className="flex items-center justify-between text-sm">
            <span className="capitalize text-muted-foreground">{type.name}s</span>
            <span className="font-medium text-foreground tabular-nums">{type.count}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-muted/40 p-4">
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  )
}

function ActionsSection({ profile }: { profile: ProfileData }) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 space-y-4">
      <h2 className="text-sm font-medium text-muted-foreground">Account Actions</h2>
      {!profile.isOAuthUser && <ChangePasswordDialog />}
      <DeleteAccountDialog />
    </section>
  )
}

function ChangePasswordDialog() {
  const [open, setOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/profile/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json() as { error?: string }
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong')
      } else {
        setSuccess(true)
        setTimeout(() => {
          setOpen(false)
          setSuccess(false)
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
        }, 1500)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="outline" className="w-full justify-start" />}
      >
        Change Password
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>Enter your current password and choose a new one.</DialogDescription>
        </DialogHeader>
        {success ? (
          <p className="text-sm text-green-500 py-4 text-center">Password updated successfully.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 py-2">
            <Input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="New password (min. 8 characters)"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving…' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

function DeleteAccountDialog() {
  const [open, setOpen] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function handleOpenChange(value: boolean) {
    setOpen(value)
    if (!value) {
      setConfirmation('')
      setError(null)
    }
  }

  async function handleDelete() {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/profile/delete-account', { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json() as { error?: string }
        setError(data.error ?? 'Something went wrong')
        return
      }
      await signOut({ redirect: false })
      router.push('/sign-in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="w-full justify-start text-red-500 hover:text-red-500 hover:border-red-500"
          />
        }
      >
        Delete Account
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            This will permanently delete your account and all your data. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-1">
          <p className="text-sm text-muted-foreground">
            Type <span className="font-semibold text-foreground">delete</span> to confirm.
          </p>
          <Input
            placeholder="delete"
            value={confirmation}
            onChange={e => setConfirmation(e.target.value)}
            autoComplete="off"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <DialogFooter>
          <Button variant="ghost" onClick={() => handleOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading || confirmation !== 'delete'}
          >
            {loading ? 'Deleting…' : 'Delete my account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
