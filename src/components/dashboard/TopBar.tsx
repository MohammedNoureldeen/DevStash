import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TopBar() {
  return (
    <header className="flex items-center gap-4 border-b border-border px-4 h-14 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 w-56 shrink-0">
        <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary text-primary-foreground text-sm font-bold">
          S
        </div>
        <span className="font-semibold text-sm">DevStash</span>
      </div>

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9 pr-16 bg-muted border-0 h-9 text-sm"
          placeholder="Search items..."
          readOnly
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded border border-border bg-background px-1.5 text-xs text-muted-foreground">
          ⌘ /
        </kbd>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-auto">
        <Button variant="outline" size="sm">
          New Collection
        </Button>
        <Button size="sm">
          + New Item
        </Button>
      </div>
    </header>
  );
}
