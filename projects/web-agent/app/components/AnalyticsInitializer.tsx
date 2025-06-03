'use client';

import { useEffect } from 'react';
import Analytics from '../utils/Analytics';
import Config from '../utils/Config';

/**
 * Component to initialize analytics on page load
 * This component should be placed at the root layout
 */
export default function AnalyticsInitializer() {
  useEffect(() => {
    if (Config.analytics.isEnabled && Config.analytics.googleAnalyticsId) {
      // Initialize Google Analytics with the ID from config
      Analytics.initialize(Config.analytics.googleAnalyticsId);
      
      // Track initial page view
      Analytics.pageview(window.location.pathname, document.title);
      
      if (Config.analytics.debugMode) {
        console.log('Analytics initialized with ID:', Config.analytics.googleAnalyticsId);
      }
    }
  }, []);

  // This is a utility component that doesn't render anything
  return null;
} 