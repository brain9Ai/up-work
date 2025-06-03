import { MetadataRoute } from 'next';
import { siteData } from './data/siteData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://brain9ai.com';
  
  // Main site pages
  const routes = [
    '',
    '/products',
    '/services',
    '/blog',
    '/about',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));
  
  // Product pages
  const productRoutes = siteData.products.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
  
  // Blog posts
  const blogRoutes = siteData.blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishDate),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));
  
  // Service pages - if individual service pages exist
  const serviceRoutes = siteData.services.map((service) => ({
    url: `${baseUrl}/services/${service.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  
  return [...routes, ...productRoutes, ...blogRoutes, ...serviceRoutes];
} 