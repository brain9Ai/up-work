'use client';

// AgentContext.tsx - Dependency injection for the agent system

import React, { createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Config, { AppConfig } from '../../utils/Config';

// Define context types with extended configuration
export interface AgentContextProps extends AppConfig {
  // Add runtime properties and functions
  router: ReturnType<typeof useRouter> | null;
}

// Create default context value to handle both server and client contexts
const defaultContextValue: AgentContextProps = {
  ...Config,
  router: null,
};

// Create context with default values
const AgentContext = createContext<AgentContextProps>(defaultContextValue);

// Provider component
interface AgentContextProviderProps {
  children: ReactNode;
  config?: Partial<AppConfig>;
}

export const AgentContextProvider: React.FC<AgentContextProviderProps> = ({ 
  children,
  config = {}
}) => {
  // Get router instance for navigation
  const router = useRouter();
  
  // Merge provided config with defaults
  const contextValue: AgentContextProps = {
    ...Config,
    ...config,
    router,
  };
  
  // Log configuration in development
  if (Config.environment === 'development') {
    console.log('Agent context initialized with config:', contextValue);
  }

  return (
    <AgentContext.Provider value={contextValue}>
      {children}
    </AgentContext.Provider>
  );
};

// Custom hook for using the agent context
export const useAgentContext = () => useContext(AgentContext);

export default AgentContext; 