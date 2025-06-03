'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { siteData } from '../data/siteData';

type HireNowButtonProps = {
  buttonClassName?: string;
  buttonText?: string | React.ReactNode;
};

export default function HireNowButton({
  buttonClassName = "px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:scale-[1.02]",
  buttonText = "Hire Now"
}: HireNowButtonProps) {
  // Router for navigation
  const router = useRouter();
  
  // State for modal visibility
  const [showModal, setShowModal] = useState(false);
  
  // State to track if we're in the browser environment
  const [isBrowser, setIsBrowser] = useState(false);
  
  // State for selection (products or services)
  const [selectionType, setSelectionType] = useState<'products' | 'services' | null>(null);
  
  // State for storing products and services from siteData
  const [items, setItems] = useState<any[]>([]);
  
  // Set browser state after component mounts
  useEffect(() => {
    setIsBrowser(true);
    
    // Add event listener for escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        closeModal();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showModal]);
  
  // Handle selection type change
  useEffect(() => {
    if (selectionType === 'products') {
      setItems(siteData.products || []);
    } else if (selectionType === 'services') {
      setItems(siteData.services || []);
    } else {
      setItems([]);
    }
  }, [selectionType]);
  
  // Open modal
  const openModal = () => {
    // Prevent scrolling when modal is open
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
    setShowModal(true);
  };
  
  // Close modal
  const closeModal = () => {
    // Re-enable scrolling when modal is closed
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
    setShowModal(false);
    // Reset selection
    setSelectionType(null);
  };
  
  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop itself, not its children
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };
  
  // Handle item selection
  const handleItemSelect = (item: any) => {
    closeModal();
    
    // Navigate to the appropriate page
    if (selectionType === 'products') {
      router.push(`/products/${item.id}`);
    } else if (selectionType === 'services') {
      // We'll use the URL to identify the service on the services page
      router.push(`/services#${item.id}`);
    }
  };
  
  // Handle selection type
  const handleSelectionType = (type: 'products' | 'services') => {
    setSelectionType(type);
  };
  
  // The modal component
  const Modal = () => {
    return (
      <div 
        className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4 overflow-y-auto"
        onClick={handleBackdropClick}
      >
        <div 
          className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] my-4 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Close Button */}
          <button 
            onClick={closeModal}
            className="absolute top-3 right-3 z-10 p-1 bg-slate-800/70 backdrop-blur-sm rounded-full text-slate-300 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-6 overflow-y-auto">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 mr-4 rounded-lg text-blue-400 flex items-center justify-center bg-slate-800/80 border border-slate-700/80 shadow-lg">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.5 2.25v0m-1.5-2.25c.212.1.448.1.66 0m-1.5-2.25L5.354 15m7.5 0h7.5M12 9.75v5.25m0 0v3m0-3h7.5" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Hire Brain9 AI</h2>
                <p className="text-sm text-slate-400">Choose a product or service to get started</p>
              </div>
            </div>
            
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded mb-6"></div>
            
            {!selectionType ? (
              // Initial selection - Products or Services
              <div className="space-y-6">
                <p className="text-slate-300 mb-6 text-sm">
                  What would you like to request today? Choose from our range of AI agents or custom automation services.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Products Option */}
                  <button
                    onClick={() => handleSelectionType('products')}
                    className="p-5 bg-slate-800/50 border border-slate-700 rounded-xl flex flex-col items-center text-center hover:bg-slate-800 hover:border-blue-500/30 transition-all hover:shadow-lg"
                  >
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
                      <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">AI Agents</h3>
                    <p className="text-slate-400 text-sm mb-3">Ready-to-use AI agents for specific business needs</p>
                    <span className="text-blue-400 flex items-center text-sm font-medium">
                      Browse Agents
                      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                  
                  {/* Services Option */}
                  <button
                    onClick={() => handleSelectionType('services')}
                    className="p-5 bg-slate-800/50 border border-slate-700 rounded-xl flex flex-col items-center text-center hover:bg-slate-800 hover:border-purple-500/30 transition-all hover:shadow-lg"
                  >
                    <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-3">
                      <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">Custom Services</h3>
                    <p className="text-slate-400 text-sm mb-3">Custom AI automation tailored to your business</p>
                    <span className="text-purple-400 flex items-center text-sm font-medium">
                      Explore Services
                      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              // List of products or services
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <button 
                    onClick={() => setSelectionType(null)} 
                    className="flex items-center text-slate-400 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                  <h3 className="text-lg font-semibold text-white ml-4">
                    {selectionType === 'products' ? 'Choose an AI Agent' : 'Choose a Service'}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-1">
                  {items.map((item: any, index: number) => {
                    // Get appropriate image path for products vs services
                    const imagePath = selectionType === 'products' 
                      ? `/agents/${item.name.toLowerCase().split(' ')[0]}.png`
                      : null;
                      
                    return (
                      <button
                        key={index}
                        onClick={() => handleItemSelect(item)}
                        className="flex flex-col p-3 bg-slate-800/50 border border-slate-700 rounded-lg text-left hover:bg-slate-800 hover:border-blue-500/30 transition-all hover:shadow-md"
                      >
                        {selectionType === 'products' && (
                          <div className="w-16 h-16 rounded-lg overflow-hidden mb-2 bg-gradient-to-br from-blue-500/10 to-purple-500/10 relative">
                            {imagePath && (
                              <Image 
                                src={imagePath}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                        )}
                        {selectionType === 'services' && (
                          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-2 text-blue-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d={getServiceIcon(item.id)} />
                            </svg>
                          </div>
                        )}
                        <h4 className="font-medium text-white text-sm mb-0.5">{item.name}</h4>
                        <p className="text-xs text-blue-400 mb-1">
                          {selectionType === 'products' ? item.role : 'Service'}
                        </p>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {item.shortDescription || item.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <button 
        onClick={openModal}
        className={buttonClassName}
      >
        {buttonText}
      </button>
      
      {/* Use Portal to mount modal at document.body level to avoid positioning issues */}
      {isBrowser && showModal && createPortal(
        <Modal />,
        document.body
      )}
    </>
  );
}

// Function to get the SVG path for a service icon based on service ID
function getServiceIcon(serviceId: string): string {
  switch (serviceId) {
    case 'workflow-automation':
      return "M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z";
    case 'crm-integration':
      return "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z";
    case 'lead-generation':
      return "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z";
    case 'data-automation':
      return "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125";
    case 'voice-automation':
      return "M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z";
    default:
      return "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z";
  }
} 