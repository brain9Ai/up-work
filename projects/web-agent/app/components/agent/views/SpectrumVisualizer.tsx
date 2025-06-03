'use client';

import React from 'react';

/**
 * SpectrumVisualizer Component
 * 
 * A self-contained component that renders animated sound spectrum bars
 * Can be used in both MainView and WidgetView without external CSS dependencies
 */
const SpectrumVisualizer: React.FC = () => {
  // Inline styles for the spectrum visualizer
  const styles = {
    container: {
      display: 'flex',
      alignItems: 'flex-end',
      height: '12px',
      gap: '1px',
      marginLeft: '6px',
      overflow: 'visible',
    } as React.CSSProperties,
    
    bar: (index: number) => {
      const colors = [
        'rgba(96, 165, 250, 0.7)',   // blue
        'rgba(129, 140, 248, 0.7)',  // indigo
        'rgba(139, 92, 246, 0.7)',   // purple
        'rgba(168, 85, 247, 0.7)',   // violet
        'rgba(192, 132, 252, 0.7)',  // fuchsia
        'rgba(216, 180, 254, 0.7)',  // pink
        'rgba(232, 121, 249, 0.7)',  // rose
      ];
      
      const delays = [
        '0s',
        '0.1s',
        '0.2s',
        '0.15s',
        '0.25s',
        '0.1s',
        '0.2s',
      ];
      
      return {
        width: '2px',
        height: '2px',
        backgroundColor: colors[index % colors.length],
        borderRadius: '1px',
        transformOrigin: 'bottom',
        boxShadow: `0 0 2px ${colors[index % colors.length]}`,
        animation: `spectrumDance${index} 0.8s ease-in-out infinite alternate`,
        animationDelay: delays[index % delays.length],
        overflow: 'visible',
      } as React.CSSProperties;
    },
  };

  // Add keyframes for each bar animation
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    let keyframes = '';
    
    // Create 7 slightly different animations for variety
    for (let i = 0; i < 7; i++) {
      const maxScale = 3 + Math.random() * 2; // Random scale between 3 and 5
      keyframes += `
        @keyframes spectrumDance${i} {
          0% {
            transform: scaleY(1);
            opacity: 0.6;
          }
          100% {
            transform: scaleY(${maxScale});
            opacity: 0.8;
          }
        }
      `;
    }
    
    styleElement.innerHTML = keyframes;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div style={styles.container}>
      {[0, 1, 2, 3, 4, 5, 6].map((index) => (
        <div key={index} style={styles.bar(index)}></div>
      ))}
    </div>
  );
};

export default SpectrumVisualizer; 