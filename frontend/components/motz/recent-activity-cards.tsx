"use client"

import type React from "react"

import { useNewMZC, useExitMZC, useNewKeys, useExitKeys } from "@/lib/motz-hooks"
import { formatWallet } from "@/lib/motz-formatters"
import { ErrorAlert } from "./error-alert"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ActivityCardProps {
  title: string
  icon: React.ReactNode
  data: any[]
  isLoading: boolean
  error?: string
  metadata: any
  isExit?: boolean
  holdingsField: string
}

function ActivityCard({
  title,
  icon,
  data,
  isLoading,
  error,
  metadata,
  isExit = false,
  holdingsField,
}: ActivityCardProps) {
  const { toast } = useToast()
  const borderColor = isExit ? "border-red-500/20" : "border-green-500/20"
  const badgeVariant = isExit ? "destructive" : "secondary"

  return (
    <Card className={borderColor}>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          {icon}
          {title}
          <Badge variant={badgeVariant} className="ml-auto text-xs">
            {data?.length || 0}
          </Badge>
        </CardTitle>
        <CardDescription className="text-xs">{metadata?.is_fresh ? "Fresh" : "Cached"} - Last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-48" />
        ) : error ? (
          <ErrorAlert message={error} />
        ) : data && data.length > 0 ? (
          <ScrollArea className="h-48 pr-4">
            <div className="space-y-2">
              {data.slice(0, 20).map((holder, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm border-b pb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <a
                      href={`https://app.roninchain.com/address/${holder.address}?t=collectibles`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`hover:underline font-mono text-xs flex-1 ${isExit ? "text-red-500" : "text-primary"}`}
                    >
                      {formatWallet(holder.address)}
                    </a>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => {
                        navigator.clipboard.writeText(holder.address)
                        toast({ title: "Copied!" })
                      }}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <Badge variant="outline" className="text-xs ml-2">
                    {(holder[holdingsField] || 0).toFixed(0)}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">No activity</p>
        )}
      </CardContent>
    </Card>
  )
}

export function RecentActivityCards() {
  const { data: newMZC, metadata: newMZCMeta, isLoading: loadingNewMZC, error: newMZCError } = useNewMZC()
  const { data: exitMZC, metadata: exitMZCMeta, isLoading: loadingExitMZC, error: exitMZCError } = useExitMZC()
  const { data: newKeys, metadata: newKeysMeta, isLoading: loadingNewKeys, error: newKeysError } = useNewKeys()
  const { data: exitKeys, metadata: exitKeysMeta, isLoading: loadingExitKeys, error: exitKeysError } = useExitKeys()

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Recent Activity (7 Days)</h2>
        <p className="text-muted-foreground">Latest holder changes and transactions</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ActivityCard
          title="New MZC Holders"
          icon={<TrendingUp className="w-4 h-4 text-green-500" />}
          data={newMZC}
          isLoading={loadingNewMZC}
          error={newMZCError}
          metadata={newMZCMeta}
          holdingsField="MZC holdings"
        />

        <ActivityCard
          title="MZC Exits"
          icon={<TrendingDown className="w-4 h-4 text-red-500" />}
          data={exitMZC}
          isLoading={loadingExitMZC}
          error={exitMZCError}
          metadata={exitMZCMeta}
          isExit={true}
          holdingsField="MZC holdings before"
        />

        <ActivityCard
          title="New KEYS Holders"
          icon={<TrendingUp className="w-4 h-4 text-green-500" />}
          data={newKeys}
          isLoading={loadingNewKeys}
          error={newKeysError}
          metadata={newKeysMeta}
          holdingsField="MOTZ Keys holdings"
        />

        <ActivityCard
          title="KEYS Exits"
          icon={<TrendingDown className="w-4 h-4 text-red-500" />}
          data={exitKeys}
          isLoading={loadingExitKeys}
          error={exitKeysError}
          metadata={exitKeysMeta}
          isExit={true}
          holdingsField="MOTZ Keys holdings before"
        />
      </div>
    </section>
  )
}
