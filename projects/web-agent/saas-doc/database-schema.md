# Database Schema

This document outlines the complete database schema for the Brain9 AI Agent Platform using PostgreSQL on Neon.

## Entity Relationship Diagram

```
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│     users     │       │    agents     │       │    api_keys   │
├───────────────┤       ├───────────────┤       ├───────────────┤
│ id            │       │ id            │       │ id            │
│ email         │       │ slug          │       │ user_id       │──┐
│ name          │       │ title         │       │ agent_id      │──┘
│ created_at    │       │ description   │       │ key           │
│ metadata      │       │ is_free       │       │ revoked       │
└───────┬───────┘       │ price         │       │ quota         │
        │               │ sdk_package   │       │ created_at    │
        │               │ docs_url      │       │ expires_at    │
        │               │ api_base_url  │       └───────────────┘
        │               └───────┬───────┘               ▲
        │                       │                       │
        │                       │                       │
        │               ┌───────▼───────┐       ┌───────┴───────┐
        │               │ rate_limits   │       │  usage_logs   │
        │               ├───────────────┤       ├───────────────┤
        │               │ id            │       │ id            │
        │               │ agent_id      │       │ api_key_id    │
        │               │ plan_name     │       │ agent_id      │
        └───────────────┤ requests_day  │       │ endpoint      │
                        │ requests_min  │       │ timestamp     │
                        └───────────────┘       │ status_code   │
                                                │ request_data  │
        ┌───────────────┐                       │ response_data │
        │ subscriptions │                       └───────────────┘
        ├───────────────┤
        │ id            │
        │ user_id       │
        │ agent_id      │
        │ status        │
        │ sub_id        │◄─────────────┐
        │ plan_id       │              │
        │ created_at    │              │
        │ updated_at    │     ┌────────┴──────┐
        │ expires_at    │     │   payments    │
        └───────────────┘     ├───────────────┤
                              │ id            │
                              │ user_id       │
                              │ sub_id        │
                              │ payment_id    │
                              │ order_id      │
                              │ amount        │
                              │ currency      │
                              │ status        │
                              │ created_at    │
                              └───────────────┘
```

## Table Definitions

### Users Table

Stores user information, synchronized with Clerk authentication.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);
```

### Agents Table

Catalog of available AI agents on the platform.

```sql
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_free BOOLEAN DEFAULT FALSE,
  price JSONB,
  sdk_package_name TEXT,
  docs_url TEXT,
  api_base_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

Example `price` JSONB:
```json
{
  "monthly": {
    "amount": 199,
    "currency": "INR"
  },
  "yearly": {
    "amount": 1999,
    "currency": "INR"
  }
}
```

### Subscriptions Table

Tracks user subscriptions to agents.

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  agent_id UUID REFERENCES agents(id),
  status TEXT NOT NULL, -- active, trial, cancelled
  subscription_id TEXT, -- razorpay subscription ID
  plan_id TEXT, -- razorpay plan ID
  plan_name TEXT, -- monthly, yearly
  billing_cycle TEXT, -- monthly, yearly
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  UNIQUE(user_id, agent_id)
);
```

### API Keys Table

Manages API keys for accessing agent APIs.

```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  agent_id UUID REFERENCES agents(id),
  key TEXT UNIQUE NOT NULL,
  revoked BOOLEAN DEFAULT FALSE,
  quota INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  UNIQUE(user_id, agent_id)
);
```

### Usage Logs Table

Records API usage for billing and monitoring.

```sql
CREATE TABLE usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_key_id UUID REFERENCES api_keys(id),
  agent_id UUID REFERENCES agents(id),
  endpoint TEXT,
  timestamp TIMESTAMP DEFAULT NOW(),
  status_code INTEGER,
  request_data JSONB,
  response_data JSONB
);
```

### Payments Table

Records payment transactions from Razorpay.

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  subscription_id UUID REFERENCES subscriptions(id),
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  amount INTEGER,
  currency TEXT,
  status TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Agent Configurations Table

Stores user-specific configurations for agents.

```sql
CREATE TABLE agent_configurations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  agent_id UUID REFERENCES agents(id),
  configuration JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, agent_id)
);
```

Example `configuration` JSONB for Anaya:
```json
{
  "defaultMode": "browse",
  "allowedDomains": ["example.com", "github.com"],
  "maxConcurrentSessions": 3,
  "preferences": {
    "theme": "light",
    "language": "en"
  }
}
```

### Agent Instances Table

Tracks running instances of agents.

```sql
CREATE TABLE agent_instances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  agent_id UUID REFERENCES agents(id),
  status TEXT NOT NULL, -- running, stopped, error
  metadata JSONB,
  started_at TIMESTAMP,
  stopped_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Documentation Table

Stores documentation content.

```sql
CREATE TABLE documentation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES agents(id) NULL, -- NULL for general docs
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(agent_id, slug)
);
```

### Blog Posts Table

Manages blog content for marketing and SEO.

```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID REFERENCES users(id),
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  tags TEXT[],
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Rate Limits Table

Defines rate limits for different subscription tiers.

```sql
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES agents(id),
  plan_name TEXT NOT NULL,
  requests_per_day INTEGER NOT NULL,
  requests_per_minute INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(agent_id, plan_name)
);
```

## Indexes

```sql
-- Indexes for improved query performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_agent_id ON subscriptions(agent_id);
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_agent_id ON api_keys(agent_id);
CREATE INDEX idx_usage_logs_api_key_id ON usage_logs(api_key_id);
CREATE INDEX idx_usage_logs_timestamp ON usage_logs(timestamp);
CREATE INDEX idx_agent_instances_user_id ON agent_instances(user_id);
CREATE INDEX idx_agent_instances_status ON agent_instances(status);
CREATE INDEX idx_blog_posts_published ON blog_posts(published, published_at);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
```

## Initial Data

Populate the database with initial data:

```sql
-- Insert initial agent: Anaya
INSERT INTO agents (
  slug, 
  title, 
  description, 
  is_free, 
  price, 
  sdk_package_name, 
  docs_url, 
  api_base_url
) VALUES (
  'anaya', 
  'Anaya Web Agent', 
  'Intelligent web browsing assistant that can understand and interact with web content.', 
  false, 
  '{"monthly": {"amount": 199, "currency": "INR"}, "yearly": {"amount": 1999, "currency": "INR"}}', 
  '@brain9/sdk-anaya', 
  '/docs/anaya', 
  '/api/anaya'
);

-- Insert rate limits for Anaya
INSERT INTO rate_limits (
  agent_id,
  plan_name,
  requests_per_day,
  requests_per_minute
) VALUES (
  (SELECT id FROM agents WHERE slug = 'anaya'),
  'free',
  100,
  10
), (
  (SELECT id FROM agents WHERE slug = 'anaya'),
  'monthly',
  1000,
  60
), (
  (SELECT id FROM agents WHERE slug = 'anaya'),
  'yearly',
  2000,
  100
);
```

## Data Migration Strategy

When migrating from the current site:

1. Create database schema in Neon
2. Sync user data from Clerk
3. Import agent definitions
4. Set up subscriptions for existing users (if applicable)
5. Generate API keys for existing subscriptions

## Database Connection

Use a connection pool for efficient database access:

```typescript
// src/lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default {
  query: (text: string, params: any[]) => pool.query(text, params),
  getClient: () => pool.connect(),
};
``` 