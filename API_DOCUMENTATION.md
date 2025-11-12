# MoTZ API Documentation

Complete API reference for the MoTZ Ecosystem Tracker backend.

**Base URL**: `https://web-production-6162.up.railway.app`

**Interactive Docs**: `https://web-production-6162.up.railway.app/docs`

## Authentication

No authentication required. All endpoints are publicly accessible.

## Rate Limiting

- The API uses intelligent caching (24 hours) to minimize external API calls
- Manual refresh via `/api/cache/refresh` should be used sparingly
- No hard rate limits, but please be respectful

## Response Format

All data endpoints return a standardized JSON response:

```json
{
  "metadata": {
    "source": "Dune Analytics",
    "query_id": 6151943,
    "last_updated": "2025-01-15T10:30:00.000Z",
    "cache_age_hours": 2.5,
    "is_fresh": true,
    "next_refresh": "2025-01-16T10:30:00.000Z",
    "row_count": 3
  },
  "data": [
    // Array of data objects
  ]
}
```

## Error Responses

```json
{
  "detail": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `404` - Endpoint not found
- `500` - Internal server error
- `503` - Service unavailable (cache expired, Dune API error)

## Endpoints

### Health & Status

#### GET /

Root endpoint with API documentation.

**Response**:
```json
{
  "message": "MoTZ Ecosystem Tracker API v1.0",
  "version": "1.0.0",
  "status": "online",
  "documentation": "https://web-production-6162.up.railway.app/docs",
  "endpoints": {
    // List of all available endpoints
  }
}
```

#### GET /health

Health check endpoint.

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "api_keys_configured": {
    "dune": true
  },
  "cache_directory": "motz_data_cache"
}
```

### Dune Analytics Data

#### GET /api/raw/dune/motz_overview

Returns ecosystem overview with sales, holders, and fees.

**Response Data Fields**:
- `asset`: Asset name (string)
- `Primary + Secondary sales volume (RON)`: Total sales in RON (number)
- `Primary + Secondary sales volume (USD)`: Total sales in USD (number)
- `contract address`: Smart contract address (string)
- `creator royalty fees (RON)`: Royalties in RON (number)
- `creator royalty fees (USD)`: Royalties in USD (number)
- `floor price (RON)`: Floor price in RON (number)
- `floor price (USD)`: Floor price in USD (number)
- `generated platform fees (RON)`: Platform fees in RON (number)
- `generated platform fees (USD)`: Platform fees in USD (number)
- `generated ronin fees (RON)`: Ronin fees in RON (number)
- `generated ronin fees (USD)`: Ronin fees in USD (number)
- `holders`: Number of holders (number)
- `sales`: Number of sales (number)
- `token standard`: Token standard (string)

---

#### GET /api/raw/dune/daily_secondary_sales

Returns daily secondary market sales volume.

**Response Data Fields**:
- `asset`: Asset name (string)
- `day`: Date (string, ISO 8601)
- `sales volume (USD)`: Daily sales in USD (number)
- `cumulative sales volume (USD)`: Cumulative sales in USD (number)

---

#### GET /api/raw/dune/current_stats

Returns current statistics for MZC and Keys.

**Response Data Fields**:
- `asset name`: Asset name (string)
- `Total and circulating NFT supply`: Total supply (number)
- `Total number of NFTs transferred`: Transfer count (number)
- `Total number of unique users making and receiving these asset transfers`: Unique users (number)
- `Total unique NFT transfer transactions`: Transaction count (number)

---

#### GET /api/raw/dune/daily_user_activity

Returns daily user activity metrics across all sectors.

**Response Data Fields**:
- `day`: Date (string, ISO 8601)
- `total active users interacting with ANY of the 3 sectors (MOTZ Keys, MOTZ Founders Coin, or MOTZ Gotcha Machine)`: Total active users (number)
- `users actively interacting with 1 sector alone`: Single sector users (number)
- `users actively interacting with 2 sectors alone`: Two sector users (number)
- `users actively interacting with ALL of the 3 sectors (MoTZ KEYS, MoTZ Founders Coin and MoTZ Gotcha Machine)`: All sectors users (number)
- `users interacting with Mark of The Zeal Founders Coin`: MZC users (number)
- `users interacting with MOTZ Keys`: Keys users (number)
- `users interacting with MOTZ Gotcha Machine`: Gotcha users (number)

---

#### GET /api/raw/dune/daily_transfer_transactions

Returns daily transaction volumes by sector.

**Response Data Fields**:
- `day`: Date (string, ISO 8601)
- `sector`: Sector name (string)
- `number of transactions/interactions`: Daily transactions (number)
- `cumulative transactions/interactions in each sector`: Sector cumulative (number)
- `cumulative transactions/interactions in all 3 sectors`: Overall cumulative (number)

---

#### GET /api/raw/dune/weekly_user_activation_retention

Returns cohort-based retention analysis.

**Response Data Fields**:
- `asset name`: Asset name (string)
- `cohort week`: Cohort date (string, ISO 8601)
- `new users`: New users in cohort (number)
- `% retention 1 week later`: 1-week retention (number | null)
- `% retention 2 weeks later`: 2-week retention (number | null)
- ... (continues through 12 weeks)
- `% retention 12 weeks later`: 12-week retention (number | null)

---

#### GET /api/raw/dune/daily_holders

Returns historical holder count trends.

**Response Data Fields**:
- `asset`: Asset name (string)
- `day`: Date (string, ISO 8601)
- `holders`: Number of holders (number)

---

#### GET /api/raw/dune/current_holders_founders_coin

Returns complete MZC holder directory (500+ wallets).

