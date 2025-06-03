'use client';

/**
 * SessionManager - Handles customer session management
 * 
 * This utility centralizes session management for customer interactions and
 * prepares for future integration with server-side authentication.
 */

// Key for storing session ID in browser storage
const SESSION_STORAGE_KEY = 'brain9_customer_session_id';
// Key for agent active state tracking
const AGENT_STATE_KEY = 'brain9ai_agent_state';

/**
 * Generate a unique session ID using timestamp and random values
 */
const generateSessionId = (): string => {
  const timestamp = Date.now();
  const randomPart = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `${timestamp}${randomPart}`;
};

/**
 * Initialize the session - this should be called when the application starts
 * In the future, this will integrate with server-side authentication
 */
export const initSession = (): string => {
  if (typeof window === 'undefined') {
    return generateSessionId(); // For SSR, just generate one (will be replaced client-side)
  }

  // Only set up beforeunload handler for complete page unloads, not for SPA navigation
  const existingHandler = window.onbeforeunload;
  window.onbeforeunload = (event) => {
    // Only clear session if not an internal navigation
    const isAgentActive = sessionStorage.getItem(AGENT_STATE_KEY) === 'active';
    const timestamp = sessionStorage.getItem(AGENT_STATE_KEY + '_timestamp');
    const isRecentNavigation = timestamp && (Date.now() - parseInt(timestamp)) < 3000;
    
    // If this is a navigation where we're preserving state, don't clear session
    if (!isAgentActive || !isRecentNavigation) {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
    
    // Run existing handler if it exists
    if (existingHandler) {
      return existingHandler.call(window, event);
    }
  };
  
  // Check for existing session or create new one
  const existingSession = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (existingSession) {
    return existingSession;
  }
  
  // No existing session, create a new one
  const newSessionId = generateSessionId();
  sessionStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
  return newSessionId;
};

/**
 * Get the current session ID or create a new one if needed
 */
export const getSessionId = (): string => {
  if (typeof window === 'undefined') {
    return generateSessionId(); // For SSR, create a temporary ID
  }
  
  const existingSession = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (existingSession) {
    return existingSession;
  }
  
  // No session found, initialize a new one
  return initSession();
};

/**
 * Clear the current session (for logout, etc.)
 */
export const clearSession = (): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  }
};

/**
 * Store to remember customer data during a session
 */
type CustomerData = Record<string, any>;
let currentCustomerData: CustomerData = {};

/**
 * Customer information store API
 */
export const customerStore = {
  /**
   * Update customer data with new information
   */
  updateData(newData: CustomerData): void {
    currentCustomerData = { ...currentCustomerData, ...newData };
  },
  
  /**
   * Get current customer data
   */
  getData(): CustomerData {
    return { ...currentCustomerData };
  },
  
  /**
   * Check if we have essential customer information
   */
  hasEssentialInfo(): boolean {
    return Boolean(
      currentCustomerData.name && 
      (currentCustomerData.email || currentCustomerData.phone)
    );
  },
  
  /**
   * Clear all customer data (typically done when session expires)
   */
  clearData(): void {
    currentCustomerData = {};
  }
};

// Initialize the session immediately
const currentSessionId = initSession();

/**
 * Check if agent was active in previous navigation
 */
export const wasAgentActive = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const isActive = sessionStorage.getItem(AGENT_STATE_KEY) === 'active';
  const timestamp = sessionStorage.getItem(AGENT_STATE_KEY + '_timestamp');
  // Allow a longer time window (5 seconds) to account for slower navigations
  const isRecent = timestamp ? (Date.now() - parseInt(timestamp)) < 5000 : false;
  
  return Boolean(isActive && isRecent);
};

/**
 * Set agent as active (for persistent navigation)
 */
export const setAgentActive = (): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(AGENT_STATE_KEY, 'active');
    sessionStorage.setItem(AGENT_STATE_KEY + '_timestamp', Date.now().toString());
    console.log('Agent state set to active for navigation');
  }
};

/**
 * Clear agent active status
 */
export const clearAgentActiveStatus = (): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(AGENT_STATE_KEY);
    sessionStorage.removeItem(AGENT_STATE_KEY + '_timestamp');
    console.log('Agent active status cleared');
  }
};

// Export the current session ID
export default currentSessionId; 