import DashboardShell from '@/src/components/dashboard/DashboardShell'
import MainContent from '@/src/components/dashboard/MainContent'
import { getRecentCollections } from '@/src/lib/db/collections'

export default async function DashboardPage() {
  const collections = await getRecentCollections(6)

  return (
    <DashboardShell>
      <MainContent collections={collections} />
    </DashboardShell>
  )
}
