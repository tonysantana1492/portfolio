import { Globe, Sparkles, Zap } from "lucide-react";

import { MakeProfileForm } from "@/features/profile/make-profile.fom";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="mx-auto min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="sticky top-0 z-50 border-border/40 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">Let's 0</span>
          </div>
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid items-center gap-12 p-4 lg:grid-cols-2">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary text-sm">
              <Zap className="h-4 w-4" />
              <span>Start from 0 shine like one</span>
            </div>

            <h1 className="text-balance font-bold text-5xl leading-tight lg:text-6xl">
              Your professional profile with{" "}
              <span className="text-primary">your own subdomain</span>
            </h1>

            <p className="text-pretty text-muted-foreground text-xl leading-relaxed">
              Transform your LinkedIn profile into a professional web portfolio.
              Get your own subdomain and stand out in the digital world.
            </p>

            {/* Features */}
            <div className="grid gap-4 pt-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Custom Subdomain</h3>
                  <p className="text-muted-foreground text-sm">
                    yourname.profilegen.app
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Automatic Generation</h3>
                  <p className="text-muted-foreground text-sm">
                    From your LinkedIn
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="p-4 lg:pl-8">
            <MakeProfileForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 border-border/40 border-t">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground text-sm">
            © 2025 ProfileGen. Transform your LinkedIn into a professional
            portfolio.
          </p>
        </div>
      </footer>
    </div>
  );
}
