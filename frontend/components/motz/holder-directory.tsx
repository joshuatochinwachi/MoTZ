"use client"

import { useState } from "react"
import { useMZCHolders, useKeysHolders } from "@/lib/motz-hooks"
import { formatNumber, formatWallet, formatDate } from "@/lib/motz-formatters"
import { ErrorAlert } from "./error-alert"
import { EmptyState } from "./empty-state"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Copy, ChevronDown, ChevronUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function HolderDirectory() {
  const { data: mzcHolders, metadata: mzcMeta, isLoading: mzcLoading, error: mzcError } = useMZCHolders()
  const { data: keysHolders, metadata: keysMeta, isLoading: keysLoading, error: keysError } = useKeysHolders()

  const [mzcSearch, setMzcSearch] = useState("")
  const [keysSearch, setKeysSearch] = useState("")
  const [mzcPage, setMzcPage] = useState(0)
  const [keysPage, setKeysPage] = useState(0)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const { toast } = useToast()
  const pageSize = 50

  const filteredMzcHolders =
    mzcHolders?.filter((holder) => holder.address.toLowerCase().includes(mzcSearch.toLowerCase())) || []

  const filteredKeysHolders =
    keysHolders?.filter((holder) => holder.address.toLowerCase().includes(keysSearch.toLowerCase())) || []

  const paginatedMzc = filteredMzcHolders.slice(mzcPage * pageSize, (mzcPage + 1) * pageSize)
  const paginatedKeys = filteredKeysHolders.slice(keysPage * pageSize, (keysPage + 1) * pageSize)

  const HolderTable = ({
    holders,
    paginatedHolders,
    page,
    setPage,
    search,
    setSearch,
    metadata,
    isLoading,
    error,
    fieldKey,
    assetName,
    percentField,
  }: {
    holders: any[]
    paginatedHolders: any[]
    page: number
    setPage: (page: number | ((prev: number) => number)) => void
    search: string
    setSearch: (search: string) => void
    metadata: any
    isLoading: boolean
    error?: string
    fieldKey: string
    assetName: string
    percentField: string
  }) => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search by address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm"
        />
        {metadata && (
          <Badge variant={metadata.is_fresh ? "secondary" : "outline"}>
            Updated {formatDate(metadata.last_updated)}
          </Badge>
        )}
      </div>

      {isLoading ? (
        <Skeleton className="h-96" />
      ) : error ? (
        <ErrorAlert message={error} />
      ) : paginatedHolders.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Wallet Address</TableHead>
                  <TableHead>Holdings</TableHead>
                  <TableHead>% of Supply</TableHead>
                  <TableHead>Token IDs</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedHolders.map((holder, idx) => {
                  const tokenIds = holder["token IDs"] || []
                  const isExpanded = expandedRow === holder.address
                  const displayTokens = isExpanded ? tokenIds : tokenIds.slice(0, 3)
                  const hasMore = tokenIds.length > 3

                  return (
                    <TableRow key={holder.address}>
                      <TableCell className="font-medium">{page * pageSize + idx + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://app.roninchain.com/address/${holder.address}?t=collectibles`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-mono text-sm"
                          >
                            {formatWallet(holder.address)}
                            <ExternalLink className="inline w-3 h-3 ml-1" />
                          </a>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => {
                              navigator.clipboard.writeText(holder.address)
                              toast({ title: "Address copied!" })
                            }}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{formatNumber(holder[fieldKey] || 0)}</TableCell>
                      <TableCell>{(holder[percentField] || 0).toFixed(2)}%</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex flex-wrap gap-1">
                            {displayTokens.map((tokenId: string | number) => (
                              <Badge key={tokenId} variant="secondary" className="font-mono text-xs">
                                {tokenId}
                              </Badge>
                            ))}
                          </div>
                          {hasMore && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => setExpandedRow(isExpanded ? null : holder.address)}
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-3 h-3 mr-1" />
                                  Show less
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-3 h-3 mr-1" />+{tokenIds.length - 3} more
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, holders.length)} of {holders.length}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={(page + 1) * pageSize >= holders.length}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Holder Directory</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="mzc-holders" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mzc-holders">MZC Holders ({mzcHolders?.length || 0})</TabsTrigger>
            <TabsTrigger value="keys-holders">KEYS Holders ({keysHolders?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="mzc-holders" className="mt-6">
            <HolderTable
              holders={filteredMzcHolders}
              paginatedHolders={paginatedMzc}
              page={mzcPage}
              setPage={setMzcPage}
              search={mzcSearch}
              setSearch={setMzcSearch}
              metadata={mzcMeta}
              isLoading={mzcLoading}
              error={mzcError}
              fieldKey="Mark of The Zeal Founders Coin holdings"
              assetName="MZC"
              percentField="percent of total MZC supply"
            />
          </TabsContent>

          <TabsContent value="keys-holders" className="mt-6">
            <HolderTable
              holders={filteredKeysHolders}
              paginatedHolders={paginatedKeys}
              page={keysPage}
              setPage={setKeysPage}
              search={keysSearch}
              setSearch={setKeysSearch}
              metadata={keysMeta}
              isLoading={keysLoading}
              error={keysError}
              fieldKey="MoTZ Key holdings"
              assetName="KEYS"
              percentField="percent of total MoTZ Keys supply"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
