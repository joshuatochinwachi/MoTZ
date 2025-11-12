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
    <Card className="border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
          MoTZ Sectors (Overview)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current-stats" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-purple-950/30">
            <TabsTrigger 
              value="current-stats"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Assets
            </TabsTrigger>
            <TabsTrigger 
              value="gotcha-machine"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
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
                    className="transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/30 hover:-translate-y-1 border-purple-500/10 bg-gradient-to-br from-purple-950/5 to-transparent"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                        {asset["asset name"]}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Last updated: {formatDate(statsMetadata?.last_updated)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="group">
                        <p className="text-sm text-muted-foreground mb-1 group-hover:text-purple-400 transition-colors">
                          Total Supply
                        </p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                          {formatNumber(asset["Total and circulating NFT supply"])}
                        </p>
                      </div>
                      <div className="group">
                        <p className="text-sm text-muted-foreground mb-1 group-hover:text-purple-400 transition-colors">
                          NFTs Transferred
                        </p>
                        <p className="text-xl font-semibold">
                          {formatNumber(asset["Total number of NFTs transferred"])}
                        </p>
                      </div>
                      <div className="group">
                        <p className="text-sm text-muted-foreground mb-1 group-hover:text-purple-400 transition-colors">
                          Unique Users (Senders & Recipients)
                        </p>
                        <p className="text-xl font-semibold">
                          {formatNumber(
                            asset["Total number of unique users making and receiving these asset transfers"],
                          )}
                        </p>
                      </div>
                      <div className="group">
                        <p className="text-sm text-muted-foreground mb-1 group-hover:text-purple-400 transition-colors">
                          Transfer Transactions
                        </p>
                        <p className="text-xl font-semibold">
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
                <div className="text-center mb-6 p-6 rounded-lg bg-gradient-to-br from-purple-950/20 to-transparent border border-purple-500/20">
                  <p className="text-sm text-muted-foreground mb-2">Total Interactions</p>
                  <p className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                    {formatNumber(gotchaData[0]["Total gotcha machine transactions/interactions"])}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/30 hover:-translate-y-1 border-purple-500/10 bg-gradient-to-br from-purple-950/5 to-transparent">
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        Unique Users
                      </p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                        {formatNumber(gotchaData[0]["Total active gotcha machine unique users"])}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/30 hover:-translate-y-1 border-purple-500/10 bg-gradient-to-br from-purple-950/5 to-transparent">
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        Avg per User
                      </p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
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
                    <Badge variant={gotchaMetadata.is_fresh ? "secondary" : "outline"} className="border-purple-500/30">
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
