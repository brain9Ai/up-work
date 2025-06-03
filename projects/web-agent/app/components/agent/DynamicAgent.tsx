'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { WebAgentContext, WebAgentStatus, WebAgentActions, Message } from './WebAgent';
import { initPromptTemplates } from './templates/promptTemplates';
import toolManager from './ToolManager';
import currentSessionId, { 
  initSession, 
  clearSession, 
  wasAgentActive, 
  setAgentActive, 
  clearAgentActiveStatus 
} from './SessionManager';
import { useAgentContext } from './AgentContext';

export interface DynamicAgentProps {
  children?: React.ReactNode;
  isHomePage?: boolean;
  voiceId?: string;
  modelName?: string;
  autoStart?: boolean;
  usePreCreatedAssistant?: boolean;
}

/**
 * DynamicAgent Component
 * 
 * This component creates an assistant on-the-fly using VAPI API
 */
const DynamicAgent: React.FC<DynamicAgentProps> = ({
  children,
  isHomePage = false,
  voiceId,
  modelName,
  autoStart = false,
  usePreCreatedAssistant = false,
}) => {
  const router = useRouter();
  const config = useAgentContext();
  
  // Get configuration from context
  const VAPI_API_KEY = config.api.vapiKey;
  const MAX_RETRIES = 3;
  const INITIAL_RETRY_DELAY = 2000; // 2 seconds
  const KEEP_ALIVE_INTERVAL = config.agent.keepAliveInterval;
  const RECONNECT_DELAY = config.agent.reconnectDelay;
  const INACTIVITY_TIMEOUT = config.agent.inactivityTimeout;
  
  // Use provided props or fall back to config defaults
  const effectiveVoiceId = voiceId || config.agent.defaultVoiceId;
  const effectiveModelName = modelName || config.agent.defaultModel;
  
  console.log('DynamicAgent rendering with:');
  console.log(`- isHomePage: ${isHomePage}`);
  console.log(`- voiceId: ${effectiveVoiceId}`);
  console.log(`- modelName: ${effectiveModelName}`);
  console.log(`- autoStart: ${autoStart}`);
  console.log(`- VAPI_API_KEY: ${VAPI_API_KEY ? 'set' : 'not set'}`);
  
  // Configuration from context
  const maintainConversation = typeof window !== 'undefined' && config.agent.maintainConversation;
  const autoReconnect = typeof window !== 'undefined' && config.agent.autoReconnect;
  
  // State
  const [status, setStatus] = useState<WebAgentStatus>({
    isInitialized: false,
    isActive: false,
    isSpeaking: false,
    isLoading: true,
    error: null,
    statusMessage: 'Initializing...',
  });
  
  // Refs
  const vapiClientRef = useRef<any>(null);
  const callRef = useRef<any>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractedRef = useRef<boolean>(false);
  const inactivityStageRef = useRef<number>(0);
  
  // Clear inactivity timer - define this first to avoid dependency cycle
  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      console.log('Clearing inactivity timer');
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, []);
  
  // Function to handle inactivity
  const handleInactivity = useCallback(() => {
    console.log('Inactivity detected, stage:', inactivityStageRef.current);
    console.log('Status at inactivity time:', {
      isActive: status.isActive,
      userInteracted: userInteractedRef.current,
      callRef: !!callRef.current
    });
    
    // Only proceed if the agent is active but user hasn't interacted
    if (!status.isActive || userInteractedRef.current) {
      console.log('Skipping inactivity action - conditions not met');
      return;
    }
    
    if (!callRef.current) {
      console.log('Skipping inactivity action - no active call reference');
      return;
    }
    
    // Import Analytics dynamically to avoid SSR issues
    import('../../utils/Analytics').then(({ default: Analytics }) => {
      // Check if analytics tracking is enabled
      import('../../utils/Config').then(({ default: Config }) => {
        if (Config.analytics.isEnabled && Config.analytics.trackInactivity) {
          // Track this inactivity event
          Analytics.trackInactivity(inactivityStageRef.current, 'detected');
        }
      });
    });
    
    // Respect the main inactivity timeout by using a percentage
    // Only take action if we're past 50% of the main timeout
    // This prevents rapid actions when the timeout is long
    if (INACTIVITY_TIMEOUT > 120000) { // If longer than 2 minutes
      console.log('Using longer inactivity stages based on main timeout');
      
      // Increment the inactivity stage
      const currentStage = inactivityStageRef.current;
      inactivityStageRef.current = currentStage + 1;
      
      // Set the next inactivity timer - use a percentage of the main timeout
      // but cap at reasonable values (min 30s, max 2min)
      const nextStageDelay = Math.min(
        Math.max(INACTIVITY_TIMEOUT * 0.15, 30000), // At least 30s, at most 15% of timeout
        120000 // Cap at 2 minutes
      );
      
      console.log(`Setting next inactivity timer for ${nextStageDelay/1000} seconds`);
      clearInactivityTimer();
      inactivityTimerRef.current = setTimeout(handleInactivity, nextStageDelay);
      
      return; // Skip the immediate actions below when using longer timeouts
    }
    
    // Increment the inactivity stage for shorter timeouts
    const currentStage = inactivityStageRef.current;
    inactivityStageRef.current = currentStage + 1;
    console.log(`Proceeding with inactivity action at stage ${currentStage}`);
    
    // Different actions based on the inactivity stage
    switch (currentStage) {
      case 0:
        // First inactivity - Navigate to Anaya product page
        console.log('Inactivity action: Navigating to Anaya product page');
        try {
          if (callRef.current) {
            callRef.current.sendMessage({
              content: "Let me show you our flagship product, Anaya WebAgent, which can help businesses like yours with website navigation and lead capture.",
              metadata: {
                function_call: {
                  name: "navigate_to",
                  parameters: {
                    destination: "/products/anaya-webAgent"
                  }
                }
              }
            });
            console.log('Successfully sent navigate message for stage 0');
            
            // Track successful navigation action
            import('../../utils/Analytics').then(({ default: Analytics }) => {
              import('../../utils/Config').then(({ default: Config }) => {
                if (Config.analytics.isEnabled && Config.analytics.trackInactivity) {
                  Analytics.trackInactivity(0, 'navigate_to_anaya');
                }
              });
            });
          }
        } catch (error) {
          console.error('Error executing inactivity action stage 0:', error);
        }
        break;
      case 1:
        // Second inactivity - Navigate to services page
        console.log('Inactivity action: Navigating to services page');
        try {
          if (callRef.current) {
            callRef.current.sendMessage({
              content: "Would you like to see our services? Let me show you how we can help implement AI agents in your business.",
              metadata: {
                function_call: {
                  name: "navigate_to",
                  parameters: {
                    destination: "/services"
                  }
                }
              }
            });
            console.log('Successfully sent navigate message for stage 1');
            
            // Track successful navigation action
            import('../../utils/Analytics').then(({ default: Analytics }) => {
              import('../../utils/Config').then(({ default: Config }) => {
                if (Config.analytics.isEnabled && Config.analytics.trackInactivity) {
                  Analytics.trackInactivity(1, 'navigate_to_services');
                }
              });
            });
          }
        } catch (error) {
          console.error('Error executing inactivity action stage 1:', error);
        }
        break;
      case 2:
        // Third inactivity - Navigate to blog page
        console.log('Inactivity action: Navigating to blog page');
        try {
          if (callRef.current) {
            callRef.current.sendMessage({
              content: "We also have some interesting blog articles about AI automation. Let me show you our blog section.",
              metadata: {
                function_call: {
                  name: "navigate_to",
                  parameters: {
                    destination: "/blog"
                  }
                }
              }
            });
            console.log('Successfully sent navigate message for stage 2');
            
            // Track successful navigation action
            import('../../utils/Analytics').then(({ default: Analytics }) => {
              import('../../utils/Config').then(({ default: Config }) => {
                if (Config.analytics.isEnabled && Config.analytics.trackInactivity) {
                  Analytics.trackInactivity(2, 'navigate_to_blog');
                }
              });
            });
          }
        } catch (error) {
          console.error('Error executing inactivity action stage 2:', error);
        }
        break;
      default:
        // Reset to first stage if we've gone through all stages
        console.log('Resetting inactivity stage counter');
        inactivityStageRef.current = 0;
        break;
    }
    
    // Set the next inactivity timer
    console.log('Setting next inactivity timer for 30 seconds');
    clearInactivityTimer();
    inactivityTimerRef.current = setTimeout(handleInactivity, 30000); // 30 seconds for next stage
  }, [status.isActive, clearInactivityTimer]);

  // Start inactivity timer
  const startInactivityTimer = useCallback(() => {
    // Use a percentage of the main inactivity timeout for the first timer
    // but ensure it's not too short or too long
    const initialDelay = INACTIVITY_TIMEOUT > 120000 
      ? Math.min(Math.max(INACTIVITY_TIMEOUT * 0.1, 30000), 90000) // 10% of timeout with min/max bounds
      : 20000; // Default for short timeouts
      
    console.log(`Starting inactivity timer for ${initialDelay/1000} seconds`);
    clearInactivityTimer();
    inactivityTimerRef.current = setTimeout(handleInactivity, initialDelay);
  }, [handleInactivity, clearInactivityTimer, INACTIVITY_TIMEOUT]);

  // Function to handle user interaction
  const handleUserInteraction = useCallback(() => {
    userInteractedRef.current = true;
    clearInactivityTimer();
    
    // Track user interaction
    import('../../utils/Analytics').then(({ default: Analytics }) => {
      import('../../utils/Config').then(({ default: Config }) => {
        if (Config.analytics.isEnabled && Config.analytics.trackAgentInteractions) {
          Analytics.trackAgentInteraction('user_input');
        }
      });
    });
    
    // Reset inactivity timer after user interaction
    if (status.isActive) {
      startInactivityTimer();
    }
  }, [clearInactivityTimer, startInactivityTimer, status.isActive]);

  // Reinitialize the inactivity detection when status changes
  useEffect(() => {
    if (status.isActive) {
      userInteractedRef.current = false;
      inactivityStageRef.current = 0;
      startInactivityTimer();
    } else {
      clearInactivityTimer();
    }
  }, [status.isActive, startInactivityTimer, clearInactivityTimer]);
  
  // Initialize session and ToolManager context
  useEffect(() => {
    initSession();
    
    toolManager.setContext({ 
      router,
      siteData: config.siteData,
      webAgentInfo: config.webAgentInfo,
      navigation: config.navigation.paths,
      currentPage: typeof window !== 'undefined' ? window.location.pathname : '/',
    });
    
    // Check for muted state in localStorage to sync UI with mute status
    if (typeof window !== 'undefined') {
      const storedMuteState = localStorage.getItem('agent_voice_muted') === 'true';
      if (storedMuteState) {
        console.log('Found muted state in localStorage, applying to UI');
        setStatus(prev => ({
          ...prev,
          statusMessage: 'Voice muted from previous session',
        }));
      }
    }
    
    return () => {
      clearSession();
    };
  }, [router, config]);
  
  // Initialize session on component mount
  useEffect(() => {
    const initVapi = async () => {
      try {
        // Check if we're coming from a navigation where the agent was active
        const wasActive = wasAgentActive();
        
        // If we're already initialized and this is a recent navigation
        // then we can skip full reinitialization
        if (status.isInitialized && wasActive) {
          console.log('Skipping full agent reinitialization after navigation');
          
          // Clean up the stored state
          clearAgentActiveStatus();
          
          // Only update the necessary status
          setStatus(prev => ({
            ...prev,
            isLoading: false,
            isActive: true, // Ensure agent remains active after navigation
            statusMessage: 'Agent active after navigation',
          }));
          
          // If we have an active call, maintain it
          if (callRef.current) {
            console.log('Existing call reference detected after navigation');
            return;
          }
          
          // Otherwise try to restore the conversation
          if (autoStart || wasActive) {
            setTimeout(() => {
              startConversation().then(() => {
                console.log('Resumed conversation after navigation');
                // Initialize inactivity tracking
                userInteractedRef.current = false;
                inactivityStageRef.current = 0;
                startInactivityTimer();
              }).catch(err => {
                console.error('Error resuming conversation after navigation:', err);
              });
            }, 500); // Reduced delay for faster response
          }
          
          return;
        }
        
        // Regular initialization process if not resuming
        setStatus(prev => ({
          ...prev,
          isLoading: true,
          statusMessage: 'Initializing dynamic agent...',
        }));
        
        // Dynamically import VAPI module
        const vapiModule = await import('@vapi-ai/web');
        console.log('VAPI module loaded for Dynamic Agent');
        
        // Initialize the client
        // @ts-ignore - Type definitions might be incomplete, but this works
        vapiClientRef.current = new vapiModule.default(VAPI_API_KEY);
        
        // Set up event listeners
        setupEventListeners();
        
        setStatus(prev => ({
          ...prev,
          isInitialized: true,
          isLoading: false,
          statusMessage: 'Ready to start conversation',
        }));
        
        console.log('Dynamic agent initialized successfully');
        
        // Auto-start if configured
        if (autoStart) {
          setTimeout(() => {
            startConversation().then(() => {
              console.log('Auto-started conversation, initializing inactivity tracking');
              // Initialize inactivity tracking after auto-start
              userInteractedRef.current = false;
              inactivityStageRef.current = 0;
              startInactivityTimer();
            }).catch(err => {
              console.error('Error in auto-start conversation:', err);
            });
          }, 1000); // Small delay to ensure initialization is complete
        }
        
      } catch (error) {
        console.error('Dynamic agent initialization error:', error);
        setStatus(prev => ({
          ...prev,
          isLoading: false,
          error: `Failed to initialize voice assistant: ${error instanceof Error ? error.message : 'Unknown error'}`,
          statusMessage: 'Error initializing',
        }));
      }
    };
    
    initVapi();
    
    // Set up a keep-alive mechanism to prevent disconnections due to inactivity
    let keepAliveInterval: NodeJS.Timeout | null = null;
    
    if (autoReconnect) {
      keepAliveInterval = setInterval(() => {
        if (callRef.current) {
          // If we have an active call, send a silent ping to keep it alive
          try {
            // For VAPI, we'll use a method that doesn't trigger user-visible actions
            if (typeof callRef.current.ping === 'function') {
              callRef.current.ping();
              console.log('Keep-alive ping sent');
              
              // Make sure inactivity timer is still running if there's an active call
              if (!inactivityTimerRef.current && status.isActive && !userInteractedRef.current) {
                console.log('No active inactivity timer but call is active, restarting timer');
                startInactivityTimer();
                  }
            }
          } catch (error) {
            console.error('Keep-alive ping failed:', error);
            
            // Don't immediately try to reconnect - wait to see if it recovers naturally
            // This prevents aggressive reconnection loops
            if (!status.isActive && !status.isLoading) {
              console.log('Connection appears lost, scheduling reconnection attempt');
              setTimeout(() => {
                // Check again before attempting reconnection
                if (!callRef.current || !status.isActive) {
                  startConversation().catch(err => {
                    console.error('Failed to reconnect after ping failure:', err);
                  });
        }
              }, RECONNECT_DELAY * 2); // Use a longer delay for ping failures
            }
          }
        } else if (autoReconnect && !status.isActive && !status.isLoading) {
          // If we're configured to auto-reconnect, try to start a call if none exists
          console.log('No active call, attempting to start one');
          startConversation().catch(err => {
            console.error('Failed to start conversation in auto-reconnect mode:', err);
          });
        }
      }, KEEP_ALIVE_INTERVAL); // Use the configured keep-alive interval
    }
    
    // Add event listener for page unload to clear session
    const handleBeforeUnload = () => {
      clearSession();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Cleanup
    return () => {
      if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
      }
      
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      
      if (callRef.current) {
        try {
          callRef.current.stop();
          callRef.current = null;
        } catch (error) {
          console.error('Error stopping call:', error);
        }
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [router, autoStart, autoReconnect, startInactivityTimer]);
  
  // Set up event listeners for VAPI client
  const setupEventListeners = useCallback(() => {
    const client = vapiClientRef.current;
    if (!client) return;
    
    // Keep track of whether we're in the greeting phase
    let isGreetingPhase = true;
    let messageCount = 0;
    
    client.on('speech-start', () => {
      console.log('Assistant started speaking');
      
      // Check and apply mute state on every speech event
      // This ensures greeting is properly muted if needed
      if (typeof window !== 'undefined' && callRef.current) {
        const shouldBeMuted = localStorage.getItem('agent_voice_muted') === 'true';
        if (shouldBeMuted) {
          console.log('Speech start detected - applying mute state');
          
          // Mute the call
          if (callRef.current && typeof callRef.current.mute === 'function') {
            try {
              try {
            callRef.current.mute();
          } catch (muteErr) {
            console.error('Error calling mute():', muteErr);
          }
              callRef.current.isMuted = true;
            } catch (err) {
              console.error('Error muting during speech start:', err);
            }
          }
          
          // Mute any audio elements
          setTimeout(() => {
            if (typeof document !== 'undefined') {
              const audioElements = document.querySelectorAll('audio');
              audioElements.forEach(audio => {
                audio.muted = true;
                try { audio.pause(); } catch (e) {}
              });
            }
          }, 50);
        }
      }
      
      setStatus(prev => ({
        ...prev,
        isSpeaking: true,
        statusMessage: 'Assistant is speaking...',
      }));
    });
    
    client.on('speech-end', () => {
      console.log('Assistant finished speaking');
      setStatus(prev => ({
        ...prev,
        isSpeaking: false,
        statusMessage: 'Assistant is listening...',
      }));
    });
    
    // Ensure we're using the right event name for call started
    client.on('call-start', () => {
      console.log('Call started');
      setStatus(prev => ({
        ...prev,
        isActive: true,
        statusMessage: 'Call active',
      }));
      
      // Apply stored mute state when call becomes active
      if (typeof window !== 'undefined' && callRef.current) {
        const storedMuteState = localStorage.getItem('agent_voice_muted') === 'true';
        if (storedMuteState && typeof callRef.current.mute === 'function') {
          console.log('Applying stored mute state (muted) to new call');
          try {
            callRef.current.mute();
          } catch (muteErr) {
            console.error('Error calling mute():', muteErr);
          }
          callRef.current.isMuted = true;
          
          // Update status to reflect muted state
          setStatus(prev => ({
            ...prev,
            statusMessage: 'Voice muted (from stored state)',
          }));
        }
      }
      
      // Reset inactivity tracking when call starts
      userInteractedRef.current = false;
      inactivityStageRef.current = 0;
      startInactivityTimer();
      console.log('Inactivity timer started on call start');
    });
    
    // Also listen for 'call-started' variant (for compatibility)
    client.on('call-started', () => {
      console.log('Call started (alternate event)');
      setStatus(prev => ({
        ...prev,
        isActive: true,
        statusMessage: 'Call active',
      }));
      
      // Reset inactivity tracking when call starts
      userInteractedRef.current = false;
      inactivityStageRef.current = 0;
      startInactivityTimer();
      console.log('Inactivity timer started on call-started event');
    });
    
    // Ensure we're using the right event name for user message
    client.on('user-message-start', () => {
      console.log('User started speaking');
      handleUserInteraction();
    });
    
    // Also listen for alternative event names for user speaking
    client.on('userMessageStarted', () => {
      console.log('User started speaking (alternate event)');
      handleUserInteraction();
    });
    
    client.on('user-speech-start', () => {
      console.log('User speech detected');
      handleUserInteraction();
    });
    
    client.on('call-end', (reason: any) => {
      console.log('Call ended with reason:', reason);
      
      // Check if this is a server disconnection that we should recover from
      const isServerDisconnection = 
        reason === 'server_disconnected' || 
        reason === 'meeting_ended' || 
        (typeof reason === 'object' && reason?.reason === 'meeting_ended');
      
      // Determine if we should attempt recovery
      const shouldRecover = maintainConversation && autoReconnect && isServerDisconnection;
      
      // Reset callRef regardless of reason
      if (callRef.current) {
        callRef.current = null;
        console.log('Reset callRef to null');
      }
      
      // Update status
      setStatus(prev => ({
        ...prev,
        isActive: false,
        isSpeaking: false,
        statusMessage: shouldRecover ? 'Connection lost - attempting to reconnect...' : 'Call ended',
      }));
      
      // Attempt to recover if necessary
      if (shouldRecover) {
        console.log('Attempting to recover from server disconnection...');
        setTimeout(() => {
          startConversation().catch(err => {
            console.error('Failed to recover from server disconnection:', err);
            setStatus(prev => ({
              ...prev,
              error: 'Failed to reconnect. Please try again manually.',
              statusMessage: 'Reconnection failed'
            }));
          });
        }, RECONNECT_DELAY); // Use the configured reconnect delay
      }
      
      // Additional debugging
      setTimeout(() => {
        console.log('State after call end:', {
          isActive: false,
          callRef: callRef.current,
          isSpeaking: false,
          shouldRecover
        });
      }, 0);
    });
    
    client.on('error', (error: Error) => {
      console.error('Call error:', error);
      
      // Check if the error is a "Meeting has ended" error
      const isMeetingEndedError = 
        (typeof error === 'object' && 
         error !== null && 
         ('errorMsg' in error) && 
         (error as any).errorMsg === 'Meeting has ended') ||
        (error.message && error.message.includes('Meeting has ended'));
      
      if (isMeetingEndedError) {
        console.log('Meeting was ended by the server, attempting to recover...');
        
        // Clean up the call reference
        callRef.current = null;
        
        setStatus(prev => ({
          ...prev,
          isActive: false,
          isSpeaking: false,
          isLoading: false,
          statusMessage: 'Connection lost - ready to reconnect',
          error: null // Clear error to allow for reconnection
        }));
        
        // Auto-reconnect after a delay if configured to do so
        if (maintainConversation && autoReconnect) {
          setTimeout(() => {
            if (!callRef.current) { // Double-check we're still disconnected
              console.log('Attempting to auto-reconnect after disconnection');
              startConversation().catch(err => {
                console.error('Failed to auto-reconnect:', err);
              });
            }
          }, RECONNECT_DELAY); // Use the configured reconnect delay
        }
      } else {
        // Handle other errors normally
        setStatus(prev => ({
          ...prev,
          error: `Error: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
          isActive: false,
          isSpeaking: false,
          isLoading: false,
          statusMessage: 'Error occurred',
        }));
      }
    });
    
    client.on('message', (message: any) => {
      console.log('Message from assistant:', message);
      
      // Track user interaction with each message
      handleUserInteraction();
      
      // Increment message count to track greeting phase
      messageCount++;
      
      // Consider the first 5 messages as part of the greeting phase
      if (messageCount <= 5) {
        console.log('Still in greeting phase, skipping function calls');
        return;
      }
      
      // End of greeting phase
      if (isGreetingPhase && messageCount > 5) {
        isGreetingPhase = false;
        console.log('Greeting phase complete, now processing function calls');
      }
      
      // Skip all message processing during greeting phase
      if (isGreetingPhase) {
        return;
      }
      
      // Only process function calls after greeting phase
      handleFunctionCalls(message);
    });
  }, [handleUserInteraction, startInactivityTimer]);
  
  // Central function to handle all function/tool calls
  const handleFunctionCalls = useCallback((message: any) => {
    // Check for function calls in different formats
    if (message.role === 'assistant' && message.function_call) {
      console.log('Function call detected (standard format):', message.function_call);
      processToolCall(message.function_call);
    }
    
    // Check for tool calls
    if (message.type === 'tool-calls' && message.toolCalls && message.toolCalls.length > 0) {
      console.log('Tool calls detected:', message.toolCalls);
      message.toolCalls.forEach((toolCall: any) => {
        processToolCall(toolCall);
      });
    }
    
    // Check for function call in the content
    if (message.role === 'assistant' && typeof message.content === 'object' && message.content?.function_call) {
      console.log('Function call detected (in content):', message.content.function_call);
      processToolCall(message.content.function_call);
    }
  }, []);
  
  // Process a single tool/function call using the ToolManager
  const processToolCall = useCallback((functionCall: any) => {
    try {
      // Update the router in the context for every call
      toolManager.setContext({ 
        router, 
        status, // Use status instead of setStatus
        isHomePage,
        // Add additional data that might be useful for tools
        currentPage: typeof window !== 'undefined' ? window.location.pathname : '/'
      });
      
      // Extract function name and arguments
      const fnName = functionCall.name || functionCall.function?.name;
      const argumentsRaw = functionCall.arguments || functionCall.function?.arguments;
      
      console.log(`Processing tool call: ${fnName}`);
      
      // Parse arguments if needed
      let args;
      if (typeof argumentsRaw === 'string') {
        try {
          args = JSON.parse(argumentsRaw);
          console.log('Parsed string arguments into object:', args);
        } catch (parseError) {
          console.error('Error parsing function arguments string:', parseError);
          args = argumentsRaw; // Use the raw string if parsing fails
        }
      } else {
        args = argumentsRaw;
      }
      
      // Use the ToolManager to handle the tool call
      toolManager.handleToolCall({
        name: fnName,
        arguments: args
      }).catch(error => {
        console.error(`Error handling tool call for ${fnName}:`, error);
      });
    } catch (error) {
      console.error('Error processing function call:', error);
    }
  }, [router, isHomePage, status]);
  
  // Start conversation with dynamic assistant
  const startConversation = useCallback(async (retryCount = 0) => {
    // Use callRef to determine if a call is already in progress
    if (callRef.current) {
      console.log('Call already in progress (callRef exists)');
      return;
    }
    
    // Track conversation start attempt
    import('../../utils/Analytics').then(({ default: Analytics }) => {
      import('../../utils/Config').then(({ default: Config }) => {
        if (Config.analytics.isEnabled && Config.analytics.trackAgentInteractions) {
          Analytics.trackAgentInteraction('start_conversation', retryCount > 0 ? `retry_${retryCount}` : 'first_attempt');
        }
      });
    });
    
    // Double-check and reset state if necessary
    if (status.isActive) {
      console.log('Warning: isActive is true but callRef is null, resetting state');
      setStatus(prev => ({ ...prev, isActive: false }));
    }

    try {
      console.log('🚀 DynamicAgent: Starting conversation...');
      setStatus(prev => ({
        ...prev,
        isLoading: true,
        statusMessage: retryCount > 0 ? `Retrying connection (${retryCount}/${MAX_RETRIES})...` : 'Starting conversation...',
        error: null,
      }));
      
      if (!vapiClientRef.current) {
        console.log('🚀 DynamicAgent: VAPI client not initialized, attempting to initialize');
        try {
          // Attempt to initialize VAPI client
          const vapiModule = await import('@vapi-ai/web');
          console.log('🚀 DynamicAgent: VAPI module loaded:', Object.keys(vapiModule));
          
          // Try both ways to initialize the client
          try {
            // @ts-ignore - Try constructor first
            vapiClientRef.current = new vapiModule.default(VAPI_API_KEY);
            console.log('🚀 DynamicAgent: Client initialized with constructor');
          } catch (constructorError) {
            console.log('🚀 DynamicAgent: Constructor failed, trying function call', constructorError);
            // @ts-ignore - Try function call if constructor fails
            vapiClientRef.current = vapiModule.default(VAPI_API_KEY);
            console.log('🚀 DynamicAgent: Client initialized with function call');
          }
          
          setupEventListeners();
        } catch (initError) {
          console.error('🚀 DynamicAgent: Failed to initialize VAPI client:', initError);
          throw new Error(`Failed to initialize VAPI client: ${initError instanceof Error ? initError.message : 'Unknown error'}`);
        }
      }

      // Check browser support for microphone
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support microphone access');
      }

      // Request microphone permission
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('Microphone permission granted');
      } catch (micError) {
        console.warn('Microphone access denied:', micError);
        // Set a user-friendly error message instead of throwing an error
        setStatus(prev => ({
          ...prev,
          error: 'Voice features disabled. Click to enable microphone access.',
          isActive: false,
          isLoading: false,
          statusMessage: 'Microphone access required for voice interaction'
        }));
        // Don't throw, return early to allow UI to continue working in text-only mode
        return;
      }

      // Create assistant configuration - use site data
      const assistantConfig = {
        firstMessage: (() => {
          // Get prompt templates with site data context
          const { FIRST_MESSAGE, getWelcomeVariation } = initPromptTemplates(config.siteData, config.webAgentInfo);
          
          if (typeof window !== 'undefined') {
            const hasVisitedBefore = localStorage.getItem('has_visited_before') === 'true';
            
            // Always set the flag for future visits
            if (!hasVisitedBefore) {
              localStorage.setItem('has_visited_before', 'true');
              // First time visitor gets the standard greeting
              return config.webAgentInfo.greeting || FIRST_MESSAGE;
            } else {
              // For returning visitors, always use a random greeting variation
              // This ensures variety even on page refreshes
              return getWelcomeVariation();
            }
          }
          return config.webAgentInfo.greeting || FIRST_MESSAGE;
        })(),
        voice: {
          provider: 'vapi',
          voiceId: 'Neha',
        },
        transcriber: {
          provider: 'deepgram',
          model: 'nova-2',
        },
        model: {
          provider: 'openai',
          model: 'gpt-4',
          temperature: 0.7,
          systemPrompt: (() => {
            const { createSystemPrompt } = initPromptTemplates(config.siteData, config.webAgentInfo);
            return createSystemPrompt(isHomePage);
          })(),
          tools: toolManager.getToolDefinitions().map(toolDef => {
            // Special handling for transfer_call tool (needed for VAPI to recognize it properly)
            if (toolDef && typeof toolDef === 'object' && toolDef.function && 
                toolDef.function.name === 'transfer_call') {
              const transferCallTool = {
                type: "transferCall",
                destinations: [
                  {
                    type: "number",
                    number: "+19714022481", // Support number
                    description: "Support Department"
                  },
                  {
                    type: "number",
                    number: "+919821120065", // Sales number
                    description: "Sales Department"
                  }
                ]
              };
              console.log('Found transfer_call tool, applying special formatting:', JSON.stringify(transferCallTool, null, 2));
              return transferCallTool;
            }
            
            // Handle other tools with different structures
            if (toolDef && typeof toolDef === 'object') {
              if ('function' in toolDef) {
                // For tools that have function property
                const functionDef = toolDef.function;
                if (functionDef && typeof functionDef === 'object' && 'type' in functionDef) {
                  // If function has a type property, we need to remove it
                  const { type, ...functionProps } = functionDef;
                  return {
                    type: 'function',
                    function: functionProps
                  };
                } else {
                  // Function doesn't have a type property
                  return {
                    type: 'function',
                    function: functionDef
                  };
                }
              } else {
                // Direct tool definition without .function nesting
                return {
                  type: 'function',
                  function: toolDef
                };
              }
            } else {
              // Fallback for any unexpected format
              console.error('Invalid tool definition format:', toolDef);
              return null;
            }
          }).filter(Boolean), // Remove any null entries
        }
      };

      // Log configuration for debugging
      console.log('Starting call with configuration:', JSON.stringify(assistantConfig, null, 2));
      console.log('VAPI API Key:', VAPI_API_KEY.substring(0, 5) + '****' + VAPI_API_KEY.substring(VAPI_API_KEY.length - 4));

      try {
        // Mark the agent as active to persist through navigation
        setAgentActive();
        
        // Start the call with explicit error handling
        console.log('Attempting to start VAPI call...');
        
        const call = await vapiClientRef.current.start(assistantConfig);

        callRef.current = call;
        console.log('Call initialized successfully:', call);
        
        // Apply mute state from localStorage if needed
        if (typeof window !== 'undefined') {
          const shouldBeMuted = localStorage.getItem('agent_voice_muted') === 'true';
          if (shouldBeMuted && call && typeof call.mute === 'function') {
            console.log('Applying muted state from localStorage');
            call.mute();
            call.isMuted = true;
          }
        }
      } catch (apiError: any) {
        console.error('VAPI API Error:', apiError);
        
        // Check for concurrency limit error
        const isConcurrencyError = 
          apiError.message === "Over Concurrency Limit." || 
          (apiError.response && apiError.response.data && 
           apiError.response.data.message === "Over Concurrency Limit.");
        
        if (isConcurrencyError && retryCount < MAX_RETRIES) {
          // Calculate exponential backoff delay
          const retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
          console.log(`Concurrency limit reached. Retrying in ${retryDelay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
          
          setStatus(prev => ({
            ...prev,
            error: "Concurrency limit reached. Retrying soon...",
            isLoading: true,
            statusMessage: `Waiting to retry (${retryCount + 1}/${MAX_RETRIES})...`
          }));
          
          // Schedule retry with exponential backoff
          setTimeout(() => {
            console.log(`Executing retry attempt ${retryCount + 1}`);
            startConversation(retryCount + 1);
          }, retryDelay);
          
          return; // Exit early to avoid setting error state
        }
        
        // Extract more detailed error information for non-concurrency errors
        let errorMessage = 'Failed to start conversation';
        
        if (apiError.response) {
          console.error('Error response:', apiError.response);
          errorMessage = `API Error: ${apiError.response.status} - ${apiError.response.statusText || 'Unknown error'}`;
          
          // Try to extract JSON error details if available
          try {
            const errorData = apiError.response.data || apiError.response.error;
            if (errorData) {
              console.error('Error data:', errorData);
              errorMessage = `API Error: ${JSON.stringify(errorData)}`;
            }
          } catch (e) {
            console.error('Could not parse error response:', e);
          }
        } else if (apiError.request) {
          errorMessage = 'No response received from server';
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }
        
        setStatus(prev => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
          statusMessage: 'Error creating assistant',
        }));
        throw new Error(errorMessage);
      }
        
    } catch (error: any) {
      // Track error
      import('../../utils/Analytics').then(({ default: Analytics }) => {
        import('../../utils/Config').then(({ default: Config }) => {
          if (Config.analytics.isEnabled && Config.analytics.trackAgentInteractions) {
            Analytics.trackAgentInteraction('conversation_error', error.message || 'unknown_error');
          }
        });
      });
      
      // Only set error state if not retrying for concurrency
      if (!(error.message && error.message.includes("Concurrency") && retryCount < MAX_RETRIES)) {
        console.error('Failed to start conversation:', error);
        setStatus(prev => ({
          ...prev,
          error: `Error: ${error.message}`,
          isLoading: false,
          statusMessage: 'Error starting conversation',
        }));
      }
    }
  }, [isHomePage, modelName, voiceId, setupEventListeners, status.isActive]);
  
  // Stop conversation
  const stopConversation = useCallback(() => {
    if (callRef.current) {
      try {
        // Track conversation stop
        import('../../utils/Analytics').then(({ default: Analytics }) => {
          import('../../utils/Config').then(({ default: Config }) => {
            if (Config.analytics.isEnabled && Config.analytics.trackAgentInteractions) {
              Analytics.trackAgentInteraction('stop_conversation');
            }
          });
        });
        
        // Check if we should maintain the conversation
        const maintainConversation = process.env.NEXT_PUBLIC_MAINTAIN_CONVERSATION === 'true';
        
        if (maintainConversation) {
          // Instead of stopping the call completely, we'll just pause it
          // This will keep the conversation alive but stop listening
          if (callRef.current.pauseRecording) {
            callRef.current.pauseRecording();
            console.log('Call paused but maintained');
          } else if (callRef.current.pause) {
            callRef.current.pause();
            console.log('Call paused but maintained');
          } else {
            console.log('No pause method available, microphone will stay active');
          }
          
          // Important: We don't set callRef.current to null so the conversation stays alive
          
          setStatus(prev => ({
            ...prev,
            isActive: false,  // UI shows inactive state
            isSpeaking: false,
            statusMessage: 'Microphone paused - conversation maintained',
          }));
        } else {
          // Traditional stop behavior - completely end the call
          callRef.current.stop();
          callRef.current = null;
          
          setStatus(prev => ({
            ...prev,
            isActive: false,
            isSpeaking: false,
            statusMessage: 'Call ended',
          }));
          
          console.log('Call completely ended (not maintained)');
        }
      } catch (error) {
        console.error('Error managing call:', error);
        
        // Ensure we clean up the reference in case of error
        callRef.current = null;
        
        setStatus(prev => ({
          ...prev,
          isActive: false,
          isSpeaking: false,
          statusMessage: 'Call ended due to error',
          error: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        }));
      }
    } else {
      // No active call, just update the UI
      setStatus(prev => ({
        ...prev,
        isActive: false,
        isSpeaking: false,
        statusMessage: 'No active call to stop',
      }));
    }
  }, []);
  
  // Send message to assistant
  const sendMessage = useCallback(async (message: string) => {
    // If no active call, start one first
    if (!callRef.current) {
      console.log('No active call, starting conversation first');
      await startConversation(0);
      
      // Wait a bit for the call to initialize
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // If still no call, abort
      if (!callRef.current) {
        console.error('Failed to start call for sending message');
        return;
      }
    }
    
    // Special handling for resume_speaking message to avoid showing errors in UI
    if (message === '__resume_speaking__') {
      try {
        await callRef.current.send(message);
        console.log('Resume speaking message sent successfully');
      } catch (resumeErr) {
        console.error('Error sending resume message (suppressed from UI):', resumeErr);
        // Don't update error status for this specific message type
      }
      return; // Return early - don't update any error status
    }
    
    // For regular messages
    try {
      await callRef.current.send(message);
      console.log('Message sent to dynamic assistant:', message);
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus(prev => ({
        ...prev,
        error: `Error sending message: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }));
    }
  }, [startConversation]);
  
  // Initialize any active call with the mute state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && callRef.current) {
      const storedMuteState = localStorage.getItem('agent_voice_muted') === 'true';
      
      // Apply the stored mute state to the call
      if (storedMuteState && typeof callRef.current.mute === 'function') {
        console.log('Applying stored mute state (muted) to active call');
        try {
            callRef.current.mute();
          } catch (muteErr) {
            console.error('Error calling mute():', muteErr);
          }
        callRef.current.isMuted = true;
      } else if (!storedMuteState && typeof callRef.current.unmute === 'function') {
        console.log('Applying stored mute state (unmuted) to active call');
        try {
            callRef.current.unmute();
          } catch (unmuteErr) {
            console.error('Error calling unmute():', unmuteErr);
          }
        callRef.current.isMuted = false;
      }
      
      // Update the status message
      setStatus(prev => ({
        ...prev,
        statusMessage: storedMuteState ? 'Voice muted (from stored state)' : prev.statusMessage
      }));
    }
  }, [callRef.current]);
  
  // Toggle voice mute
  const toggleVoiceMute = useCallback((shouldMute?: boolean) => {
    try {
      if (!callRef.current) {
        console.log('No active call to mute/unmute');
        return false;
      }
      
      // Get current state from localStorage or fallback to call state
      const currentMuteState = typeof window !== 'undefined' ? 
        localStorage.getItem('agent_voice_muted') === 'true' : 
        callRef.current.isMuted || false;
      
      // If shouldMute is provided, use it; otherwise toggle the current state
      const mute = typeof shouldMute !== 'undefined' ? shouldMute : !currentMuteState;
      
      // Store the state in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('agent_voice_muted', String(mute));
        console.log(`DynamicAgent: Updated localStorage mute state to: ${mute}`);
      }
      
      // Update the mute state on the call object
      callRef.current.isMuted = mute;
      
      // Try to use the VAPI mute function if available
      if (callRef.current && typeof callRef.current.mute === 'function') {
        if (mute) {
          try {
            callRef.current.mute();
          } catch (muteErr) {
            console.error('Error calling mute():', muteErr);
          }
        } else {
          try {
            callRef.current.unmute();
          } catch (unmuteErr) {
            console.error('Error calling unmute():', unmuteErr);
          }
          
          // Also send a silent message to trigger an audio response
          if (typeof callRef.current.send === 'function') {
            try {
              // Sending a special message that tells the assistant to resume speaking
              setTimeout(() => {
                callRef.current.send('__resume_speaking__');
                console.log('Sent resume speaking message to restart audio');
              }, 500);
            } catch (sendError) {
              console.error('Error sending resume message:', sendError);
            }
          }
        }
        console.log(`Voice ${mute ? 'muted' : 'unmuted'} using VAPI's built-in function`);
      } else {
        // Fallback approach - handle audio output by intercepting the audio elements
        if (typeof document !== 'undefined') {
          // Get all audio elements and handle them
          const audioElements = Array.from(document.querySelectorAll('audio'));
          
          if (mute) {
            // Mute all audio elements
            audioElements.forEach(audio => {
              audio.muted = true;
              audio.pause();
              console.log('Audio element muted and paused');
            });
          } else {
            // Unmute all audio elements and restart playback
            audioElements.forEach(audio => {
              audio.muted = false;
              
              // Try to restart playback
              const playPromise = audio.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => console.log('Audio playback successfully restarted'))
                  .catch(err => console.error('Error restarting audio playback:', err));
              }
              
              console.log('Audio element unmuted and resumed');
            });
            
            // Also send a silent message to trigger a new audio response
            if (typeof callRef.current.send === 'function') {
              try {
                // Sending a special message that won't display to the user
                setTimeout(() => {
                  callRef.current.send('__resume_speaking__');
                  console.log('Sent resume speaking message to restart audio');
                }, 500);
              } catch (sendError) {
                console.error('Error sending resume message:', sendError);
              }
            }
          }
          
          // Add a listener for any new audio elements that might be created
          const audioElementObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
              if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                  const node = mutation.addedNodes[i];
                  if (node.nodeName && node.nodeName.toLowerCase() === 'audio') {
                    const audio = node as HTMLAudioElement;
                    audio.muted = mute;
                    if (mute) {
                      audio.pause();
                    } else {
                      audio.play().catch(err => console.error('Error playing new audio:', err));
                    }
                    console.log(`New audio element ${mute ? 'muted' : 'unmuted'}`);
                  }
                }
              }
            });
          });
          
          // Start observing the document for added audio elements
          audioElementObserver.observe(document.body, { childList: true, subtree: true });
          
          // Stop observing after 10 seconds to avoid memory leaks
          setTimeout(() => {
            audioElementObserver.disconnect();
            console.log('Audio element observer disconnected');
          }, 10000);
          
          console.log(`Voice ${mute ? 'muted' : 'unmuted'} using audio element control`);
        }
      }
      
      return mute;
    } catch (error) {
      console.error('Error toggling voice mute:', error);
      return false;
    }
  }, []);

  // Listen for mute change events from other components or localStorage changes
  useEffect(() => {
    const handleMuteChange = (e: StorageEvent) => {
      if (e.key === 'agent_voice_muted') {
        const newMuteState = e.newValue === 'true';
        console.log(`DynamicAgent: Detected localStorage mute change to: ${newMuteState}`);
        toggleVoiceMute(newMuteState);
      }
    };
    
    const handleMuteEvent = (e: CustomEvent) => {
      const newMuteState = (e as CustomEvent<boolean>).detail;
      console.log(`DynamicAgent: Received mute event with state: ${newMuteState}`);
      toggleVoiceMute(newMuteState);
    };
    
    window.addEventListener('storage', handleMuteChange);
    window.addEventListener('agent-mute-change', handleMuteEvent as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleMuteChange);
      window.removeEventListener('agent-mute-change', handleMuteEvent as EventListener);
    };
  }, [toggleVoiceMute]);
  
  // Create actions object
  const actions: WebAgentActions = {
    startConversation,
    stopConversation,
    sendMessage,
    toggleVoiceMute,
  };
  
  // Track messages for context
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Add message handler to track messages
  useEffect(() => {
    const client = vapiClientRef.current;
    if (!client) return;
    
    const messageHandler = (message: Message) => {
      setMessages(prev => [...prev, message]);
    };
    
    client.on('message', messageHandler);
    
    return () => {
      // Remove event listener on cleanup
      client.off('message', messageHandler);
    };
  }, [vapiClientRef.current]);
  
  // Handle TTS audio playback updates
  const handleAudioPlaybackStateChange = (isPlaying: boolean) => {
    setStatus(prev => ({
      ...prev,
      isSpeaking: isPlaying,
      statusMessage: isPlaying ? 'Speaking' : 'Idle'
    }));
    
    // Emit speaking events for talking animation
    if (isPlaying) {
      window.dispatchEvent(new CustomEvent('anaya-speaking-start'));
      window.postMessage({ type: 'anaya-speaking', speaking: true }, '*');
    } else {
      window.dispatchEvent(new CustomEvent('anaya-speaking-end'));
      window.postMessage({ type: 'anaya-speaking', speaking: false }, '*');
    }
  };
  
  console.log('Notice: Tools are configured directly in DynamicAgent. This may need to be updated to match new VAPI format.');
  
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      return localStorage.getItem('agent_voice_muted') === 'true';
    }
    return false;
  });

  // Initialize mute state from localStorage when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Sync mute state from localStorage
      const storedMutedState = localStorage.getItem('agent_voice_muted') === 'true';
      if (storedMutedState) {
        setStatus(prev => ({
          ...prev,
          // Update status to reflect muted state
          statusMessage: storedMutedState ? 'Voice muted' : 'Ready to listen',
        }));
      }
      
      // Listen for storage events to sync across tabs/pages
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'agent_voice_muted') {
          const newMuteState = e.newValue === 'true';
          console.log('Syncing mute state from storage change:', newMuteState);
          
          // Apply mute state if we have an active call
          if (callRef.current && typeof callRef.current.mute === 'function') {
            if (newMuteState) {
              try {
            callRef.current.mute();
          } catch (muteErr) {
            console.error('Error calling mute():', muteErr);
          }
            } else {
              try {
            callRef.current.unmute();
          } catch (unmuteErr) {
            console.error('Error calling unmute():', unmuteErr);
          }
            }
          }
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);
  
  // Utility function to immediately apply current mute state
  // This can be called from multiple places to ensure mute state is always applied
  const applyCurrentMuteState = () => {
    if (typeof window !== 'undefined' && callRef.current) {
      const shouldBeMuted = localStorage.getItem('agent_voice_muted') === 'true';
      if (shouldBeMuted) {
        console.log('MUTE CHECK: Applying mute state to active call');
        
        // Apply to call object
        if (callRef.current && typeof callRef.current.mute === 'function') {
          try {
            try {
            callRef.current.mute();
          } catch (muteErr) {
            console.error('Error calling mute():', muteErr);
          }
            callRef.current.isMuted = true;
          } catch (err) {
            console.error('Error applying mute to call:', err);
          }
        }
        
        // Apply to audio elements with delay for better capture
        setTimeout(() => {
          if (typeof document !== 'undefined') {
            const audioElements = document.querySelectorAll('audio');
            if (audioElements.length > 0) {
              console.log(`MUTE CHECK: Muting ${audioElements.length} audio elements`);
              audioElements.forEach(audio => {
                try {
                  audio.muted = true;
                  audio.pause();
                } catch (err) {
                  console.error('Error muting audio element:', err);
                }
              });
            }
          }
        }, 100);
      }
    }
  };
  
  return (
    <WebAgentContext.Provider value={{
      status,
      actions,
      messages: [],
      mode: 'dynamic',
      setMode: () => {},
      usePreCreatedAssistant,
      setUsePreCreatedAssistant: () => {},
      isAlwaysLive: config.agent.alwaysLive,
    }}>
      {children}
    </WebAgentContext.Provider>
  );
};

export default DynamicAgent; 