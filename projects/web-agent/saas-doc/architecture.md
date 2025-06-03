# Architecture Overview

## System Architecture

The Brain9 AI Agent Platform uses a modern, scalable architecture with the following components:

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│                                                             │
│  ┌───────────────┐   ┌───────────────┐   ┌───────────────┐  │
│  │ Marketplace   │   │ User          │   │ Admin         │  │
│  │ - Agent list  │   │ Dashboard     │   │ Dashboard     │  │
│  │ - Agent detail│   │ - Config      │   │ - Management  │  │
│  │ - Search      │   │ - Monitoring  │   │ - Analytics   │  │
│  └───────────────┘   └───────────────┘   └───────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         API Layer                            │
│                                                             │
│  ┌───────────────┐   ┌───────────────┐   ┌───────────────┐  │
│  │ Authentication│   │ Agent API     │   │ Subscription  │  │
│  │ (Clerk)       │   │ - Management  │   │ - Razorpay    │  │
│  │               │   │ - Operations  │   │ - Plans       │  │
│  └───────────────┘   └───────────────┘   └───────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Service Layer                           │
│                                                             │
│  ┌───────────────┐   ┌───────────────┐   ┌───────────────┐  │
│  │ User Service  │   │ Agent Service │   │ Content       │  │
│  │               │   │               │   │ Service       │  │
│  └───────────────┘   └───────────────┘   └───────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                            │
│                                                             │
│  ┌───────────────┐   ┌───────────────┐   ┌───────────────┐  │
│  │ Neon          │   │ External APIs │   │ File Storage  │  │
│  │ PostgreSQL    │   │ - OpenAI etc. │   │ - Assets      │  │
│  │               │   │               │   │ - Docs        │  │
│  └───────────────┘   └───────────────┘   └───────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (matching current site)
- **Authentication**: Clerk
- **State Management**: React Context API + Hooks
- **UI Components**: Custom components matching current site design

### Backend
- **API Routes**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **Authentication**: Clerk
- **Payment Processing**: Razorpay
- **Logging**: Custom logger
- **Email**: SendGrid/Resend

### Deployment
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions
- **Monitoring**: Vercel Analytics
- **Error Tracking**: Sentry

## Monorepo Structure

The project uses a monorepo structure with Turborepo:

```
/brain9ai-agent-platform/
├── apps/
│   └── web/                     # Main marketplace Next.js app
├── packages/
│   ├── sdk-anaya/               # Anaya SDK (publishable)
│   ├── ui/                      # Shared UI components
│   └── database/                # Database utilities
├── package.json                 # Root package.json for workspace
└── turbo.json                   # Turborepo config
```

## Component Structure

### Core System Components

1. **Authentication System**
   - User registration and login
   - Session management
   - Role-based access control

2. **Agent Registry**
   - Agent metadata storage
   - Versioning
   - Configuration templates

3. **Subscription System**
   - Plan management
   - Payment processing
   - Subscription lifecycle

4. **API Gateway**
   - Authentication
   - Rate limiting
   - Request forwarding

5. **User Dashboard**
   - Agent configuration
   - Monitoring
   - Usage analytics

6. **Admin System**
   - Agent management
   - User management
   - System configuration

### SDK Architecture

```
┌──────────────────────────────────────────────────────┐
│                  Anaya SDK                           │
│                                                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐     │
│  │ Auth       │  │ Web Client │  │ Task       │     │
│  │ Module     │  │ Module     │  │ Module     │     │
│  └────────────┘  └────────────┘  └────────────┘     │
│                                                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐     │
│  │ Content    │  │ Analytics  │  │ Extensions │     │
│  │ Module     │  │ Module     │  │ Module     │     │
│  └────────────┘  └────────────┘  └────────────┘     │
└──────────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────┐
│                  Platform API                        │
└──────────────────────────────────────────────────────┘
```

## Communication Flows

### User Authentication Flow

1. User navigates to login page
2. Clerk handles authentication
3. On successful auth, user is redirected to dashboard
4. Session is maintained via Clerk session management

### Subscription Flow

1. User selects an agent from marketplace
2. Views agent details and pricing options
3. Clicks "Subscribe" on desired plan
4. Razorpay payment interface is displayed
5. User completes payment
6. Webhook confirms payment to backend
7. Subscription is activated
8. User is granted access to agent

### Agent Usage Flow

1. User configures agent in dashboard
2. Starts agent instance
3. Agent processes tasks based on configuration
4. Results are displayed in dashboard
5. Usage is logged for billing and analytics

## Security Architecture

1. **Authentication**: Clerk handles identity and access management
2. **Authorization**: Role-based access control for features
3. **API Security**: API keys with scoped permissions
4. **Data Security**: Encrypted storage for sensitive data
5. **Rate Limiting**: Prevent abuse with tier-based rate limits

## Scalability Considerations

1. **Database**: Neon PostgreSQL with connection pooling
2. **API**: Stateless design for horizontal scaling
3. **Caching**: Redis for high-frequency data
4. **Task Processing**: Background workers for intensive operations
5. **CDN**: Edge caching for static assets and content 