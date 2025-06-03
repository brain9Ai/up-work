import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { siteData } from '../../data/siteData';
import { Metadata } from 'next';
import Breadcrumb from '../../components/Breadcrumb';
import ProductRequestForm from '@/app/components/ProductRequestForm';
import { generateMetadata as genMeta } from '../../utils/openGraph';

// Generate static params for all products to enable static site generation
export async function generateStaticParams() {
  // Extract IDs from all products
  const productIds = siteData.products.map((product) => ({
    id: product.id,
  }));
  
  return productIds;
}

// Define types for the metadata generation params
type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

// Generate metadata for the page based on the agent data
export async function generateMetadata(
  { params, searchParams }: Props
): Promise<Metadata> {
  // Get the agent data using the ID
  const agent = getAgentFromSiteData(params.id);
  
  // If agent not found, return default metadata
  if (!agent) {
    return genMeta({
      title: 'Agent Not Found | brain9ai',
      description: 'The requested AI agent could not be found.',
    });
  }
  
  // Get base product ID for image
  const baseProductId = params.id.split('-')[0];
  
  return genMeta({
    title: `${agent.name} - ${agent.role} | brain9ai`,
    description: agent.description,
    canonical: `/products/${params.id}`,
    keywords: [`AI Agent`, `${agent.role}`, `brain9ai`, `AI Automation`, `Voice Agent`, `Conversational AI`],
    ogConfig: {
      type: 'article',
      productId: baseProductId,
    },
  });
}

// Map of background colors for each agent type
const agentBgColors: { [key: string]: string } = {
  'WebAgent': 'from-blue-600/20 to-cyan-500/20',
  'Sales Agent': 'from-purple-600/20 to-pink-500/20',
  'Appointment Setter Agent': 'from-emerald-600/20 to-teal-500/20',
  'Lead Generation Agent': 'from-amber-600/20 to-orange-500/20',
  'Social Media Support Agent': 'from-pink-600/20 to-red-500/20'
};

// Helper function to generate capabilities and use cases from agent data
const generateCapabilities = (agent: any) => {
  // Generate capabilities based on features
  const capabilities = agent.features.map((feature: string) => {
    // Extract title from feature (first few words)
    const title = feature.split(' ').slice(0, 3).join(' ');
    return {
      title,
      description: feature
    };
  });
  
  return capabilities;
};

const generateUseCases = (agent: any) => {
  // Generate use cases based on benefits
  return agent.benefits.map((benefit: string) => {
    // Extract title from benefit (first few words)
    const title = benefit.split(' ').slice(0, 3).join(' ') + '...';
    return {
      title,
      description: benefit
    };
  });
};

