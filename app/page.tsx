import Link from 'next/link'
import { 
  ArrowRight, 
  Sparkles, 
  FolderOpen, 
  Search, 
  Zap,
  Code,
  StickyNote,
  Terminal,
  Link as LinkIcon,
  FileText,
  Image as ImageIcon,
  Shield,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const FEATURES = [
  {
    icon: FolderOpen,
    title: 'Smart Collections',
    description: 'Organize your dev resources into color-coded collections for quick access.',
    color: '#8b5cf6',
  },
  {
    icon: Search,
    title: 'Lightning Search',
    description: 'Find any snippet, command, or link instantly with powerful search.',
    color: '#3b82f6',
  },
  {
    icon: Zap,
    title: 'Quick Access',
    description: 'Pin important items and access them from anywhere with a click.',
    color: '#f59e0b',
  },
  {
    icon: Shield,
    title: 'Secure Storage',
    description: 'Your data stays private and secure with local-first architecture.',
    color: '#10b981',
  },
]

const ITEM_TYPES = [
  { icon: Code, label: 'Snippets', color: '#3b82f6' },
  { icon: Sparkles, label: 'Prompts', color: '#8b5cf6' },
  { icon: StickyNote, label: 'Notes', color: '#f59e0b' },
  { icon: Terminal, label: 'Commands', color: '#ef4444' },
  { icon: LinkIcon, label: 'Links', color: '#06b6d4' },
  { icon: FileText, label: 'Files', color: '#6b7280' },
  { icon: ImageIcon, label: 'Images', color: '#ec4899' },
]

function FeatureCard({ feature }: { feature: typeof FEATURES[0] }) {
  const Icon = feature.icon
  return (
    <div className="group relative rounded-2xl border border-border/60 bg-gradient-card p-6 card-lift">
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ 
          background: `linear-gradient(135deg, ${feature.color}08 0%, transparent 60%)` 
        }}
      />
      <div className="relative">
        <div 
          className="flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${feature.color}15` }}
        >
          <Icon className="h-6 w-6" style={{ color: feature.color }} />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
      </div>
    </div>
  )
}

function ItemTypeBadge({ type }: { type: typeof ITEM_TYPES[0] }) {
  const Icon = type.icon
  return (
    <div 
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200 hover:scale-105 cursor-default"
      style={{ 
        backgroundColor: `${type.color}10`,
        borderColor: `${type.color}25`,
      }}
    >
      <Icon className="h-3.5 w-3.5" style={{ color: type.color }} />
      <span className="text-xs font-semibold" style={{ color: type.color }}>{type.label}</span>
    </div>
  )
}

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-sm">
              S
            </div>
            <span className="font-bold text-lg tracking-tight">DevStash</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="gap-1.5">
                Get Started
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border/60 mb-8">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-muted-foreground">
              The ultimate developer resource manager
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6">
            Organize your
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              dev workflow
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Store, organize, and instantly access your code snippets, commands, prompts, 
            and links. Everything you need, exactly when you need it.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 text-base px-8 h-12">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-base px-8 h-12">
              Learn More
            </Button>
          </div>

          {/* Item types showcase */}
          <div className="mt-16">
            <p className="text-sm font-medium text-muted-foreground mb-4">
              Store all your developer resources
            </p>
            <div className="flex items-center justify-center flex-wrap gap-3">
              {ITEM_TYPES.map((type) => (
                <ItemTypeBadge key={type.label} type={type} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 border-t border-border/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Everything you need
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Built for developers who value efficiency and organization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 border-t border-border/40 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-extrabold text-foreground mb-1">10K+</p>
              <p className="text-sm font-medium text-muted-foreground">Resources Stored</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-foreground mb-1">500+</p>
              <p className="text-sm font-medium text-muted-foreground">Active Users</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-foreground mb-1">99.9%</p>
              <p className="text-sm font-medium text-muted-foreground">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl p-12 text-center overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-border/60 rounded-3xl" />
            
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Ready to organize your workflow?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
                Join thousands of developers who trust DevStash to keep their resources organized.
              </p>
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 text-base px-8 h-12">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-xs">
              S
            </div>
            <span className="font-bold text-sm tracking-tight">DevStash</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built for developers, by developers.
          </p>
        </div>
      </footer>
    </main>
  )
}
