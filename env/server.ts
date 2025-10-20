// https://env.t3.gg/docs/nextjs#create-your-schema
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const serverEnv = createEnv({
  server: {
    // Quest Platform Required APIs
    SERPER_API_KEY: z.string().min(1),
    GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1),
    FIRECRAWL_API_KEY: z.string().min(1),

    // Auth & Database Required
    DATABASE_URL: z.string().min(1),
    REDIS_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(1),

    // Optional APIs (with defaults for Railway deployment)
    XAI_API_KEY: z.string().optional().default('dummy'),
    OPENAI_API_KEY: z.string().optional().default('dummy'),
    ANTHROPIC_API_KEY: z.string().optional().default('dummy'),
    GROQ_API_KEY: z.string().optional().default('dummy'),
    DAYTONA_API_KEY: z.string().optional().default('dummy'),
    GITHUB_CLIENT_ID: z.string().optional().default('dummy'),
    GITHUB_CLIENT_SECRET: z.string().optional().default('dummy'),
    GOOGLE_CLIENT_ID: z.string().optional().default('dummy'),
    GOOGLE_CLIENT_SECRET: z.string().optional().default('dummy'),
    TWITTER_CLIENT_ID: z.string().optional().default('dummy'),
    TWITTER_CLIENT_SECRET: z.string().optional().default('dummy'),
    UPSTASH_REDIS_REST_URL: z.string().optional().default('dummy'),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional().default('dummy'),
    ELEVENLABS_API_KEY: z.string().optional().default('dummy'),
    TAVILY_API_KEY: z.string().optional().default('dummy'),
    EXA_API_KEY: z.string().optional().default('dummy'),
    VALYU_API_KEY: z.string().optional().default('dummy'),
    TMDB_API_KEY: z.string().optional().default('dummy'),
    YT_ENDPOINT: z.string().optional().default('dummy'),
    PARALLEL_API_KEY: z.string().optional().default('dummy'),
    OPENWEATHER_API_KEY: z.string().optional().default('dummy'),
    GOOGLE_MAPS_API_KEY: z.string().optional().default('dummy'),
    AMADEUS_API_KEY: z.string().optional().default('dummy'),
    AMADEUS_API_SECRET: z.string().optional().default('dummy'),
    CRON_SECRET: z.string().optional().default('dummy'),
    BLOB_READ_WRITE_TOKEN: z.string().optional().default('dummy'),
    SMITHERY_API_KEY: z.string().optional().default('dummy'),
    COINGECKO_API_KEY: z.string().optional().default('dummy'),
    QSTASH_TOKEN: z.string().optional().default('dummy'),
    RESEND_API_KEY: z.string().optional().default('dummy'),
    SUPERMEMORY_API_KEY: z.string().optional().default('dummy'),
    ALLOWED_ORIGINS: z.string().optional().default('http://localhost:3000'),
  },
  experimental__runtimeEnv: process.env,
});
