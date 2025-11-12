"use client"

import { useOverview } from "@/lib/motz-hooks"
import { formatUSD, formatNumber } from "@/lib/motz-formatters"
import { MetricCard } from "./metric-card"
import { ErrorAlert } from "./error-alert"
import { EmptyState } from "./empty-state"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, Users, TrendingUp, ShoppingCart } from "lucide-react"

export function HeroStats() {
  const { data, metadata, isLoading, error } = useOverview()

  if (isLoading) return <Skeleton className="h-80 w-full rounded-lg" />
  if (error) return <ErrorAlert message={`Error loading hero stats: ${error}`} />
  if (!data || data.length === 0) return <EmptyState />

  const totalVolumeUSD = data.reduce((sum, item) => sum + (item["Primary + Secondary sales volume (USD)"] || 0), 0)
  const totalHolders = data.reduce((sum, item) => sum + (item.holders || 0), 0)
  const avgFloorPriceUSD = data.reduce((sum, item) => sum + (item["floor price (USD)"] || 0), 0) / data.length
  const totalSales = data.reduce((sum, item) => sum + (item.sales || 0), 0)

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Volume (USD)"
          value={formatUSD(totalVolumeUSD)}
          icon={DollarSign}
          metadata={metadata}
        />
        <MetricCard title="Total Holders" value={formatNumber(totalHolders)} icon={Users} metadata={metadata} />
        <MetricCard
          title="Avg Floor Price (USD)"
          value={formatUSD(avgFloorPriceUSD)}
          icon={TrendingUp}
          metadata={metadata}
        />
        <MetricCard title="Total Sales" value={formatNumber(totalSales)} icon={ShoppingCart} metadata={metadata} />
      </div>

      <Card className="interactive-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Asset Comparison
            </CardTitle>
            {metadata && (
              <Badge variant={metadata.is_fresh ? "secondary" : "outline"} className="badge-interactive">
                {metadata.is_fresh ? "🟢 Fresh" : "🔄 Cached"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-primary/5 border-b border-primary/10">
                <TableHead className="text-primary font-bold">Asset</TableHead>
                <TableHead className="text-primary font-bold">Sales Volume (USD)</TableHead>
                <TableHead className="text-primary font-bold">Holders</TableHead>
                <TableHead className="text-primary font-bold">Floor Price (USD)</TableHead>
                <TableHead className="text-primary font-bold">Sales</TableHead>
                <TableHead className="text-primary font-bold">Creator Royalties</TableHead>
                <TableHead className="text-primary font-bold">Platform Fees</TableHead>
                <TableHead className="text-primary font-bold">Ronin Fees</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((asset, idx) => (
                <TableRow key={idx} className="interactive-row border-b border-border hover:border-primary/30">
                  <TableCell className="font-semibold text-primary">{asset.asset}</TableCell>
                  <TableCell className="text-foreground">
                    {formatUSD(asset["Primary + Secondary sales volume (USD)"])}
                  </TableCell>
                  <TableCell className="text-foreground">{formatNumber(asset.holders)}</TableCell>
                  <TableCell className="text-foreground">{formatUSD(asset["floor price (USD)"])}</TableCell>
                  <TableCell className="text-foreground">{formatNumber(asset.sales)}</TableCell>
                  <TableCell className="text-foreground">{formatUSD(asset["creator royalty fees (USD)"])}</TableCell>
                  <TableCell className="text-foreground">{formatUSD(asset["generated platform fees (USD)"])}</TableCell>
                  <TableCell className="text-foreground">{formatUSD(asset["generated ronin fees (USD)"])}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  )
}
