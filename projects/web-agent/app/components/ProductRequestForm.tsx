'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import logger from '../utils/logger';
import WEBHOOK_ENDPOINTS from '../config/webhooks';
import { validateEmail, validatePhone, validateRequired } from '../utils/validation';

type Agent = {
  id: string;
  name: string;
  role: string;
  // Add other properties as needed
};

type ProductRequestFormProps = {
  agent: Agent;
  buttonClassName: string;
  buttonText: string;
};

export default function ProductRequestForm({ 
  agent, 
  buttonClassName, 
  buttonText 
}: ProductRequestFormProps) {
  // State for the request modal
  const [showRequestModal, setShowRequestModal] = useState(false);
  
  // State to track if we're in the browser environment
  const [isBrowser, setIsBrowser] = useState(false);
  
  // Form field values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: `I'm interested in the ${agent.name} (${agent.role}) agent. Please provide more information about implementation and pricing.`
  });
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  
  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs for form inputs to maintain focus
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const companyInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  
  // Track active input to restore focus after state changes
  const [activeField, setActiveField] = useState<string | null>(null);
  
  // Focus management
  useEffect(() => {
    if (!activeField) return;
    
    // Restore focus to the active field after state update
    switch (activeField) {
      case 'name':
        nameInputRef.current?.focus();
        break;
      case 'email':
        emailInputRef.current?.focus();
        break;
      case 'phone':
        phoneInputRef.current?.focus();
        break;
      case 'company':
        companyInputRef.current?.focus();
        break;
      case 'message':
        if (messageInputRef.current) {
          messageInputRef.current.focus();
          // Set cursor position at the end
          const length = messageInputRef.current.value.length;
          messageInputRef.current.setSelectionRange(length, length);
        }
        break;
    }
  }, [formData, activeField]);
  
  // Set browser state after component mounts
  useEffect(() => {
    setIsBrowser(true);
    
    // Add event listener for escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showRequestModal) {
        closeRequestModal();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showRequestModal]);
  
  // Universal change handler that preserves focus
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    // Track which field is currently active
    setActiveField(id);
    
    // Update the form data
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Validate the field
    let errorMessage = '';
    
    switch(id) {
      case 'name':
        if (!validateRequired(value)) {
          errorMessage = 'Name is required';
        }
        break;
      case 'email':
        if (!validateRequired(value)) {
          errorMessage = 'Email is required';
        } else if (!validateEmail(value)) {
          errorMessage = 'Please enter a valid email address';
        }
        break;
      case 'phone':
        if (value.trim() !== '' && !validatePhone(value)) {
          errorMessage = 'Please enter a valid phone number';
        }
        break;
      case 'message':
        if (!validateRequired(value)) {
          errorMessage = 'Message is required';
        }
        break;
    }
    
    // Update validation errors
    setValidationErrors(prev => ({
      ...prev,
      [id]: errorMessage
    }));
  };
  
  // Focus handlers for inputs
  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setActiveField(e.target.id);
  };
  
  // Open request modal
  const openRequestModal = () => {
    // Prevent scrolling when modal is open
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
    setShowRequestModal(true);
  };
  
  // Close request modal
  const closeRequestModal = () => {
    // Re-enable scrolling when modal is closed
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
    setShowRequestModal(false);
    setActiveField(null);
    
    // Reset form if not submitted successfully
    if (!isSubmitted) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: `I'm interested in the ${agent.name} (${agent.role}) agent. Please provide more information about implementation and pricing.`
      });
      
      // Reset validation errors
      setValidationErrors({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
      });
      
      setError(null);
    }
  };
  
  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop itself, not its children
    if (e.target === e.currentTarget) {
      closeRequestModal();
    }
  };
  
  // Handle form submission
  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newValidationErrors = { ...validationErrors };
    let hasErrors = false;
    
    // Check required fields
    if (!validateRequired(formData.name)) {
      newValidationErrors.name = 'Name is required';
      hasErrors = true;
    }
    
    if (!validateRequired(formData.email)) {
      newValidationErrors.email = 'Email is required';
      hasErrors = true;
    } else if (!validateEmail(formData.email)) {
      newValidationErrors.email = 'Please enter a valid email address';
      hasErrors = true;
    }
    
    if (formData.phone.trim() !== '' && !validatePhone(formData.phone)) {
      newValidationErrors.phone = 'Please enter a valid phone number';
      hasErrors = true;
    }
    
    if (!validateRequired(formData.message)) {
      newValidationErrors.message = 'Message is required';
      hasErrors = true;
    }
    
    // Update validation errors state
    setValidationErrors(newValidationErrors);
    
    // If there are validation errors, focus on the first field with an error
    if (hasErrors) {
      if (newValidationErrors.name) {
        nameInputRef.current?.focus();
      } else if (newValidationErrors.email) {
        emailInputRef.current?.focus();
      } else if (newValidationErrors.phone) {
        phoneInputRef.current?.focus();
      } else if (newValidationErrors.message) {
        messageInputRef.current?.focus();
      }
      return;
    }
    
    // If all validations pass, proceed with form submission
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create payload for API
      const payload = {
        // Standard customer fields 
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        customerCompany: formData.company,
        
        // Additional fields
        agentId: agent.id,
        agentName: agent.name,
        agentRole: agent.role,
        message: formData.message,
        requestDate: new Date().toISOString(),
        requestType: 'product',
        toolName: 'store-customer-info',
        // Generate a session ID
        sessionId: `${Date.now()}${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        timestamp: new Date().toISOString()
      };
      
      // Log payload for debugging (will be removed in production)
      console.log('Submitting product request:', payload);
      
      // Direct webhook call instead of using the API utility
      const webhookUrl = WEBHOOK_ENDPOINTS.BOOK_APPOINTMENT;
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      // Check if response is OK, don't try to parse JSON if it's not needed
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      
      // Check if the response has content before trying to parse it
      const contentType = response.headers.get('content-type');
      let responseData;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          responseData = await response.json();
          console.log('Response from API:', responseData);
        } catch (jsonError) {
          // Log but don't throw - we already got a successful status code
          console.warn('Could not parse JSON response:', jsonError);
        }
      } else {
        // For non-JSON responses, just log the status
        console.log('Request successful with status:', response.status);
      }
      
      // Set form as submitted successfully
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Close modal automatically after 3 seconds
      setTimeout(() => {
        closeRequestModal();
        
        // Reset form after closing
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          message: `I'm interested in the ${agent.name} (${agent.role}) agent. Please provide more information about implementation and pricing.`
        });
        setIsSubmitted(false);
        setError(null);
      }, 3000);
      
    } catch (error) {
      logger.error('Error submitting product request', error);
      setIsSubmitting(false);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  // The modal component
  const Modal = () => {
    return (
      <div 
        className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4 overflow-y-auto"
        onClick={handleBackdropClick}
      >
        <div 
          className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] my-4 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Close Button */}
          <button 
            onClick={closeRequestModal}
            className="absolute top-3 right-3 z-10 p-1 bg-slate-800/70 backdrop-blur-sm rounded-full text-slate-300 hover:text-white transition-colors"
            aria-label="Close request form"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-6 overflow-y-auto">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 mr-4 rounded-lg text-blue-400 flex items-center justify-center bg-slate-800/80 border border-slate-700/80 shadow-lg">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Request {agent.name}</h2>
                <p className="text-sm text-slate-400">{agent.role}</p>
              </div>
            </div>
            
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded mb-6"></div>
            
            {isSubmitted ? (
              <div className="bg-emerald-900/20 border border-emerald-600/30 rounded-lg p-4 text-center">
                <svg className="w-16 h-16 mx-auto text-emerald-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="text-lg font-medium text-emerald-300 mb-2">Request Submitted Successfully!</h3>
                <p className="text-slate-300 mb-1">Thank you for your interest in {agent.name}.</p>
                <p className="text-slate-400 text-sm">Our team will contact you shortly to discuss your requirements.</p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                {isSubmitting && (
                  <div className="bg-blue-900/30 border border-blue-600/40 rounded-lg p-4 mb-4 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 mr-3 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-blue-300 font-medium text-lg">Submitting...</span>
                  </div>
                )}
                <p className="text-slate-300 mb-4 text-sm">
                  Fill out the form below and our team will contact you to discuss how {agent.name} can help your business.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-slate-300 text-sm font-medium mb-1">Full Name <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      id="name"
                      ref={nameInputRef}
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={handleFocus}
                      className={`w-full bg-slate-800/50 border ${validationErrors.name ? 'border-red-500' : 'border-slate-700'} rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="John Doe"
                    />
                    {validationErrors.name && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-slate-300 text-sm font-medium mb-1">Email Address <span className="text-red-400">*</span></label>
                    <input
                      type="email"
                      id="email"
                      ref={emailInputRef}
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={handleFocus}
                      className={`w-full bg-slate-800/50 border ${validationErrors.email ? 'border-red-500' : 'border-slate-700'} rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="john@example.com"
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-slate-300 text-sm font-medium mb-1">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      ref={phoneInputRef}
                      value={formData.phone}
                      onChange={handleInputChange}
                      onFocus={handleFocus}
                      className={`w-full bg-slate-800/50 border ${validationErrors.phone ? 'border-red-500' : 'border-slate-700'} rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {validationErrors.phone && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-slate-300 text-sm font-medium mb-1">Company Name</label>
                    <input
                      type="text"
                      id="company"
                      ref={companyInputRef}
                      value={formData.company}
                      onChange={handleInputChange}
                      onFocus={handleFocus}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Acme Inc."
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-slate-300 text-sm font-medium mb-1">Message <span className="text-red-400">*</span></label>
                  <textarea
                    id="message"
                    ref={messageInputRef}
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    rows={4}
                    className={`w-full bg-slate-800/50 border ${validationErrors.message ? 'border-red-500' : 'border-slate-700'} rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Tell us about your requirements..."
                  ></textarea>
                  {validationErrors.message && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.message}</p>
                  )}
                </div>
                
                {error && (
                  <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-3 text-red-300 text-sm">
                    <p className="flex items-start">
                      <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {error}
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={closeRequestModal}
                    className="px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:scale-[1.02]"
                  >
                    {isSubmitting ? 'Processing...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <button 
        onClick={openRequestModal}
        className={buttonClassName}
      >
        {buttonText}
      </button>
      
      {/* Use Portal to mount modal at document.body level to avoid positioning issues */}
      {isBrowser && showRequestModal && createPortal(
        <Modal />,
        document.body
      )}
    </>
  );
} 