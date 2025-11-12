"use client"

import { useCurrentStats, useGotchaMachine } from "@/lib/motz-hooks"
import { formatNumber, formatDate } from "@/lib/motz-formatters"
import { ErrorAlert } from "./error-alert"
import { EmptyState } from "./empty-state"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AssetOverview() {
  const { data: statsData, metadata: statsMetadata, isLoading: statsLoading, error: statsError } = useCurrentStats()
  const {
    data: gotchaData,
    metadata: gotchaMetadata,
    isLoading: gotchaLoading,
    error: gotchaError,
  } = useGotchaMachine()

  return (
    <Card className="interactive-card border-primary/20 bg-gradient-to-br from-card/80 to-card/40">
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          MoTZ Sectors (Overview)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current-stats" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-primary/10 p-1 rounded-lg mb-6">
            <TabsTrigger
              value="current-stats"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              Assets
            </TabsTrigger>
            <TabsTrigger
              value="gotcha-machine"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              Gotcha Machine
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Current Stats */}
          <TabsContent value="current-stats" className="mt-6">
            {statsLoading ? (
              <Skeleton className="h-80" />
            ) : statsError ? (
              <ErrorAlert message={statsError} />
            ) : statsData && statsData.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {statsData.map((asset, idx) => (
                  <Card
                    key={idx}
                    className="metric-card group transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-1 border-primary/10 bg-gradient-to-br from-primary/5 to-transparent"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse group-hover:animate-glow-pulse" />
                        {asset["asset name"]}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Last updated: {formatDate(statsMetadata?.last_updated)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="group/item">
                        <p className="text-sm text-muted-foreground mb-1 group-hover/item:text-primary transition-colors">
                          Total Supply
                        </p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent group-hover/item:from-primary group-hover/item:to-accent">
                          {formatNumber(asset["Total and circulating NFT supply"])}
                        </p>
                      </div>
                      <div className="group/item">
                        <p className="text-sm text-muted-foreground mb-1 group-hover/item:text-primary transition-colors">
                          NFTs Transferred
                        </p>
                        <p className="text-xl font-semibold group-hover/item:text-primary transition-colors">
                          {formatNumber(asset["Total number of NFTs transferred"])}
                        </p>
                      </div>
                      <div className="group/item">
                        <p className="text-sm text-muted-foreground mb-1 group-hover/item:text-primary transition-colors">
                          Unique Users (Senders & Recipients)
                        </p>
                        <p className="text-xl font-semibold group-hover/item:text-primary transition-colors">
                          {formatNumber(
                            asset["Total number of unique users making and receiving these asset transfers"],
                          )}
                        </p>
                      </div>
                      <div className="group/item">
                        <p className="text-sm text-muted-foreground mb-1 group-hover/item:text-primary transition-colors">
                          Transfer Transactions
                        </p>
                        <p className="text-xl font-semibold group-hover/item:text-primary transition-colors">
                          {formatNumber(asset["Total unique NFT transfer transactions"])}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </TabsContent>

          {/* Tab 2: Gotcha Machine */}
          <TabsContent value="gotcha-machine" className="mt-6">
            {gotchaLoading ? (
              <Skeleton className="h-80" />
            ) : gotchaError ? (
              <ErrorAlert message={gotchaError} />
            ) : gotchaData && gotchaData.length > 0 ? (
              <div>
                <div className="text-center mb-6 p-6 rounded-lg bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                  <p className="text-sm text-muted-foreground mb-2">Total Interactions</p>
                  <p className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {formatNumber(gotchaData[0]["Total gotcha machine transactions/interactions"])}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="metric-card group transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-1 border-primary/10 bg-gradient-to-br from-primary/5 to-transparent">
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2 group-hover:text-primary transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Unique Users
                      </p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent group-hover:from-primary group-hover:to-accent">
                        {formatNumber(gotchaData[0]["Total active gotcha machine unique users"])}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="metric-card group transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-1 border-primary/10 bg-gradient-to-br from-primary/5 to-transparent">
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2 group-hover:text-primary transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Avg per User
                      </p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent group-hover:from-primary group-hover:to-accent">
                        {(
                          gotchaData[0]["Total gotcha machine transactions/interactions"] /
                          gotchaData[0]["Total active gotcha machine unique users"]
                        ).toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                {gotchaMetadata && (
                  <div className="mt-4">
                    <Badge
                      variant={gotchaMetadata.is_fresh ? "secondary" : "outline"}
                      className="badge-interactive border-primary/30"
                    >
                      Updated: {formatDate(gotchaMetadata.last_updated)}
                    </Badge>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
