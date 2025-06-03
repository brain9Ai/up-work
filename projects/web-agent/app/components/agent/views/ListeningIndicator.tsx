'use client';

import React, { useEffect } from 'react';

/**
 * ListeningIndicator Component
 * 
 * A self-contained component that shows a pulsing dot to indicate active listening
 */
const ListeningIndicator: React.FC = () => {
  // Styles for the listening indicator
  const styles = {
    container: {
      position: 'relative',
      height: '8px',
      width: '8px',
      marginLeft: '8px',
    } as React.CSSProperties,
    
    ping: {
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      backgroundColor: 'rgba(96, 165, 250, 0.75)',
      animation: 'listening-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
    } as React.CSSProperties,
    
    dot: {
      position: 'relative',
      display: 'inline-flex',
      borderRadius: '50%',
      height: '8px',
      width: '8px',
      backgroundColor: 'rgb(59, 130, 246)',
    } as React.CSSProperties,
  };

  // Add keyframes for the ping animation
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      @keyframes listening-ping {
        0% {
          transform: scale(1);
          opacity: 0.75;
        }
        75%, 100% {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <span style={styles.container}>
      <span style={styles.ping}></span>
      <span style={styles.dot}></span>
    </span>
  );
};

export default ListeningIndicator; 