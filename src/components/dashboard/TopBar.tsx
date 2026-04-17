'use client'

import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface TopBarProps {
  onMobileMenuClick: () => void;
}

export default function TopBar({ onMobileMenuClick }: TopBarProps) {
  return (
    <header className="flex items-center gap-4 border-b border-border/60 bg-background/95 backdrop-blur-sm px-5 h-16 shrink-0 shadow-elevation-xs">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden h-9 w-9 rounded-lg hover:bg-muted"
        onClick={onMobileMenuClick}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm font-bold transition-transform duration-200 group-hover:scale-105">
          S
        </div>
        <span className="font-bold text-base tracking-tight">DevStash</span>
      </Link>

      {/* Search */}
      <div className="relative flex-1 max-w-md mx-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-10 pr-16 bg-muted/60 border-0 h-10 text-sm rounded-xl transition-all duration-200 focus:bg-background focus:ring-2 focus:ring-primary/20"
          placeholder="Search items..."
          readOnly
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-md border border-border/60 bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
          ⌘ /
        </kbd>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5 ml-auto">
        <Button 
          variant="outline" 
          size="sm" 
          className="hidden sm:flex h-9 rounded-lg font-medium border-border/60 hover:bg-muted/80"
        >
          New Collection
        </Button>
        <Button 
          size="sm" 
          className="h-9 rounded-lg font-medium gap-1.5"
        >
          <span className="text-base leading-none">+</span>
          <span className="hidden sm:inline">New Item</span>
        </Button>
      </div>
    </header>
  );
}
