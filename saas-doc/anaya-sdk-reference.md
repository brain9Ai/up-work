# Anaya SDK Reference

This document provides a comprehensive reference for implementing the Anaya Web Agent SDK in the new platform. It outlines the key features, components, and integration patterns based on the current implementation.

## Overview of Anaya

Anaya is an intelligent web browsing assistant that can understand and interact with web content. It provides capabilities such as:

- Browsing websites and extracting content
- Answering questions about web pages
- Performing actions on websites (clicks, form submissions)
- Summarizing content
- Following multi-step browsing sequences

## SDK Architecture

The Anaya SDK will be structured as follows:

```
@brain9/sdk-anaya/
├── src/
│   ├── index.ts           # Main entry point
│   ├── client.ts          # AnayaClient class
│   ├── types.ts           # TypeScript type definitions
│   ├── modules/
│   │   ├── auth.ts        # Authentication module
│   │   ├── browser.ts     # Web browsing module
│   │   ├── content.ts     # Content extraction module
│   │   ├── task.ts        # Task execution module
│   │   └── analytics.ts   # Usage analytics module
│   └── utils/
│       ├── logger.ts      # Logging utilities
│       ├── validation.ts  # Input validation
│       └── helpers.ts     # Helper functions
├── dist/                  # Compiled output
├── examples/              # Usage examples
└── README.md              # Documentation
```

## Core API Reference

### AnayaClient

The main client class for interacting with the Anaya API:

```typescript
import { AnayaClient } from '@brain9/sdk-anaya';

// Initialize with API key
const anaya = new AnayaClient('your-api-key');

// Or with custom configuration
const anaya = new AnayaClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.example.com', // optional
  timeout: 30000, // optional, in ms
  debug: false // optional
});
```

### Primary Methods

#### Browse

Navigate to a URL and get content:

```typescript
// Simple browsing
const result = await anaya.browse('https://example.com');

// With options
const result = await anaya.browse({
  url: 'https://example.com',
  waitFor: '.content', // CSS selector to wait for
  headers: { 'User-Agent': '...' },
  timeout: 10000
});
```

#### Ask

Ask questions about web content:

```typescript
// Ask about current page
const answer = await anaya.ask('What is the main topic of this page?');

// Ask about specific URL
const answer = await anaya.ask({
  query: 'What is the main topic of this page?',
  url: 'https://example.com'
});
```

#### Extract

Extract specific content from a page:

```typescript
// Extract content matching a selector
const content = await anaya.extract('.article-content');

// Extract with more options
const content = await anaya.extract({
  selector: '.article-content',
  url: 'https://example.com', // optional
  format: 'markdown', // html, text, markdown
  cleanUp: true // remove unnecessary elements
});
```

#### Perform

Perform actions on a web page:

```typescript
// Click an element
await anaya.perform({
  action: 'click',
  selector: '.submit-button'
});

// Fill a form
await anaya.perform({
  action: 'fill',
  selector: '#search-input',
  value: 'search term'
});

// Complex sequence
await anaya.perform([
  { action: 'fill', selector: '#username', value: 'user' },
  { action: 'fill', selector: '#password', value: 'pass' },
  { action: 'click', selector: '.login-button' },
  { action: 'wait', duration: 2000 }
]);
```

#### Execute

Run a complete task sequence:

```typescript
// Execute a sequence of operations
const result = await anaya.execute([
  { operation: 'browse', url: 'https://example.com' },
  { operation: 'extract', selector: '.content' },
  { operation: 'ask', query: 'Summarize this page' }
]);
```

## Session Management

The SDK maintains session state for a seamless browsing experience:

```typescript
// Create a named session
const session = anaya.createSession('research');

// Use the session
await session.browse('https://example.com');
const answer = await session.ask('What is this page about?');

// End the session
await session.end();
```

## Error Handling

The SDK provides comprehensive error handling:

```typescript
try {
  const result = await anaya.browse('https://example.com');
} catch (error) {
  if (error instanceof AnayaError) {
    console.error(`Error ${error.code}: ${error.message}`);
    
    // Error types
    if (error.code === 'AUTHENTICATION_ERROR') {
      // Handle auth errors
    } else if (error.code === 'RATE_LIMIT_EXCEEDED') {
      // Handle rate limiting
    } else if (error.code === 'BROWSING_ERROR') {
      // Handle browsing issues
    }
  }
}
```

## Authentication

The SDK handles API key authentication transparently:

```typescript
// API key is set during initialization
const anaya = new AnayaClient('your-api-key');

// Check authentication status
const isAuthenticated = await anaya.isAuthenticated();

// Refresh authentication if needed
await anaya.refreshAuthentication();
```

