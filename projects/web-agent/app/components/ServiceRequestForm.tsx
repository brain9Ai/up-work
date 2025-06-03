'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import WEBHOOK_ENDPOINTS from '../config/webhooks';
import { validateEmail, validatePhone, validateRequired } from '../utils/validation';

type Service = {
  id: string;
  name: string;
  description?: string;
  pricingTiers?: Array<{
    name: string;
    price: string;
  }>;
};

type ServiceRequestFormProps = {
  service: Service;
  buttonClassName: string;
  buttonText: string | React.ReactNode;
  selectedTier?: string;
};

export default function ServiceRequestForm({ 
  service, 
  buttonClassName, 
  buttonText,
  selectedTier
}: ServiceRequestFormProps) {
  // State for the request modal
  const [showRequestModal, setShowRequestModal] = useState(false);
  
  // State to track if we're in the browser environment
  const [isBrowser, setIsBrowser] = useState(false);
  
  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  // Step 1: Basic Info - with focused state management
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });
  
  // Step 2: Project Details
  const [projectDetails, setProjectDetails] = useState({
    projectTitle: '',
    pricingTier: selectedTier || '',
    timeline: 'Flexible',
    budget: ''
  });
  
  // Step 3: Technical Requirements
  const [technicalDetails, setTechnicalDetails] = useState({
    requirements: '',
    existingTech: '',
    integrations: '',
    additionalInfo: ''
  });
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectTitle: '',
    pricingTier: '',
    timeline: '',
    budget: '',
    requirements: '',
    existingTech: '',
    integrations: '',
    additionalInfo: ''
  });
  
  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs for form inputs to maintain focus - Step 1
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const companyInputRef = useRef<HTMLInputElement>(null);
  
  // Refs for form inputs - Step 2
  const projectTitleRef = useRef<HTMLInputElement>(null);
  const pricingTierRef = useRef<HTMLSelectElement>(null);
  const timelineRef = useRef<HTMLSelectElement>(null);
  const budgetRef = useRef<HTMLSelectElement>(null);
  
  // Refs for form inputs - Step 3
  const requirementsRef = useRef<HTMLTextAreaElement>(null);
  const existingTechRef = useRef<HTMLTextAreaElement>(null);
  const integrationsRef = useRef<HTMLTextAreaElement>(null);
  const additionalInfoRef = useRef<HTMLTextAreaElement>(null);
  
  // Track active input to restore focus after state changes
  const [activeField, setActiveField] = useState<string | null>(null);
  
  // Focus management - restore focus after state updates
  useEffect(() => {
    if (!activeField) return;
    
    // Restore focus based on current step
    switch (currentStep) {
      case 1:
        // Step 1: Basic Info fields
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
        }
        break;
        
      case 2:
        // Step 2: Project Details fields
        switch (activeField) {
          case 'projectTitle':
            projectTitleRef.current?.focus();
            break;
          case 'pricingTier':
            pricingTierRef.current?.focus();
            break;
          case 'timeline':
            timelineRef.current?.focus();
            break;
          case 'budget':
            budgetRef.current?.focus();
            break;
        }
        break;
        
      case 3:
        // Step 3: Technical Requirements fields
        switch (activeField) {
          case 'requirements':
            if (requirementsRef.current) {
              requirementsRef.current.focus();
              // Set cursor position at the end
              const length = requirementsRef.current.value.length;
              requirementsRef.current.setSelectionRange(length, length);
            }
            break;
          case 'existingTech':
            if (existingTechRef.current) {
              existingTechRef.current.focus();
              // Set cursor position at the end
              const length = existingTechRef.current.value.length;
              existingTechRef.current.setSelectionRange(length, length);
            }
            break;
          case 'integrations':
            if (integrationsRef.current) {
              integrationsRef.current.focus();
              // Set cursor position at the end
              const length = integrationsRef.current.value.length;
              integrationsRef.current.setSelectionRange(length, length);
            }
            break;
          case 'additionalInfo':
            if (additionalInfoRef.current) {
              additionalInfoRef.current.focus();
              // Set cursor position at the end
              const length = additionalInfoRef.current.value.length;
              additionalInfoRef.current.setSelectionRange(length, length);
            }
            break;
        }
        break;
    }
  }, [basicInfo, projectDetails, technicalDetails, activeField, currentStep]);
  
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
  
  // Universal change handler for Step 1 fields that preserves focus
  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    // Track which field is currently active
    setActiveField(id);
    
    // Update the form data
    setBasicInfo(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Validate the field
    let errorMessage = '';
    
    if (id === 'name' && value.trim() === '') {
      errorMessage = 'Name is required';
    } else if (id === 'email') {
      if (value.trim() === '') {
        errorMessage = 'Email is required';
      } else if (!validateEmail(value)) {
        errorMessage = 'Please enter a valid email address';
      }
    } else if (id === 'phone' && value.trim() !== '' && !validatePhone(value)) {
      errorMessage = 'Please enter a valid phone number';
    }
    
    // Update validation errors for the current field
    setValidationErrors(prev => ({
      ...prev,
      [id]: errorMessage
    }));
  };
  
  // Universal change handler for Step 2 fields
  const handleProjectDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    
    // Track which field is currently active
    setActiveField(id);
    
    // Update the form data
    setProjectDetails(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Validate the field
    let errorMessage = '';
    
    if (id === 'projectTitle' && value.trim() === '') {
      errorMessage = 'Project title is required';
    }
    
    // Update validation errors
    setValidationErrors(prev => ({
      ...prev,
      [id]: errorMessage
    }));
  };
  
  // Universal change handler for Step 3 fields
  const handleTechnicalDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    // Track which field is currently active
    setActiveField(id);
    
    // Update the form data
    setTechnicalDetails(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Validate the field
    let errorMessage = '';
    
    if (id === 'requirements' && value.trim() === '') {
      errorMessage = 'Project requirements are required';
    }
    
    // Update validation errors
    setValidationErrors(prev => ({
      ...prev,
      [id]: errorMessage
    }));
  };
  
  // Focus handlers for inputs
  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setActiveField(e.target.id);
  };
  
  // Open request modal
  const openRequestModal = () => {
    // Prevent scrolling when modal is open
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
    
    // If tier was selected, set it in the form
    if (selectedTier) {
      setProjectDetails(prev => ({
        ...prev,
        pricingTier: selectedTier
      }));
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
      // Reset all form fields
      setBasicInfo({
        name: '',
        email: '',
        phone: '',
        company: ''
      });
      
      setProjectDetails({
        projectTitle: '',
        pricingTier: selectedTier || '',
        timeline: 'Flexible',
        budget: ''
      });
      
      setTechnicalDetails({
        requirements: '',
        existingTech: '',
        integrations: '',
        additionalInfo: ''
      });
      
      // Reset validation errors
      setValidationErrors({
        name: '',
        email: '',
        phone: '',
        company: '',
        projectTitle: '',
        pricingTier: '',
        timeline: '',
        budget: '',
        requirements: '',
        existingTech: '',
        integrations: '',
        additionalInfo: ''
      });
      
      setError(null);
      
      // Reset step to 1
      setCurrentStep(1);
    }
  };
  
  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop itself, not its children
    if (e.target === e.currentTarget) {
      closeRequestModal();
    }
  };
  
  // Go to next step
  const nextStep = () => {
    // Only proceed if required fields are filled
    if (areRequiredFieldsFilled()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      setActiveField(null); // Clear active field when changing steps
    } else {
      // Set validation errors for the current step
      const newValidationErrors = { ...validationErrors };
      
      if (currentStep === 1) {
        if (!basicInfo.name.trim()) {
          newValidationErrors.name = 'Name is required';
        }
        if (!basicInfo.email.trim()) {
          newValidationErrors.email = 'Email is required';
        } else if (!validateEmail(basicInfo.email)) {
          newValidationErrors.email = 'Please enter a valid email address';
        }
        if (basicInfo.phone.trim() !== '' && !validatePhone(basicInfo.phone)) {
          newValidationErrors.phone = 'Please enter a valid phone number';
        }
      } else if (currentStep === 2) {
        if (!projectDetails.projectTitle.trim()) {
          newValidationErrors.projectTitle = 'Project title is required';
        }
      } else if (currentStep === 3) {
        if (!technicalDetails.requirements.trim()) {
          newValidationErrors.requirements = 'Project requirements are required';
        }
      }
      
      setValidationErrors(newValidationErrors);
    }
  };
  
  // Go to previous step
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setActiveField(null); // Clear active field when changing steps
  };
  
  // Handle form submission
  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields based on current step
    const newValidationErrors = { ...validationErrors };
    let hasErrors = false;
    
    // Validate based on current step
    if (currentStep === 1) {
      // Validate Step 1: Basic Info
      if (!validateRequired(basicInfo.name)) {
        newValidationErrors.name = 'Name is required';
        hasErrors = true;
      }
      
      if (!validateRequired(basicInfo.email)) {
        newValidationErrors.email = 'Email is required';
        hasErrors = true;
      } else if (!validateEmail(basicInfo.email)) {
        newValidationErrors.email = 'Please enter a valid email address';
        hasErrors = true;
      }
      
      if (basicInfo.phone.trim() !== '' && !validatePhone(basicInfo.phone)) {
        newValidationErrors.phone = 'Please enter a valid phone number';
        hasErrors = true;
      }
      
      // Focus the first field with error
      if (hasErrors) {
        setValidationErrors(newValidationErrors);
        if (newValidationErrors.name) {
          nameInputRef.current?.focus();
        } else if (newValidationErrors.email) {
          emailInputRef.current?.focus();
        } else if (newValidationErrors.phone) {
          phoneInputRef.current?.focus();
        }
        return;
      }
      
      // If no errors, proceed to next step
      nextStep();
      return;
    } else if (currentStep === 2) {
      // Validate Step 2: Project Details
      if (!validateRequired(projectDetails.projectTitle)) {
        newValidationErrors.projectTitle = 'Project title is required';
        hasErrors = true;
      }
      
      // Focus the first field with error
      if (hasErrors) {
        setValidationErrors(newValidationErrors);
        if (newValidationErrors.projectTitle) {
          projectTitleRef.current?.focus();
        }
        return;
      }
      
      // If no errors, proceed to next step
      nextStep();
      return;
    } else if (currentStep === 3) {
      // Validate Step 3: Technical Requirements
      if (!validateRequired(technicalDetails.requirements)) {
        newValidationErrors.requirements = 'Project requirements are required';
        hasErrors = true;
      }
      
      // Focus the first field with error
      if (hasErrors) {
        setValidationErrors(newValidationErrors);
        if (newValidationErrors.requirements) {
          requirementsRef.current?.focus();
        }
        return;
      }
      
      // All steps are valid, proceed with form submission
      setIsSubmitting(true);
      setError(null);
      
      try {
        // Create payload for API
        const payload = {
          // Standard customer fields
          customerName: basicInfo.name,
          customerEmail: basicInfo.email,
          customerPhone: basicInfo.phone,
          customerCompany: basicInfo.company,
          
          // Additional fields
          serviceId: service.id,
          serviceName: service.name,
          projectTitle: projectDetails.projectTitle,
          pricingTier: projectDetails.pricingTier,
          timeline: projectDetails.timeline,
          budget: projectDetails.budget,
          requirements: technicalDetails.requirements,
          existingTech: technicalDetails.existingTech,
          integrations: technicalDetails.integrations,
          additionalInfo: technicalDetails.additionalInfo,
          requestDate: new Date().toISOString(),
          requestType: 'service',
          toolName: 'store-customer-info',
          // Generate a session ID
          sessionId: `${Date.now()}${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
          timestamp: new Date().toISOString()
        };
        
        // Log payload for debugging (will be removed in production)
        console.log('Submitting service request:', payload);
        
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
        
        // Close modal automatically after 5 seconds
        setTimeout(() => {
          closeRequestModal();
          
          // Reset form after closing
          setBasicInfo({
            name: '',
            email: '',
            phone: '',
            company: ''
          });
          
          setProjectDetails({
            projectTitle: '',
            pricingTier: selectedTier || '',
            timeline: 'Flexible',
            budget: ''
          });
          
          setTechnicalDetails({
            requirements: '',
            existingTech: '',
            integrations: '',
            additionalInfo: ''
          });
          
          setIsSubmitted(false);
          setError(null);
          
          // Reset step
          setCurrentStep(1);
        }, 5000);
        
      } catch (error) {
        console.error('Error submitting service request:', error);
        setIsSubmitting(false);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      }
    }
  };

  // Step indicator component
  const StepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-6">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                currentStep === step 
                  ? 'bg-blue-500 text-white' 
                  : currentStep > step 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-slate-700 text-slate-300'
              }`}
            >
              {currentStep > step ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step
              )}
            </div>
            {step < totalSteps && (
              <div className={`w-10 h-1 mx-1 ${
                currentStep > step ? 'bg-emerald-500' : 'bg-slate-700'
              }`}></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render form based on current step
  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h3 className="text-lg font-semibold text-white mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-slate-300 text-sm font-medium mb-1">Full Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  id="name"
                  ref={nameInputRef}
                  required
                  value={basicInfo.name}
                  onChange={handleBasicInfoChange}
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
                  value={basicInfo.email}
                  onChange={handleBasicInfoChange}
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
                  value={basicInfo.phone}
                  onChange={handleBasicInfoChange}
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
                  value={basicInfo.company}
                  onChange={handleBasicInfoChange}
                  onFocus={handleFocus}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Acme Inc."
                />
              </div>
            </div>
          </>
        );
      
      case 2:
        return (
          <>
            <h3 className="text-lg font-semibold text-white mb-3">Project Details</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="projectTitle" className="block text-slate-300 text-sm font-medium mb-1">Project Title <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  id="projectTitle"
                  ref={projectTitleRef}
                  required
                  value={projectDetails.projectTitle}
                  onChange={handleProjectDetailsChange}
                  onFocus={handleFocus}
                  className={`w-full bg-slate-800/50 border ${validationErrors.projectTitle ? 'border-red-500' : 'border-slate-700'} rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="E.g., Customer Support Automation"
                />
                {validationErrors.projectTitle && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.projectTitle}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="pricingTier" className="block text-slate-300 text-sm font-medium mb-1">Preferred Service Tier</label>
                <select
                  id="pricingTier"
                  ref={pricingTierRef}
                  value={projectDetails.pricingTier}
                  onChange={handleProjectDetailsChange}
                  onFocus={handleFocus}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a service tier</option>
                  {service.pricingTiers?.map((tier, index) => (
                    <option key={index} value={tier.name}>
                      {tier.name} ({tier.price})
                    </option>
                  ))}
                  <option value="Custom">Custom (Let's discuss)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="timeline" className="block text-slate-300 text-sm font-medium mb-1">Project Timeline</label>
                <select
                  id="timeline"
                  ref={timelineRef}
                  value={projectDetails.timeline}
                  onChange={handleProjectDetailsChange}
                  onFocus={handleFocus}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Urgent">Urgent (ASAP)</option>
                  <option value="1-4 weeks">1-4 weeks</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3+ months">3+ months</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="budget" className="block text-slate-300 text-sm font-medium mb-1">Budget Range</label>
                <select
                  id="budget"
                  ref={budgetRef}
                  value={projectDetails.budget}
                  onChange={handleProjectDetailsChange}
                  onFocus={handleFocus}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select your budget range</option>
                  <option value="Under $5,000">Under $5,000</option>
                  <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                  <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                  <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                  <option value="$50,000+">$50,000+</option>
                  <option value="Not sure">Not sure yet</option>
                </select>
              </div>
            </div>
          </>
        );
        
      case 3:
        return (
          <>
            <h3 className="text-lg font-semibold text-white mb-3">Technical Requirements</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="requirements" className="block text-slate-300 text-sm font-medium mb-1">Project Requirements <span className="text-red-400">*</span></label>
                <textarea
                  id="requirements"
                  ref={requirementsRef}
                  required
                  value={technicalDetails.requirements}
                  onChange={handleTechnicalDetailsChange}
                  onFocus={handleFocus}
                  rows={3}
                  className={`w-full bg-slate-800/50 border ${validationErrors.requirements ? 'border-red-500' : 'border-slate-700'} rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Describe what you want to achieve with this service..."
                ></textarea>
                {validationErrors.requirements && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.requirements}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="existingTech" className="block text-slate-300 text-sm font-medium mb-1">Existing Technology</label>
                <textarea
                  id="existingTech"
                  ref={existingTechRef}
                  value={technicalDetails.existingTech}
                  onChange={handleTechnicalDetailsChange}
                  onFocus={handleFocus}
                  rows={2}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="List any existing systems, platforms, or technologies you're using..."
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="integrations" className="block text-slate-300 text-sm font-medium mb-1">Desired Integrations</label>
                <textarea
                  id="integrations"
                  ref={integrationsRef}
                  value={technicalDetails.integrations}
                  onChange={handleTechnicalDetailsChange}
                  onFocus={handleFocus}
                  rows={2}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="List any systems you'd like to integrate with (CRM, ERP, etc.)..."
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="additionalInfo" className="block text-slate-300 text-sm font-medium mb-1">Additional Information</label>
                <textarea
                  id="additionalInfo"
                  ref={additionalInfoRef}
                  value={technicalDetails.additionalInfo}
                  onChange={handleTechnicalDetailsChange}
                  onFocus={handleFocus}
                  rows={2}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any other details that would help us understand your project better..."
                ></textarea>
              </div>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  // Add function to check if the required fields are filled for the current step
  const areRequiredFieldsFilled = () => {
    switch (currentStep) {
      case 1:
        // Check required fields for step 1: name and email
        return basicInfo.name.trim() !== '' && 
               basicInfo.email.trim() !== '' && 
               validateEmail(basicInfo.email) && 
               (basicInfo.phone.trim() === '' || validatePhone(basicInfo.phone));
      case 2:
        // Check required fields for step 2: project title
        return projectDetails.projectTitle.trim() !== '';
      case 3:
        // Check required fields for step 3: requirements
        return technicalDetails.requirements.trim() !== '';
      default:
        return true;
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
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] my-4 flex flex-col"
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{service.name} Service Request</h2>
                <p className="text-sm text-slate-400">{service.description || 'Custom AI automation solution'}</p>
              </div>
            </div>
            
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded mb-6"></div>
            
            {isSubmitted ? (
              <div className="bg-emerald-900/20 border border-emerald-600/30 rounded-lg p-4 text-center">
                <svg className="w-16 h-16 mx-auto text-emerald-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="text-lg font-medium text-emerald-300 mb-2">Project Request Submitted!</h3>
                <p className="text-slate-300 mb-1">Thank you for your interest in our {service.name} service.</p>
                <p className="text-slate-400 text-sm">Our team will review your requirements and contact you within 24-48 hours to discuss next steps.</p>
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
                  Tell us about your project needs and our team will create a custom {service.name} solution tailored to your business.
                </p>
                
                {/* Step indicator */}
                <StepIndicator />
                
                {/* Dynamic form content based on current step */}
                {renderFormStep()}
                
                {/* Display errors */}
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
                
                {/* Form navigation buttons */}
                <div className="flex justify-between space-x-3 pt-2">
                  {currentStep === 1 ? (
                    <button
                      type="button"
                      onClick={closeRequestModal}
                      className="px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:border-slate-500 hover:text-white transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </button>
                  )}
                  
                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!areRequiredFieldsFilled()}
                      className={`px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:scale-[1.02] flex items-center ${!areRequiredFieldsFilled() ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Next
                      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:scale-[1.02]"
                    >
                      {isSubmitting ? 'Processing...' : 'Submit Request'}
                    </button>
                  )}
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