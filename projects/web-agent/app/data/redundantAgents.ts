// Redundant agent variations to enrich the product catalog
// These agents are variations of the main agents with slightly different specializations

// Function to create agent variations with new IDs and modified descriptions
export const createRedundantAgents = (originalAgents: any[]) => {
  const redundantAgents: any[] = [];

  // For each original agent, create 2 variations
  originalAgents.forEach(agent => {
    // Extract base name and role
    const baseName = agent.name;
    const baseRole = agent.role;

    // Skip variations for certain agents if needed
    if (agent.id === 'anaya-webAgent') {
      // Create Lite, Pro and Enterprise variations of Anaya
      redundantAgents.push({
        ...agent,
        id: `${agent.id}-lite`,
        name: `${baseName} Lite`,
        role: `${baseRole} Lite`,
        shortDescription: `Simplified version of ${baseName} with essential features at an affordable price.`,
        fullDescription: `${agent.fullDescription} The Lite version includes core voice navigation and user assistance capabilities at a budget-friendly price point, perfect for small businesses and startups.`,
        pricing: "$25/month",
        isFree: false,
        features: [
          "Essential voice assistance for website visitors",
          "Basic website navigation guidance",
          "Standard language processing for common user queries",
          "Support for English language only",
          "Basic product and service information delivery",
          "Simple lead capture functionality",
          "Standard response templates for common questions",
          "Email notification for captured leads"
        ],
        benefits: [
          "Affordable entry point for voice assistance technology",
          "Improve user experience with basic voice guidance",
          "Reduce bounce rates by helping visitors find information",
          "Capture basic lead information from interested visitors",
          "Enhance website functionality without a large investment"
        ]
      });

      redundantAgents.push({
        ...agent,
        id: `${agent.id}-pro`,
        name: `${baseName} Pro`,
        role: `${baseRole} Pro`,
        shortDescription: `Advanced version of ${baseName} with additional customization options and premium features.`,
        fullDescription: `${agent.fullDescription} The Pro version includes expanded voice capabilities, additional languages, and priority support.`,
        pricing: "$99/month",
        isFree: false,
        features: [
          ...agent.features,
          "Advanced product filtering based on user requirements",
          "Semantic search capabilities to match user intent with products",
          "Personalized product recommendations based on user interactions",
          "User search history tracking and analysis",
          "Advanced language processing for complex product queries",
          "Custom voice and appearance options",
          "Priority support with 24-hour response time",
          "Enhanced multi-language capabilities with dialect support",
          "Advanced analytics on user interactions and conversions"
        ],
        benefits: [
          ...agent.benefits,
          "Higher conversion rates through enhanced product matching",
          "Deeper user engagement with personalized recommendations",
          "Improved search experience with semantic understanding",
          "Better insights into user behavior and preferences"
        ]
      });

      redundantAgents.push({
        ...agent,
        id: `${agent.id}-enterprise`,
        name: `${baseName} Enterprise`,
        role: `${baseRole} Enterprise`,
        shortDescription: `Enterprise-grade ${baseName} for large organizations requiring advanced features and high volume.`,
        fullDescription: `${agent.fullDescription} The Enterprise version includes unlimited usage, dedicated support, custom integrations, and SLA guarantees.`,
        pricing: "$299/month",
        isFree: false,
        features: [
          ...agent.features,
          "Direct database integration with your product catalogs",
          "Real-time synchronization with inventory management systems",
          "Custom database schema support and data mapping",
          "Enterprise-grade security with data encryption",
          "Custom API endpoints for integration with legacy systems",
          "Advanced analytics and reporting dashboard",
          "White-labeled voice and appearance customization",
          "User behavior analytics and segmentation",
          "SLA guarantees with 99.9% uptime",
          "Dedicated account manager and support team",
          "Custom training and onboarding for your team",
          "Multi-department access controls and user management"
        ],
        benefits: [
          ...agent.benefits,
          "Seamless integration with existing enterprise systems",
          "Real-time data synchronization for accurate information",
          "Enhanced security for sensitive business data",
          "Comprehensive analytics for business intelligence",
          "Dedicated support to ensure optimal performance"
        ]
      });
    }

    // Add industry-specific variations for other agents
    if (agent.id === 'rocketsingh-salesAgent') {
      redundantAgents.push({
        ...agent,
        id: `${agent.id}-saas`,
        name: `${baseName} SaaS`,
        role: `SaaS ${baseRole}`,
        shortDescription: `Specialized voice-enabled sales agent for Software-as-a-Service businesses with automated outbound calling.`,
        fullDescription: `A specialized version of ${baseName} designed specifically for SaaS businesses. This voice-enabled AI agent autonomously handles cold calls, follow-ups, and negotiations for SaaS companies. It understands subscription models, churn reduction strategies, and SaaS-specific sales cycles.`,
        pricing: "$15/month",
        isFree: false
      });

      redundantAgents.push({
        ...agent,
        id: `${agent.id}-ecommerce`,
        name: `${baseName} Commerce`,
        role: `E-commerce ${baseRole}`,
        shortDescription: `Voice-enabled sales agent for e-commerce businesses with automated outbound calling and follow-up.`,
        fullDescription: `A specialized version of ${baseName} tailored for e-commerce businesses. This voice-enabled AI agent autonomously handles cold calls, follow-ups, and negotiations while continuously updating your CRM. It understands product catalogs, cart abandonment, upselling strategies, and online customer behavior.`,
        pricing: "$12/month",
        isFree: false
      });
    }

    if (agent.id === 'sam-leadGenAgent') {
      redundantAgents.push({
        ...agent,
        id: `${agent.id}-b2b`,
        name: `${baseName} B2B`,
        role: `B2B ${baseRole}`,
        shortDescription: `Specialized lead generation agent for B2B companies focused on account-based marketing.`,
        fullDescription: `A specialized version of ${baseName} designed for B2B lead generation with account-based marketing approaches, longer sales cycles, and multi-stakeholder decision processes.`,
        pricing: "$15/month",
        isFree: false
      });

      redundantAgents.push({
        ...agent,
        id: `${agent.id}-realestate`,
        name: `${baseName} Realty`,
        role: `Real Estate ${baseRole}`,
        shortDescription: `Specialized lead generation agent for real estate professionals and property managers.`,
        fullDescription: `A specialized version of ${baseName} designed for real estate lead generation with property listing integration, buyer/seller qualification, and property-specific inquiries.`,
        pricing: "$14/month",
        isFree: false
      });
    }

    if (agent.id === 'liya-appointmentSetter') {
      redundantAgents.push({
        ...agent,
        id: `${agent.id}-medical`,
        name: `${baseName} Medical`,
        role: `Healthcare ${baseRole}`,
        shortDescription: `HIPAA-compliant appointment setter specialized for medical and healthcare providers.`,
        fullDescription: `A specialized version of ${baseName} designed for healthcare providers with HIPAA compliance, medical terminology understanding, and integration with health records systems.`,
        pricing: "$15/month",
        isFree: false
      });

      redundantAgents.push({
        ...agent,
        id: `${agent.id}-salon`,
        name: `${baseName} Salon`,
        role: `Beauty & Wellness ${baseRole}`,
        shortDescription: `Specialized appointment setter for salons, spas, and wellness businesses.`,
        fullDescription: `A specialized version of ${baseName} designed for beauty and wellness businesses with service-based booking, staff selection, and treatment-specific scheduling.`,
        pricing: "$12/month",
        isFree: false
      });
    }

    if (agent.id === 'ahana-socialMediaAgent') {
      redundantAgents.push({
        ...agent,
        id: `${agent.id}-content`,
        name: `${baseName} Content`,
        role: `Content ${baseRole}`,
        shortDescription: `Social media agent specialized in content curation and audience engagement.`,
        fullDescription: `A specialized version of ${baseName} focused on content curation, audience engagement, and social media strategy for brands looking to grow their digital presence.`,
        pricing: "$10/month",
        isFree: false
      });

      redundantAgents.push({
        ...agent,
        id: `${agent.id}-support`,
        name: `${baseName} Support`,
        role: `Customer Support ${baseRole}`,
        shortDescription: `Social media agent dedicated to customer support and issue resolution.`,
        fullDescription: `A specialized version of ${baseName} focused on customer support through social channels with case tracking, issue escalation, and resolution management.`,
        pricing: "$12/month",
        isFree: false
      });
    }
  });

  return redundantAgents;
}; 