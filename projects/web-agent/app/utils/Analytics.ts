'use client';

import ReactGA from 'react-ga4';

interface EventProps {
  category: string;
  action: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
  transport?: 'beacon' | 'xhr' | 'image';
}

/**
 * Google Analytics service helper
 */
export const Analytics = {
  /**
   * Initialize Google Analytics with the measurement ID
   * @param measurementId Google Analytics 4 measurement ID (G-XXXXXXXXXX)
   */
  initialize: (measurementId: string) => {
    if (typeof window !== 'undefined') {
      ReactGA.initialize(measurementId);
      console.log(`Google Analytics initialized with ID: ${measurementId}`);
    }
  },

  /**
   * Track a page view
   * @param path Path of the current page (e.g., '/products')
   * @param title Page title
   */
  pageview: (path: string, title?: string) => {
    if (typeof window !== 'undefined') {
      ReactGA.send({ hitType: 'pageview', page: path, title });
      console.log(`GA pageview: ${path} - ${title || 'No title'}`);
    }
  },

  /**
   * Track an event
   * @param param0 Event parameters (category, action, label, value)
   */
  event: ({ category, action, label, value, nonInteraction, transport }: EventProps) => {
    if (typeof window !== 'undefined') {
      ReactGA.event({
        category,
        action,
        label,
        value,
        nonInteraction,
        transport,
      });
      console.log(`GA event: ${category} - ${action} - ${label || 'No label'} - ${value || 'No value'}`);
    }
  },

  /**
   * Track agent interactions
   * @param action The specific action (e.g., 'started', 'stopped', 'navigation')
   * @param label Optional label for additional context
   */
  trackAgentInteraction: (action: string, label?: string) => {
    Analytics.event({
      category: 'Agent',
      action,
      label,
    });
  },

  /**
   * Track user profile information (in a privacy-compliant way)
   * @param userType Type of user (e.g., 'visitor', 'customer')
   * @param industry User's industry if available
   */
  trackUserProfile: (userType: string, industry?: string) => {
    Analytics.event({
      category: 'User',
      action: 'Profile',
      label: `${userType}${industry ? ` - ${industry}` : ''}`,
    });
  },

  /**
   * Track feature usage
   * @param feature Name of the feature being used
   * @param detail Optional additional details
   */
  trackFeatureUsage: (feature: string, detail?: string) => {
    Analytics.event({
      category: 'Feature',
      action: feature,
      label: detail,
    });
  },

  /**
   * Track search queries
   * @param query The search query
   * @param resultsCount Number of results found
   */
  trackSearch: (query: string, resultsCount?: number) => {
    Analytics.event({
      category: 'Search',
      action: 'Query',
      label: query,
      value: resultsCount,
    });
  },

  /**
   * Track inactivity responses
   * @param stage The inactivity stage (0, 1, 2)
   * @param action The action taken (e.g., 'navigate_to_products')
   */
  trackInactivity: (stage: number, action: string) => {
    Analytics.event({
      category: 'Inactivity',
      action: `Stage_${stage}`,
      label: action,
    });
  },
  
  /**
   * Debug helper that tests GA connection and reports back status
   * This helps verify if Google Analytics is working properly
   */
  testConnection: () => {
    if (typeof window !== 'undefined') {
      try {
        // Send a test event
        ReactGA.event({
          category: 'Test',
          action: 'Connection_Test',
          label: 'Manual test from browser',
        });
        
        // Check if GA object exists
        const gaExists = !!(window as any).gtag || !!(window as any).ga;
        
        console.log('GA Test Results:');
        console.log(`- GA script loaded: ${gaExists ? 'Yes' : 'No'}`);
        console.log('- Test event sent to GA');
        console.log('- Check GA Real-time reports to confirm data receipt');
        
        return gaExists;
      } catch (error) {
        console.error('GA Test Error:', error);
        return false;
      }
    }
    return false;
  }
};

export default Analytics; 