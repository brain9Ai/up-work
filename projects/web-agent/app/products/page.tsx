'use client';

import Link from 'next/link';
import Image from 'next/image';
import { siteData, agentIndustryMap, AgentIndustryMap } from '../data/siteData';
import Breadcrumb from '../components/Breadcrumb';
import { useState, useEffect } from 'react';
import ProductFilterSidebar from '../components/ProductFilterSidebar';
import Pagination from '../components/Pagination';
import { useSearchParams, useRouter } from 'next/navigation';
import WEBHOOK_ENDPOINTS from '../config/webhooks';

// Agent role icons as React components
const AgentIcons = {
  WebAgent: ({ className }: { className: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1 3"/>
    </svg>
  ),
  SalesAgent: ({ className }: { className: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 6H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 10H21V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 10L5 2H19L21 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 16C13.1046 16 14 15.1046 14 14C14 12.8954 13.1046 12 12 12C10.8954 12 10 12.8954 10 14C10 15.1046 10.8954 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 16L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 16L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  AppointmentAgent: ({ className }: { className: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 16L11 18L15 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  LeadGenAgent: ({ className }: { className: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 9V7C17 5.89543 16.1046 5 15 5H5C3.89543 5 3 5.89543 3 7V13C3 14.1046 3.89543 15 5 15H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 15C21 16.1046 20.1046 17 19 17L11 17C9.89543 17 9 16.1046 9 15L9 11C9 9.89543 9.89543 9 11 9L19 9C20.1046 9 21 9.89543 21 11L21 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 21H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 17V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  SocialMediaAgent: ({ className }: { className: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

// Helper function to get the right icon based on agent role
const getAgentIcon = (role: string) => {
  if (role.includes('Web')) return <AgentIcons.WebAgent className="w-full h-full" />;
  if (role.includes('Sales') || role.includes('Business Growth')) return <AgentIcons.SalesAgent className="w-full h-full" />;
  if (role.includes('Appointment')) return <AgentIcons.AppointmentAgent className="w-full h-full" />;
  if (role.includes('Lead')) return <AgentIcons.LeadGenAgent className="w-full h-full" />;
  if (role.includes('Social Media')) return <AgentIcons.SocialMediaAgent className="w-full h-full" />;
  
  // Default icon if no match
  return <AgentIcons.WebAgent className="w-full h-full" />;
};

// Function to map agent data to UI display format
const mapAgentToProduct = (agent: any) => {
  // Map of accent colors based on agent type
  const accentColors: { [key: string]: { accent: string, accent2: string, iconColor: string } } = {
    WebAgent: { 
      accent: 'from-blue-500 to-cyan-400', 
      accent2: 'from-cyan-300 to-blue-500', 
      iconColor: 'text-blue-400' 
    },
    'Sales Agent': { 
      accent: 'from-purple-500 to-pink-400', 
      accent2: 'from-pink-300 to-purple-500', 
      iconColor: 'text-purple-400' 
    },
    'Appointment Setter Agent': { 
      accent: 'from-emerald-500 to-teal-400', 
      accent2: 'from-teal-300 to-emerald-500', 
      iconColor: 'text-emerald-400' 
    },
    'Lead Generation Agent': { 
      accent: 'from-amber-500 to-orange-400', 
      accent2: 'from-orange-300 to-amber-500', 
      iconColor: 'text-amber-400' 
    },
    'Social Media Support Agent': { 
      accent: 'from-pink-500 to-red-400', 
      accent2: 'from-red-300 to-pink-500', 
      iconColor: 'text-pink-400' 
    }
  };

  // Get the accent colors based on role, or default to WebAgent colors
  // Extract the base role (first word) to handle variations like "WebAgent Pro"
  const baseRole = agent.role.split(' ')[0];
  const colorScheme = accentColors[baseRole] || accentColors.WebAgent;

  // Generate image path based on agent name - use only the first word of the name
  // This handles variations like "Anaya Pro" -> still using "anaya.png"
  const baseName = agent.name.toLowerCase().split(' ')[0];
  const imagePath = `/agents/${baseName}.png`;

  // Format agent ID for URLs - keep the full ID for variations
  const formattedId = agent.id;

  return {
    id: formattedId,
    name: agent.name,
    role: agent.role,
    description: agent.shortDescription, // Use shorter description in cards
    features: agent.features.slice(0, 5), // Take first 5 features for display
    image: imagePath,
    ctaText: `Hire ${agent.name}`,
    hasExternalSite: false,
    available: true,
    accent: colorScheme.accent,
    accent2: colorScheme.accent2,
    iconColor: colorScheme.iconColor,
    isFree: agent.isFree,
    pricing: agent.pricing
  };
};

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get products from siteData and map them to the display format
  const allProducts = siteData.products.map(mapAgentToProduct);

  // Agent-Industry mapping utility
  const getRecommendedIndustries = (agentName: string): string[] => {
    // Extract base name (e.g., "Anaya Pro" becomes "Anaya")
    const baseName = agentName.split(' ')[0];
    return agentIndustryMap[baseName]?.industries || [];
  };

  // Get industry specialization for an agent
  const getAgentIndustrySpecialization = (agentName: string): string => {
    // Extract base name (e.g., "Anaya Pro" becomes "Anaya")
    const baseName = agentName.split(' ')[0];
    return agentIndustryMap[baseName]?.specialization || '';
  };

  // Check if agent is suitable for a specific industry
  const isAgentSuitableForIndustry = (agentName: string, industry: string): boolean => {
    const baseName = agentName.split(' ')[0];
    return agentIndustryMap[baseName]?.industries.includes(industry.toLowerCase()) || false;
  };

  // Filter state
  const [filters, setFilters] = useState<Record<string, string[]>>({
    type: [],
    industry: [],
    pricing: [],
    feature: []
  });
  
  // Selected product for quick view
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  
  // Selected product for request modal
  const [requestProduct, setRequestProduct] = useState<any>(null);
  
  // Request form state
  const [requestForm, setRequestForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    submitting: false,
    submitted: false,
    error: null as string | null
  });
  
  // Validation state for the form
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  // Promotion banner state
  const [showPromoBanner, setShowPromoBanner] = useState(false);

  // Current page for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  
  // Initialize filters from URL
  useEffect(() => {
    const type = searchParams.get('type')?.split(',') || [];
    const industry = searchParams.get('industry')?.split(',') || [];
    const pricing = searchParams.get('pricing')?.split(',') || [];
    const feature = searchParams.get('feature')?.split(',') || [];
    
    setFilters({
      type: type.filter(Boolean),
      industry: industry.filter(Boolean),
      pricing: pricing.filter(Boolean),
      feature: feature.filter(Boolean)
    });
  }, [searchParams]);

  // Apply filters to products
  const filteredProducts = allProducts.filter(product => {
    // If no filters are selected, show all products
    const noFilters = Object.values(filters).every(filterGroup => filterGroup.length === 0);
    if (noFilters) return true;
    
    // Filter by agent type
    if (filters.type.length > 0) {
      const productType = product.role.toLowerCase().replace(/[^a-z0-9]/g, '');
      const matchesType = filters.type.some(type => {
        const cleanedType = type.toLowerCase().replace(/[^a-z0-9]/g, '');
        const isMatch = productType.includes(cleanedType);
        if (process.env.NODE_ENV === 'development') {
          console.debug(`Type filter - Product: "${product.role}" → "${productType}", Filter: "${type}" → "${cleanedType}", Match: ${isMatch}`);
        }
        return isMatch;
      });
      if (!matchesType) return false;
    }
    
    // Filter by industry
    if (filters.industry.length > 0) {
      // Get applicable industries for this product
      const applicableIndustries = getRecommendedIndustries(product.name);
      
      // Also check product text for industry mentions as fallback
      const productText = (product.name + ' ' + product.description + ' ' + product.role).toLowerCase();
      
      const matchesIndustry = filters.industry.some(industry => {
        // First check if the agent is applicable to this industry based on our mapping
        if (applicableIndustries.includes(industry.toLowerCase())) {
          return true;
        }
        // Then fall back to the original text-matching approach
        return productText.includes(industry.toLowerCase());
      });
      
      if (!matchesIndustry) return false;
    }
    
    // Filter by pricing
    if (filters.pricing.length > 0) {
      // Extract the pricing string from the product
      const productPriceString = product.pricing; // e.g. "Free", "Starting at $15/month", "$25/month"
      
      // Check if product matches any of the selected price filters
      const matchesPricing = filters.pricing.some(priceFilter => {
        // Free products
        if (priceFilter === 'free' && product.isFree) return true;
        
        // Extract price from string - look for numbers
        const priceMatch = productPriceString.match(/\$(\d+)/);
        const price = priceMatch ? parseInt(priceMatch[1], 10) : null;
    
        // Price doesn't exist, can't match price ranges
        if (price === null) return false;
        
        // Check price ranges
        switch(priceFilter) {
          case 'under_15':
            return price < 15 && !product.isFree;
          case '15_49':
            return price >= 15 && price <= 49;
          case '50_99':
            return price >= 50 && price <= 99;
          case '100_plus':
            return price >= 100;
          default:
            return false;
        }
      });
      
      if (!matchesPricing) return false;
    }
    
    // Filter by features
    if (filters.feature.length > 0) {
      const matchesFeature = filters.feature.some(feature => {
        return product.features.some((productFeature: string) => 
          productFeature.toLowerCase().includes(feature.toLowerCase())
        );
      });
      if (!matchesFeature) return false;
    }
    
    return true;
  });
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  
  // Handle filter change
  const handleFilterChange = (newFilters: Record<string, string[]>) => {
    setFilters(newFilters);
    
    // Reset to page 1 when filters change
    setCurrentPage(1);
    
    // Update URL with query parameters
    const params = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(key, values.join(','));
      }
    });
    
    // Set page to 1 when filters change
    params.set('page', '1');
    
    const newUrl = `/products?${params.toString()}`;
    router.push(newUrl);
  };
  
  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    
    // Update URL with the new page
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    
    const newUrl = `/products?${params.toString()}`;
    router.push(newUrl);
  };
  
  // Calculate active filter count
  const activeFilterCount = Object.values(filters).flat().length;
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      type: [],
      industry: [],
      pricing: [],
      feature: []
    });
    
    // Reset to page 1
    setCurrentPage(1);
    
    // Update URL - remove all query parameters
    router.push('/products');
  };
  
  // Handle quick view toggle
  const toggleQuickView = (product: any) => {
    if (quickViewProduct && quickViewProduct.id === product.id) {
      setQuickViewProduct(null);
    } else {
      setQuickViewProduct(product);
    }
  };

  // Close quick view
  const closeQuickView = () => {
    setQuickViewProduct(null);
  };
  
  // Handle industry tag click
  const handleIndustryTagClick = (industry: string) => {
    // Create a new filters object
    const newFilters = { ...filters };
    // Add the industry if it's not already in the filters
    if (!newFilters.industry.includes(industry)) {
      newFilters.industry = [...newFilters.industry, industry];
      // Update the filters
      setFilters(newFilters);
      
      // Close the quick view modal if open
      setQuickViewProduct(null);
      
      // Update URL with query parameters
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, values]) => {
        if (values.length > 0) {
          params.set(key, values.join(','));
        }
      });
      
      // Set page to 1 when filters change
      params.set('page', '1');
      
      const newUrl = `/products?${params.toString()}`;
      router.push(newUrl);
    }
  };
  
  // Parse the page from URL on component mount
  useEffect(() => {
    const pageParam = searchParams.get('page');
    if (pageParam) {
      const pageNumber = parseInt(pageParam, 10);
      if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      }
    } else {
      setCurrentPage(1);
    }
  }, [searchParams, totalPages]);

  // Handle opening the request modal
  const openRequestModal = (product: any) => {
    setRequestProduct(product);
    
    // Pre-populate message with product-specific text
    setRequestForm({
      ...requestForm,
      message: `I'm interested in the ${product.name} (${product.role}) agent. Please provide more information about implementation and pricing.`
    });
  };
  
  // Handle closing the request modal
  const closeRequestModal = () => {
    setRequestProduct(null);
    
    // Reset form if not submitted successfully
    if (!requestForm.submitted) {
      setRequestForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        submitting: false,
        submitted: false,
        error: null
      });
      
      // Reset validation errors
      setValidationErrors({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Update form data
    setRequestForm({
      ...requestForm,
      [name]: value
    });
    
    // Validate the field
    let errorMessage = '';
    
    switch(name) {
      case 'name':
        if (value.trim() === '') {
          errorMessage = 'Name is required';
        }
        break;
      case 'email':
        if (value.trim() === '') {
          errorMessage = 'Email is required';
        } else if (!value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
          errorMessage = 'Please enter a valid email address';
        }
        break;
      case 'phone':
        if (value.trim() !== '' && !value.match(/^(?:\+?\d{1,3}[- ]?)?\(?(?:\d{3})\)?[- ]?\d{3}[- ]?\d{4}$/)) {
          errorMessage = 'Please enter a valid phone number';
        }
        break;
      case 'message':
        if (value.trim() === '') {
          errorMessage = 'Message is required';
        }
        break;
    }
    
    // Update validation errors
    setValidationErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };
  
  // Handle form submission
  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      
    if (!requestProduct) return;
    
    // Validate all fields
    const newValidationErrors = { ...validationErrors };
    let hasErrors = false;
    
    // Check required fields
    if (requestForm.name.trim() === '') {
      newValidationErrors.name = 'Name is required';
      hasErrors = true;
    }
    
    if (requestForm.email.trim() === '') {
      newValidationErrors.email = 'Email is required';
      hasErrors = true;
    } else if (!requestForm.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      newValidationErrors.email = 'Please enter a valid email address';
      hasErrors = true;
    }
    
    if (requestForm.phone.trim() !== '' && !requestForm.phone.match(/^(?:\+?\d{1,3}[- ]?)?\(?(?:\d{3})\)?[- ]?\d{3}[- ]?\d{4}$/)) {
      newValidationErrors.phone = 'Please enter a valid phone number';
      hasErrors = true;
    }
    
    if (requestForm.message.trim() === '') {
      newValidationErrors.message = 'Message is required';
      hasErrors = true;
    }
    
    // Update validation errors
    setValidationErrors(newValidationErrors);
    
    // If there are errors, don't submit
    if (hasErrors) {
      return;
    }
    
    setRequestForm({
      ...requestForm,
      submitting: true,
      error: null
    });
    
    try {
      // Create payload for n8n webhook
      const payload = {
        agentId: requestProduct.id,
        agentName: requestProduct.name,
        agentRole: requestProduct.role,
        customerName: requestForm.name,
        customerEmail: requestForm.email,
        customerPhone: requestForm.phone,
        customerCompany: requestForm.company,
        customerMessage: requestForm.message,
        requestDate: new Date().toISOString(),
        toolName: 'store-customer-info',
        sessionId: `${Date.now()}${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        timestamp: new Date().toISOString(),
        requestType: 'product'
      };
      
      // Send to n8n webhook (replace with your actual webhook URL)
      const response = await fetch(WEBHOOK_ENDPOINTS.BOOK_APPOINTMENT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit request');
      }
      
      // Check if the response has content before trying to parse it
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const responseData = await response.json();
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
      setRequestForm({
        ...requestForm,
        submitting: false,
        submitted: true
      });
      
      // Close modal automatically after 3 seconds
      setTimeout(() => {
        closeRequestModal();
        
        // Reset form after closing
        setRequestForm({
          name: '',
          email: '',
          phone: '',
          company: '',
          message: '',
          submitting: false,
          submitted: false,
          error: null
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting request:', error);
      setRequestForm({
        ...requestForm,
        submitting: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    }
  };

  return (
    <>
      {/* Breadcrumb navigation - positioned at the root level outside the main element */}
      <div className="fixed-breadcrumb w-full">
        <Breadcrumb 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', isActive: true }
          ]}
          sticky={true}
        />
      </div>
      
      <div className="min-h-screen bg-slate-950 relative pb-8 pt-6 w-full">
        {/* Header section with animated gradient background */}
        <div className="relative py-6 overflow-hidden w-full">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-slate-950 z-0"></div>
          <div className="absolute inset-0 bg-circuit-pattern opacity-10 z-0"></div>
          
          <div className="max-w-[1200px] mx-auto px-4 sm:px-5 lg:px-6 relative z-10">
            <div className="text-center">
              <h1 className="mt-5 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 text-2xl md:text-3xl lg:text-4xl font-bold font-display tracking-wider relative inline-block">
                AI Agents Marketplace
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-shine"></span>
              </h1>
              <p className="mt-3 text-slate-300 text-base max-w-2xl mx-auto">
                Browse our collection of specialized AI agents designed to transform your business operations.
                Filter by type, industry, and features to find the perfect match.
              </p>
              
              {/* Add a special offer tag */}
              <div className="mt-4 inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 border border-blue-500/30 rounded-full">
                <span className="mr-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-xs">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <span className="text-blue-300 text-xs font-medium">Use code <span className="text-white font-bold">AIAGENT30</span> for 30% off your first purchase</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content area with products grid */}
        <main className="max-w-[1200px] mx-auto px-4 sm:px-5 lg:px-6 mt-2">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Sidebar for filters - only visible on desktop by default */}
            <div className="hidden md:block md:w-64 lg:w-72 flex-shrink-0 sticky top-24 self-start">
              <ProductFilterSidebar onFilterChange={handleFilterChange} />
            </div>
            
            {/* Filters toggle button - only visible on mobile */}
            <div className="md:hidden flex justify-between items-center bg-slate-900/90 backdrop-blur-sm p-3 rounded-lg mb-4 sticky top-20 z-20 shadow-md border border-slate-800/70">
              <button 
                onClick={() => document.getElementById('mobile-filters')?.classList.toggle('hidden')}
                className="flex items-center text-slate-200 text-sm font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm0 8a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm1 6a1 1 0 100 2h16a1 1 0 100-2H4z" />
                </svg>
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <div className="text-slate-400 text-sm">
                {filteredProducts.length} agents
              </div>
            </div>
            
            {/* Mobile filters - hidden by default */}
            <div id="mobile-filters" className="md:hidden mb-4 hidden">
              <ProductFilterSidebar onFilterChange={handleFilterChange} />
            </div>
            
            {/* Products grid */}
            <div className="flex-grow">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 bg-slate-900/50 rounded-lg border border-slate-800/50">
                  <svg className="w-16 h-16 mx-auto text-slate-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
                  </svg>
                  <h3 className="text-xl text-slate-300 font-medium mb-2">No agents match your selected filters</h3>
                  <p className="text-slate-400 mb-4">Try adjusting your filter criteria to see more results</p>
                  <button 
                    onClick={clearFilters}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <>
                  {/* Sorting and view options */}
                  <div className="flex justify-between items-center mb-4 bg-slate-900/80 backdrop-blur-sm p-3 rounded-lg shadow border border-slate-800/50">
                    <div className="text-slate-300 text-sm">
                      <span className="font-medium">{filteredProducts.length}</span> agents found
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-slate-400 text-sm hidden sm:inline">View:</span>
                      <div className="flex space-x-2">
                        <button className="text-blue-400 p-1 rounded hover:bg-slate-800 transition-colors">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                        </button>
                        <button className="text-slate-400 p-1 rounded hover:bg-slate-800 transition-colors">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                        </button>
                        <button className="text-slate-400 p-1 rounded hover:bg-slate-800 transition-colors">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                    {currentProducts.map((product) => (
                      <div 
                        key={product.id}
                        className="group relative overflow-hidden rounded-xl bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/10"
                      >
                        {/* Card Top Bar Accent */}
                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${product.accent}`}></div>
                        
                        {/* Background Glow Effect on Hover */}
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br ${product.accent}`}></div>
                        
                        {/* Quick View Overlay Button */}
                        <button
                          onClick={() => toggleQuickView(product)}
                          className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center z-10"
                          aria-label="Quick view"
                        >
                          <span className="sr-only">Quick view</span>
                          <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 transform scale-50 group-hover:scale-100 transition-all duration-300">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </div>
                        </button>
                        
                        {/* Product Tag */}
                        {product.isFree && (
                          <div className="absolute top-3 right-3 z-10">
                            <div className="bg-emerald-600/90 backdrop-blur-sm text-emerald-100 text-xs font-medium px-2.5 py-1 rounded-full flex items-center shadow-lg shadow-emerald-800/20">
                              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Free
                            </div>
                          </div>
                        )}
                        
                        <div className="p-4">
                          {/* Icon and Title */}
                          <div className="flex items-start mb-3">
                            <div className={`w-10 h-10 mr-3 rounded-lg ${product.iconColor} flex items-center justify-center bg-slate-800/80 border border-slate-700/80 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                              {getAgentIcon(product.role)}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors duration-300">{product.name}</h3>
                              <p className="text-sm text-slate-400">{product.role}</p>
                            </div>
                          </div>
                          
                          {/* Product Image - Only show for specific products */}
                          <div className="relative h-32 w-full mb-3 bg-slate-800/30 rounded-lg overflow-hidden group-hover:shadow-lg transform-gpu transition-all duration-500">
                          <Image 
                              src={product.image || "/agents/placeholder.png"}
                              alt={product.name}
                              className="object-contain transition-transform duration-500 group-hover:scale-110"
                              fill
                              priority
                          />
                        </div>
                          
                          {/* Description */}
                          <p className="text-slate-300 mb-4 text-sm line-clamp-2 group-hover:line-clamp-3 transition-all duration-300">
                            {product.description}
                          </p>
                          
                          {/* Recommended Industries */}
                          <div className="mb-4">
                            <h4 className="text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">Best For:</h4>
                            <div className="flex flex-wrap gap-1">
                              {getRecommendedIndustries(product.name).slice(0, 3).map((industry: string, index: number) => (
                                <button 
                                  key={industry} 
                                  onClick={() => handleIndustryTagClick(industry)}
                                  className="px-2 py-0.5 bg-purple-900/30 text-purple-400 text-xs rounded-full border border-purple-600/20 hover:bg-purple-800/40 transition-colors"
                                >
                                  {industry.charAt(0).toUpperCase() + industry.slice(1)}
                                </button>
                              ))}
                              {getRecommendedIndustries(product.name).length > 3 && (
                                <span className="px-2 py-0.5 bg-slate-800/50 text-slate-400 text-xs rounded-full">
                                  +{getRecommendedIndustries(product.name).length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Key Features - Shown on hover */}
                          <div className="mb-4 h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300 overflow-hidden">
                            <h4 className="text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">Key Features:</h4>
                            <ul className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                              {product.features.slice(0, 3).map((feature: string, index: number) => (
                                <li key={index} className="text-xs text-slate-400 flex items-start">
                                  <span className={`mr-2 text-${product.iconColor.split('-')[1]}-500`}>
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                      </div>
                          
                          {/* Pricing */}
                          <div className="mb-4">
                            <p className="text-sm text-slate-400">
                              <span className="font-medium text-slate-300">Pricing: </span>
                              {product.isFree ? (
                                <span className="text-emerald-400 font-medium">Free</span>
                              ) : (
                                <span className="text-slate-300">{product.pricing}</span>
                              )}
                            </p>
                    </div>
                          
                          {/* Action Buttons */}
                          <div className="flex flex-col space-y-2">
                            {/* Product detail link */}
                      <Link 
                              href={`/products/${product.id}`}
                              className={`w-full py-2 text-center rounded-lg bg-gradient-to-r ${product.accent} text-white font-medium text-sm transition-all hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                            >
                              Learn More
                            </Link>
                            
                            {/* Action row */}
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => openRequestModal(product)}
                                className="flex-grow py-2 px-3 text-center rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-medium text-sm transition-all hover:shadow-lg"
                              >
                                <span className="flex items-center justify-center">
                                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                                  Request Now
                        </span>
                              </button>
                              <button
                                onClick={() => toggleQuickView(product)}
                                className="p-2 rounded-lg border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
                                aria-label="Quick view"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                            </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
                  
                  {/* Pagination */}
                  {filteredProducts.length > productsPerPage && (
                    <Pagination 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      className="mt-8"
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </main>
          </div>
          
      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Close Button */}
            <button 
              onClick={closeQuickView}
              className="absolute top-3 right-3 z-10 p-1 bg-slate-800/70 backdrop-blur-sm rounded-full text-slate-300 hover:text-white transition-colors"
              aria-label="Close quick view"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="overflow-auto hide-scrollbar">
              <div className="flex flex-col lg:flex-row p-6 gap-8">
                {/* Product Image */}
                <div className="lg:w-1/3 flex-shrink-0">
                  <div className="relative w-full h-64 lg:h-80 bg-slate-800/30 rounded-lg overflow-hidden shadow-xl">
                    <Image
                      src={quickViewProduct.image || "/agents/placeholder.png"}
                      alt={quickViewProduct.name}
                      className="object-contain"
                      fill
                      priority
                    />
                    {/* Accent color top bar */}
                    <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${quickViewProduct.accent}`}></div>
                  </div>
                  </div>
                  
                {/* Product Details */}
                <div className="lg:w-2/3">
                  <div className="flex items-center mb-4">
                    <div className={`w-14 h-14 mr-4 rounded-lg ${quickViewProduct.iconColor} flex items-center justify-center bg-slate-800/80 border border-slate-700/80 shadow-lg`}>
                      {getAgentIcon(quickViewProduct.role)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{quickViewProduct.name}</h2>
                      <p className="text-md text-slate-400">{quickViewProduct.role}</p>
                    </div>
                    {quickViewProduct.isFree && (
                      <div className="ml-auto">
                        <div className="bg-emerald-600/90 backdrop-blur-sm text-emerald-100 text-sm font-medium px-3 py-1 rounded-full flex items-center shadow-lg shadow-emerald-800/20">
                          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Free Agent
                        </div>
                      </div>
                    )}
                    </div>

                  <div className={`h-1 w-full bg-gradient-to-r ${quickViewProduct.accent} rounded mb-4`}></div>

                  <div className="mb-6">
                    <p className="text-slate-300 mb-4">
                      {quickViewProduct.description}
                    </p>
                    <p className="text-sm text-slate-400">
                      <span className="font-medium text-slate-300">Pricing: </span>
                      {quickViewProduct.isFree ? (
                        <span className="text-emerald-400 font-medium">Free</span>
                      ) : (
                        <span className="text-slate-300">{quickViewProduct.pricing}</span>
                      )}
                    </p>
                  </div>

                  {/* Industry Compatibility */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-slate-200 mb-3">Ideal For Industries:</h3>
                    {getAgentIndustrySpecialization(quickViewProduct.name) && (
                      <p className="text-sm text-slate-300 mb-3 italic">
                        "{getAgentIndustrySpecialization(quickViewProduct.name)}"
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {getRecommendedIndustries(quickViewProduct.name).map((industry: string) => (
                        <button 
                          key={industry} 
                          onClick={() => handleIndustryTagClick(industry)}
                          className="px-3 py-1 bg-purple-900/30 text-purple-400 text-sm rounded-full border border-purple-600/20 hover:bg-purple-800/40 transition-colors"
                        >
                          {industry.charAt(0).toUpperCase() + industry.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-slate-200 mb-3">Key Features:</h3>
                    <ul className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {quickViewProduct.features.slice(0, 6).map((feature: string, index: number) => (
                        <li key={index} className="text-sm text-slate-400 flex items-start">
                          <span className={`mr-2 text-${quickViewProduct.iconColor.split('-')[1]}-500`}>
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    </div>

                  <div className="flex items-center space-x-4 mt-6">
                    {/* View Details Link */}
                    <Link 
                      href={`/products/${quickViewProduct.id}`}
                      className={`flex-grow py-3 px-6 text-center rounded-lg bg-gradient-to-r ${quickViewProduct.accent} text-white font-medium transition-all hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      View Full Details
                    </Link>
                    
                    {/* Request Button */}
                    <button 
                      onClick={() => {
                        closeQuickView();
                        openRequestModal(quickViewProduct);
                      }}
                      className="py-3 px-6 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-medium transition-all"
                    >
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Request Now
                      </span>
                    </button>
                    
                    {/* Close Button */}
                    <button
                      onClick={closeQuickView}
                      className="p-3 rounded-lg border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Request Modal */}
      {requestProduct && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
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

            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 mr-4 rounded-lg ${requestProduct.iconColor} flex items-center justify-center bg-slate-800/80 border border-slate-700/80 shadow-lg`}>
                  {getAgentIcon(requestProduct.role)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Request {requestProduct.name}</h2>
                  <p className="text-sm text-slate-400">{requestProduct.role}</p>
                </div>
              </div>
              
              <div className={`h-1 w-full bg-gradient-to-r ${requestProduct.accent} rounded mb-6`}></div>
              
              {requestForm.submitted ? (
                <div className="bg-emerald-900/20 border border-emerald-600/30 rounded-lg p-4 text-center">
                  <svg className="w-16 h-16 mx-auto text-emerald-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <h3 className="text-lg font-medium text-emerald-300 mb-2">Request Submitted Successfully!</h3>
                  <p className="text-slate-300 mb-1">Thank you for your interest in {requestProduct.name}.</p>
                  <p className="text-slate-400 text-sm">Our team will contact you shortly to discuss your requirements.</p>
                </div>
              ) : (
                <form onSubmit={handleRequestSubmit} className="space-y-4">
                  <p className="text-slate-300 mb-4 text-sm">
                    Fill out the form below and our team will contact you to discuss how {requestProduct.name} can help your business.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-slate-300 text-sm font-medium mb-1">Full Name <span className="text-red-400">*</span></label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={requestForm.name}
                        onChange={handleInputChange}
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
                        name="email"
                        required
                        value={requestForm.email}
                        onChange={handleInputChange}
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
                        name="phone"
                        value={requestForm.phone}
                        onChange={handleInputChange}
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
                        name="company"
                        value={requestForm.company}
                        onChange={handleInputChange}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Acme Inc."
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-slate-300 text-sm font-medium mb-1">Message <span className="text-red-400">*</span></label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={requestForm.message}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full bg-slate-800/50 border ${validationErrors.message ? 'border-red-500' : 'border-slate-700'} rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Tell us about your requirements..."
                    ></textarea>
                    {validationErrors.message && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.message}</p>
                    )}
                  </div>
                  
                  {requestForm.error && (
                    <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-3 text-red-300 text-sm">
                      <p className="flex items-start">
                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {requestForm.error}
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
                      disabled={requestForm.submitting}
                      className={`px-6 py-2 bg-gradient-to-r ${requestProduct.accent} text-white rounded-lg font-medium transition-all hover:shadow-lg ${requestForm.submitting ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                    >
                      {requestForm.submitting ? (
                        <span className="flex items-center">
                          <svg className="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : 'Submit Request'}
                    </button>
                  </div>
                </form>
              )}
          </div>
        </div>
      </div>
      )}
    </>
  );
};

export default ProductsPage; 