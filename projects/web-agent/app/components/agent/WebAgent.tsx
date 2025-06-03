'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { AgentContextProvider } from './AgentContext';
import Config from '../../utils/Config';

// Types
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  function_call?: {
    name: string;
    arguments: string | any;
  };
}

export interface WebAgentStatus {
  isInitialized: boolean;
  isActive: boolean;
  isSpeaking: boolean;
  isLoading: boolean;
  error: string | null;
  statusMessage: string;
}

export interface WebAgentActions {
  startConversation: () => void;
  stopConversation: () => void;
  sendMessage: (message: string) => void;
  toggleVoiceMute?: (shouldMute?: boolean) => boolean | void;
}

export interface WebAgentContextType {
  status: WebAgentStatus;
  actions: WebAgentActions;
  messages: Message[];
  mode: string;
  setMode: (mode: string) => void;
  usePreCreatedAssistant: boolean;
  setUsePreCreatedAssistant: (value: boolean) => void;
  isAlwaysLive: boolean;
}

// WebAgentProvider props
export interface WebAgentProviderProps {
  children: React.ReactNode;
  mode?: string;
  isHomePage?: boolean;
  usePreCreatedAssistant?: boolean;
}

// Create the context with default values
export const WebAgentContext = createContext<WebAgentContextType>({
  status: {
    isInitialized: false,
    isActive: false,
    isSpeaking: false,
    isLoading: false,
    error: null,
    statusMessage: 'Idle'
  },
  actions: {
    startConversation: () => {},
    stopConversation: () => {},
    sendMessage: () => {},
    toggleVoiceMute: () => false,
  },
  messages: [],
  mode: 'static',
  setMode: () => {},
  usePreCreatedAssistant: true,
  setUsePreCreatedAssistant: () => {},
  isAlwaysLive: false,
});

// Create custom hook for using the agent context
export const useWebAgent = () => useContext(WebAgentContext);

// Dynamic imports for components to prevent SSR issues
const StaticAgent = dynamic(() => import('./StaticAgent'), { ssr: false });
const DynamicAgent = dynamic(() => import('./DynamicAgent'), { ssr: false });

// Constants for configuration
export const AGENT_MODE_KEY = 'agent-mode';
export const USE_PRE_CREATED_KEY = 'use-pre-created';
export const AGENT_MODE_STATIC = 'static';
export const AGENT_MODE_DYNAMIC = 'dynamic';
export const DEFAULT_AGENT_MODE = Config.agent.defaultMode;
export const ALWAYS_LIVE = Config.agent.alwaysLive;

/**
 * WebAgent component that acts as a provider for agent functionality
 * This component initializes the agent on application startup if configured
 */
