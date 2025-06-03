'use client';

import { Tool } from '../ToolManager';
import { siteData } from '../../../data/siteData';

// Extract services from siteData
const servicesData = siteData.services;

const ServicesTool: Tool = {
  name: 'getServiceInfo',
  definition: {
    type: "function",
    function: {
      name: "getServiceInfo",
      description: "Get information about available automation services. Can search by industry, service ID, or return all services.",
      parameters: {
        type: "object",
        properties: {
          industry: {
            type: "string",
            description: "Optional. Filter services by industry (e.g., E-commerce, SaaS, Healthcare, Real Estate)",
          },
          serviceId: {
            type: "string",
            description: "Optional. Get details about a specific service by ID",
          },
          query: {
            type: "string",
            description: "Optional. Search term to filter services by name or description",
          }
        },
        required: []
      }
    }
  },
  handler: async (args: any) => {
    try {
      const { industry, serviceId, query } = args;
      
      // Get specific service by ID
      if (serviceId) {
        const service = servicesData.find(s => s.id === serviceId);
        if (!service) {
          return {
            success: false,
            message: `Service with ID ${serviceId} not found.`,
            services: []
          };
        }
        return {
          success: true,
          message: `Found service: ${service.name}`,
          services: [service]
        };
      }
      
      // Filter by industry
      let filteredServices = servicesData;
      if (industry) {
        filteredServices = filteredServices.filter(s => 
          s.industries && s.industries.some(ind => 
            ind.toLowerCase().includes(industry.toLowerCase())
          )
        );
      }
      
      // Filter by search query
      if (query) {
        const searchTerm = query.toLowerCase();
        filteredServices = filteredServices.filter(s => 
          s.name.toLowerCase().includes(searchTerm) || 
          s.shortDescription.toLowerCase().includes(searchTerm) ||
          s.fullDescription.toLowerCase().includes(searchTerm) ||
          (s.tools && s.tools.some(tool => tool.toLowerCase().includes(searchTerm)))
        );
      }
      
      if (filteredServices.length === 0) {
        return {
          success: false,
          message: "No services found matching your criteria.",
          services: []
        };
      }
      
      // Format the response data to include key information
      const formattedServices = filteredServices.map(service => ({
        id: service.id,
        name: service.name,
        shortDescription: service.shortDescription,
        fullDescription: service.fullDescription,
        tools: service.tools || [],
        industries: service.industries || [],
        pricingTiers: service.pricingTiers ? service.pricingTiers.map(tier => ({
          name: tier.name,
          price: tier.price,
          billingPeriod: tier.billingPeriod,
          description: tier.description,
          isPopular: tier.isPopular || false
        })) : [],
        benefits: service.benefits || []
      }));
      
      return {
        success: true,
        message: `Found ${filteredServices.length} service(s).`,
        services: formattedServices
      };
    } catch (error) {
      console.error("Error in ServicesTool:", error);
      return {
        success: false,
        message: `Error retrieving service information: ${error instanceof Error ? error.message : String(error)}`,
        services: []
      };
    }
  }
};

export default ServicesTool; 
 
 