'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FilterOption {
  id: string;
  label: string;
}

// Price Range Slider Component
const PriceRangeSlider = ({ 
  minPrice = 0, 
  maxPrice = 300, 
  currentMin, 
  currentMax, 
  onRangeChange
}: { 
  minPrice?: number;
  maxPrice?: number;
  currentMin: number;
  currentMax: number;
  onRangeChange: (min: number, max: number) => void;
}) => {
  const [min, setMin] = useState(currentMin);
  const [max, setMax] = useState(currentMax);
  
  // Calculate percentage for the range fill
  const leftPercentage = Math.floor((min / maxPrice) * 100);
  const rightPercentage = 100 - Math.floor((max / maxPrice) * 100);
  
  // Apply changes after a small delay to prevent too many updates
  const applyChanges = () => {
    onRangeChange(min, max);
  };
  
  return (
    <div className="px-2 py-4">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-xs text-slate-400 mr-1">$</span>
          <input 
            type="number" 
            min={minPrice}
            max={max - 1}
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
            onBlur={applyChanges}
            className="w-14 h-7 bg-slate-800 text-slate-300 text-xs rounded border border-slate-600 px-2"
          />
        </div>
        <div className="text-xs text-slate-400 mx-2">to</div>
        <div className="flex items-center">
          <span className="text-xs text-slate-400 mr-1">$</span>
          <input 
            type="number" 
            min={min + 1}
            max={maxPrice}
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
            onBlur={applyChanges}
            className="w-14 h-7 bg-slate-800 text-slate-300 text-xs rounded border border-slate-600 px-2"
          />
        </div>
      </div>
      
      {/* Range slider track */}
      <div className="relative h-1.5 bg-slate-700 rounded-full">
        {/* Fill between thumbs */}
        <div 
          className="absolute h-full bg-green-500 rounded-full transition-all duration-300 ease-out"
          style={{
            left: `${leftPercentage}%`,
            right: `${rightPercentage}%`
          }}
        ></div>
        
        {/* Price markers on the track */}
        <div className="absolute h-3 w-1 bg-slate-600 top-1/2 -translate-y-1/2" style={{ left: "0%" }}></div>
        <div className="absolute h-2 w-0.5 bg-slate-600 top-1/2 -translate-y-1/2" style={{ left: "25%" }}></div>
        <div className="absolute h-2 w-0.5 bg-slate-600 top-1/2 -translate-y-1/2" style={{ left: "50%" }}></div>
        <div className="absolute h-2 w-0.5 bg-slate-600 top-1/2 -translate-y-1/2" style={{ left: "75%" }}></div>
        <div className="absolute h-3 w-1 bg-slate-600 top-1/2 -translate-y-1/2" style={{ left: "100%" }}></div>
        
        {/* Min thumb */}
        <input 
          type="range"
          min={minPrice}
          max={maxPrice}
          value={min}
          onChange={(e) => {
            const value = Number(e.target.value);
            setMin(value < max ? value : max - 1);
          }}
          onMouseUp={applyChanges}
          onTouchEnd={applyChanges}
          className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none range-thumb-green"
        />
        
        {/* Max thumb */}
        <input 
          type="range"
          min={minPrice}
          max={maxPrice}
          value={max}
          onChange={(e) => {
            const value = Number(e.target.value);
            setMax(value > min ? value : min + 1);
          }}
          onMouseUp={applyChanges}
          onTouchEnd={applyChanges}
          className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none range-thumb-green"
        />
      </div>
      
      {/* Price guide markers */}
      <div className="flex justify-between mt-1.5 text-[10px] text-slate-500">
        <span>$0</span>
        <span>$100</span>
        <span>$200</span>
        <span>$300+</span>
      </div>
    </div>
  );
};

export interface ProductFilterProps {
  onFilterChange?: (filters: Record<string, string[]>) => void;
}

