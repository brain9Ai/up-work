'use client';

import React from 'react';

/**
 * RippleEffect Component
 * 
 * A self-contained component that renders animated ripple effects
 * Can be used in both MainView and WidgetView without external dependencies
 */
interface RippleEffectProps {
  scale?: number; // Optional scale factor to adjust size for different button sizes
}

const RippleEffect: React.FC<RippleEffectProps> = ({ scale = 1 }) => {
  // Inline styles for the ripple effect to avoid external CSS dependencies
  const styles = {
    container: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100%',
      height: '100%',
      zIndex: -1,
      pointerEvents: 'none',
      overflow: 'visible',
    } as React.CSSProperties,
    
    ripple: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      border: '1px solid rgba(96, 165, 250, 0.4)',
      boxShadow: '0 0 5px rgba(96, 165, 250, 0.3), inset 0 0 5px rgba(96, 165, 250, 0.2)',
      animation: 'rippleExpand 3s linear infinite',
      overflow: 'visible',
    } as React.CSSProperties,
    
    ripple2: {
      borderColor: 'rgba(129, 140, 248, 0.4)',
      animationDelay: '0.5s',
      boxShadow: '0 0 5px rgba(129, 140, 248, 0.3), inset 0 0 5px rgba(129, 140, 248, 0.2)',
    } as React.CSSProperties,
    
    ripple3: {
      borderColor: 'rgba(168, 85, 247, 0.4)',
      animationDelay: '1s',
      boxShadow: '0 0 5px rgba(168, 85, 247, 0.3), inset 0 0 5px rgba(168, 85, 247, 0.2)',
    } as React.CSSProperties,
    
    ripple4: {
      borderColor: 'rgba(236, 72, 153, 0.4)',
      animationDelay: '1.5s',
      boxShadow: '0 0 5px rgba(236, 72, 153, 0.3), inset 0 0 5px rgba(236, 72, 153, 0.2)',
    } as React.CSSProperties,
  };

  // Keyframes for the animation with dynamic scale
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    const keyframeId = `rippleExpand_${Math.random().toString(36).substr(2, 9)}`;
    
    styleElement.innerHTML = `
      @keyframes rippleExpand {
        0% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.6;
        }
        100% {
          transform: translate(-50%, -50%) scale(${2 * scale});
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [scale]);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none overflow-visible">
      <div style={styles.container}>
        <div style={styles.ripple}></div>
        <div style={{...styles.ripple, ...styles.ripple2}}></div>
        <div style={{...styles.ripple, ...styles.ripple3}}></div>
        <div style={{...styles.ripple, ...styles.ripple4}}></div>
      </div>
    </div>
  );
};

export default RippleEffect; 