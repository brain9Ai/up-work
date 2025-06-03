# WebAgent System Tutorial

This tutorial will guide you through the process of implementing, customizing, and extending the WebAgent system. We'll cover common use cases with practical examples.

## Table of Contents

1. [Basic Integration](#basic-integration)
2. [Customizing the Agent](#customizing-the-agent)
3. [Creating Custom Tools](#creating-custom-tools)
4. [Customizing Prompts and Templates](#customizing-prompts-and-templates)
5. [Handling User Information](#handling-user-information)
6. [Advanced Configuration](#advanced-configuration)
7. [Troubleshooting](#troubleshooting)

## Basic Integration

This section covers adding the WebAgent to a Next.js app.

### Step 1: Add WebAgent to Your App Layout

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

### Step 2: Add Agent UI to Your Pages

```tsx
// app/components/AgentButton.tsx
import { useWebAgent } from '../components/agent/WebAgent';

export function AgentButton() {
  const { status, actions } = useWebAgent();
  
  return (
    <button 
      className="agent-button"
      onClick={status.isActive ? actions.stopConversation : actions.startConversation}
    >
      {status.isActive ? 'Stop Agent' : 'Start Agent'}
    </button>
  );
}
```

### Step 3: Use the Agent in a Page

```tsx
// app/page.tsx
import { AgentButton } from './components/AgentButton';

export default function HomePage() {
  return (
    <main>
      <h1>Welcome to My Website</h1>
      <AgentButton />
    </main>
  );
}
```

## Customizing the Agent

This section demonstrates how to customize the agent's behavior and appearance.

### Example: Configuring Agent Modes

```tsx
// app/components/CustomAgentProvider.tsx
import { WebAgentProvider } from '../components/agent/WebAgent';

export function CustomAgentProvider({ children }) {
  return (
    <WebAgentProvider
      mode="static" // Use "static" or "dynamic"
      isHomePage={true}
      autoStart={true}
      usePreCreatedAssistant={true}
    >
      {children}
    </WebAgentProvider>
  );
}
```

### Example: Custom Agent Configuration

```tsx
// app/config/customConfig.ts
import { createConfig } from '../utils/Config';
import { mySiteData, myWebAgentInfo } from './myData';

// Create a custom configuration
export const customConfig = createConfig(mySiteData, myWebAgentInfo);

// Example custom site data
export const mySiteData = {
  company: {
    name: "My Company",
    tagline: "Custom solution provider",
    description: "We offer custom solutions for businesses.",
    contact: {
      email: "info@mycompany.com",
      phone: "+1 (123) 456-7890",
    }
  },
  navigation: {
    mainLinks: [
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
      { name: "Contact", path: "/contact" }
    ]
  },
  products: [
    {
      id: "product1",
      name: "Product One",
      shortDescription: "Our flagship product.",
      features: ["Feature 1", "Feature 2"]
    }
  ]
};

// Example web agent info
export const myWebAgentInfo = {
  name: "Alex",
  greeting: "Hi there! I'm Alex, your AI assistant.",
  welcomeVariations: [
    "Welcome back! How can I help you today?",
    "Hello again! What can I assist you with?"
  ],
  persona: {
    traits: ["Helpful", "Professional", "Friendly"],
    goals: ["Assist users", "Answer questions", "Guide navigation"]
  },
  capabilities: [
    "Answer questions about products and services",
    "Navigate to different pages on the website",
    "Provide information about the company"
  ]
};
```

### Example: Using Custom Config

```tsx
// app/components/CustomAgentProvider.tsx
import { AgentContextProvider } from '../components/agent/AgentContext';
import { WebAgentProvider } from '../components/agent/WebAgent';
import { customConfig } from '../config/customConfig';

export function CustomAgentProvider({ children }) {
  return (
    <AgentContextProvider config={customConfig}>
      <WebAgentProvider>
        {children}
      </WebAgentProvider>
    </AgentContextProvider>
  );
}
```

## Creating Custom Tools

This section shows how to create custom tools for your agent.

### Example: Creating a Custom Weather Tool

```typescript
// app/components/agent/tools/WeatherTool.ts
import toolManager, { Tool } from '../ToolManager';

// Define the Weather Tool
const WeatherTool: Tool = {
  name: 'get_weather',
  definition: {
    type: 'function',
    function: {
      name: 'get_weather',
      description: 'Get the current weather for a location',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'The city and state/country, e.g., "New York, NY"'
          }
        },
        required: ['location']
      }
    }
  },
  handler: async (args, context) => {
    try {
      // In a real implementation, you would call a weather API
      const { location } = args;
      
      // Mock implementation for the example
      const mockWeatherData = {
        location,
        temperature: Math.floor(Math.random() * 30) + 10, // Random temp between 10-40°C
        condition: ['Sunny', 'Cloudy', 'Rainy', 'Snowy'][Math.floor(Math.random() * 4)]
      };
      
      return {
        success: true,
        weather: mockWeatherData
      };
    } catch (error) {
      console.error('Error getting weather:', error);
      return {
        success: false,
        message: 'Failed to get weather information'
      };
    }
  }
};

// Export the tool
export default WeatherTool;

// Register the tool with the ToolManager
export const registerWeatherTool = () => {
  toolManager.registerTool(WeatherTool);
};
```

### Example: Registering the Custom Tool

```typescript
// app/components/agent/customTools.ts
import { registerWeatherTool } from './tools/WeatherTool';

// Register all custom tools
export const registerCustomTools = () => {
  registerWeatherTool();
};

// Usage in your app initialization
// import { registerCustomTools } from './components/agent/customTools';
// registerCustomTools();
```

## Customizing Prompts and Templates

This section demonstrates how to customize the agent's prompts and templates.

### Example: Custom Prompt Templates

```typescript
// app/components/agent/customPrompts.ts
import { SiteData, WebAgentInfo } from './interfaces/SiteDataInterface';
import { initPromptTemplates } from './templates/promptTemplates';

// Create custom site data
const customSiteData: SiteData = {
  company: {
    name: "TechCorp",
    tagline: "Innovative solutions for tomorrow",
    description: "We build cutting-edge technology solutions."
  },
  // Add other required fields...
};

// Create custom web agent info
const customWebAgentInfo: WebAgentInfo = {
  name: "Jarvis",
  greeting: "Hello, I'm Jarvis, your personal assistant. How may I help you?",
  welcomeVariations: [
    "Welcome back! How can I be of service today?",
    "Hello again! What can I assist you with?"
  ],
  // Add other required fields...
};

// Initialize custom prompt templates
export const customPrompts = initPromptTemplates(
  customSiteData,
  customWebAgentInfo
);

// Usage
// const { FIRST_MESSAGE, createSystemPrompt } = customPrompts;
```

### Example: Using Custom Prompts in a Component

```tsx
// app/components/CustomAgent.tsx
import { useEffect, useState } from 'react';
import { customPrompts } from './customPrompts';

export function CustomAgent() {
  const [systemPrompt, setSystemPrompt] = useState('');
  
  useEffect(() => {
    // Get a custom system prompt for the home page
    const homePagePrompt = customPrompts.createSystemPrompt(true);
    setSystemPrompt(homePagePrompt);
  }, []);
  
  return (
    <div>
      <h3>System Prompt Preview:</h3>
      <pre className="prompt-preview">
        {systemPrompt.substring(0, 200)}...
      </pre>
    </div>
  );
}
```

## Handling User Information

This section covers storing and managing user information.

### Example: Using the Customer Info Tool

```typescript
// app/components/MyContactForm.tsx
import { useState } from 'react';
import toolManager from '../components/agent/ToolManager';

export function MyContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Use the customer info tool to store the information
    try {
      const result = await toolManager.handleToolCall({
        name: 'store_customer_info',
        arguments: {
          name,
          email,
          phone,
          notes: message,
          source: 'contact_form'
        }
      });
      
      if (result.success) {
        alert('Thank you! Your information has been submitted.');
      } else {
        alert('There was an error submitting your information. Please try again.');
      }
    } catch (error) {
      console.error('Error storing customer info:', error);
      alert('There was an error processing your request.');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="tel"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      ></textarea>
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Advanced Configuration

This section covers advanced configuration options for the WebAgent system.

### Example: Configuring VAPI Settings

```typescript
// app/config/vapiConfig.ts
import { createConfig } from '../utils/Config';
import { defaultSiteData, defaultWebAgentInfo } from './defaultData';

// Create a custom configuration with VAPI settings
export const vapiConfig = createConfig(
  defaultSiteData,
  defaultWebAgentInfo
);

// Override the API configuration
vapiConfig.api = {
  ...vapiConfig.api,
  vapiKey: process.env.MY_CUSTOM_VAPI_KEY || '',
  vapiAssistantId: process.env.MY_CUSTOM_ASSISTANT_ID || '',
  endpoints: {
    // Custom endpoints if needed
  }
};

// Override agent settings
vapiConfig.agent = {
  ...vapiConfig.agent,
  defaultMode: 'dynamic',
  alwaysLive: true,
  autoStart: false,
  defaultModel: 'gpt-4-turbo',
  defaultVoiceId: 'echo', // Custom voice ID
  keepAliveInterval: 30000, // 30 seconds
  reconnectDelay: 3000, // 3 seconds
  inactivityTimeout: 300000 // 5 minutes
};
```

### Example: Using Environment Variables for Configuration

```typescript
// .env.local
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_key
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_assistant_id
NEXT_PUBLIC_DEFAULT_AGENT_MODE=static
NEXT_PUBLIC_ALWAYS_LIVE=true
NEXT_PUBLIC_AUTO_START=false
NEXT_PUBLIC_WEB_AGENT_ENABLED=true
```

```typescript
// app/utils/environmentConfig.ts
// This file demonstrates how to use environment variables with the config

import { createConfig } from './Config';
import { defaultSiteData, defaultWebAgentInfo } from '../data/defaultData';

const envConfig = createConfig(defaultSiteData, defaultWebAgentInfo);

// Log the environment configuration for debugging
console.log('Environment Configuration:', {
  apiKey: process.env.NEXT_PUBLIC_VAPI_API_KEY ? 'Set' : 'Not Set',
  assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ? 'Set' : 'Not Set',
  agentMode: process.env.NEXT_PUBLIC_DEFAULT_AGENT_MODE || 'Default',
  alwaysLive: process.env.NEXT_PUBLIC_ALWAYS_LIVE === 'true',
  autoStart: process.env.NEXT_PUBLIC_AUTO_START === 'true',
  enabled: process.env.NEXT_PUBLIC_WEB_AGENT_ENABLED !== 'false'
});

export default envConfig;
```

## Troubleshooting

This section provides solutions for common issues.

### Common Issues and Solutions

#### 1. Agent doesn't initialize

**Symptoms**: The agent doesn't start or shows initialization errors.

**Solutions**:
- Check that your VAPI API key is correct
- Verify your assistant ID (for StaticAgent mode)
- Check browser console for specific error messages
- Ensure you have microphone permissions enabled

```typescript
// Debug initialization
import { useEffect } from 'react';
import { useWebAgent } from '../components/agent/WebAgent';

function DebugAgent() {
  const { status, actions } = useWebAgent();
  
  useEffect(() => {
    console.log('Agent Status:', status);
    
    if (status.error) {
      console.error('Agent Error:', status.error);
    }
  }, [status]);
  
  return (
    <div>
      <p>Agent Status: {status.statusMessage}</p>
      {status.error && <p className="error">Error: {status.error}</p>}
      <button onClick={actions.startConversation}>
        Try Start
      </button>
    </div>
  );
}
```

#### 2. Tools are not working

**Symptoms**: The agent doesn't execute tools properly.

**Solutions**:
- Check that your tools are registered correctly
- Ensure tool definitions match the expected format
- Verify that the tool handler is working properly
- Check for errors in the browser console

```typescript
// Debug tools
import toolManager from '../components/agent/ToolManager';

// List all registered tools
console.log('Registered Tools:', toolManager.getAllTools().map(t => t.name));

// Test a specific tool
async function testNavigationTool() {
  try {
    const result = await toolManager.handleToolCall({
      name: 'navigate',
      arguments: { route: '/products' }
    });
    
    console.log('Navigation Result:', result);
  } catch (error) {
    console.error('Navigation Error:', error);
  }
}

testNavigationTool();
```

#### 3. Prompts and Templates Issues

**Symptoms**: The agent's responses are not as expected.

**Solutions**:
- Verify your site data format matches the expected interfaces
- Check that prompt templates are initialized correctly
- Ensure you're passing isHomePage correctly for context-aware prompts

```typescript
// Debug prompt templates
import { initPromptTemplates } from '../components/agent/templates/promptTemplates';
import { mySiteData, myWebAgentInfo } from './myData';

// Initialize and check templates
const templates = initPromptTemplates(mySiteData, myWebAgentInfo);

// Log the system prompt to check its content
console.log('System Prompt for Home Page:', templates.createSystemPrompt(true).substring(0, 500) + '...');
console.log('System Prompt for Other Pages:', templates.createSystemPrompt(false).substring(0, 500) + '...');
``` 