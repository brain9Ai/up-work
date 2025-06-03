import { Metadata } from 'next';

type OpenGraphImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

export type OpenGraphConfig = {
  title?: string;
  description?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  images?: OpenGraphImage[];
  customImage?: boolean;
  productId?: string;
};

/**
 * Generates OpenGraph metadata with sensible defaults
 * @param config Override default OpenGraph settings
 * @returns OpenGraph and Twitter metadata objects for Next.js Metadata
 */
export function generateOpenGraph(config?: OpenGraphConfig) {
  const title = config?.title || 'brain9ai - Intelligent Agent Solutions';
  const description = config?.description || 'Specialized AI agents for business innovation and growth';
  const url = config?.url || 'https://brain9ai.com/';
  const type = config?.type || 'website';
  
  // Generate dynamic OG image URL if not provided
  let images: OpenGraphImage[];
  if (config?.images) {
    images = config.images;
  } else if (config?.productId) {
    // Use specific product image for product pages
    const productId = config.productId.split('-')[0]; // Get base product ID
    images = [{
      url: `/images/og/og-${productId}.png`,
      width: 1200,
      height: 630,
      alt: title,
    }];
  } else if (config?.customImage === false) {
    // Default static image - always use the brain9ai OG image for consistent branding
    images = [{
      url: '/images/og/og-brain9ai.png',
      width: 1200,
      height: 630,
      alt: 'brain9ai - Intelligent Agent Solutions',
    }];
  } else {
    // For other cases also use the static brain9ai image for consistency
    // instead of the dynamic API route
    images = [{
      url: '/images/og/og-brain9ai.png',
      width: 1200,
      height: 630,
      alt: title,
    }];
    
    // Commented out the dynamic OG image generation
    /*
    const pageTitle = encodeURIComponent(title.replace(' | brain9ai', ''));
    const subtitle = encodeURIComponent(description.length > 100 
      ? description.substring(0, 100) + '...' 
      : description);
    
    images = [{
      url: `/api/og?title=${pageTitle}&subtitle=${subtitle}&type=${type}`,
      width: 1200,
      height: 630,
      alt: title,
    }];
    */
  }

  const openGraph = {
    type,
    locale: 'en_US',
    url,
    siteName: 'brain9ai',
    title,
    description,
    images,
  };

  const twitter = {
    card: 'summary_large_image',
    title,
    description,
    images: images.map(img => img.url),
    creator: '@brain9ai',
  };

  return { openGraph, twitter };
}

/**
 * Generates complete metadata including OpenGraph for a page
 * @param config Page metadata configuration
 * @returns Complete Next.js Metadata object
 */
export function generateMetadata(config: {
  title?: string;
  description?: string;
  ogConfig?: OpenGraphConfig;
  keywords?: string[];
  canonical?: string;
}): Metadata {
  const { title, description, ogConfig, keywords, canonical } = config;
  
  const pageTitle = title || 'brain9ai - Intelligent Agent Solutions';
  const pageDescription = description || 'Explore our specialized AI agent ecosystem for business innovation including Anaya WebAgent, RocketSingh Sales Agent, and more intelligent automation tools.';
  
  const { openGraph, twitter } = generateOpenGraph({
    title: pageTitle,
    description: pageDescription,
    url: canonical ? `https://brain9ai.com${canonical}` : 'https://brain9ai.com/',
    ...ogConfig,
  });

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: keywords || ['AI agents', 'WebAgent', 'sales automation', 'voice agent', 'AI assistant', 'business automation'],
    alternates: {
      canonical: canonical || '/',
    },
    openGraph,
    twitter,
  };
} 