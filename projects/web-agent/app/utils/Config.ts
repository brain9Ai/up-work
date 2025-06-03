'use client';

// Config.ts - Centralized configuration for the application
// This file manages all dependencies and configuration values needed for the app

import { siteData, webAgentInfo } from '../data/siteData';
import { SiteData, WebAgentInfo, validateSiteData, validateWebAgentInfo } from '../components/agent/interfaces/SiteDataInterface';

// Define common types for configuration
export interface NavigationConfig {
  paths: {
    home: string;
    products: string;
    services: string;
    about: string;
    contact: string;
    blog: string;
    [key: string]: string;
  };
  redirects?: Record<string, string>;
}

export interface APIConfig {
  vapiKey: string;
  vapiAssistantId: string;
  endpoints: {
    [key: string]: string;
  };
}

export interface AgentConfig {
  // Core settings
  isEnabled: boolean;
  defaultMode: 'static' | 'dynamic';
  alwaysLive: boolean;
  autoStart: boolean;
  
  // Timeouts and intervals
  keepAliveInterval: number;
  reconnectDelay: number;
  inactivityTimeout: number;
  
  // Behavioral flags
  maintainConversation: boolean;
  autoReconnect: boolean;
  
  // Model settings
  defaultModel: string;
  defaultVoiceId: string;
  
  // Feature flags
  usePreCreatedAssistant: boolean;
  debugMode: boolean;
}

export interface AnalyticsConfig {
  isEnabled: boolean;
  googleAnalyticsId: string;
  trackAgentInteractions: boolean;
  trackInactivity: boolean;
  debugMode: boolean;
}

// The main configuration object containing all app settings
export interface AppConfig {
  api: APIConfig;
  agent: AgentConfig;
  navigation: NavigationConfig;
  siteData: SiteData;
  webAgentInfo: WebAgentInfo;
  environment: 'development' | 'production' | 'test';
  analytics: AnalyticsConfig;
}

/**
 * Create a configuration factory function that can accept site data
 * This allows configuration to be loaded without creating circular dependencies
 */
export function createConfig(
  overrideSiteData?: SiteData,
  overrideWebAgentInfo?: WebAgentInfo
): AppConfig {
  const effectiveSiteData = overrideSiteData || validateSiteData(siteData);
  const effectiveWebAgentInfo = overrideWebAgentInfo || validateWebAgentInfo(webAgentInfo);
  
  return {
    api: {
      vapiKey: process.env.NEXT_PUBLIC_VAPI_API_KEY || '21fd8ff3-a187-47b0-8598-0371e16ddcb2',
      vapiAssistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || '4eec6801-382b-48c8-b019-9b8595081384',
      endpoints: {
        // Add any API endpoints here
      }
    },
    
    agent: {
      isEnabled: process.env.NEXT_PUBLIC_WEB_AGENT_ENABLED !== 'false', // Default to true
      defaultMode: (process.env.NEXT_PUBLIC_DEFAULT_AGENT_MODE === 'dynamic' ? 'dynamic' : 'static'),
      alwaysLive: process.env.NEXT_PUBLIC_ALWAYS_LIVE === 'true',
      autoStart: process.env.NEXT_PUBLIC_AUTO_START === 'true',
      
      // Timeouts and intervals (with defaults)
      keepAliveInterval: parseInt(process.env.NEXT_PUBLIC_KEEP_ALIVE_INTERVAL || '60000', 10), // 1 minute
      reconnectDelay: parseInt(process.env.NEXT_PUBLIC_RECONNECT_DELAY || '5000', 10), // 5 seconds
      inactivityTimeout: parseInt(process.env.NEXT_PUBLIC_INACTIVITY_TIMEOUT || '600000', 10), // 10 minutes
      
      // Behavioral flags
      maintainConversation: process.env.NEXT_PUBLIC_MAINTAIN_CONVERSATION === 'true',
      autoReconnect: process.env.NEXT_PUBLIC_AUTO_RECONNECT === 'true',
      
      // Model settings
      defaultModel: process.env.NEXT_PUBLIC_DEFAULT_MODEL || 'gpt-4o',
      defaultVoiceId: process.env.NEXT_PUBLIC_DEFAULT_VOICE_ID || 'Neha',
      
      // Feature flags
      usePreCreatedAssistant: true, // Default, can be overridden
      debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
    },
    
    navigation: {
      paths: {
        home: '/',
        products: '/products',
        services: '/services',
        about: '/about',
        contact: '/contact',
        blog: '/blog',
      },
      redirects: {
        // Add any URL redirects here
      }
    },
    
    // Use the provided site data or the imported default
    siteData: effectiveSiteData,
    webAgentInfo: effectiveWebAgentInfo,
    
    // Environment
    environment: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
    
    // Analytics configuration
    analytics: {
      isEnabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== 'false', // Default to true
      googleAnalyticsId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-MEB4FQ8H5T', // Updated with actual GA ID
      trackAgentInteractions: process.env.NEXT_PUBLIC_TRACK_AGENT_INTERACTIONS !== 'false', // Default to true
      trackInactivity: process.env.NEXT_PUBLIC_TRACK_INACTIVITY !== 'false', // Default to true
      debugMode: process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true',
    }
  };
}

// Create and export the default configuration
const Config = createConfig();

export default Config; 