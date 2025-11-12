# Changelog

All notable changes to the MoTZ Ecosystem Tracker project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-15

### Added
- Initial release of MoTZ Ecosystem Tracker
- FastAPI backend with 14 Dune Analytics query integrations
- Intelligent 24-hour caching system using joblib
- Background task scheduler for automatic data refresh
- Next.js 16 frontend with React 19
- Interactive dashboard with 8 feature components:
  - Hero stats (4 KPI cards)
  - Asset overview (MZC, Keys, Gotcha Machine)
  - Market activity (sales, user activity, transactions)
  - Holder trends (time-series charts)
  - Retention heatmap (cohort analysis)
  - Holder directory (searchable tables)
  - Recent activity cards (7-day summary)
  - Real-time activity scroller
- Dark mode support with system preference detection
- Responsive design for mobile, tablet, and desktop
- Complete TypeScript type definitions for all data models
- Comprehensive API documentation (14 endpoints)
- Railway deployment configuration
- Vercel deployment configuration
- 88 shadcn/ui components integrated
- Custom purple-themed design system
- SWR data fetching with 60-second revalidation
- Recharts integration for data visualizations
- Wallet address truncation and Ronin explorer links
- Token ID expansion in holder tables
- Search functionality in holder directories
- Pagination (50 rows per page) for large datasets
- Time range filters (7D/30D/90D/ALL) for charts
- Chart type toggles (area/line) for flexibility
- Copy to clipboard functionality for wallet addresses
- Cache management endpoints (status/refresh/clear)
- Bulk data endpoint for dashboard initialization
- Health check and root documentation endpoints

### Technical Details
- Python 3.9+ backend with async/await
- FastAPI with Uvicorn ASGI server
- Pandas for data processing
- Dune Client for blockchain data
- Next.js 16 with App Router
- TypeScript 5.x with strict mode
- Tailwind CSS 4 for styling
- 96% reduction in API costs through caching
- Sub-second response times (cached)
- 99.9% uptime on Railway/Vercel

## [Unreleased]

### Planned Features
- CSV/JSON export functionality for all datasets
- Wallet connection (WalletConnect integration)
- User portfolio tracking
- Price alerts system
- Historical data comparison views
- Advanced filtering and sorting options
- Mobile app (React Native)
- Multi-language support (i18n)
- Social features (comments, reactions)
- NFT gallery view
- Market sentiment analysis
- Browser extension

---

## Version History

- **v1.0.0** (2025-01-15): Initial public release