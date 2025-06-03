'use client';

import React, { ReactNode } from 'react';
import { AgentContextProvider } from './AgentContext';

interface ClientProviderProps {
  children: ReactNode;
}

/**
 * ClientProvider ensures all client components have access to the Agent context
 * This is important for fixing issues with server/client component boundaries
 */
export default function ClientProvider({ children }: ClientProviderProps) {
  return (
    <AgentContextProvider>
      {children}
    </AgentContextProvider>
  );
} 