export const WebAgentProvider: React.FC<WebAgentProviderProps> = ({ 
  children, 
  mode: propMode, 
  isHomePage: propIsHomePage = false,
  usePreCreatedAssistant: propUsePreCreated,
}) => {
  // Get the current path to determine if we're on the home page
  const pathname = usePathname();
  const isHomePage = propIsHomePage || pathname === '/';
  
  // Check if web agent is enabled at all
  const isWebAgentEnabled = Config.agent.isEnabled;
  
  // If web agent is disabled, just render children without the agent
  if (!isWebAgentEnabled) {
    console.log('Web agent is disabled by NEXT_PUBLIC_WEB_AGENT_ENABLED=false');
    return <>{children}</>;
  }
  
  // Priority: prop > localStorage > env var > default
  const [agentMode, setAgentMode] = useState<string>(() => {
    // If mode is provided via prop, use it
    if (propMode) {
      console.log(`Using agent mode from prop: ${propMode}`);
      return propMode;
    }
    
    // Check localStorage if we're in browser
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem(AGENT_MODE_KEY);
      if (savedMode) {
        console.log(`Using agent mode from localStorage: ${savedMode}`);
        // Clear localStorage if env var has changed to allow updates
        const envMode = Config.agent.defaultMode;
        if (envMode && envMode !== savedMode) {
          console.log(`Env mode (${envMode}) differs from saved mode (${savedMode}), clearing localStorage`);
          localStorage.removeItem(AGENT_MODE_KEY);
          return envMode;
        }
        return savedMode;
      }
    }
    
    // Fall back to environment variable or default
    const finalMode = DEFAULT_AGENT_MODE;
    console.log(`Using agent mode from env/default: ${finalMode}`);
    return finalMode;
  });

  // Determine if we should use pre-created assistant or dynamic assistant
  const [usePreCreatedAssistant, setUsePreCreatedAssistant] = useState<boolean>(() => {
    // If explicitly provided as prop, use it
    if (propUsePreCreated !== undefined) return propUsePreCreated;
    
    // Check localStorage if we're in browser
    if (typeof window !== 'undefined') {
      const savedPreference = localStorage.getItem(USE_PRE_CREATED_KEY);
      if (savedPreference !== null) return savedPreference === 'true';
    }
    
    // Fall back to default - always use pre-created in static mode unless specified otherwise
    return agentMode === AGENT_MODE_STATIC || ALWAYS_LIVE;
  });
  
  // When agentMode changes, update localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AGENT_MODE_KEY, agentMode);
    }
  }, [agentMode]);
  
  // When usePreCreatedAssistant changes, update localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USE_PRE_CREATED_KEY, String(usePreCreatedAssistant));
    }
  }, [usePreCreatedAssistant]);
  
  // Ensure we always use pre-created assistant in always-live mode
  // This ensures consistency in the always-live experience
  useEffect(() => {
    if (ALWAYS_LIVE && !usePreCreatedAssistant) {
      console.log('Always-live mode requires pre-created assistant, updating preference');
      setUsePreCreatedAssistant(true);
    }
  }, [usePreCreatedAssistant]);

  // Add auto-mode switching based on URL hash for demo purposes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleHashChange = () => {
        const hash = window.location.hash;
        if (hash === '#static') {
          setAgentMode(AGENT_MODE_STATIC);
        } else if (hash === '#dynamic') {
          setAgentMode(AGENT_MODE_DYNAMIC);
        }
        
        // Handle pre-created vs dynamic hash params
        if (hash === '#precreated') {
          setUsePreCreatedAssistant(true);
        } else if (hash === '#onthefly') {
          // Only allow this if not in always-live mode
          if (!ALWAYS_LIVE) {
            setUsePreCreatedAssistant(false);
          }
        }
      };
      
      // Check hash on initial load
      handleHashChange();
      
      // Listen for hash changes
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }
  }, []);

  // Placeholder for status and actions until the actual agent is rendered
  const [status, setStatus] = useState<WebAgentStatus>({
    isInitialized: false,
    isActive: false,
    isSpeaking: false,
    isLoading: false,
    error: null,
    statusMessage: 'Idle'
  });
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Dummy actions that will be overridden by the child agent
  const actions: WebAgentActions = {
    startConversation: () => console.warn('Agent not fully initialized'),
    stopConversation: () => {
      console.warn('Agent not fully initialized - stopConversation called');
      console.log('This is a dummy implementation that should be overridden by the child agent');
    },
    sendMessage: () => console.warn('Agent not fully initialized'),
  };

  // Conditionally render appropriate agent
  const AgentComponent = useMemo(() => {
    // Check if auto-start is enabled
    const autoStart = Config.agent.autoStart || ALWAYS_LIVE;
    
    // Specify the props that will be passed to the agent component
    const agentProps = {
      isHomePage,
      // Auto-start if enabled
      autoStart,
      // Pass the usePreCreatedAssistant state to child components
      usePreCreatedAssistant,
    };
    
    // Debug info to help diagnose the issue
    if (Config.agent.debugMode) {
      console.log('Environment variables state:');
      console.log(`- Default Agent Mode: ${Config.agent.defaultMode}`);
      console.log(`- Auto Start: ${Config.agent.autoStart}`);
      console.log(`- Always Live: ${Config.agent.alwaysLive}`);
      console.log(`- Voice Agent Enabled: ${Config.agent.isEnabled}`);
      console.log(`- Current agent mode: ${agentMode}`);
      console.log(`- Is home page: ${isHomePage}`);
      console.log(`- Current pathname: ${pathname}`);
    }
    
    // Choose between static and dynamic agent - modified to prioritize dynamic when explicitly set
    if (agentMode === AGENT_MODE_DYNAMIC) {
      console.log('Using DynamicAgent based on mode setting');
      return <DynamicAgent {...agentProps}>{children}</DynamicAgent>;
    }
    
    // Default to StaticAgent
    console.log('Using StaticAgent as fallback');
    return <StaticAgent {...agentProps}>{children}</StaticAgent>;
  }, [agentMode, children, isHomePage, usePreCreatedAssistant]);
  
  // Provide context so child components can access and update agent mode
  const contextValue = useMemo<WebAgentContextType>(() => ({
    status,
    actions,
    messages,
    mode: agentMode,
    setMode: setAgentMode,
    usePreCreatedAssistant,
    setUsePreCreatedAssistant: (value: boolean) => {
      // In always-live mode, prevent setting to false
      if (ALWAYS_LIVE && !value) {
        console.warn('Cannot disable pre-created assistant in always-live mode');
        return;
      }
      setUsePreCreatedAssistant(value);
    },
    isAlwaysLive: ALWAYS_LIVE,
  }), [agentMode, usePreCreatedAssistant, status, actions, messages]);

  return (
    <AgentContextProvider>
      <WebAgentContext.Provider value={contextValue}>
        {AgentComponent}
      </WebAgentContext.Provider>
    </AgentContextProvider>
  );
};

export default WebAgentProvider; 