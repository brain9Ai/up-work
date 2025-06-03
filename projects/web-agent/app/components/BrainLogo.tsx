import React from 'react';

interface BrainLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const BrainLogo: React.FC<BrainLogoProps> = ({ 
  className = "", 
  width = 24, 
  height = 24 
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      width={width} 
      height={height} 
      className={className} 
      fill="none"
    >
      {/* Left half of brain (blue) */}
      <path 
        d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44A2.5 2.5 0 0 1 4.06 16a2.5 2.5 0 0 1-1.5-4 2.5 2.5 0 0 1 0-4a2.5 2.5 0 0 1 1.5-4 2.5 2.5 0 0 1 2.98-3.96A2.5 2.5 0 0 1 9.5 2Z" 
        stroke="#3B82F6" 
        strokeWidth="2.2" 
        strokeLinecap="round" 
        fill="none" 
      />
      
      {/* Right half of brain (purple) */}
      <path 
        d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44A2.5 2.5 0 0 0 19.94 16a2.5 2.5 0 0 0 1.5-4a2.5 2.5 0 0 0 0-4a2.5 2.5 0 0 0-1.5-4a2.5 2.5 0 0 0-2.98-3.96A2.5 2.5 0 0 0 14.5 2Z" 
        stroke="#8B5CF6" 
        strokeWidth="2.2" 
        strokeLinecap="round" 
        fill="none" 
      />
    </svg>
  );
};

export default BrainLogo; 