**Response Data Fields**:
- `address`: Wallet address (string)
- `Mark of The Zeal Founders Coin holdings`: MZC holdings (number)
- `percent of total MZC supply`: Percentage of supply (number)
- `ronin portfolio`: Portfolio URL (string)
- `token IDs`: Array of token IDs (string[])

---

#### GET /api/raw/dune/current_holders_keys

Returns complete Keys holder directory (300+ wallets).

**Response Data Fields**:
- `address`: Wallet address (string)
- `MoTZ Key holdings`: Keys holdings (number)
- `percent of total MoTZ Keys supply`: Percentage of supply (number)
- `ronin portfolio`: Portfolio URL (string)
- `token IDs`: Array of token IDs (string[])

---

#### GET /api/raw/dune/new_holders_founders_coin_7d

Returns wallets that acquired MZC in last 7 days.

**Response Data Fields**:
- `address`: Wallet address (string)
- `MZC holdings`: Current holdings (number)
- `first holding timestamp`: Acquisition timestamp (string, ISO 8601)
- `token IDs`: Array of token IDs (string[])

---

#### GET /api/raw/dune/new_holders_keys_7d

Returns wallets that acquired Keys in last 7 days.

**Response Data Fields**:
- `address`: Wallet address (string)
- `MOTZ Keys holdings`: Current holdings (number)
- `first holding timestamp`: Acquisition timestamp (string, ISO 8601)
- `token IDs`: Array of token IDs (string[])

---

#### GET /api/raw/dune/sold_transferred_founders_coin_7d

Returns wallets that sold/transferred MZC in last 7 days.

**Response Data Fields**:
- `address`: Wallet address (string)
- `MZC holdings before`: Holdings before exit (number)
- `last sell/transfer timestamp`: Exit timestamp (string, ISO 8601)
- `token IDs sold`: Array of token IDs (string[])

---

#### GET /api/raw/dune/sold_transferred_keys_7d

Returns wallets that sold/transferred Keys in last 7 days.

**Response Data Fields**:
- `address`: Wallet address (string)
- `MOTZ Keys holdings before`: Holdings before exit (number)
- `last sell/transfer timestamp`: Exit timestamp (string, ISO 8601)
- `token IDs sold`: Array of token IDs (string[])

---

#### GET /api/raw/dune/current_stats_gotcha_machine

Returns Gotcha Machine engagement metrics.

**Response Data Fields**:
- `Total gotcha machine transactions/interactions`: Total interactions (number)
- `Total active gotcha machine unique users`: Unique users (number)

---

### Cache Management

#### GET /api/cache/status

Returns detailed cache status for all 14 data sources.

**Response**:
```json
{
  "cache_directory": "motz_data_cache",
  "cache_duration_hours": 24,
  "total_sources": 14,
  "sources": {
    "motz_overview": {
      "type": "Dune Analytics",
      "query_id": 6151943,
      "cache_age_hours": 2.5,
      "is_cached": true,
      "is_fresh": true,
      "last_updated": "2025-01-15T10:30:00.000Z",
      "row_count": 3
    },
    // ... other sources
  }
}
```

---

#### POST /api/cache/refresh

Force refresh all 14 Dune queries. **Use sparingly** - this hits the Dune API directly.

**Response**:
```json
{
  "started_at": "2025-01-15T12:00:00.000Z",
  "results": {
    "motz_overview": "success (3 rows)",
    "daily_secondary_sales": "success (150 rows)",
    // ... other queries
  },
  "completed_at": "2025-01-15T12:02:30.000Z"
}
```

---

#### POST /api/cache/clear

Clear all cached data. **Nuclear option** - causes cold starts on next requests.

**Response**:
```json
{
  "message": "Cache cleared successfully",
  "timestamp": "2025-01-15T12:00:00.000Z"
}
```

---

### Bulk Operations

#### GET /api/bulk/all

Returns all 14 datasets in a single response. Useful for dashboard initialization.

**Response**:
```json
{
  "timestamp": "2025-01-15T12:00:00.000Z",
  "dune": {
    "motz_overview": {
      "metadata": { /* ... */ },
      "data": [ /* ... */ ]
    },
    // ... all 14 queries
  }
}
```

---

## Code Examples

### JavaScript/Fetch

```javascript
// Fetch holder directory
const response = await fetch(
  'https://web-production-6162.up.railway.app/api/raw/dune/current_holders_founders_coin'
);
const { metadata, data } = await response.json();

console.log(`${data.length} MZC holders`);
console.log(`Cache age: ${metadata.cache_age_hours} hours`);
```

### Python/Requests

```python
import requests

# Get overview data
url = 'https://web-production-6162.up.railway.app/api/raw/dune/motz_overview'
response = requests.get(url)
result = response.json()

print(f"Last updated: {result['metadata']['last_updated']}")
for asset in result['data']:
    print(f"{asset['asset']}: {asset['holders']} holders")
```

### cURL

```bash
# Check cache status
curl https://web-production-6162.up.railway.app/api/cache/status | jq

# Get retention data
curl https://web-production-6162.up.railway.app/api/raw/dune/weekly_user_activation_retention | jq '.data | length'

# Force refresh (use sparingly!)
curl -X POST https://web-production-6162.up.railway.app/api/cache/refresh | jq
```

## Support

For questions or issues with the API:
- GitHub Issues: [github.com/joshuatochinwachi/MoTZ/issues](https://github.com/joshuatochinwachi/MoTZ/issues)
- Telegram: [@joshuatochinwachi](https://t.me/joshuatochinwachi)
- Twitter: [@defi__josh](https://x.com/defi__josh)