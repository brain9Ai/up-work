'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useWebAgent } from '../WebAgent';
import RippleEffect from './RippleEffect';
import SpectrumVisualizer from './SpectrumVisualizer';
import ListeningIndicator from './ListeningIndicator';
import MicrophonePermissionModal from './MicrophonePermissionModal';

export interface WidgetViewProps {
  isHomePage?: boolean;
  widgetPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

/**
 * WidgetView Component
 * 
 * This component renders the WebAgent as a floating widget on the page
 */
const WidgetView: React.FC<WidgetViewProps> = ({
  isHomePage = false,
  widgetPosition = 'bottom-right'
}) => {
  const { status, actions } = useWebAgent();
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasActiveConversation, setHasActiveConversation] = useState(false);
  // Track if this is the first load to only show loading indicator initially
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  // Track if voice is muted (separate from pausing the conversation)
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(() => {
    // Initialize from localStorage if available
    return typeof window !== 'undefined' ? localStorage.getItem('agent_voice_muted') === 'true' : false;
  });
  // State for permission modal
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  
  // Listen for changes to mute state from other instances and localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Handle direct storage changes (from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'agent_voice_muted') {
        const newMuteState = e.newValue === 'true';
        console.log('WidgetView: Syncing mute state from storage event:', newMuteState);
        setIsVoiceMuted(newMuteState);
      }
    };
    
    // Handle custom events (from other components in same page)
    const handleMuteEvent = (e: CustomEvent) => {
      if (e.detail && typeof e.detail.muted === 'boolean') {
        console.log('WidgetView: Syncing mute state from custom event:', e.detail.muted);
        setIsVoiceMuted(e.detail.muted);
      }
    };
    
    // Check for mute state changes periodically
    const intervalCheck = setInterval(() => {
      const storedState = localStorage.getItem('agent_voice_muted') === 'true';
      if (storedState !== isVoiceMuted) {
        console.log('WidgetView: Detected mute state change in localStorage:', storedState);
        setIsVoiceMuted(storedState);
      }
    }, 1000);
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('agent-mute-change', handleMuteEvent as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('agent-mute-change', handleMuteEvent as EventListener);
      clearInterval(intervalCheck);
    };
  }, [isVoiceMuted]);
  
  // Update the active conversation state when the status changes
  useEffect(() => {
    if (status.isActive) {
      setHasActiveConversation(true);
    }
    
    // If we've initialized, mark first load as complete
    if (status.isInitialized && isFirstLoad) {
      setIsFirstLoad(false);
      
      // Auto-start conversation on first load
      if (!status.isActive && !status.error) {
        console.log('Auto-starting conversation on first load');
        setTimeout(() => {
          actions.startConversation();
        }, 500);
      }
    }
    
    // Don't automatically show permission modal when microphone error occurs
    // The user will need to click the message or button to see it
  }, [status.isActive, status.isInitialized, isFirstLoad, actions]);
  
  // Initial load effect
  useEffect(() => {
    // On first initialization, apply any stored mute state
    if (status.isInitialized && !status.isLoading) {
      const storedMuteState = localStorage.getItem('agent_voice_muted') === 'true';
      if (storedMuteState !== isVoiceMuted) {
        console.log('WidgetView: Syncing initial mute state from localStorage:', storedMuteState);
        setIsVoiceMuted(storedMuteState);
        
        // Apply mute state through the agent
        if (status.isActive && storedMuteState && actions.toggleVoiceMute) {
          try {
            actions.toggleVoiceMute(storedMuteState);
            console.log('Applied stored mute state to agent on init');
          } catch (err) {
            console.error('Error applying initial mute state:', err);
          }
        }
      }
    }
  }, [status.isInitialized, status.isLoading, status.isActive, isVoiceMuted, actions]);
  
  // Determine position classes based on widgetPosition
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  }[widgetPosition];
  
  const handleStartConversation = useCallback(() => {
    actions.startConversation();
    setIsExpanded(true);
  }, [actions]);
  
  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);
  
  // Function to handle re-requesting microphone permission - called directly from modal button click
  const handleRequestMicrophonePermission = useCallback(() => {
    console.log('WidgetView: Starting conversation, which will trigger permission request');
    
    // Simply start the conversation - this will naturally trigger the permission request
    // Since this is called from a button click handler, it maintains the user gesture chain
    actions.startConversation();
    
    // Ensure widget is expanded to show the conversation
    setIsExpanded(true);
  }, [actions, setIsExpanded]);
  
  // Toggle voice mute state
  const toggleVoiceMute = useCallback(() => {
    console.log("WidgetView: Toggling voice mute state from", isVoiceMuted, "to", !isVoiceMuted);
    
    try {
      // Force the opposite of current state
      const newMuteState = !isVoiceMuted;
      
      // Update localStorage first
      if (typeof window !== 'undefined') {
        localStorage.setItem('agent_voice_muted', String(newMuteState));
        console.log("WidgetView: Updated localStorage mute state:", newMuteState);
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('agent-mute-change', { 
          detail: { muted: newMuteState } 
        }));
      }
      
      // Call the WebAgent's toggleVoiceMute with explicit mute state
      try {
        actions.toggleVoiceMute?.(newMuteState);
        console.log("WidgetView: Called toggleVoiceMute with value:", newMuteState);
      } catch (toggleErr) {
        console.error("Error in WebAgent toggleVoiceMute:", toggleErr);
        // Don't propagate this error to UI
      }
      
      // Update our local state
      setIsVoiceMuted(newMuteState);
      
      // If unmuting, directly try to play any existing audio elements
      if (!newMuteState && typeof document !== 'undefined') {
        const audioElements = document.querySelectorAll('audio');
        console.log(`Found ${audioElements.length} audio elements to unmute`);
        
        audioElements.forEach((audio, i) => {
          audio.muted = false;
          try {
            setTimeout(() => {
              const playPromise = audio.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => console.log(`Audio element ${i} played successfully`))
                  .catch(err => console.error(`Audio element ${i} failed to play:`, err));
              }
            }, 300);
          } catch (err) {
            console.error(`Error playing audio element ${i}:`, err);
            // Don't propagate this error to UI
          }
        });
        
        // Send a message to trigger speaking
        if (typeof actions.sendMessage === 'function') {
          setTimeout(() => {
            try {
              actions.sendMessage('__resume_speaking__');
              console.log('Sent resume speaking message');
            } catch (err) {
              console.error('Error sending resume message:', err);
              // Don't propagate this error to UI
            }
          }, 500);
        }
      }
      
      return newMuteState;
    } catch (error) {
      console.error("Error in toggleVoiceMute:", error);
      // Don't propagate this error to UI - return current state instead
      return isVoiceMuted;
    }
  }, [actions, isVoiceMuted]);
  
  // Only show loading spinner on first initialization
  const showLoadingSpinner = isFirstLoad && status.isLoading;
  
  return (
    <div className={`fixed ${positionClasses} z-50 flex flex-col items-end`}>
      {/* Expanded widget with status */}
      {isExpanded && (
        <div className={`mb-2 p-3 rounded-lg bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 shadow-lg ${
          status.isSpeaking && !isVoiceMuted ? 'animate-pulse-slow' : ''
        }`}>
          <div className="text-sm font-medium mb-1 h-5">
            {status.isSpeaking && !isVoiceMuted ? (
              <div className="flex items-center gap-1.5">
                <div className="text-sm font-medium text-blue-400">Speaking</div>
                <SpectrumVisualizer />
              </div>
            ) : isVoiceMuted ? (
              <span className="text-red-400">Voice muted</span>
            ) : (
              <div className="flex items-center">
                <span className="text-blue-400">Anaya is listening</span>
                <ListeningIndicator />
              </div>
            )}
          </div>
          
          {status.error && 
           !status.error.includes('__resume_speaking__') && 
           !status.error.includes('Error sending message:') && 
           !status.error.includes('send error') && (
            <div 
              className={`text-xs max-w-[200px] p-1.5 rounded ${
                status.error && status.error.includes('Voice features disabled') 
                ? 'bg-blue-900/40 text-blue-300 border border-blue-500/30 cursor-pointer hover:bg-blue-900/60' 
                : 'text-red-400'
              }`}
              onClick={() => {
                if (status.error?.includes('Voice features disabled')) {
                  // Show modal instead of directly requesting permissions
                  setIsPermissionModalOpen(true);
                }
              }}
            >
              {status.error && status.error.includes('Voice features disabled') 
                ? <span className="flex items-center"><svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>{status.error}</span>
                : status.error}
            </div>
          )}
          
          {/* Voice Controls button - Just a single mute/unmute button with icon only */}
          <div className="mt-2 flex items-center justify-center">
            <button 
              onClick={toggleVoiceMute} 
              className={`p-2 ${isVoiceMuted ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-blue-600 text-white hover:bg-blue-500'} rounded-full flex items-center justify-center transition-all shadow-lg`}
              title={isVoiceMuted ? "Unmute voice" : "Mute voice"}
            >
              {isVoiceMuted ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9.168 16.828A5 5 0 015.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586a5 5 0 013.582-1.828" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
      
      {/* Main button - elegant design with ripple effects */}
      <div className="relative" style={{ overflow: 'visible' }}>
        {/* RippleTalk effect - water ripple effect when speaking */}
        {status.isSpeaking && !isVoiceMuted && <RippleEffect scale={0.9} />}
        
        {/* Voice status indicator - small badge on button */}
        {isVoiceMuted && (
          <div className="absolute -top-1 -right-1 z-20 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center border border-slate-800">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636" />
            </svg>
          </div>
        )}
        
        <button
          onClick={status.isActive ? (isExpanded ? toggleExpand : toggleVoiceMute) : 
            (status.error && status.error.includes('Voice features disabled') ? 
             () => setIsPermissionModalOpen(true) : handleStartConversation)}
          disabled={showLoadingSpinner}
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 focus:outline-none bg-blue-600 hover:bg-blue-500 relative z-10"
          aria-label={!status.isActive ? "Start conversation" : isExpanded ? "Collapse widget" : (isVoiceMuted ? "Unmute voice" : "Mute voice")}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 -z-5 rounded-full bg-blue-500/20 blur-md"></div>
          
          {/* Loading spinner - only show on first load */}
          {showLoadingSpinner ? (
            <div className="w-6 h-6 border-t-2 border-white rounded-full animate-spin"></div>
          ) : (
            <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
      
      {/* Microphone Permission Modal */}
      <MicrophonePermissionModal 
        isOpen={isPermissionModalOpen} 
        onClose={() => setIsPermissionModalOpen(false)} 
        onRequestPermission={handleRequestMicrophonePermission} 
      />
    </div>
  );
};

export default WidgetView; 