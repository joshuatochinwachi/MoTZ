"use client"

import useSWR from "swr"
import type {
  ApiResponse,
  OverviewItem,
  CurrentStatsItem,
  GotchaMachineItem,
  SecondSalesItem,
  UserActivityItem,
  TransactionItem,
  HolderItem,
  RetentionItem,
  MZCHolderItem,
  KeysHolderItem,
  NewMZCItem,
  ExitMZCItem,
  NewKeysItem,
  ExitKeysItem,
} from "./motz-types"

const fetcher = async (url: string) => {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000) // 10s timeout

    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeout)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    return response.json()
  } catch (err: any) {
    console.error("[v0] Fetch error:", err.message)
    throw err
  }
}

// Endpoint 1: Overview Stats
export function useOverview() {
  const { data, error, isLoading } = useSWR<ApiResponse<OverviewItem>>("/api/dune/motz-overview", fetcher, {
    refreshInterval: 60000,
  })
  return {
    data: data?.data || [],
    metadata: data?.metadata,
    isLoading,
    error: error?.message,
  }
}

// Endpoint 2: Current Stats
export function useCurrentStats() {
  const { data, error, isLoading } = useSWR<ApiResponse<CurrentStatsItem>>("/api/dune/current-stats", fetcher, {
    refreshInterval: 60000,
  })
  return {
    data: data?.data || [],
    metadata: data?.metadata,
    isLoading,
    error: error?.message,
  }
}

// Endpoint 3: Gotcha Machine
export function useGotchaMachine() {
  const { data, error, isLoading } = useSWR<ApiResponse<GotchaMachineItem>>(
    "/api/dune/current-stats-gotcha-machine",
    fetcher,
    { refreshInterval: 60000 },
  )
  return {
    data: data?.data || [],
    metadata: data?.metadata,
    isLoading,
    error: error?.message,
  }
}

// Endpoint 4: Secondary Sales
export function useSecondarySales() {
  const { data, error, isLoading } = useSWR<ApiResponse<SecondSalesItem>>("/api/dune/daily-secondary-sales", fetcher, {
    refreshInterval: 60000,
  })
  return {
    data: data?.data || [],
    metadata: data?.metadata,
    isLoading,
    error: error?.message,
  }
}

// Endpoint 5: User Activity
export function useUserActivity() {
  const { data, error, isLoading } = useSWR<ApiResponse<UserActivityItem>>("/api/dune/daily-user-activity", fetcher, {
    refreshInterval: 60000,
  })
  return {
    data: data?.data || [],
    metadata: data?.metadata,
    isLoading,
    error: error?.message,
  }
}

// Endpoint 6: Transactions
export function useTransactions() {
  const { data, error, isLoading } = useSWR<ApiResponse<TransactionItem>>(
    "/api/dune/daily-transfer-transactions",
    fetcher,
    { refreshInterval: 60000 },
  )
  return {
    data: data?.data || [],
    metadata: data?.metadata,
    isLoading,
    error: error?.message,
  }
}

// Endpoint 7: Daily Holders
export function useDailyHolders() {
  const { data, error, isLoading } = useSWR<ApiResponse<HolderItem>>("/api/dune/daily-holders", fetcher, {
    refreshInterval: 60000,
  })
  return {
    data: data?.data || [],
    metadata: data?.metadata,
    isLoading,
    error: error?.message,
  }
}

// Endpoint 8: Retention
export function useRetention() {
  const { data, error, isLoading } = useSWR<ApiResponse<RetentionItem>>(
    "/api/dune/weekly-user-activation-retention",
    fetcher,
    { refreshInterval: 60000 },
  )
  return {
    data: data?.data || [],
    metadata: data?.metadata,
    isLoading,
    error: error?.message,
  }
}

// Endpoint 9: MZC Holders
export function useMZCHolders() {
  const { data, error, isLoading } = useSWR<ApiResponse<MZCHolderItem>>(
    "/api/dune/current-holders-founders-coin",
    fetcher,
    { refreshInterval: 60000 },
  )
  return {
    data: data?.data || [],
    metadata: data?.metadata,
    isLoading,
    error: error?.message,
  }
}

// Endpoint 10: Keys Holders
export function useKeysHolders() {
  const { data, error, isLoading } = useSWR<ApiResponse<KeysHolderItem>>("/api/dune/current-holders-keys", fetcher, {
    refreshInterval: 60000,
  })
  return {
    data: data?.data || [],
    metadata: data?.metadata,
    isLoading,
    error: error?.message,
  }
}

// Endpoint 11: New MZC Holders
export function useNewMZC() {
  const { data, error, isLoading } = useSWR<ApiResponse<NewMZCItem>>(
    "/api/dune/new-holders-founders-coin-7d",
    fetcher,
    { refreshInterval: 60000 },
  )
  return {
    data: data?.data || [],
    metadata: data?.metadata,
    isLoading,
    error: error?.message,
  }
}

// Endpoint 12: MZC Exits
export function useExitMZC() {
  const { data, error, isLoading } = useSWR<ApiResponse<ExitMZCItem>>(
    "/api/dune/sold-transferred-founders-coin-7d",
    fetcher,
    { refreshInterval: 60000 },
  )
  return {
    data: data?.data || [],
    metadata: data?.metadata,
    isLoading,
    error: error?.message,
  }
}

// Endpoint 13: New Keys Holders
export function useNewKeys() {
  const { data, error, isLoading } = useSWR<ApiResponse<NewKeysItem>>("/api/dune/new-holders-keys-7d", fetcher, {
    refreshInterval: 60000,
  })
  return {
    data: data?.data || [],
    metadata: data?.metadata,
    isLoading,
    error: error?.message,
  }
}

// Endpoint 14: Keys Exits
export function useExitKeys() {
  const { data, error, isLoading } = useSWR<ApiResponse<ExitKeysItem>>("/api/dune/sold-transferred-keys-7d", fetcher, {
    refreshInterval: 60000,
  })
  return {
    data: data?.data || [],
    metadata: data?.metadata,
    isLoading,
    error: error?.message,
  }
}
