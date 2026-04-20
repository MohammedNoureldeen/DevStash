import { redirect } from 'next/navigation'
import { auth } from '@/src/auth'
import DashboardShell from '@/src/components/dashboard/DashboardShell'
import ProfileContent from '@/src/components/profile/ProfileContent'
import { getProfileData, getProfileStats } from '@/src/lib/db/profile'
import { getItemTypesWithCounts } from '@/src/lib/db/items'
import { getFavoriteCollections, getRecentCollections } from '@/src/lib/db/collections'

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in')

  const userId = session.user.id

  const [profile, stats, itemTypes, favoriteCollections, recentCollections] = await Promise.all([
    getProfileData(userId),
    getProfileStats(userId),
    getItemTypesWithCounts(),
    getFavoriteCollections(),
    getRecentCollections(3),
  ])

  if (!profile) redirect('/sign-in')

  return (
    <DashboardShell
      sidebarData={{ itemTypes, favoriteCollections, recentCollections }}
      user={session.user}
    >
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Profile</h1>
        <ProfileContent profile={profile} stats={stats} />
      </div>
    </DashboardShell>
  )
}
