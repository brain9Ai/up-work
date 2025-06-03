'use client';

interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'Product' | 'BreadcrumbList' | 'FAQPage';
  data: Record<string, any>;
}

/**
 * Component for adding structured data (JSON-LD) to pages
 * Improves SEO by providing search engines with additional context
 */
export default function StructuredData({ type, data }: StructuredDataProps) {
  // Create the structured data object based on type
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * Organization structured data creator
 */
export function OrganizationSchema() {
  const orgData = {
    name: 'brain9ai',
    url: 'https://brain9ai.com',
    logo: 'https://brain9ai.com/logo.png',
    sameAs: [
      'https://twitter.com/brain9ai',
      'https://linkedin.com/company/brain9ai',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-123-456-7890',
      contactType: 'customer service',
      email: 'contact@brain9ai.com',
    },
  };

  return <StructuredData type="Organization" data={orgData} />;
}

/**
 * Website structured data creator
 */
export function WebsiteSchema() {
  const websiteData = {
    name: 'brain9ai - Intelligent Agent Solutions',
    url: 'https://brain9ai.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://brain9ai.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return <StructuredData type="WebSite" data={websiteData} />;
}

/**
 * Product structured data creator (for agent products)
 */
export function ProductSchema({ 
  name, 
  description, 
  image, 
  price 
}: { 
  name: string; 
  description: string; 
  image: string; 
  price?: string;
}) {
  const productData = {
    name,
    description,
    image,
    ...(price && { offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    }}),
  };

  return <StructuredData type="Product" data={productData} />;
} 