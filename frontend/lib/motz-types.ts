export interface Metadata {
  source: string
  query_id: number
  last_updated: string
  cache_age_hours: number
  is_fresh: boolean
  next_refresh: string
  row_count: number
}

export interface ApiResponse<T> {
  metadata: Metadata
  data: T[]
}

// Endpoint 1: Overview
export interface OverviewItem {
  asset: string
  "Primary + Secondary sales volume (RON)": number
  "Primary + Secondary sales volume (USD)": number
  "contract address": string
  "creator royalty fees (RON)": number
  "creator royalty fees (USD)": number
  "floor price (RON)": number
  "floor price (USD)": number
  "generated platform fees (RON)": number
  "generated platform fees (USD)": number
  "generated ronin fees (RON)": number
  "generated ronin fees (USD)": number
  holders: number
  sales: number
  "token standard": string
}

// Endpoint 2: Current Stats
export interface CurrentStatsItem {
  "asset name": string
  "Total and circulating NFT supply": number
  "Total number of NFTs transferred": number
  "Total number of unique users making and receiving these asset transfers": number
  "Total unique NFT transfer transactions": number
}

// Endpoint 3: Gotcha Machine
export interface GotchaMachineItem {
  "Total active gotcha machine unique users": number
  "Total gotcha machine transactions/interactions": number
}

// Endpoint 4: Daily Secondary Sales
export interface SecondSalesItem {
  asset: string
  day: string
  "sales volume (USD)": number
  "cumulative sales volume (USD)": number
}

// Endpoint 5: Daily User Activity
export interface UserActivityItem {
  day: string
  "total active users interacting with ANY of the 3 sectors (MOTZ Keys, MOTZ Founders Coin, or MOTZ Gotcha Machine)": number
  "users actively interacting with 1 sector alone": number
  "users actively interacting with 2 sectors alone": number
  "users actively interacting with ALL of the 3 sectors (MoTZ KEYS, MoTZ Founders Coin and MoTZ Gotcha Machine)": number
  "users interacting with Mark of The Zeal Founders Coin": number
  "users interacting with MOTZ Keys": number
  "users interacting with MOTZ Gotcha Machine": number
}

// Endpoint 6: Daily Transactions
export interface TransactionItem {
  day: string
  sector: string
  "number of transactions/interactions": number
  "cumulative transactions/interactions in each sector": number
  "cumulative transactions/interactions in all 3 sectors": number
}

// Endpoint 7: Daily Holders
export interface HolderItem {
  asset: string
  day: string
  holders: number
}

// Endpoint 8: Weekly Retention
export interface RetentionItem {
  "asset name": string
  "cohort week": string
  "new users": number
  "% retention 1 week later": number | null
  "% retention 2 weeks later": number | null
  "% retention 3 weeks later": number | null
  "% retention 4 weeks later": number | null
  "% retention 5 weeks later": number | null
  "% retention 6 weeks later": number | null
  "% retention 7 weeks later": number | null
  "% retention 8 weeks later": number | null
  "% retention 9 weeks later": number | null
  "% retention 10 weeks later": number | null
  "% retention 11 weeks later": number | null
  "% retention 12 weeks later": number | null
}

// Endpoint 9: MZC Holders
export interface MZCHolderItem {
  address: string
  "Mark of The Zeal Founders Coin holdings": number
  "percent of total MZC supply": number
  "ronin portfolio": string
  "token IDs": string[]
}

// Endpoint 10: Keys Holders
export interface KeysHolderItem {
  address: string
  "MoTZ Key holdings": number
  "percent of total MoTZ Keys supply": number
  "ronin portfolio": string
  "token IDs": string[]
}

// Endpoint 11: New MZC Holders 7D
export interface NewMZCItem {
  address: string
  "MZC holdings": number
  "first holding timestamp": string
  "token IDs": string[]
}

// Endpoint 12: MZC Exits 7D
export interface ExitMZCItem {
  address: string
  "MZC holdings before": number
  "last sell/transfer timestamp": string
  "token IDs sold": string[]
}

// Endpoint 13: New Keys Holders 7D
export interface NewKeysItem {
  address: string
  "MOTZ Keys holdings": number
  "first holding timestamp": string
  "token IDs": string[]
}

// Endpoint 14: Keys Exits 7D
export interface ExitKeysItem {
  address: string
  "MOTZ Keys holdings before": number
  "last sell/transfer timestamp": string
  "token IDs sold": string[]
}
