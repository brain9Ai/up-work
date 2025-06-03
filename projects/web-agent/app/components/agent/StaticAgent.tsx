'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { WebAgentContext, WebAgentStatus, WebAgentActions, Message, WebAgentContextType } from './WebAgent';
import toolManager from './ToolManager';
import { initPromptTemplates } from './templates/promptTemplates';
import currentSessionId, { initSession, clearSession } from './SessionManager';
import { useAgentContext } from './AgentContext';

// Interface for component props
export interface StaticAgentProps {
  children?: React.ReactNode;
  isHomePage?: boolean;
  autoStart?: boolean;
  usePreCreatedAssistant?: boolean;
}

/**
 * StaticAgent Component
 * 
 * This component uses a pre-defined assistant ID from VAPI and can be configured
 * to maintain an always-live experience with automatic reconnection
 */
const StaticAgent: React.FC<StaticAgentProps> = ({ 
  children, 
  isHomePage = false,
  autoStart,
  usePreCreatedAssistant = true,
}) => {
  const router = useRouter();
  const config = useAgentContext();
  
  // Get configuration from context
  const VAPI_API_KEY = config.api.vapiKey;
  const VAPI_ASSISTANT_ID = config.api.vapiAssistantId;
  const ALWAYS_LIVE = config.agent.alwaysLive;
  const MAX_RETRIES = 3;
  const INITIAL_RETRY_DELAY = 2000; // 2 seconds
  const KEEP_ALIVE_INTERVAL = config.agent.keepAliveInterval;
  const RECONNECT_DELAY = config.agent.reconnectDelay;
  const INACTIVITY_TIMEOUT = config.agent.inactivityTimeout;
  
  console.log('StaticAgent rendering with:');
  console.log(`- isHomePage: ${isHomePage}`);
  console.log(`- autoStart: ${autoStart}`);
  console.log(`- usePreCreatedAssistant: ${usePreCreatedAssistant}`);
  console.log(`- ALWAYS_LIVE: ${ALWAYS_LIVE}`);
  console.log(`- VAPI_ASSISTANT_ID: ${VAPI_ASSISTANT_ID}`);
  
  // Configuration
  const maintainConversation = typeof window !== 'undefined' && (config.agent.maintainConversation || ALWAYS_LIVE);
  const autoReconnect = typeof window !== 'undefined' && (config.agent.autoReconnect || ALWAYS_LIVE);
  
  // Log timeout values for easier debugging
  console.log(`StaticAgent timeout values:`);
  console.log(`- KEEP_ALIVE_INTERVAL: ${KEEP_ALIVE_INTERVAL}ms (${KEEP_ALIVE_INTERVAL/60000} minutes)`);
  console.log(`- INACTIVITY_TIMEOUT: ${INACTIVITY_TIMEOUT}ms (${INACTIVITY_TIMEOUT/60000} minutes)`);
  
  // State
  const [status, setStatus] = useState<WebAgentStatus>({
    isInitialized: false,
    isActive: false,
    isSpeaking: false,
    isLoading: true,
    error: null,
    statusMessage: 'Initializing...'
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [mode, setMode] = useState<string>('static');
  const [usePreCreated, setUsePreCreated] = useState<boolean>(usePreCreatedAssistant);
  
  // Refs
  const vapiClientRef = useRef<any>(null);
  const callRef = useRef<any>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize session on component mount
  useEffect(() => {
    initSession();
    
    const initVapi = async () => {
      try {
        setStatus(prev => ({
          ...prev,
          isLoading: true,
          statusMessage: 'Connecting...'
        }));
        
        // Dynamically import VAPI module
        const vapiModule = await import('@vapi-ai/web');
        console.log('VAPI module loaded for Static Agent');
        
        // Initialize the client
        // @ts-ignore - Type definitions might be incomplete
        vapiClientRef.current = new vapiModule.default(VAPI_API_KEY);
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize ToolManager with router context
        toolManager.setContext({ 
          router, 
          siteData: config.siteData,
          webAgentInfo: config.webAgentInfo,
          navigation: config.navigation.paths,
          currentPage: typeof window !== 'undefined' ? window.location.pathname : '/',
        });
        
        setStatus(prev => ({
          ...prev,
          isInitialized: true,
          isLoading: false,
          statusMessage: 'Ready'
        }));
        
        console.log('Static agent initialized successfully');
        
        // Auto-start if configured - use a longer delay in always-live mode for better initialization
        if (autoStart) {
          const startDelay = ALWAYS_LIVE ? 1500 : 1000;
          console.log(`Auto-starting conversation in ${startDelay}ms`);
          setTimeout(() => {
            startConversation();
          }, startDelay);
        }
        
      } catch (error) {
        console.error('Static agent initialization error:', error);
        setStatus(prev => ({
          ...prev,
          isLoading: false,
          error: `Initialization error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          statusMessage: 'Error'
        }));
      }
    };
    
    initVapi();
    
    // Set up a keep-alive mechanism with less frequent pings to reduce reinitializations
    let keepAliveInterval: NodeJS.Timeout | null = null;
    
    if (autoReconnect) {
      // Use a longer interval to reduce server load and prevent disconnections
      keepAliveInterval = setInterval(() => {
        if (callRef.current) {
          // If we have an active call, send a silent ping to keep it alive
          try {
            // For VAPI, use a method that doesn't trigger user-visible actions
            if (typeof callRef.current.ping === 'function') {
              callRef.current.ping();
              console.log('Keep-alive ping sent');
            } else {
              // If no ping method, send a silent message that won't be processed by the assistant
              callRef.current.send('__silent_ping__');
              console.log('Silent ping message sent');
            }
            
            // Reset inactivity timer whenever we successfully ping
            if (inactivityTimerRef.current) {
              clearTimeout(inactivityTimerRef.current);
            }
            
            // Set new inactivity timer
            inactivityTimerRef.current = setTimeout(() => {
              console.log(`No activity for ${INACTIVITY_TIMEOUT/60000} minutes, refreshing connection silently`);
              // Instead of full reinitialization, try to silently refresh the connection
              try {
                if (callRef.current) {
                  callRef.current.send('__silent__waiting_for_user_input');
                }
              } catch (err) {
                console.warn('Failed to send silent refresh, will attempt reconnection:', err);
                // Only restart if absolutely necessary
                if (!callRef.current || status.error) {
                  startConversation().catch(e => console.error('Failed to reconnect after inactivity:', e));
                }
              }
            }, INACTIVITY_TIMEOUT);
            
          } catch (error) {
            console.error('Keep-alive ping failed:', error);
            
            // Don't immediately try to reconnect - wait to see if it recovers naturally
            // This prevents aggressive reconnection loops
            if (ALWAYS_LIVE && !status.isActive && !status.isLoading) {
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
        } else if (ALWAYS_LIVE && !status.isActive && !status.isLoading) {
          // In always-live mode, if we don't have an active call, try to start one
          // But only if we're not already trying to connect and not already active
          console.log('No active call in always-live mode, attempting to start one');
          startConversation().catch(err => {
            console.error('Failed to start conversation in always-live mode:', err);
          });
        }
      }, KEEP_ALIVE_INTERVAL);
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
  }, [router, autoStart, autoReconnect, status.isLoading]);
  
  // Set up event listeners for VAPI client
  const setupEventListeners = useCallback(() => {
    const client = vapiClientRef.current;
    if (!client) return;
    
    client.on('speech-start', () => {
      console.log('Assistant started speaking');
      setStatus(prev => ({
        ...prev,
        isSpeaking: true,
        statusMessage: 'Speaking'
      }));
      
      // Emit speaking start event for talking animation
      window.dispatchEvent(new CustomEvent('anaya-speaking-start'));
      window.postMessage({ type: 'anaya-speaking', speaking: true }, '*');
    });
    
    client.on('speech-end', () => {
      console.log('Assistant stopped speaking');
      setStatus(prev => ({
        ...prev,
        isSpeaking: false,
        statusMessage: 'Listening'
      }));
      
      // Emit speaking end event for talking animation
      window.dispatchEvent(new CustomEvent('anaya-speaking-end'));
      window.postMessage({ type: 'anaya-speaking', speaking: false }, '*');
    });
    
    client.on('call-start', () => {
      console.log('Call started with static assistant');
      setStatus(prev => ({
        ...prev,
        isActive: true,
        statusMessage: 'Listening'
      }));
    });
    
    client.on('call-end', (reason: any) => {
      console.log('Call ended with reason:', reason);
      
      // Check if this is a server disconnection that we should recover from
      const isServerDisconnection = 
        reason === 'server_disconnected' || 
        reason === 'meeting_ended' || 
        (typeof reason === 'object' && reason?.reason === 'meeting_ended');
      
      // Determine if we should attempt recovery (always attempt in always-live mode)
      const shouldRecover = (maintainConversation && autoReconnect && isServerDisconnection) || ALWAYS_LIVE;
      
      // Reset callRef
      if (callRef.current) {
        callRef.current = null;
      }
      
      // Update status
      setStatus(prev => ({
        ...prev,
        isActive: false,
        statusMessage: 'Idle'
      }));
      
      // Attempt to recover if necessary, but with a longer delay to prevent rapid reconnection attempts
      if (shouldRecover) {
        console.log('Attempting to recover from server disconnection...');
        
        setTimeout(() => {
          // Check if we still need to reconnect
          if (!callRef.current) {
            console.log('Attempting reconnection after disconnection');
            startConversation().catch(err => {
              console.error('Failed to recover from server disconnection:', err);
              setStatus(prev => ({
                ...prev,
                error: `Reconnection error: ${err instanceof Error ? err.message : 'Unknown error'}`,
                statusMessage: 'Error'
              }));
              
              // In always-live mode, try again but with a much longer delay
              if (ALWAYS_LIVE) {
                console.log('Always-live mode: scheduling another reconnection attempt with longer delay');
                setTimeout(() => {
                  if (!callRef.current) {
                    startConversation().catch(e => {
                      console.error('Second reconnection attempt failed:', e);
                    });
                  }
                }, RECONNECT_DELAY * 4); // Use a 4x longer delay for second attempt
              }
            });
          }
        }, RECONNECT_DELAY);
      }
    });
    
    client.on('error', (err: Error) => {
      console.error('Call error:', err);
      
      // Check if the error is a "Meeting has ended" error
      const isMeetingEndedError = 
        (typeof err === 'object' && 
         err !== null && 
         ('errorMsg' in err) && 
         (err as any).errorMsg === 'Meeting has ended') ||
        (err.message && err.message.includes('Meeting has ended'));
      
      if (isMeetingEndedError || ALWAYS_LIVE) {
        console.log('Meeting was ended by the server or error in always-live mode, attempting to recover...');
        
        // Clean up the call reference
        callRef.current = null;
        
        setStatus(prev => ({
          ...prev,
          isActive: false,
          statusMessage: 'Idle'
        }));
        
        // Auto-reconnect after a delay if configured to do so
        if (maintainConversation && autoReconnect || ALWAYS_LIVE) {
          const reconnectDelay = ALWAYS_LIVE ? 2000 : 5000;
          
          setTimeout(() => {
            if (!callRef.current) { // Double-check we're still disconnected
              console.log('Attempting to auto-reconnect after disconnection');
              startConversation().catch(err => {
                console.error('Failed to auto-reconnect:', err);
                
                // In always-live mode, keep trying to reconnect
                if (ALWAYS_LIVE) {
                  setTimeout(() => {
                    startConversation().catch(e => {
                      console.error('Second reconnection attempt failed:', e);
                    });
                  }, 5000);
                }
              });
            }
          }, reconnectDelay);
        }
      } else {
        // Handle other errors normally
        setStatus(prev => ({
          ...prev,
          error: `Call error: ${err instanceof Error ? err.message : 'Unknown error'}`,
          statusMessage: 'Error'
        }));
      }
    });
    
    client.on('message', (message: Message) => {
      console.log('Message received from static assistant:', message);
      
      // Add message to state
      setMessages(prev => [...prev, message]);
      
      // Handle function calls
      if (message.role === 'assistant' && message.function_call) {
        // Use the ToolManager to handle tool calls
        toolManager.setContext({ 
          router, 
          status,
          isHomePage,
          currentPage: typeof window !== 'undefined' ? window.location.pathname : '/'
        });
        
        let args = message.function_call.arguments;
        if (typeof args === 'string') {
          try {
            args = JSON.parse(args);
          } catch (err) {
            console.error('Failed to parse function arguments:', err);
            // Use the string as-is if parsing fails
          }
        }
        
        toolManager.handleToolCall({
          name: message.function_call.name,
          arguments: args
        }).catch(error => {
          console.error('Error handling tool call:', error);
        });
      }
      
      // Fallback content-based navigation using site data
      if (message.role === 'assistant' && message.content) {
        const content = message.content.toLowerCase();
        
        // Use navigation data from config context
        const navLinks = config.siteData.navigation?.mainLinks || [];
        let matchedLink = null;
        
        for (const link of navLinks) {
          const linkName = link.name.toLowerCase();
          if (
            content.includes(`${linkName} page`) || 
            (content.includes(linkName) && content.includes('page'))
          ) {
            matchedLink = link;
            break;
          }
        }
        
        if (matchedLink) {
          console.log(`Content-based navigation to: ${matchedLink.path}`);
          setTimeout(() => router.push(matchedLink.path), 1500);
        }
      }
    });
  }, [router, maintainConversation, autoReconnect]);
  
  // Start conversation with static assistant
  const startConversation = useCallback(async (retryCount = 0) => {
    // Use callRef to determine if a call is already in progress
    if (callRef.current) {
      console.log('Call already in progress (callRef exists)');
      return;
    }
    
    try {
      setStatus(prev => ({
        ...prev,
        isLoading: true,
        statusMessage: retryCount > 0 ? `Retrying connection (${retryCount}/${MAX_RETRIES})...` : 'Connecting...'
      }));
      
      if (!vapiClientRef.current) {
        console.error('VAPI client not initialized, attempting to initialize');
        try {
          // Attempt to initialize VAPI client
          const vapiModule = await import('@vapi-ai/web');
          console.log('VAPI module loaded:', vapiModule);
          
          // @ts-ignore - Create the client ignoring TypeScript errors
          vapiClientRef.current = new vapiModule.default(VAPI_API_KEY);
          setupEventListeners();
        } catch (initError) {
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

      try {
        // Get tool definitions to provide to the assistant
        const toolDefinitions = toolManager.getToolDefinitions();
        console.log('Providing custom tools to assistant:', toolDefinitions.map(t => t.function?.name || 'unnamed tool'));
        console.log('Full tool definitions:', JSON.stringify(toolDefinitions, null, 2));

        // Connect to the assistant and start a new call
        const assistantOptions = usePreCreatedAssistant 
          ? { assistantId: VAPI_ASSISTANT_ID }
          : { 
              assistant: {
                firstMessage: config.webAgentInfo.greeting,
                voice: {
                  provider: 'vapi',
                  voiceId: 'alex'
                },
                transcriber: {
                  provider: 'deepgram',
                  language: 'en',
                },
                model: {
                  provider: 'anthropic',
                  model: 'claude-3-opus-20240229',
                  temperature: 0.7,
                  systemPrompt: (() => {
                    const { createSystemPrompt } = initPromptTemplates(config.siteData, config.webAgentInfo);
                    return createSystemPrompt(isHomePage);
                  })()
                }
              }
            };

        console.log('Starting call with assistant options:', assistantOptions);
        
        // Start the call with explicit error handling
        console.log('Attempting to start VAPI call with static assistant...');
        
        const call = await vapiClientRef.current.start(assistantOptions);

        // Add pause capabilities if not present
        if (!call.pauseRecording && !call.pause) {
          console.log('Adding custom pause capability to call object');
          call.pauseRecording = () => {
            console.log('Custom pauseRecording method called');
            // Implementation depends on VAPI's capabilities
            // We'll just set a flag and stop recording but keep the connection
            try {
              // Try to pause the microphone if possible
              if (typeof call.pauseMicrophone === 'function') {
                call.pauseMicrophone();
              } else if (typeof call.stopRecording === 'function') {
                call.stopRecording();
              } else if (typeof call.stop === 'function' && typeof call.isMuted === 'undefined') {
                // Add a muted flag if we're using stop as a workaround
                call.isMuted = true;
              }
            } catch (e) {
              console.error('Error in custom pause implementation:', e);
            }
          };
        }
        
        callRef.current = call;
        console.log('Call initialized successfully:', call);
        
        // In always-live mode, send a welcome message if this isn't a reconnection
        // This helps to make the experience more engaging when the page first loads
        if (ALWAYS_LIVE && !status.isActive) {
          setTimeout(() => {
            // Check if the call is still active before sending
            if (callRef.current) {
              try {
                console.log('Sending welcome prompt in always-live mode');
                // This will be a silent prompt that doesn't show to the user
                // but tells the assistant to wait for user input
                call.send('__silent__waiting_for_user_input');
                
                // Set up initial inactivity timer
                if (inactivityTimerRef.current) {
                  clearTimeout(inactivityTimerRef.current);
                }
                
                inactivityTimerRef.current = setTimeout(() => {
                  console.log(`No activity for ${INACTIVITY_TIMEOUT/60000} minutes, refreshing connection silently`);
                  try {
                    if (callRef.current) {
                      // Just send a silent refresh ping without restarting the whole conversation
                      callRef.current.send('__silent__waiting_for_user_input');
                      
                      // Reset the timer for the next inactivity period
                      if (inactivityTimerRef.current) {
                        clearTimeout(inactivityTimerRef.current);
                      }
                      inactivityTimerRef.current = setTimeout(() => {
                        console.log(`Second inactivity period (${INACTIVITY_TIMEOUT/60000} minutes) elapsed`);
                        if (callRef.current) {
                          callRef.current.send('__silent__waiting_for_user_input');
                        }
                      }, INACTIVITY_TIMEOUT);
                    }
                  } catch (err) {
                    console.warn('Failed to send silent refresh:', err);
                  }
                }, INACTIVITY_TIMEOUT);
                
              } catch (err) {
                console.error('Failed to send welcome prompt:', err);
              }
            }
          }, 2000); // Longer delay for initial welcome prompt
        }
        
      } catch (apiError: any) {
        console.error('VAPI API Error:', apiError);
        
        // Log the full error for debugging
        console.error('Full API error:', JSON.stringify(apiError, null, 2));
        
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
            statusMessage: `Waiting to retry (${retryCount + 1}/${MAX_RETRIES})...`
          }));
          
          // Schedule retry with exponential backoff
          setTimeout(() => {
            console.log(`Executing retry attempt ${retryCount + 1}`);
            startConversation(retryCount + 1);
          }, retryDelay);
          
          return; // Exit early to avoid setting error state
        }
        
        // Extract error information for non-concurrency errors or after max retries
        let errorMessage = 'Failed to start conversation';
        
        if (apiError.response) {
          console.error('Error response:', apiError.response);
          errorMessage = `API Error: ${apiError.response.status || ''} - ${apiError.response.statusText || 'Unknown error'}`;
          
          try {
            const errorData = apiError.response.data || apiError.response.error;
            if (errorData) {
              console.error('Error data:', errorData);
              errorMessage = `API Error: ${JSON.stringify(errorData)}`;
            }
          } catch (e) {
            console.error('Could not parse error response:', e);
          }
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }
        
        setStatus(prev => ({
          ...prev,
          error: errorMessage,
          statusMessage: 'Error'
        }));
        throw new Error(errorMessage);
      }
        
    } catch (error: any) {
      // Only set error state if not retrying for concurrency
      if (!(error.message && error.message.includes("Concurrency") && retryCount < MAX_RETRIES)) {
        console.error('Failed to start conversation:', error);
        setStatus(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : String(error),
          statusMessage: 'Error'
        }));
      }
      
      // In always-live mode, retry after failure with exponential backoff
      if (ALWAYS_LIVE) {
        const retryDelay = Math.min(5000 + Math.random() * 2000, 10000);
        console.log(`Always-live mode: retrying in ${retryDelay}ms after failure`);
        
        setTimeout(() => {
          if (!callRef.current) {
            console.log('Retrying conversation start in always-live mode');
            startConversation(0).catch(err => {
              console.error('Retry attempt failed:', err);
            });
          }
        }, retryDelay);
      }
    }
  }, [setupEventListeners, status.isLoading]);

  // Stop conversation - in always-live mode, just pause the microphone
  const stopConversation = useCallback(() => {
    console.log('StaticAgent: stopConversation called');
    
    if (callRef.current) {
      console.log('StaticAgent: callRef.current exists:', callRef.current);
      
      try {
        // In always-live mode, always maintain the conversation
        const shouldMaintainConversation = process.env.NEXT_PUBLIC_MAINTAIN_CONVERSATION === 'true' || ALWAYS_LIVE;
        console.log('StaticAgent: shouldMaintainConversation =', shouldMaintainConversation);
        
        if (shouldMaintainConversation) {
          // Instead of stopping the call completely, we'll just pause it
          // This will keep the conversation alive but stop listening
          if (callRef.current.pauseRecording) {
            console.log('StaticAgent: Calling pauseRecording method');
            callRef.current.pauseRecording();
            console.log('Call paused but maintained');
          } else if (callRef.current.pause) {
            console.log('StaticAgent: Calling pause method');
            callRef.current.pause();
            console.log('Call paused but maintained');
          } else {
            console.log('StaticAgent: No pause method available, microphone will stay active');
            console.log('StaticAgent: Available methods:', Object.keys(callRef.current));
          }
          
          // Important: We don't set callRef.current to null so the conversation stays alive
          
          setStatus(prev => ({
            ...prev,
            isActive: false,
            statusMessage: 'Idle'
          }));
        } else {
          // Traditional stop behavior - completely end the call
          console.log('StaticAgent: Calling stop method');
          callRef.current.stop();
          callRef.current = null;
          
          setStatus(prev => ({
            ...prev,
            isActive: false,
            statusMessage: 'Idle'
          }));
          
          console.log('Call completely ended (not maintained)');
        }
      } catch (error) {
        console.error('StaticAgent: Error managing call:', error);
        
        // Ensure we clean up the reference in case of error
        callRef.current = null;
        
        setStatus(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : String(error),
          statusMessage: 'Error'
        }));
      }
    } else {
      console.log('StaticAgent: No active call to stop');
      // No active call, just update the UI
      setStatus(prev => ({
        ...prev,
        statusMessage: 'Idle'
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
    
    // Add user message to state
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      await callRef.current.send(message);
      console.log('Message sent to static assistant:', message);
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : String(error),
        statusMessage: 'Error'
      }));
    }
  }, [startConversation]);
  
  // Toggle voice mute
  const toggleVoiceMute = useCallback((shouldMute?: boolean) => {
    try {
      if (!callRef.current) {
        console.log('No active call to mute/unmute');
        return false;
      }
      
      // If shouldMute is provided, use it; otherwise toggle the current state
      const mute = typeof shouldMute !== 'undefined' 
        ? shouldMute 
        : !(callRef.current.isMuted || false);
      
      console.log(`Toggling voice to ${mute ? 'muted' : 'unmuted'}`);
      
      // Set the mute state on the call object
      callRef.current.isMuted = mute;
      
      // Try to use the VAPI mute function if available
      if (typeof callRef.current.mute === 'function') {
        if (mute) {
          callRef.current.mute();
          console.log('Called mute() on VAPI call object');
        } else {
          callRef.current.unmute();
          console.log('Called unmute() on VAPI call object');
          
          // When unmuting, send multiple messages to restart audio stream
          if (typeof callRef.current.send === 'function') {
            [300, 1000].forEach(delay => {
              setTimeout(() => {
                try {
                  callRef.current.send('__resume_speaking__');
                  console.log(`Sent message to restart audio stream (${delay}ms delay)`);
                } catch (error) {
                  console.error(`Error sending restart message (${delay}ms delay):`, error);
                }
              }, delay);
            });
          }
        }
        console.log(`Voice ${mute ? 'muted' : 'unmuted'} using VAPI's built-in function`);
      } 
      
      // Handle audio elements (always do this even if VAPI functions are available)
      if (typeof document !== 'undefined') {
        // Get all audio elements currently in the DOM
        const audioElements = document.querySelectorAll('audio');
        console.log(`Found ${audioElements.length} audio elements to handle`);
        
        audioElements.forEach((audio, index) => {
          audio.muted = mute;
          console.log(`Audio element ${index} muted=${mute}`);
          
          if (mute) {
            // If muting, pause all audio
            audio.pause();
            console.log(`Audio element ${index} paused`);
          } else {
            // If unmuting, try to restart playback
            try {
              console.log(`Attempting to play audio element ${index}`);
              const playPromise = audio.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => console.log(`Audio element ${index} played successfully`))
                  .catch(error => {
                    console.warn(`Failed to play audio element ${index}:`, error);
                    
                    // Try again with a delay
                    setTimeout(() => {
                      audio.play().catch(e => console.error(`Retry failed for audio ${index}:`, e));
                    }, 500);
                  });
              }
            } catch (error) {
              console.warn(`Error trying to play audio ${index}:`, error);
            }
          }
        });
        
        // If unmuting, also send messages to get a new audio response
        if (!mute && typeof callRef.current.send === 'function') {
          [300, 1000].forEach(delay => {
            setTimeout(() => {
              try {
                callRef.current.send('__resume_speaking__');
                console.log(`Additional message to restart audio (${delay}ms)`);
              } catch (error) {
                console.error(`Error sending additional message (${delay}ms):`, error);
              }
            }, delay);
          });
        }
        
        console.log(`Voice ${mute ? 'muted' : 'unmuted'} using audio element control`);
      }
      
      return mute;
    } catch (error) {
      console.error('Error toggling voice mute:', error);
      return false;
    }
  }, []);
  
  return (
    <WebAgentContext.Provider value={{
      status,
      actions: {
        startConversation: startConversation,
        stopConversation: stopConversation,
        sendMessage: sendMessage,
        toggleVoiceMute: toggleVoiceMute,
      },
      messages,
      mode: 'static',
      setMode: () => {}, // Static agent doesn't change modes
      usePreCreatedAssistant: usePreCreated,
      setUsePreCreatedAssistant: () => {}, // Static agent doesn't change this setting
      isAlwaysLive: ALWAYS_LIVE,
    }}>
      {children}
    </WebAgentContext.Provider>
  );
};

export default StaticAgent; 