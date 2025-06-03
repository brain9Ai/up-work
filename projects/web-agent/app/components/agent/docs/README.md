# Brain9 AI WebAgent System

## Overview

The Brain9 AI WebAgent system is a modular framework for integrating conversational voice agents into web applications. It provides a complete solution for creating, managing, and customizing AI agents that can interact with users through voice and text.

## Key Features

- **Modular Architecture**: Loosely coupled components that can be customized and extended
- **Voice Integration**: Built-in support for voice interactions using VAPI
- **Tool System**: Extensible tool system for implementing custom agent capabilities
- **Context-Aware Prompts**: Dynamic prompt generation based on site context
- **Dependency Injection**: Clean separation between application data and agent system
- **Multiple Agent Modes**: Support for both static (pre-created) and dynamic agents

## Documentation

- [Developer Guide](./DeveloperGuide.md) - Comprehensive guide to the system architecture and components
- [Tutorial](./Tutorial.md) - Step-by-step tutorial with practical examples

## Quick Start

1. Add the WebAgentProvider to your app:

```tsx
// app/layout.tsx
import { WebAgentProvider } from './components/agent/WebAgent';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WebAgentProvider>
          {children}
        </WebAgentProvider>
      </body>
    </html>
  );
}
```

2. Create an agent UI component:

```tsx
// app/components/AgentButton.tsx
import { useWebAgent } from '../components/agent/WebAgent';

export function AgentButton() {
  const { status, actions } = useWebAgent();
  
  return (
    <button onClick={status.isActive ? actions.stopConversation : actions.startConversation}>
      {status.isActive ? 'Stop Agent' : 'Start Agent'}
    </button>
  );
}
```

3. Add the component to your page:

```tsx
// app/page.tsx
import { AgentButton } from './components/AgentButton';

export default function HomePage() {
  return (
    <main>
      <h1>Welcome</h1>
      <AgentButton />
    </main>
  );
}
```

## System Components

- **WebAgent.tsx**: Main entry point and context provider
- **StaticAgent.tsx**: Implementation using pre-created VAPI assistants
- **DynamicAgent.tsx**: Implementation creating assistants on-the-fly
- **ToolManager.ts**: Tool registration and execution system
- **interfaces/SiteDataInterface.ts**: Interface definitions for site data
- **templates/promptTemplates.ts**: Factory functions for generating prompts
- **Config.ts**: Configuration system with dependency injection
- **AgentContext.tsx**: Context provider for dependency injection

## Configuration

The agent system is highly configurable through environment variables:

```
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_key
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_assistant_id
NEXT_PUBLIC_DEFAULT_AGENT_MODE=static
NEXT_PUBLIC_ALWAYS_LIVE=true
NEXT_PUBLIC_AUTO_START=false
NEXT_PUBLIC_WEB_AGENT_ENABLED=true
```

For advanced configuration options, see the [Developer Guide](./DeveloperGuide.md).

## Example Use Cases

- **Customer Support**: Provide voice-based support on your website
- **Product Demos**: Create interactive product demonstrations
- **Lead Generation**: Capture lead information through conversational interfaces
- **Website Navigation**: Help users find information and navigate your site
- **Appointment Booking**: Enable voice-based appointment scheduling

## Best Practices

- Use interfaces instead of direct imports
- Inject dependencies through context
- Handle missing data gracefully
- Use factory functions for configuration and templates
- Keep components focused on a single responsibility

For more detailed best practices, see the [Developer Guide](./DeveloperGuide.md).

## Troubleshooting

For common issues and their solutions, see the [Troubleshooting section](./Tutorial.md#troubleshooting) in the Tutorial. 