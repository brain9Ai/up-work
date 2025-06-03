'use client';

import { useState, useEffect } from 'react';
import Analytics from '../utils/Analytics';
import Config from '../utils/Config';

/**
 * Test component for verifying Google Analytics integration
 */
export default function GATest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isGADetected, setIsGADetected] = useState<boolean | null>(null);
  const gaId = Config.analytics.googleAnalyticsId;
  const isEnabled = Config.analytics.isEnabled;

  useEffect(() => {
    // Check if GA is loaded after a short delay
    const timer = setTimeout(() => {
      const gaExists = Analytics.testConnection();
      setIsGADetected(gaExists);
      addResult(`Google Analytics detected: ${gaExists ? 'Yes' : 'No'}`);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testPageview = () => {
    Analytics.pageview('/test-page', 'Test Page');
    addResult('Pageview event sent for "/test-page"');
  };

  const testEvent = () => {
    Analytics.event({
      category: 'Test',
      action: 'Button Click',
      label: 'Test Event Button',
    });
    addResult('Event sent: Test - Button Click');
  };

  const testAgentInteraction = () => {
    Analytics.trackAgentInteraction('test_interaction', 'Testing agent tracking');
    addResult('Agent interaction event sent');
  };

  const testInactivity = () => {
    Analytics.trackInactivity(1, 'test_inactivity_response');
    addResult('Inactivity event sent');
  };

  const testConnection = () => {
    const result = Analytics.testConnection();
    setIsGADetected(result);
    addResult(`Connection test completed. GA detected: ${result ? 'Yes' : 'No'}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md my-8">
      <h1 className="text-2xl font-bold mb-4">Google Analytics Test</h1>
      
      <div className="mb-4 p-4 border rounded bg-gray-50">
        <p><strong>Status:</strong> {isEnabled ? 'Enabled' : 'Disabled'}</p>
        <p><strong>Measurement ID:</strong> {gaId}</p>
        <p><strong>GA Detected:</strong> {isGADetected === null ? 'Checking...' : (isGADetected ? 'Yes ✅' : 'No ❌')}</p>
        <p className="text-sm text-gray-500 mt-2">
          Note: Open browser developer tools (F12) &gt; Console to see detailed logs
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <button 
          onClick={testConnection}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Test Connection
        </button>
        <button 
          onClick={testPageview}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Test Pageview
        </button>
        <button 
          onClick={testEvent}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Test Event
        </button>
        <button 
          onClick={testAgentInteraction}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Test Agent Interaction
        </button>
        <button 
          onClick={testInactivity}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
        >
          Test Inactivity
        </button>
      </div>

      <div className="border rounded p-4 bg-gray-50 max-h-64 overflow-y-auto">
        <h2 className="font-semibold mb-2">Test Results:</h2>
        {testResults.length === 0 ? (
          <p className="text-gray-500">No tests run yet</p>
        ) : (
          <ul className="space-y-1">
            {testResults.map((result, index) => (
              <li key={index} className="text-sm">{result}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 p-4 border rounded bg-blue-50">
        <h2 className="font-semibold mb-2">How to Verify in Google Analytics:</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Log into your <a href="https://analytics.google.com" target="_blank" className="text-blue-600 hover:underline">Google Analytics account</a></li>
          <li>Navigate to your property (using Measurement ID: {gaId})</li>
          <li>Go to Reports &gt; Realtime &gt; Overview</li>
          <li>You should see the test events appear within 1-2 minutes</li>
          <li>Check the Events tab in Realtime reports to see specific events</li>
        </ol>
      </div>
    </div>
  );
} 