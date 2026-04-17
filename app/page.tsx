import Link from 'next/link'
import { ArrowRight, Sparkles, FolderOpen, Search, Zap, Shield, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const FEATURES = [
  {
    icon: FolderOpen,
    title: 'Smart Collections',
    description: 'Organize your resources into color-coded collections with powerful filtering.',
  },
  {
    icon: Search,
    title: 'Instant Search',
    description: 'Find any snippet, command, or link in milliseconds with fuzzy search.',
  },
  {
    icon: Zap,
    title: 'Quick Access',
    description: 'Pin important items and access them instantly from anywhere.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data stays secure with local-first architecture and encryption.',
  },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <span className="font-bold text-lg tracking-tight">DevStash</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard">
              <Button className="btn-professional gap-2 bg-gradient-to-r from-primary to-indigo-600 border-0">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">The modern developer workspace</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-foreground">Organize your</span>
            <br />
            <span className="gradient-text">dev workflow</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Store, organize, and instantly access your code snippets, commands, prompts, 
            and links. Everything you need, exactly when you need it.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="btn-professional gap-2 text-base px-8 bg-gradient-to-r from-primary to-indigo-600 border-0 h-12">
                Get Started Free
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-base px-8 h-12 border-border hover:bg-secondary">
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 pt-16 border-t border-border">
            <div className="grid grid-cols-3 gap-8">
              <div>
                <p className="text-4xl font-bold gradient-text">10K+</p>
                <p className="text-sm text-muted-foreground mt-1">Resources Stored</p>
              </div>
              <div>
                <p className="text-4xl font-bold gradient-text">500+</p>
                <p className="text-sm text-muted-foreground mt-1">Active Developers</p>
              </div>
              <div>
                <p className="text-4xl font-bold gradient-text">99.9%</p>
                <p className="text-sm text-muted-foreground mt-1">Uptime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 border-t border-border bg-card/30">
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
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="glass-card hover-lift rounded-xl p-6 group">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl p-12 text-center relative overflow-hidden">
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-indigo-600/10 pointer-events-none" />
            
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Ready to streamline your workflow?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
                Join hundreds of developers who trust DevStash to keep their resources organized.
              </p>
              <Link href="/dashboard">
                <Button size="lg" className="btn-professional gap-2 text-base px-8 bg-gradient-to-r from-primary to-indigo-600 border-0 h-12">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
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