// Helper function to process agent data from siteData for detail page
const getAgentFromSiteData = (id: string) => {
  console.log(`Looking for agent with ID: ${id}`);
  
  // Process variant IDs - check if this is a variant like "anaya-pro" or "anaya-enterprise"
  const isVariant = id.includes('-pro') || 
                    id.includes('-enterprise') || 
                    id.includes('-saas') || 
                    id.includes('-ecommerce') || 
                    id.includes('-medical') || 
                    id.includes('-salon') || 
                    id.includes('-content') || 
                    id.includes('-support') || 
                    id.includes('-b2b') || 
                    id.includes('-realestate');
  
  if (isVariant) {
    console.log(`Detected variant ID: ${id}`);
    
    // For variants, we need to find the appropriate agent
    // First check for exact ID match in the full agent array
    const exactVariantMatch = siteData.products.find(p => 
      p.id.toLowerCase().endsWith(id.toLowerCase()) ||
      p.id.toLowerCase() === id.toLowerCase()
    );
    
    if (exactVariantMatch) {
      console.log(`Found exact variant match for ID: ${exactVariantMatch.id}`);
      return formatAgentForDetailPage(exactVariantMatch, id);
    }
    
    // If no exact match, check by variant suffix (e.g., -pro, -enterprise)
    // Extract the variant suffix from the ID
    const variantParts = id.split('-');
    const variantSuffix = variantParts[variantParts.length - 1];
    const baseProductName = variantParts[0]; // e.g., "anaya" from "anaya-pro"
    
    console.log(`Looking for ${baseProductName} variant with suffix: ${variantSuffix}`);
    
    // Find agents that match both the base name and variant suffix
    const variantMatches = siteData.products.filter(p => 
      p.id.toLowerCase().includes(baseProductName.toLowerCase()) && 
      p.id.toLowerCase().endsWith(variantSuffix.toLowerCase())
    );
    
    if (variantMatches.length > 0) {
      console.log(`Found ${variantMatches.length} matches for ${baseProductName}-${variantSuffix}`);
      return formatAgentForDetailPage(variantMatches[0], id);
    }
  }
  
  // First try to find an exact match by ID
  const exactMatch = siteData.products.find(p => p.id.split('-')[0].toLowerCase() === id.toLowerCase());
  
  if (exactMatch) {
    // Format agent data for detail page display
    return formatAgentForDetailPage(exactMatch, id);
  }
  
  // ID aliases to handle different URL formats and variations
  const idAliases: { [key: string]: string } = {
    'rocketsingh': 'rocketsingh',
    'rocketsing': 'rocketsingh',
    'sales': 'rocketsingh',
    'anaya': 'anaya',
    'web': 'anaya',
    'ahana': 'ahana',
    'social': 'ahana',
    'sam': 'sam',
    'lead': 'sam',
    'leadgen': 'sam',
    'liya': 'liya',
    'appointment': 'liya'
  };
  
  // Normalize the ID using aliases if available
  const normalizedId = idAliases[id.toLowerCase()] || id.toLowerCase();
  
  // Find agents that match the normalized ID (could be variations like pro, enterprise, etc.)
  const matchingAgents = siteData.products.filter(p => 
    p.id.toLowerCase().includes(normalizedId) || 
    p.name.toLowerCase().includes(normalizedId) ||
    p.role.toLowerCase().includes(normalizedId)
  );
  
  // If no matches, return null
  if (matchingAgents.length === 0) return null;
  
  // Prefer exact matches over variations if available
  const agent = matchingAgents[0];
  
  return formatAgentForDetailPage(agent, id);
};

// Helper function to format agent data for detail page
const formatAgentForDetailPage = (agent: any, id: string) => {
  // Get base name (first part before any spaces)
  const baseName = agent.name.toLowerCase().split(' ')[0];
  
  // Format agent data for detail page display
  return {
    id: id,
    name: agent.name,
    role: agent.role,
    description: agent.shortDescription,
    features: agent.features,
    benefits: agent.benefits || [], // Add benefits field with fallback
    image: `/agents/${baseName}.png`, // Use base name for image with correct path
    bgColor: agentBgColors[agent.role.split(' ')[0]] || 'from-blue-600/20 to-cyan-500/20',
    ctaText: `Hire ${agent.name}`,
    hasExternalSite: false,
    externalLink: '',
    available: true,
    fullDescription: agent.fullDescription,
    capabilities: generateCapabilities(agent),
    useCases: generateUseCases(agent),
    isFree: agent.isFree,
    pricing: agent.pricing
  };
};

