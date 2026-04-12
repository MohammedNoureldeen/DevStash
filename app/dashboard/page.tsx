import TopBar from "@/src/components/dashboard/TopBar";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-border p-4 shrink-0">
          <h2 className="text-lg font-semibold">Sidebar</h2>
        </aside>
        <main className="flex-1 overflow-auto p-6">
          <h2 className="text-lg font-semibold">Main</h2>
        </main>
      </div>
    </div>
  );
}
