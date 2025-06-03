'use client';

import React from 'react';

interface ReadMoreButtonProps {
  className?: string;
}

const ReadMoreButton = ({ className }: ReadMoreButtonProps) => {
  return (
    <span 
      className={className}
      onClick={(e) => e.stopPropagation()}
    >
      Read article
    </span>
  );
};

export default ReadMoreButton; 