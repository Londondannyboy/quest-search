# Railway Deployment Guide for Quest-Search

This guide walks through deploying quest-search (Quest Platform's optimized Scira fork) to Railway.

## Prerequisites

- Railway account (https://railway.com)
- Quest Platform API keys (Serper, Firecrawl, Google/Gemini)
- GitHub repository: https://github.com/Londondannyboy/quest-search

## Deployment Steps

### 1. Create New Railway Project

**Option A: Railway Dashboard (Recommended)**
1. Go to https://railway.com/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose `Londondannyboy/quest-search`
5. Railway will auto-detect the Dockerfile

**Option B: Railway CLI**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to new project
railway init

# Deploy
railway up
```

### 2. Configure Environment Variables

In Railway dashboard, go to your project → Variables tab and add:

#### **Required Variables (Minimum for Quest Platform)**

```bash
# === CRITICAL - Quest Platform APIs ===
SERPER_API_KEY=your_serper_key_here
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key_here
FIRECRAWL_API_KEY=your_firecrawl_key_here

# === Database & Storage ===
DATABASE_URL=postgresql://user:pass@host:5432/dbname
REDIS_URL=redis://default:password@host:6379
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
BLOB_READ_WRITE_TOKEN=vercel_blob_token

# === Authentication (if needed) ===
BETTER_AUTH_SECRET=generate_random_secret_here
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_secret

# === AI Models (Quest uses Gemini, but keep for fallback) ===
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key
XAI_API_KEY=your_xai_key

# === Optional (Can be dummy values for now) ===
TAVILY_API_KEY=dummy_not_used_quest_uses_serper
EXA_API_KEY=dummy_not_used
PARALLEL_API_KEY=dummy_not_used
DAYTONA_API_KEY=dummy_not_used
TWITTER_CLIENT_ID=dummy_not_used
TWITTER_CLIENT_SECRET=dummy_not_used
ELEVENLABS_API_KEY=dummy_not_used
TMDB_API_KEY=dummy_not_used
YT_ENDPOINT=dummy_not_used
OPENWEATHER_API_KEY=dummy_not_used
GOOGLE_MAPS_API_KEY=dummy_not_used
AMADEUS_API_KEY=dummy_not_used
AMADEUS_API_SECRET=dummy_not_used
SMITHERY_API_KEY=dummy_not_used
SUPERMEMORY_API_KEY=dummy_not_used
COINGECKO_API_KEY=dummy_not_used
QSTASH_TOKEN=dummy_not_used
RESEND_API_KEY=dummy_not_used
CRON_SECRET=dummy_cron_secret
VALYU_API_KEY=dummy_not_used
```

#### **Quest Platform Specific Notes:**

- **SERPER_API_KEY**: PRIMARY search provider ($0.001/search)
- **GOOGLE_GENERATIVE_AI_API_KEY**: PRIMARY LLM (Gemini 2.5 Pro, $0.0001/synthesis)
- **FIRECRAWL_API_KEY**: Scraping fallback when Crawl4AI unavailable
- **TAVILY_API_KEY**: NOT USED by Quest (set to dummy value)
- **ANTHROPIC_API_KEY**: Optional fallback, not primary

### 3. Database Setup

Quest-search requires PostgreSQL and Redis:

**Option A: Use Railway's PostgreSQL + Redis**
1. In Railway dashboard, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Select "Database" → "Redis"
4. Railway will auto-populate `DATABASE_URL` and `REDIS_URL`

**Option B: Use External Services**
- PostgreSQL: Neon, Supabase, or existing Quest Neon database
- Redis: Upstash (recommended for serverless)

### 4. Deploy and Verify

```bash
# Railway will automatically deploy after env vars are set
# Check deployment logs in Railway dashboard

# Once deployed, test the endpoint
curl -X POST https://quest-search.up.railway.app/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "queries": ["private equity news 2025"],
    "maxResults": [10],
    "topics": ["news"],
    "quality": ["default"]
  }'
```

**Expected Response:**
```json
{
  "searches": [
    {
      "query": "private equity news 2025",
      "results": [
        {
          "url": "https://...",
          "title": "...",
          "content": "..."
        }
      ],
      "images": [...]
    }
  ]
}
```

### 5. Configure Custom Domain (Optional)

1. In Railway dashboard → Settings → Networking
2. Click "Generate Domain" for `quest-search.up.railway.app`
3. Or add custom domain if you have one

## Cost Estimation

### Railway Hosting Costs
- **Hobby Plan**: $5/month (500 hours included)
- **Developer Plan**: $20/month (unlimited)
- **Estimated Usage**: 24/7 operation = 730 hours/month

**Recommended**: Start with Hobby plan ($5/month), upgrade if needed.

### API Costs (Quest-Optimized)
- **Serper**: $0.001 per search
- **Firecrawl**: $0.05 per scrape (fallback only)
- **Gemini 2.5 Pro**: $0.0001 per synthesis

**Monthly Estimate (200 articles):**
- Railway: $5-20/month
- Serper: 200 × $0.001 = $0.20
- Firecrawl: 40 × $0.05 = $2.00 (20% fallback rate)
- Gemini: 200 × $0.0001 = $0.02
- **Total: $7.22 - $22.22/month**

**vs Perplexity:** $80/month → **Savings: $57.78 - $72.78/month ($693-873/year)**

## Monitoring

### Railway Dashboard
- View logs: Railway dashboard → Deployments → Logs
- Monitor metrics: CPU, Memory, Network usage
- Set up alerts for errors or downtime

### Health Check Endpoint
```bash
# Check if service is running
curl https://quest-search.up.railway.app/

# Expected: Scira homepage HTML
```

### Cost Monitoring
```bash
# Log search costs in Quest backend
logger.info("scira_search_cost", amount=0.0011, provider="serper")
```

## Troubleshooting

### Build Failures

**Error: Missing environment variables during build**
```
Solution: Ensure all required env vars are set in Railway
Railway builds with env vars present, so placeholders won't work
```

**Error: Dockerfile not detected**
```
Solution: Railway should auto-detect Dockerfile in repo root
If not, manually configure: Settings → Build → Dockerfile path: ./Dockerfile
```

### Runtime Errors

**Error: Database connection failed**
```
Check DATABASE_URL is correct
Ensure PostgreSQL database exists
Test connection: railway run psql $DATABASE_URL
```

**Error: SERPER_API_KEY invalid**
```
Verify key is correct in Railway env vars
Test key: curl -X POST https://google.serper.dev/search \
  -H "X-API-KEY: your_key" \
  -d '{"q":"test"}'
```

### Performance Issues

**Slow response times**
```
- Check Railway plan (Hobby vs Developer)
- Monitor Serper API rate limits
- Consider caching frequently searched queries
```

## Integration with Quest Backend

Once deployed, create Python client in Quest backend:

### File: `backend/app/core/scira_client.py`

```python
import httpx
from typing import List, Dict, Any
import structlog

logger = structlog.get_logger()

class SciraClient:
    """
    Quest Platform client for self-hosted Scira search service.

    Cost: ~$0.0011 per search (Serper + Gemini)
    vs Perplexity: $0.20 per search (99.5% savings)
    """

    def __init__(
        self,
        base_url: str = "https://quest-search.up.railway.app"
    ):
        self.base_url = base_url
        self.client = httpx.AsyncClient(timeout=30.0)

    async def search(
        self,
        query: str,
        max_results: int = 10,
        topic: str = "general",
        quality: str = "default"
    ) -> Dict[str, Any]:
        """
        Execute AI-powered web search.

        Args:
            query: Search query
            max_results: Number of results (default 10)
            topic: 'general' or 'news'
            quality: 'default' or 'best'

        Returns:
            Dict with 'searches' containing results and images
        """
        try:
            response = await self.client.post(
                f"{self.base_url}/api/search",
                json={
                    "queries": [query],
                    "maxResults": [max_results],
                    "topics": [topic],
                    "quality": [quality]
                }
            )
            response.raise_for_status()

            # Log cost (Serper + Gemini)
            logger.info(
                "scira_search_completed",
                cost=0.0011,
                provider="scira",
                query=query
            )

            return response.json()

        except httpx.HTTPError as e:
            logger.error(
                "scira_search_failed",
                error=str(e),
                query=query
            )
            raise

    async def close(self):
        """Close HTTP client connection."""
        await self.client.aclose()
```

### Usage Example (Task #22 - News Monitoring)

```python
from app.core.scira_client import SciraClient
from app.workflows import DBOS

@DBOS.scheduled("0 6,12,18 * * *")
async def monitor_industry_news():
    """3x daily news monitoring using Scira"""
    scira = SciraClient()

    try:
        for vertical in ["private_equity", "relocation"]:
            # Cost: $0.0011 per search (vs $0.20 Perplexity)
            news_results = await scira.search(
                query=f"{vertical} breaking news last 24 hours",
                topic="news",
                max_results=10
            )

            for search in news_results["searches"]:
                for result in search["results"]:
                    if is_newsworthy(result):
                        await DBOS.start_workflow(
                            process_news_item,
                            result,
                            vertical
                        )
    finally:
        await scira.close()
```

## Rollback Plan

If deployment fails or quality is insufficient:

1. **Immediate rollback**: Pause Railway deployment
2. **Temporary fix**: Point Quest backend to Perplexity API
3. **Debug**: Check Railway logs for errors
4. **Re-deploy**: Fix issues and re-deploy

## Next Steps

After successful deployment:

1. ✅ Task #29 complete (this deployment)
2. → Task #30: Create SciraClient Python wrapper (see above)
3. → Task #22: Implement news monitoring with Scira
4. → Task #32: 30-day quality pilot (Scira vs Perplexity)

## Support

- **Railway Docs**: https://docs.railway.com
- **Scira GitHub**: https://github.com/zaidmukaddam/scira
- **Quest Fork**: https://github.com/Londondannyboy/quest-search
- **TaskMaster**: Task #29

---

**Last Updated:** January 19, 2025
**Deployment Target:** https://quest-search.up.railway.app
**Status:** Ready for deployment
