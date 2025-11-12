"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { HeroStats } from "@/components/motz/hero-stats"
import { AssetOverview } from "@/components/motz/asset-overview"
import { MarketActivity } from "@/components/motz/market-activity"
import { HolderTrends } from "@/components/motz/holder-trends"
import { RetentionHeatmap } from "@/components/motz/retention-heatmap"
import { HolderDirectory } from "@/components/motz/holder-directory"
import { RecentActivityCards } from "@/components/motz/recent-activity-cards"
import { ActivityScroller } from "@/components/motz/activity-scroller"

export default function Dashboard() {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (isDark) {
      document.documentElement.classList.remove("dark")
    } else {
      document.documentElement.classList.add("dark")
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Skeleton className="h-screen w-full" />
      </div>
    )
  }

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="bg-animated" />

      <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95">
        <header className="sticky top-0 z-40 border-b border-primary/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-1">
                Mark of The Zeal Analytics Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">Real-time ecosystem insights and analytics</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="ml-auto bg-primary/10 hover:bg-primary/20 border-primary/30 hover:border-primary/50 transition-all duration-300 hover:scale-110"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 space-y-8 pb-32 relative z-10">
          <Card className="interactive-card bg-gradient-to-br from-card/80 to-card/40 border-primary/20 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
            <div className="p-6 prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
              <h3 className="mt-0 mb-2 font-semibold text-foreground text-base">About MoTZ Ecosystem Tracker</h3>
              <p className="mb-3">
                This dashboard provides real-time analytics and visualization for the{" "}
                <strong>Mark of The Zeal (MoTZ)</strong> ecosystem on the Ronin Blockchain.
              </p>
              <h4 className="mt-3 mb-2 font-semibold text-foreground text-sm">Tracked Contracts</h4>
              <ul className="mb-3 space-y-1 list-disc list-inside text-sm">
                <li>
                  <a
                    href="https://app.roninchain.com/token/0x712b0029a1763ef2aac240a39091bada6bdae4f8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-accent hover:underline transition-colors"
                  >
                    Mark of The Zeal Founders Coin (MZC)
                  </a>
                </li>
                <li>
                  <a
                    href="https://app.roninchain.com/token/0x45ed5ee2f9e175f59fbb28f61678afe78c3d70f8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-accent hover:underline transition-colors"
                  >
                    MoTZ Keys
                  </a>
                </li>
                <li>
                  <a
                    href="https://app.roninchain.com/address/0x7440d110db849ca61376e0a805fd7629bce28d16"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-accent hover:underline transition-colors"
                  >
                    MoTZ Gotcha Machine
                  </a>
                </li>
              </ul>
              <h4 className="mt-3 mb-2 font-semibold text-foreground text-sm">Data Refresh</h4>
              <p className="mb-3">
                Metrics automatically refresh every <strong>24 hours</strong> to provide up-to-date ecosystem insights.
              </p>
              <h4 className="mt-3 mb-2 font-semibold text-foreground text-sm">Time Zone</h4>
              <p className="m-0">
                All timestamps displayed throughout the dashboard are in{" "}
                <strong>UTC (Coordinated Universal Time)</strong>.
              </p>
            </div>
          </Card>

          <section className="fade-in-up" style={{ animationDelay: "0.1s" }}>
            <HeroStats />
          </section>

          <section className="fade-in-up" style={{ animationDelay: "0.2s" }}>
            <AssetOverview />
          </section>

          <section className="fade-in-up" style={{ animationDelay: "0.3s" }}>
            <MarketActivity />
          </section>

          <section className="fade-in-up" style={{ animationDelay: "0.4s" }}>
            <HolderTrends />
          </section>

          <section className="fade-in-up" style={{ animationDelay: "0.5s" }}>
            <RetentionHeatmap />
          </section>

          <section className="fade-in-up" style={{ animationDelay: "0.6s" }}>
            <HolderDirectory />
          </section>

          <section className="fade-in-up" style={{ animationDelay: "0.7s" }}>
            <RecentActivityCards />
          </section>
        </main>

        {/* Activity Scroller */}
        <ActivityScroller />
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
