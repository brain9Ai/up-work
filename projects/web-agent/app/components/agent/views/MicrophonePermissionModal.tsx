'use client';

import React, { useEffect, useRef } from 'react';

interface MicrophonePermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestPermission: () => void;
}

const MicrophonePermissionModal: React.FC<MicrophonePermissionModalProps> = ({
  isOpen,
  onClose,
  onRequestPermission
}) => {
  // Create a ref for the audio element
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Try to request permissions when the modal opens
  useEffect(() => {
    if (isOpen) {
      // Let browser UI settle before trying to request permissions
      const timer = setTimeout(() => {
        // Check if we can access navigator.mediaDevices
        if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
          console.log("Modal opened, pre-checking microphone permissions...");
          
          // The permission check itself
          if (navigator.permissions && typeof navigator.permissions.query === 'function') {
            navigator.permissions.query({ name: 'microphone' as PermissionName })
              .then((permissionStatus) => {
                console.log("Current microphone permission status:", permissionStatus.state);
                
                if (permissionStatus.state === 'granted') {
                  console.log("Microphone already permitted, starting conversation");
                  onClose();
                  onRequestPermission();
                }
              })
              .catch(err => {
                console.log("Permission query failed:", err);
              });
          }
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, onRequestPermission]);

  // Add keyboard event listener to close modal with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Return null if modal is not open
  if (!isOpen) return null;

  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle microphone permission request
  const handleAllowMicrophone = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    console.log("Requesting microphone access directly from modal button...");
    
    try {
      // Use a more direct approach to request microphone access
      // First close the modal
      onClose();
      
      // We need to make sure this is called directly from a user interaction handler
      // By directly calling the parent handler, we let the parent component handle the permission request
      // which should be triggered from this click event (maintaining the user gesture chain)
      onRequestPermission();
    } catch (error) {
      console.error("Error in allow microphone handler:", error);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" 
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md p-6 mx-4 bg-slate-800 rounded-lg shadow-xl border border-blue-500/30">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-blue-600/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          
          <h3 className="mb-2 text-xl font-medium text-white">Microphone Access Required</h3>
          
          <p className="mb-6 text-center text-gray-300">
            To interact with our voice assistant, your browser needs permission to access your microphone. 
            This allows you to speak directly with our AI.
          </p>
          
          <div className="w-full space-y-3">
            <button
              onClick={handleAllowMicrophone}
              className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Allow Microphone Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicrophonePermissionModal; 