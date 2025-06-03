import Link from 'next/link';
import Breadcrumb from '../components/Breadcrumb';
import { siteData } from '../data/siteData';
import ServiceRequestForm from '../components/ServiceRequestForm';

export default function ServicesPage() {
  const { services } = siteData;
  
  return (
    <>
      {/* Breadcrumb navigation */}
      <div className="fixed-breadcrumb w-full">
        <Breadcrumb 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Services', isActive: true }
          ]}
          sticky={true}
        />
      </div>
      
      <div className="min-h-screen bg-slate-950 pb-16 pt-8 w-full">
        {/* Header section with animated gradient background */}
        <div className="relative py-6 overflow-hidden w-full">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-slate-950 z-0"></div>
          <div className="absolute inset-0 bg-circuit-pattern opacity-10 z-0"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 relative z-10">
            <div className="text-center">
              <span className="relative inline-block z-10 animate-fade-in">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur animate-pulse"></div>
                <span className="relative px-3 py-1 text-xs font-medium text-blue-400 bg-slate-900/80 backdrop-blur-sm rounded-full border border-blue-600/20">
                  Enterprise Solutions
                </span>
              </span>
              <h1 className="mt-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 text-2xl md:text-3xl lg:text-4xl font-bold font-display tracking-wider relative inline-block">
                AI Automation Services
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-shine"></span>
              </h1>
              <p className="mt-2 max-w-2xl mx-auto text-base md:text-lg text-gray-300 font-light tracking-wide">
                Custom automation solutions designed to streamline your business processes and drive efficiency.
              </p>
            </div>
          </div>
        </div>
        
        {/* Main content section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 relative z-10">
          {/* Service cards */}
          <div className="grid grid-cols-1 gap-8 mt-8">
            {services.map((service, index) => (
              <div 
                key={service.id}
                className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden group transition-all duration-500 hover:bg-slate-800/50 hover:border-white/10 hover:shadow-2xl animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  {/* Service info section */}
                  <div className="p-6 lg:col-span-1 relative border-b lg:border-b-0 lg:border-r border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="text-blue-400 mr-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d={getServiceIcon(service.id)} />
                          </svg>
                    </div>
                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 animate-gradient-x">
                          {service.name}
                    </h2>
                  </div>
                  
                  <p className="text-gray-300 mb-3 group-hover:text-gray-100 transition-colors duration-300">
                        {service.shortDescription}
                  </p>
                  
                  <p className="text-gray-400 mb-6 group-hover:text-gray-200 transition-colors duration-300">
                        {service.fullDescription}
                      </p>
                      
                      {/* Tools used */}
                      {service.tools && service.tools.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-blue-400 mb-2">Tools & Technologies</h3>
                          <div className="flex flex-wrap gap-2">
                            {service.tools.map((tool, i) => (
                              <span 
                                key={i} 
                                className="px-2 py-1 text-xs rounded-md bg-blue-900/30 text-blue-300 border border-blue-700/20"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Industries */}
                      {service.industries && service.industries.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-sm font-semibold text-blue-400 mb-2">Industries</h3>
                          <div className="flex flex-wrap gap-2">
                            {service.industries.map((industry, i) => (
                              <span 
                                key={i} 
                                className="px-2 py-1 text-xs rounded-md bg-purple-900/30 text-purple-300 border border-purple-700/20"
                              >
                                {industry}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* CTA Button */}
                      <div className="flex mt-4">
                        <ServiceRequestForm
                          service={service}
                          buttonClassName="inline-block py-1.5 px-5 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 flex items-center"
                          buttonText={
                      <span className="flex items-center">
                        Request Service
                        <svg className="ml-2 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                          }
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Pricing tiers section */}
                  <div className="p-6 lg:col-span-2 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                      <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
                        Service Options
                      </h3>
                      
                      {/* Pricing tiers */}
                      {service.pricingTiers && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          {service.pricingTiers.map((tier, i) => (
                            <div 
                              key={i} 
                              className={`relative rounded-lg border ${tier.isPopular ? 'border-blue-500/50 bg-blue-900/10' : 'border-white/10 bg-slate-800/50'} p-4 transition-all duration-300 hover:shadow-md hover:shadow-blue-500/10`}
                            >
                              {tier.isPopular && (
                                <div className="absolute -top-3 -right-3">
                                  <span className="px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
                                    Popular
                                  </span>
                                </div>
                              )}
                              
                              <h4 className="text-lg font-semibold text-white mb-1">{tier.name}</h4>
                              <div className="flex items-baseline">
                                <span className="text-xl font-bold text-blue-400">{tier.price}</span>
                                <span className="ml-1 text-xs text-gray-400">/{tier.billingPeriod}</span>
                              </div>
                              
                              <p className="text-sm text-gray-400 mt-2 mb-3">{tier.description}</p>
                              
                              <div className="mt-2">
                                <h5 className="text-xs font-semibold text-gray-300 mb-2">Includes:</h5>
                                <ul className="space-y-1">
                                  {tier.features.map((feature, j) => (
                                    <li key={j} className="text-xs text-gray-400 flex items-start">
                                      <svg className="h-4 w-4 text-blue-400 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                      <span>{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div className="mt-4">
                                <ServiceRequestForm 
                                  service={service}
                                  buttonClassName={`inline-block w-full text-center py-1.5 px-3 rounded-md ${tier.isPopular ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-slate-700 text-white/80 hover:bg-slate-600'} text-sm transition-all duration-300`}
                                  buttonText="Get Started"
                                  selectedTier={tier.name}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Contract terms */}
                      {service.contractTerms && (
                        <div className="mb-6 bg-slate-800/30 rounded-lg p-4 border border-white/5">
                          <h3 className="text-sm font-semibold text-blue-400 mb-2">Contract Terms</h3>
                          <div className="grid grid-cols-3 gap-2">
                            {service.contractTerms.map((term, i) => (
                              <div key={i} className="text-center p-2 rounded-md bg-slate-800/50 border border-white/5">
                                <div className="text-sm font-medium text-white">{term.name}</div>
                                <div className="text-xs text-green-400">{term.discount}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Maintenance plans */}
                      {service.maintenancePlans && (
                        <div className="mb-6">
                          <h3 className="text-sm font-semibold text-blue-400 mb-2">Maintenance Plans</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {service.maintenancePlans.map((plan, i) => (
                              <div key={i} className="rounded-lg border border-white/10 bg-slate-800/50 p-4">
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="text-sm font-semibold text-white">{plan.name}</h4>
                                  <span className="text-sm font-bold text-blue-400">{plan.price}</span>
                                </div>
                                <ul className="space-y-1">
                                  {plan.features.map((feature, j) => (
                                    <li key={j} className="text-xs text-gray-400 flex items-start">
                                      <svg className="h-3 w-3 text-blue-400 mr-1 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                      <span>{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Operational costs */}
                      {service.operationalCosts && (
                        <div className="mb-6">
                          <h3 className="text-sm font-semibold text-blue-400 mb-2">Operational Costs</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {service.operationalCosts.map((cost, i) => (
                              <div key={i} className="rounded-lg border border-white/10 bg-slate-800/50 p-4">
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="text-sm font-semibold text-white">{cost.name}</h4>
                                  <span className="text-sm font-bold text-blue-400">{cost.price}</span>
                                </div>
                                <ul className="space-y-1">
                                  {cost.features.map((feature, j) => (
                                    <li key={j} className="text-xs text-gray-400 flex items-start">
                                      <svg className="h-3 w-3 text-blue-400 mr-1 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                      <span>{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Benefits */}
                      {service.benefits && service.benefits.length > 0 && (
                        <div className="mt-6">
                          <h3 className="text-sm font-semibold text-blue-400 mb-2">Key Benefits</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {service.benefits.map((benefit, i) => (
                              <div key={i} className="flex items-start">
                                <svg className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm text-gray-300">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* CTA Section */}
          <div className="mt-16 relative animate-fade-in-up" style={{ animationDelay: '800ms' }}>
            <div className="relative z-10 p-8 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-white/5 shadow-xl transition-all duration-500 hover:bg-slate-800/50 hover:border-white/10 hover:shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl"></div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3 animate-gradient-x">Need a Custom Solution?</h2>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Our team of experts can build a tailored automation solution to meet your specific business requirements.
                </p>
                <Link 
                  href="/contact" 
                  className="inline-block py-1.5 px-5 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                >
                  <span className="flex items-center">
                    Schedule a Consultation
                    <svg className="ml-2 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
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