## Usage Analytics

Track SDK usage for debugging and optimization:

```typescript
// Enable analytics
anaya.enableAnalytics();

// Get usage statistics
const usage = await anaya.getUsage();
console.log(`API calls today: ${usage.today.calls}`);
console.log(`Remaining quota: ${usage.remaining}`);
```

## Examples from Current Implementation

Based on the current codebase, here are some patterns to implement:

### Web Interaction Pattern

Extract this pattern from the current Anaya implementation:

```typescript
// Current implementation (simplified)
async function interactWithWebPage(url, query) {
  const browser = await initBrowser();
  const page = await browser.newPage();
  
  await page.goto(url);
  await page.waitForSelector('.content');
  
  const content = await page.evaluate(() => {
    return document.querySelector('.content').innerText;
  });
  
  // Process with AI
  const response = await processWithAI(content, query);
  
  await browser.close();
  return response;
}

// New SDK implementation
async function interactWithWebPage(url, query) {
  const anaya = new AnayaClient('api-key');
  await anaya.browse(url);
  const answer = await anaya.ask(query);
  return answer;
}
```

### Content Extraction

Implement content extraction based on current patterns:

```typescript
// Extract article content and metadata
async function extractArticle(url) {
  const anaya = new AnayaClient('api-key');
  
  const result = await anaya.extract({
    url: url,
    selectors: {
      title: 'h1.article-title',
      content: '.article-body',
      author: '.author-name',
      date: '.publish-date'
    },
    format: 'markdown'
  });
  
  return result;
}
```

## TypeScript Interfaces

Key TypeScript interfaces for the SDK:

```typescript
// Main configuration
export interface AnayaConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  debug?: boolean;
}

// Browse options
export interface BrowseOptions {
  url: string;
  waitFor?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// Ask options
export interface AskOptions {
  query: string;
  url?: string;
  context?: string;
}

// Extract options
export interface ExtractOptions {
  selector: string | Record<string, string>;
  url?: string;
  format?: 'html' | 'text' | 'markdown';
  cleanUp?: boolean;
}

// Action types
export type ActionType = 'click' | 'fill' | 'select' | 'wait';

// Perform options
export interface PerformOptions {
  action: ActionType;
  selector?: string;
  value?: string | number;
  duration?: number;
}

// Operation types
export type OperationType = 'browse' | 'ask' | 'extract' | 'perform';

// Execute options
export interface ExecuteOperation {
  operation: OperationType;
  [key: string]: any;
}

// Error codes
export enum ErrorCode {
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  INVALID_PARAMETERS = 'INVALID_PARAMETERS',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  BROWSING_ERROR = 'BROWSING_ERROR',
  EXTRACTION_ERROR = 'EXTRACTION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}
```

## Integration with the Platform

The SDK will communicate with the Brain9 platform's API:

```
Client App → SDK → Brain9 API → Anaya Service → Web Content
```

API endpoints to implement:

- `POST /api/anaya/browse` - Browse a URL
- `POST /api/anaya/ask` - Ask a question
- `POST /api/anaya/extract` - Extract content
- `POST /api/anaya/perform` - Perform actions
- `POST /api/anaya/execute` - Execute operation sequence

## Publishing the SDK

Publish the SDK to npm with appropriate versioning:

```bash
# Compile TypeScript
npm run build

# Update version
npm version patch

# Publish to npm
npm publish --access public
```

## Usage Examples

Include comprehensive examples in the SDK:

```typescript
// Example: Research assistant
async function researchTopic(topic) {
  const anaya = new AnayaClient('api-key');
  
  // Search for the topic
  await anaya.browse(`https://www.google.com/search?q=${encodeURIComponent(topic)}`);
  
  // Extract search results
  const results = await anaya.extract('.g');
  
  // Visit the first result
  const firstLink = await anaya.extract('.g a');
  await anaya.browse(firstLink.href);
  
  // Summarize the page
  const summary = await anaya.ask(`Summarize the key points about ${topic}`);
  
  return {
    topic,
    summary,
    source: anaya.getCurrentUrl()
  };
}
```

## Implementation Checklist

When implementing the SDK:

1. Extract core browsing functionality from current codebase
2. Implement API client with authentication
3. Create modular architecture for extensibility
4. Add comprehensive TypeScript types
5. Implement error handling and logging
6. Add usage analytics
7. Create examples and documentation
8. Set up CI/CD for publishing

This reference provides a foundation for implementing the Anaya SDK in the new platform, ensuring compatibility with the current functionality while enabling future extensions. 