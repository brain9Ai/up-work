# Brain9 AI WebAgent System Developer Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Core Components](#core-components)
4. [Configuration System](#configuration-system)
5. [Agent Context & Dependency Injection](#agent-context--dependency-injection)
6. [Tool System](#tool-system)
7. [Templates & Prompts](#templates--prompts)
8. [Session Management](#session-management)
9. [Integration Guidelines](#integration-guidelines)
10. [Best Practices](#best-practices)

## Introduction

The Brain9 AI WebAgent system provides a modular, maintainable framework for integrating conversational voice agents into web applications. This guide explains the system architecture, components, and implementation details for developers.

The system is designed with the following principles:
- **Modularity**: Components are loosely coupled through interfaces
- **Dependency Injection**: Data and dependencies are injected rather than imported directly
- **Clear Contracts**: Interfaces define what data is needed by components
- **Resilience**: Components handle missing or incomplete data gracefully

## Architecture Overview

The WebAgent system follows a layered architecture:

```
┌─────────────────────────────────────────────────────────┐
│                      Main Application                    │
├─────────────────────────────────────────────────────────┤
│                    Agent System Layer                    │
├───────────┬───────────┬───────────────┬─────────────────┤
│ WebAgent  │ Config &  │   Tools &     │   Templates &   │
│ Components│  Context  │ Tool Manager  │ Prompt System   │
└───────────┴───────────┴───────────────┴─────────────────┘
```

The system uses the following key patterns:
- **Context Provider Pattern**: For dependency injection and state management
- **Factory Function Pattern**: For configuration and template creation
- **Interface-Based Coupling**: To define clear contracts between components

## Core Components

### WebAgent (WebAgent.tsx)

`WebAgent.tsx` serves as the main entry point and context provider for the agent system. It:
- Initializes the agent system
- Provides the context and state for child components
- Exports hooks for accessing agent functionality
- Handles agent mode selection (static vs. dynamic)

```tsx
// Using the WebAgent in a component
import { useWebAgent } from './WebAgent';

function MyComponent() {
  const { status, actions } = useWebAgent();
  
  return (
    <div>
      <button onClick={actions.startConversation}>
        Start Conversation
      </button>
    </div>
  );
}
```

### StaticAgent and DynamicAgent

These components implement different agent strategies:

- **StaticAgent.tsx**: Uses a pre-created assistant ID from VAPI
- **DynamicAgent.tsx**: Creates an assistant on-the-fly using dynamic configuration

Both implement the same interfaces and functionality but use different initialization strategies.

## Configuration System

The configuration system uses factory functions and interfaces to maintain loose coupling:

### Config.ts

`Config.ts` exports a `createConfig` factory function that allows injecting site data:

```typescript
// Default config
import Config from '../../utils/Config';

// Custom config with injected data
import { createConfig } from '../../utils/Config';
import { customSiteData } from './myData';

const customConfig = createConfig(customSiteData);
```

### SiteDataInterface.ts

This file defines the interfaces for site data used by the agent system:

```typescript
// Example interfaces
export interface CompanyInfo {
  name: string;
  tagline?: string;
  description?: string;
  // ...other fields
}

export interface SiteData {
  company: CompanyInfo;
  navigation?: NavigationInfo;
  products?: ProductInfo[];
  services?: ServiceInfo[];
  faqs?: FaqInfo[];
  [key: string]: any;
}
```

## Agent Context & Dependency Injection

### AgentContext.tsx

The `AgentContext.tsx` file implements a context provider that injects:
- Configuration values
- Site data
- Navigation helpers
- Runtime state

```tsx
// Example usage of AgentContext
import { AgentContextProvider } from './AgentContext';

function App() {
  return (
    <AgentContextProvider>
      <MyComponent />
    </AgentContextProvider>
  );
}
```

### useAgentContext Hook

Access the agent context from any component:

```tsx
import { useAgentContext } from './AgentContext';

function MyComponent() {
  const context = useAgentContext();
  
  return (
    <div>
      <h1>{context.siteData.company.name}</h1>
    </div>
  );
}
```

## Tool System

The Tool system enables the agent to perform actions like navigation, data capture, and appointment booking.

### ToolManager.ts

`ToolManager.ts` manages the registration, discovery, and execution of tools:

```typescript
// Register a custom tool
import toolManager from './ToolManager';

const myTool = {
  name: 'my_custom_tool',
  definition: {
    type: 'function',
    function: {
      name: 'my_custom_tool',
      description: 'Performs a custom action',
      parameters: {
        type: 'object',
        properties: {
          param1: { type: 'string' }
        }
      }
    }
  },
  handler: async (args, context) => {
    // Implementation
    return { success: true, result: 'Done!' };
  }
};

toolManager.registerTool(myTool);
```

### Individual Tools

Tools are implemented as separate modules in the `tools/` directory. Each tool exports:

- A `name` property
- A `definition` object (for the LLM)
- A `handler` function that implements the tool's functionality

## Templates & Prompts

### promptTemplates.ts

The `promptTemplates.ts` file uses a factory function pattern to create prompts:

```typescript
import { initPromptTemplates } from './templates/promptTemplates';
import { mySiteData, myWebAgentInfo } from './myData';

// Initialize with custom data
const { FIRST_MESSAGE, getWelcomeVariation, createSystemPrompt } = 
  initPromptTemplates(mySiteData, myWebAgentInfo);

// Use the templates
const systemPrompt = createSystemPrompt(isHomePage);
```

This approach allows injecting different site data for prompt generation without creating direct dependencies.

## Session Management

### SessionManager.ts

The `SessionManager.ts` file manages conversation sessions:

```typescript
import currentSessionId, { initSession, clearSession } from './SessionManager';

// Initialize a new session
initSession();

// Get the current session ID
console.log(currentSessionId());

// Clear the session when done
clearSession();
```

## Integration Guidelines

To integrate the WebAgent system into a new application:

1. Import and use the WebAgentProvider component:

```tsx
import { WebAgentProvider } from './components/agent/WebAgent';

function App() {
  return (
    <WebAgentProvider>
      <YourApp />
    </WebAgentProvider>
  );
}
```

2. Create and provide site data that conforms to the SiteDataInterface

3. Customize behavior using the Config system

4. Add custom tools if needed by registering them with the ToolManager

## Best Practices

1. **Use interfaces, not direct imports**: Always use the defined interfaces instead of importing data structures directly.

2. **Inject dependencies**: Pass data through context rather than importing directly.

3. **Handle missing data gracefully**: Always provide fallbacks for missing or incomplete data.

4. **Use factory functions**: Create configuration and templates using factory functions that accept injected dependencies.

5. **Keep components focused**: Each component should have a single responsibility.

6. **Follow the existing patterns**: Maintain consistency with the established architecture patterns.

7. **Document your changes**: Add comments for complex logic and update documentation when making significant changes.

8. **Test thoroughly**: Check that your changes work with both static and dynamic agent modes. 