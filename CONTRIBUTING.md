# Contributing to MoTZ Ecosystem Tracker

First off, thanks for taking the time to contribute! 🎉

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (code snippets, screenshots, logs)
- **Describe the behavior you observed and what you expected**
- **Include your environment details** (OS, Node.js version, Python version, browser)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **Include mockups or examples if applicable**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure your code follows the existing style
4. Make sure your code lints (run ESLint for frontend, check PEP 8 for backend)
5. Update documentation as needed
6. Write a clear commit message

## Development Workflow

### Backend Development

```bash
# Set up environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Add your Dune API key to .env

# Run development server
uvicorn main:app --reload --port 8000

# Test your changes
curl http://localhost:8000/health
```

### Frontend Development

```bash
cd frontend

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Type check
pnpm type-check
```

## Code Style Guidelines

### Python (Backend)

- Follow PEP 8
- Use type hints
- Maximum line length: 120 characters
- Use descriptive variable names
- Add docstrings for classes and functions

Example:
```python
async def fetch_data(query_key: str) -> pd.DataFrame:
    """
    Fetch data from Dune Analytics.
    
    Args:
        query_key: The Dune query identifier
        
    Returns:
        DataFrame containing the query results
        
    Raises:
        ValueError: If query_key is invalid
    """
    # Implementation
```

### TypeScript (Frontend)

- Use TypeScript strict mode
- No `any` types
- Prefer functional components
- Use meaningful variable names
- Maximum line length: 120 characters

Example:
```typescript
interface HolderData {
  address: string;
  holdings: number;
  percentage: number;
}

export function useHolderData(): {
  data: HolderData[] | undefined;
  isLoading: boolean;
  error: string | undefined;
} {
  // Implementation
}
```

## Commit Message Guidelines

Use clear and descriptive commit messages:

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no code change)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

Examples:
```
feat: add export to CSV functionality
fix: resolve caching issue with retention data
docs: update API documentation for new endpoints
refactor: simplify holder directory pagination logic
```

## Questions?

Feel free to reach out:
- Open an issue with the `question` label
- Telegram: [@joshuatochinwachi](https://t.me/joshuatochinwachi)
- Twitter: [@defi__josh](https://x.com/defi__josh)

Thanks for contributing! 🚀