export default function AgentDetailPage({ params }: { params: { id: string } }) {
  // Get agent data from siteData
  const agent = getAgentFromSiteData(params.id);
  
  // If agent not found, return 404
  if (!agent) {
    notFound();
  }
  
  // Generate JSON-LD structured data for the product
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${agent.name} - ${agent.role}`,
    description: agent.description,
    image: agent.image,
    brand: {
      '@type': 'Brand',
      name: 'brain9ai'
    },
    offers: {
      '@type': 'Offer',
      price: agent.isFree ? '0' : agent.pricing.replace(/[^0-9.]/g, ''),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    category: 'AI Automation Agents',
    sku: agent.id
  };
  
  return (
    <>
      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Breadcrumb Navigation */}
      <div className="w-full bg-slate-900/60 backdrop-blur-sm border-b border-white/5 sticky top-[60px] z-30">
        <div className="max-w-[1200px] mx-auto px-4">
          <Breadcrumb 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              { label: agent.name, isActive: true }
            ]}
            sticky={true}
          />
        </div>
      </div>
      
      <main className="flex-1 pt-6 pb-12 w-full relative">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-5 lg:px-6">
          {/* Product Hero Section - E-commerce Style */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
            {/* Left Column - Product Image with Animation */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 self-start">
              <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 p-6 aspect-square relative overflow-hidden">
                {/* Background gradient for product */}
                <div className={`absolute inset-0 bg-gradient-to-br ${agent.bgColor} opacity-20`}></div>
                
                {/* Product Image with Animations (keeping animations from original) */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Animated glow effect */}
                  <div className="absolute inset-[10%] rounded-full overflow-hidden bg-gradient-to-r from-blue-600/40 to-purple-600/40 animate-pulse"></div>
                  
                  {/* Ripple effect */}
                  <div className="absolute inset-[10%] rounded-full border-2 border-blue-500/20 animate-ripple-mobile"></div>
                  <div className="absolute inset-[8%] rounded-full border border-purple-500/20 animate-ripple-mobile" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute inset-[6%] rounded-full border border-blue-500/10 animate-ripple-mobile" style={{ animationDelay: '1s' }}></div>
                  
                  {/* Orbital ring animation */}
                  <div className="absolute inset-[4%] rounded-full border-2 border-blue-500/30 animate-spin-slow"></div>
                  <div className="absolute inset-[7%] rounded-full border border-purple-500/20 animate-spin-reverse-slow"></div>
                  
                  {/* Small floating particles */}
                  <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-blue-400 rounded-full animate-float opacity-70"></div>
                  <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-purple-400 rounded-full animate-float-delay opacity-70"></div>
                  <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-90"></div>
                    
                  {/* Image with modern frame */}
                  <div className="absolute inset-[15%] rounded-full overflow-hidden border-2 border-white/10 shadow-2xl">
                    <Image 
                      src={agent.image}
                      alt={agent.name}
                      fill
                      className="object-cover z-10"
                      priority
                    />
                    
                    {/* Image overlay effects */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40"></div>
                    <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[40%] bg-white/10 rounded-full rotate-45 blur-sm"></div>
                  </div>
                  
                  {/* Status badge */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-2 border border-white/10 z-20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-medium text-white">{agent.available ? 'Available' : 'Coming Soon'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Product Details */}
            <div className="lg:col-span-7">
              {/* Product Category/Badge */}
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <div className="inline-flex px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium">
                  {agent.role}
                </div>
                {agent.isFree && (
                  <div className="inline-flex px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">
                    FREE
                  </div>
                )}
              </div>
              
              {/* Product Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 font-display tracking-tight">
                {agent.name}
              </h1>
              
              {/* Product Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-400">5.0 (12 reviews)</span>
              </div>
              
              {/* Short Description */}
              <div className="text-gray-300 mb-4 text-base leading-relaxed">
                {agent.description}
              </div>
              
              {/* Price Section */}
              <div className="mb-4 px-4 py-3 bg-slate-800/50 rounded-lg border border-white/5">
                <div className="flex items-baseline">
                  {agent.isFree ? (
                    <>
                      <span className="text-xl font-bold text-green-400">FREE</span>
                      <span className="text-gray-400 text-sm ml-2">(Third-party API costs apply)</span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-blue-400">{agent.pricing}</span>
                  )}
                </div>
                <p className="text-gray-400 text-xs mt-1">Includes integration support and 24/7 monitoring</p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-6">
                <ProductRequestForm 
                  agent={agent}
                  buttonClassName="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:scale-[1.02] flex-grow md:flex-grow-0 text-center"
                  buttonText={agent.ctaText}
                />
                <Link 
                  href="#features" 
                  className="px-5 py-2 border border-slate-600 rounded-lg text-slate-300 hover:border-slate-500 hover:text-white transition-colors flex-grow md:flex-grow-0 text-center"
                >
                  View Features
                </Link>
              </div>
              
              {/* Key Benefits */}
              <div className="mb-6">
                <h3 className="text-md font-bold text-white mb-2 font-display">Key Benefits</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                  {(agent.benefits || []).slice(0, 4).map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="text-blue-400 mr-1 mt-1 flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Secure Checkout */}
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure request process • Satisfaction guaranteed</span>
              </div>
            </div>
          </div>
          
          {/* Product Tabs Section */}
          <div className="mb-10">
            <div className="border-b border-slate-700 mb-6">
              <div className="flex space-x-6">
                <a href="#features" className="py-3 border-b-2 border-blue-500 text-white font-medium relative -mb-px text-sm">
                  Features
                </a>
                <a href="#description" className="py-3 text-gray-400 hover:text-white transition-colors text-sm">
                  Description
                </a>
                <a href="#use-cases" className="py-3 text-gray-400 hover:text-white transition-colors text-sm">
                  Use Cases
                </a>
              </div>
            </div>
            
            {/* Tab Content Container - All content placed under the tabbar */}
            <div className="grid grid-cols-1 gap-6">
              {/* Features Tab Content */}
              <div id="features" className="scroll-mt-24 bg-slate-900/50 backdrop-blur rounded-xl border border-white/5 p-5">
                <h2 className="text-xl font-bold text-white mb-4 font-display tracking-wide">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {agent.features.map((feature: string, index: number) => (
                    <div 
                      key={index} 
                      className="bg-slate-800/50 border border-white/5 p-4 rounded-xl relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-30"></div>
                      <div className="relative z-10">
                        <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-white text-sm font-medium tracking-wide">{feature}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Product Description Section */}
              <div id="description" className="scroll-mt-24 bg-slate-900/50 backdrop-blur rounded-xl border border-white/5 p-5">
                <h2 className="text-xl font-bold text-white mb-4 font-display tracking-wide">About {agent.name}</h2>
                <div className="prose prose-invert max-w-none text-sm">
                  <div className="space-y-3 text-gray-300 leading-relaxed whitespace-pre-line font-light tracking-wide">
                    {agent.fullDescription}
                  </div>
                </div>
              </div>
              
              {/* Use Cases Section */}
              <div id="use-cases" className="scroll-mt-24 bg-slate-900/50 backdrop-blur rounded-xl border border-white/5 p-5">
                <h2 className="text-xl font-bold text-white mb-4 font-display tracking-wide">Use Cases</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {agent.useCases.map((useCase: any, index: number) => (
                    <div key={index} className="flex">
                      <div className="mr-3 mt-1">
                        <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <span className="text-blue-400 text-sm font-bold">{index + 1}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-md font-bold text-white mb-1 font-display tracking-wide">{useCase.title}</h3>
                        <p className="text-gray-300 font-light text-sm">{useCase.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Related Products Section - Enhanced Design */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4 font-display tracking-wide">Related Agents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Show 4 related products with more details */}
              {siteData.products.slice(0, 4).map((relatedProduct, index) => {
                const baseName = relatedProduct.name.toLowerCase().split(' ')[0];
                return (
                  <Link 
                    href={`/products/${relatedProduct.id}`} 
                    key={index} 
                    className="bg-slate-900/40 border border-white/5 rounded-xl p-4 transition-all hover:bg-slate-800/40 hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/5 flex flex-col h-full"
                  >
                    <div className="aspect-square relative rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                      <Image 
                        src={`/agents/${baseName}.png`}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover"
                      />
                      {/* Role Badge */}
                      <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs text-white border border-white/10">
                        {relatedProduct.role}
                      </div>
                    </div>
                    <h3 className="font-medium text-white text-sm">{relatedProduct.name}</h3>
                    <div className="mt-1 flex items-center">
                      {/* Rating stars */}
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-400 ml-1">5.0</span>
                    </div>
                    
                    {/* Price info */}
                    <div className="mt-2 text-sm">
                      {relatedProduct.isFree ? (
                        <span className="text-green-400 font-medium">FREE</span>
                      ) : (
                        <span className="text-blue-400 font-medium">{relatedProduct.pricing}</span>
                      )}
                    </div>
                    
                    {/* Short description */}
                    <p className="mt-2 text-xs text-gray-400 line-clamp-2">
                      {relatedProduct.shortDescription}
                    </p>
                    
                    {/* View button */}
                    <div className="mt-auto pt-3">
                      <div className="text-xs text-white bg-blue-600/20 hover:bg-blue-600/30 transition-colors rounded-lg py-1.5 text-center mt-2">
                        View Agent
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="relative bg-slate-900/60 backdrop-blur-sm rounded-xl border border-white/10 p-5 mb-6">
            <div className="absolute -inset-px bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl blur-xl opacity-50"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white mb-2 font-display tracking-wider">Ready to add {agent.name} to your team?</h2>
                <p className="text-gray-300 font-light tracking-wide text-sm">Experience the benefits of AI automation with {agent.name}, tailored to your business needs.</p>
              </div>
              <ProductRequestForm 
                agent={agent}
                buttonClassName="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:scale-[1.02] whitespace-nowrap"
                buttonText={`Request ${agent.name} Now`}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 