const ProductFilterSidebar: React.FC<ProductFilterProps> = ({ onFilterChange }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Define filter categories
  const agentTypes: FilterOption[] = [
    { id: 'webagent', label: 'Web Agent' },
    { id: 'salesagent', label: 'Sales Agent' },
    { id: 'leadgenagent', label: 'Lead Generation Agent' },
    { id: 'appointmentagent', label: 'Appointment Agent' },
    { id: 'socialmediaagent', label: 'Social Media & Call Agent' }
  ];
  
  const industries: FilterOption[] = [
    { id: 'ecommerce', label: 'E-Commerce' },
    { id: 'saas', label: 'SaaS' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'realestate', label: 'Real Estate' },
    { id: 'restaurant', label: 'Restaurant' },
    { id: 'hotel', label: 'Hotel' },
    { id: 'blog', label: 'Blog & Media' }
  ];
  
  const pricingOptions: FilterOption[] = [
    { id: 'free', label: 'Free' },
    { id: 'under_15', label: 'Under $15/month' },
    { id: '15_49', label: '$15-$49/month' },
    { id: '50_99', label: '$50-$99/month' },
    { id: '100_plus', label: '$100+/month' }
  ];
  
  const features: FilterOption[] = [
    { id: 'multilingual', label: 'Multilingual Support' },
    { id: 'voice', label: 'Voice Interaction' },
    { id: 'lead-capture', label: 'Lead Capture' },
    { id: 'navigation', label: 'Website Navigation' },
    { id: 'crm', label: 'CRM Integration' }
  ];
  
  // State for selected filters
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    type: [],
    industry: [],
    pricing: [],
    feature: []
  });
  
  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState({
    type: true,
    industry: true,
    pricing: true,
    feature: true
  });
  
  // Toggle section expansion
  const toggleSection = (section: 'type' | 'industry' | 'pricing' | 'feature') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Initialize filters from URL on component mount
  useEffect(() => {
    const type = searchParams.get('type')?.split(',') || [];
    const industry = searchParams.get('industry')?.split(',') || [];
    const pricing = searchParams.get('pricing')?.split(',') || [];
    const feature = searchParams.get('feature')?.split(',') || [];
    
    const initialFilters = {
      type: type.filter(Boolean),
      industry: industry.filter(Boolean),
      pricing: pricing.filter(Boolean),
      feature: feature.filter(Boolean)
    };
    
    setSelectedFilters(initialFilters);
  }, [searchParams]);
  
  // Update URL when filters change
  const updateFilters = (category: string, value: string) => {
    const newFilters = { ...selectedFilters };
    
    if (newFilters[category].includes(value)) {
      // Remove the filter if already selected
      newFilters[category] = newFilters[category].filter(item => item !== value);
    } else {
      // Add the filter
      newFilters[category] = [...newFilters[category], value];
    }
    
    setSelectedFilters(newFilters);
    
    // Update URL with new filters
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(key, values.join(','));
      }
    });
    
    // Reset page to 1 when filters change
    params.delete('page');
    
    // Update URL
    const newUrl = `/products${params.toString() ? '?' + params.toString() : ''}`;
    router.push(newUrl);
    
    // Notify parent component about filter changes
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // Remove a specific filter
  const removeFilter = (category: string, value: string) => {
    const newFilters = { ...selectedFilters };
    newFilters[category] = newFilters[category].filter(item => item !== value);
    
    setSelectedFilters(newFilters);
    
    // Update URL with new filters
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(key, values.join(','));
      }
    });
    
    // Reset page to 1 when filters change
    params.delete('page');
    
    // Update URL
    const newUrl = `/products${params.toString() ? '?' + params.toString() : ''}`;
    router.push(newUrl);
    
    // Notify parent component about filter changes
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedFilters({
      type: [],
      industry: [],
      pricing: [],
      feature: []
    });
    
    // Update URL - reset to products page without any parameters (including page)
    router.push('/products');
    
    // Notify parent component
    if (onFilterChange) {
      onFilterChange({
        type: [],
        industry: [],
        pricing: [],
        feature: []
      });
    }
  };
  
  // Count active filters
  const activeFilterCount = Object.values(selectedFilters).flat().length;

  // Find label for a filter ID
  const getFilterLabel = (category: string, id: string): string => {
    switch(category) {
      case 'type':
        return agentTypes.find(item => item.id === id)?.label || id;
      case 'industry':
        return industries.find(item => item.id === id)?.label || id;
      case 'pricing':
        return pricingOptions.find(item => item.id === id)?.label || id;
      case 'feature':
        return features.find(item => item.id === id)?.label || id;
      default:
        return id;
    }
  };
  
  // Get category-specific color
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'type':
        return 'blue';
      case 'industry':
        return 'purple';
      case 'pricing':
        return 'green';
      case 'feature':
        return 'amber';
      default:
        return 'gray';
    }
  };
  
  // Calculate price range values from selected filters
  const getPriceRangeFromFilters = () => {
    const priceFilters = selectedFilters.pricing;
    
    // Default values - full range
    let min = 0;
    let max = 300;
    
    // No filters selected, return default range
    if (priceFilters.length === 0) {
      return { min, max };
    }
    
    // Get the min and max from multiple filters
    let hasMin = false;
    let hasMax = false;
    
    // Calculate based on selected price filters
    priceFilters.forEach(filter => {
      switch(filter) {
        case 'free':
          // Free items only
          if (!hasMin) min = 0;
          if (!hasMax) max = 0;
          hasMin = true;
          hasMax = true;
          break;
        case 'under_15':
          if (!hasMin) min = 0;
          if (!hasMax || max < 15) max = 15;
          hasMin = true;
          break;
        case '15_49':
          if (!hasMin || min > 15) min = 15;
          if (!hasMax || max < 49) max = 49;
          hasMin = true;
          hasMax = true;
          break;
        case '50_99':
          if (!hasMin || min > 50) min = 50;
          if (!hasMax || max < 99) max = 99;
          hasMin = true;
          hasMax = true;
          break;
        case '100_plus':
          if (!hasMin || min > 100) min = 100;
          if (!hasMax) max = 300;
          hasMin = true;
          break;
      }
    });
    
    return { min, max };
  };
  
  // Filter category section with toggle
  const FilterSection = ({ 
    title, 
    options, 
    category, 
    isExpanded 
  }: { 
    title: string;
    options: FilterOption[];
    category: string;
    isExpanded: boolean;
  }) => {
    // Get icon for category
    const getCategoryIcon = () => {
      switch(category) {
        case 'type':
          return (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          );
        case 'industry':
          return (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          );
        case 'pricing':
          return (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
        case 'feature':
          return (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          );
        default:
          return null;
      }
    };
    
    // Get background color for category
    const getCategoryBg = () => {
      switch(category) {
        case 'type':
          return 'from-blue-600/20 to-blue-700/5';
        case 'industry':
          return 'from-purple-600/20 to-purple-700/5';
        case 'pricing':
          return 'from-green-600/20 to-green-700/5';
        case 'feature':
          return 'from-amber-600/20 to-amber-700/5';
        default:
          return 'from-slate-700/20 to-slate-800/5';
      }
    };
    
    // Get accent color for category
    const getCategoryAccent = () => {
      switch(category) {
        case 'type':
          return 'border-l-blue-500';
        case 'industry':
          return 'border-l-purple-500';
        case 'pricing':
          return 'border-l-green-500';
        case 'feature':
          return 'border-l-amber-500';
        default:
          return 'border-l-slate-500';
      }
    };

    return (
      <div className={`mb-5 bg-slate-800/50 backdrop-blur-sm rounded-lg overflow-hidden border border-slate-700/50 shadow-md transition-all duration-300 ${isExpanded ? 'border-l-4 ' + getCategoryAccent() : ''}`}>
        <button 
          onClick={() => toggleSection(category as 'type' | 'industry' | 'pricing' | 'feature')}
          className={`w-full flex justify-between items-center p-4 text-slate-200 hover:text-white font-medium text-sm transition-colors focus:outline-none ${isExpanded ? `bg-gradient-to-r ${getCategoryBg()}` : 'hover:bg-slate-800/70'}`}
        >
          <div className="flex items-center">
            <span className={`mr-2.5 ${isExpanded ? `text-${getCategoryColor(category)}-400` : 'text-slate-400'} transition-colors`}>
              {getCategoryIcon()}
            </span>
            <span className="text-md">{title}</span>
            {selectedFilters[category].length > 0 && (
              <span className={`ml-2 inline-flex items-center justify-center w-5 h-5 text-xs bg-${getCategoryColor(category)}-600 text-white rounded-full`}>
                {selectedFilters[category].length}
              </span>
            )}
          </div>
          <svg
            className={`w-5 h-5 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isExpanded && (
          <div className="p-4 border-t border-slate-700/30">
            {/* For pricing category, show range slider first */}
            {category === 'pricing' && (
              <>
                <div className="mb-3">
                  <PriceRangeSlider 
                    currentMin={getPriceRangeFromFilters().min} 
                    currentMax={getPriceRangeFromFilters().max}
                    onRangeChange={(min, max) => {
                      // Translate range to filter options
                      let newPriceFilters: string[] = [];
                      
                      // Special case for "free" - keep free filter if min is 0 and it was already selected
                      if (min === 0 && selectedFilters.pricing.includes('free')) {
                        newPriceFilters.push('free');
                      }
                      
                      // Under $15
                      if (min < 15 && max >= 15 && !newPriceFilters.includes('free')) {
                        newPriceFilters.push('under_15');
                      }
                      
                      // $15-$49
                      if (min <= 49 && max >= 15) {
                        newPriceFilters.push('15_49');
                      }
                      
                      // $50-$99
                      if (min <= 99 && max >= 50) {
                        newPriceFilters.push('50_99');
                      }
                      
                      // $100+
                      if (max >= 100) {
                        newPriceFilters.push('100_plus');
                      }
                      
                      // Update all price filters at once
                      const newFilters = { ...selectedFilters, pricing: newPriceFilters };
                      setSelectedFilters(newFilters);
                      
                      // Update URL with new filters
                      const params = new URLSearchParams();
                      Object.entries(newFilters).forEach(([key, values]) => {
                        if (values.length > 0) {
                          params.set(key, values.join(','));
                        }
                      });
                      
                      // Reset page to 1 when filters change
                      params.delete('page');
                      
                      // Update URL
                      const newUrl = `/products${params.toString() ? '?' + params.toString() : ''}`;
                      router.push(newUrl);
                      
                      // Notify parent component
                      if (onFilterChange) {
                        onFilterChange(newFilters);
                      }
                    }}
                  />
                </div>
                
                {/* Show active price range as text */}
                <div className="mb-3 text-xs text-center font-medium">
                  {selectedFilters.pricing.length > 0 ? (
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {selectedFilters.pricing.includes('free') && (
                        <span className="px-2 py-0.5 bg-emerald-900/30 text-emerald-400 rounded-full border border-emerald-500/20">
                          Free
                        </span>
                      )}
                      {selectedFilters.pricing.includes('under_15') && (
                        <span className="px-2 py-0.5 bg-green-900/30 text-green-400 rounded-full border border-green-500/20">
                          &lt;$15
                        </span>
                      )}
                      {selectedFilters.pricing.includes('15_49') && (
                        <span className="px-2 py-0.5 bg-green-900/30 text-green-400 rounded-full border border-green-500/20">
                          $15-$49
                        </span>
                      )}
                      {selectedFilters.pricing.includes('50_99') && (
                        <span className="px-2 py-0.5 bg-green-900/30 text-green-400 rounded-full border border-green-500/20">
                          $50-$99
                        </span>
                      )}
                      {selectedFilters.pricing.includes('100_plus') && (
                        <span className="px-2 py-0.5 bg-green-900/30 text-green-400 rounded-full border border-green-500/20">
                          $100+
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-400">No price filter applied</span>
                  )}
                </div>
                
                <div className="mb-3 flex items-center">
                  <div className="mr-2 h-[1px] flex-grow bg-slate-700"></div>
                  <span className="text-xs font-medium text-slate-400">OR SELECT PRESET RANGES</span>
                  <div className="ml-2 h-[1px] flex-grow bg-slate-700"></div>
                </div>
              </>
            )}
            
            {/* Interactive chips for all filter categories */}
            <div className="flex flex-wrap gap-2">
              {options.map(option => {
                const isSelected = selectedFilters[category].includes(option.id);
                const colorName = getCategoryColor(category);
                
                return (
                  <button
                    key={option.id}
                    onClick={() => updateFilters(category, option.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                      isSelected 
                        ? `bg-${colorName}-600 text-white shadow-md hover:bg-${colorName}-700` 
                        : `bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-600`
                    }`}
                    aria-pressed={isSelected}
                  >
                    {isSelected && (
                      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {category === 'pricing' && !isSelected && (
                      <svg className="w-3.5 h-3.5 mr-1.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 shadow-lg">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-bold text-slate-200">Filters</h2>
        {activeFilterCount > 0 && (
          <button 
            onClick={clearFilters}
            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear all
          </button>
        )}
      </div>

      {/* Active filters summary */}
      {activeFilterCount > 0 && (
        <div className="mb-5 pb-5 border-b border-slate-700/50">
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">Active Filters:</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedFilters).map(([category, values]) => (
              values.map(value => (
                <div 
                  key={`${category}-${value}`} 
                  className={`bg-${getCategoryColor(category)}-600/20 text-${getCategoryColor(category)}-400 text-xs rounded-full px-2.5 py-1 flex items-center border border-${getCategoryColor(category)}-600/30`}
                >
                  <span className="mr-1">{getFilterLabel(category, value)}</span>
                  <button 
                    onClick={() => removeFilter(category, value)}
                    className={`ml-1 p-0.5 rounded-full hover:bg-${getCategoryColor(category)}-500/30 transition-colors`}
                    aria-label={`Remove ${getFilterLabel(category, value)} filter`}
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))
            ))}
          </div>
        </div>
      )}
      
      <FilterSection 
        title="Pricing" 
        options={pricingOptions} 
        category="pricing" 
        isExpanded={expandedSections.pricing} 
      />
      
      <FilterSection 
        title="Agent Type" 
        options={agentTypes} 
        category="type" 
        isExpanded={expandedSections.type} 
      />
      
      <FilterSection 
        title="Industry" 
        options={industries} 
        category="industry" 
        isExpanded={expandedSections.industry} 
      />
      
      <FilterSection 
        title="Features" 
        options={features} 
        category="feature" 
        isExpanded={expandedSections.feature} 
      />
    </div>
  );
};

export default ProductFilterSidebar; 