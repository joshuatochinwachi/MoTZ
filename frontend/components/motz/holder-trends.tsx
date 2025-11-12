"use client"

import { useState, useMemo } from "react"
import { useDailyHolders } from "@/lib/motz-hooks"
import { formatNumber, formatDate } from "@/lib/motz-formatters"
import { ErrorAlert } from "./error-alert"
import { EmptyState } from "./empty-state"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { format, subDays, parseISO } from "date-fns"

export function HolderTrends() {
  const { data, metadata, isLoading, error } = useDailyHolders()
  const [timeRange, setTimeRange] = useState("ALL")
  const [selectedAsset, setSelectedAsset] = useState("all")
  const [chartType, setChartType] = useState<"line" | "area">("area")

  // Get filtered data based on time range and asset
  const getFilteredData = () => {
    if (!data || data.length === 0) return []
    
    const now = new Date()
    let filteredData = [...data]

    if (timeRange === "7D") {
      const sevenDaysAgo = subDays(now, 7)
      filteredData = data.filter((item) => parseISO(item.day) >= sevenDaysAgo)
    } else if (timeRange === "30D") {
      const thirtyDaysAgo = subDays(now, 30)
      filteredData = data.filter((item) => parseISO(item.day) >= thirtyDaysAgo)
    } else if (timeRange === "90D") {
      const ninetyDaysAgo = subDays(now, 90)
      filteredData = data.filter((item) => parseISO(item.day) >= ninetyDaysAgo)
    }

    if (selectedAsset !== "all") {
      filteredData = filteredData.filter((item) => item.asset === selectedAsset)
    }

    return filteredData.sort((a, b) => parseISO(a.day).getTime() - parseISO(b.day).getTime())
  }

  const filteredData = useMemo(() => getFilteredData(), [data, timeRange, selectedAsset])
  const uniqueAssets = useMemo(() => data ? [...new Set(data.map((item) => item.asset))] : [], [data])

  // Transform data for chart
  const chartData = useMemo(() => {
    if (selectedAsset === "all") {
      // Group by date and aggregate all assets
      const dateMap = new Map<string, any>()
      
      filteredData.forEach((item) => {
        const dateKey = item.day
        if (!dateMap.has(dateKey)) {
          dateMap.set(dateKey, {
            date: format(parseISO(item.day), "MMM dd, yyyy"),
            dateShort: format(parseISO(item.day), "MMM dd"),
            rawDate: item.day,
          })
        }
        const entry = dateMap.get(dateKey)
        entry[item.asset] = item.holders
      })

      return Array.from(dateMap.values())
    } else {
      // Single asset view
      return filteredData.map((item) => ({
        date: format(parseISO(item.day), "MMM dd, yyyy"),
        dateShort: format(parseISO(item.day), "MMM dd"),
        rawDate: item.day,
        holders: item.holders,
        asset: item.asset,
      }))
    }
  }, [filteredData, selectedAsset])

  // Calculate statistics
  const stats = useMemo(() => {
    if (chartData.length === 0) return null

    const latest = chartData[chartData.length - 1]
    const earliest = chartData[0]

    if (selectedAsset === "all") {
      const totalLatest = uniqueAssets.reduce((sum, asset) => sum + (latest[asset] || 0), 0)
      const totalEarliest = uniqueAssets.reduce((sum, asset) => sum + (earliest[asset] || 0), 0)
      const change = totalLatest - totalEarliest
      const changePercent = totalEarliest > 0 ? ((change / totalEarliest) * 100).toFixed(2) : "0"

      return {
        current: totalLatest,
        change,
        changePercent,
      }
    } else {
      const current = latest.holders || 0
      const initial = earliest.holders || 0
      const change = current - initial
      const changePercent = initial > 0 ? ((change / initial) * 100).toFixed(2) : "0"

      return {
        current,
        change,
        changePercent,
      }
    }
  }, [chartData, selectedAsset, uniqueAssets])

  // NOW we can do conditional returns AFTER all hooks
  if (isLoading) return <Skeleton className="h-96 w-full" />
  if (error) return <ErrorAlert message={error} />
  if (!data || data.length === 0) return <EmptyState />

  // Colors for different assets
  const assetColors: Record<string, string> = {
    "Mark of The Zeal Founders Coin": "#8b5cf6",
    "MoTZ Keys": "#3b82f6",
    "MOTZ Gotcha Machine": "#10b981",
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-semibold">{formatNumber(entry.value)}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Holder Trends</CardTitle>
            <CardDescription>This track holders growth over time for Mark of The Zeal Founders Coin (MZC) and MoTZ Keys (KEYS)</CardDescription>
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {formatDate(metadata?.last_updated)}
            </p>
          </div>
          {metadata && (
            <Badge variant={metadata.is_fresh ? "secondary" : "outline"}>
              {metadata.is_fresh ? "Fresh" : "Cached"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2">
            {["7D", "30D", "90D", "ALL"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <Select value={chartType} onValueChange={(value: "line" | "area") => setChartType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="area">Area</SelectItem>
                <SelectItem value="line">Line</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assets</SelectItem>
                {uniqueAssets.map((asset) => (
                  <SelectItem key={asset} value={asset}>
                    {asset}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">Current Holders</p>
                <p className="text-3xl font-bold">{formatNumber(stats.current)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">Change</p>
                <p className={`text-3xl font-bold ${stats.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {stats.change >= 0 ? "+" : ""}
                  {formatNumber(stats.change)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">Growth Rate</p>
                <p className={`text-3xl font-bold ${parseFloat(stats.changePercent) >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {parseFloat(stats.changePercent) >= 0 ? "+" : ""}
                  {stats.changePercent}%
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Chart */}
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart data={chartData}>
                <defs>
                  {selectedAsset === "all" ? (
                    uniqueAssets.map((asset) => (
                      <linearGradient key={asset} id={`color${asset.replace(/\s+/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={assetColors[asset]} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={assetColors[asset]} stopOpacity={0.1} />
                      </linearGradient>
                    ))
                  ) : (
                    <linearGradient id="colorHolders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                    </linearGradient>
                  )}
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey={timeRange === "7D" || timeRange === "30D" ? "dateShort" : "date"}
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {selectedAsset === "all" ? (
                  uniqueAssets.map((asset) => (
                    <Area
                      key={asset}
                      type="monotone"
                      dataKey={asset}
                      name={asset}
                      stroke={assetColors[asset]}
                      fillOpacity={1}
                      fill={`url(#color${asset.replace(/\s+/g, "")})`}
                      strokeWidth={2}
                    />
                  ))
                ) : (
                  <Area
                    type="monotone"
                    dataKey="holders"
                    name={selectedAsset}
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorHolders)"
                    strokeWidth={2}
                  />
                )}
              </AreaChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey={timeRange === "7D" || timeRange === "30D" ? "dateShort" : "date"}
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {selectedAsset === "all" ? (
                  uniqueAssets.map((asset) => (
                    <Line
                      key={asset}
                      type="monotone"
                      dataKey={asset}
                      name={asset}
                      stroke={assetColors[asset]}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))
                ) : (
                  <Line
                    type="monotone"
                    dataKey="holders"
                    name={selectedAsset}
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
