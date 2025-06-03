'use client';

import Link from 'next/link';
import Image from 'next/image';
import { siteData } from '../data/siteData';
import Breadcrumb from '../components/Breadcrumb';
import ClientLink from '../components/ClientLink';
import { useSearchParams } from 'next/navigation'; 

// Format date to readable string
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Get reading time estimate
const getReadingTime = (content: string) => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
};

const BlogPage = ({ searchParams }: { searchParams: { category?: string } }) => {
  // Get filtered category from URL - use useSearchParams hook for client-side rendering
  const clientSearchParams = useSearchParams();
  const category = clientSearchParams?.get('category') || searchParams?.category;
  
  // Filter posts by category if specified
  const filteredPosts = category 
    ? category === 'Featured'
      ? siteData.blogPosts.filter(post => post.isFeatured)
      : siteData.blogPosts.filter(post => post.categories.includes(category))
    : siteData.blogPosts;
  
  // Sort filtered posts by date (newest first)
  const sortedPosts = [...filteredPosts].sort((a, b) => 
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
  
  // Get all unique categories from blog posts
  const allCategories = Array.from(
    new Set(siteData.blogPosts.flatMap(post => post.categories))
  ).sort();
  
  // Get full URL for canonical
  const siteUrl = process.env.SITE_URL || 'https://brain9ai.com';
  const canonicalUrl = `${siteUrl}/blog`;

  // Generate structured data for blog list
  const blogListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    headline: category ? `${category} Articles | brain9ai Blog` : 'AI Automation Insights | brain9ai Blog',
    description: category 
      ? `Explore our latest insights on ${category}`
      : 'Discover how AI agents are transforming businesses across industries',
    url: `${siteUrl}/blog${category ? `?category=${encodeURIComponent(category)}` : ''}`,
    publisher: {
      '@type': 'Organization',
      name: 'brain9ai',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`
      }
    },
    blogPost: sortedPosts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.publishDate,
      author: {
        '@type': 'Person',
        name: post.author.name
      },
      url: `${siteUrl}/blog/${post.slug}`
    }))
  };

  const setMetadata = () => {
    const headData = {
      title: category ? `${category} Articles | brain9ai Blog` : 'AI Automation Insights | brain9ai Blog',
      openGraph: {
        title: category ? `${category} Articles | brain9ai Blog` : 'AI Automation Insights | brain9ai Blog',
        url: 'https://brain9ai.com/blog' + (category ? `?category=${encodeURIComponent(category)}` : ''),
        siteName: 'brain9ai',
      },
    };
    // ... rest of the function
  };

  return (
    <>
      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListJsonLd) }}
      />

      {/* Breadcrumb navigation - positioned at the root level outside the main element */}
      <div className="fixed-breadcrumb w-full">
        <Breadcrumb 
          items={[
            { label: 'Home', href: '/' },
            { label: category ? `Blog: ${category}` : 'Blog', isActive: true }
          ]}
          sticky={true}
        />
      </div>
      
      <main className="min-h-screen bg-slate-950 pb-16 pt-8">
        {/* Hero section with modern design and animated background */}
        <div className="relative w-full pt-20 pb-12 overflow-hidden">
          {/* Decorative background pattern - inspired by modern web design trends */}
          <div className="absolute inset-0 bg-slate-950 z-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl"></div>
              <div className="absolute top-20 right-20 w-60 h-60 bg-blue-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-1/3 w-40 h-40 bg-purple-600 rounded-full blur-3xl"></div>
            </div>
            <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm z-1"></div>
            
            {/* Light grid pattern overlay */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5 z-2"></div>
          </div>
          
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-5 lg:px-6 relative z-10">
            <div className="text-center mb-12">
              {/* Subtle badge above title */}
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-3">
                <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                <span className="text-sm font-medium text-blue-400 tracking-wide">
                  {category ? `${category} Collection` : 'Insights & Expertise'}
                </span>
              </div>
              
              {/* Enhanced title with modern typography */}
              <h1 className="mt-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 text-2xl md:text-3xl lg:text-4xl font-bold font-display tracking-tight leading-[1.1] md:leading-[1.05] relative inline-block mb-3">
                {category ? `${category} Articles` : 'AI Automation Insights'}
              </h1>
              
              {/* Animated underline */}
              <div className="relative h-1 w-40 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 mb-6 overflow-hidden">
                <div className="absolute inset-0 bg-white/30 animate-[shine_2s_infinite]"></div>
              </div>
              
              <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-300 font-light tracking-wide leading-relaxed">
                {category 
                  ? `Explore our latest insights on ${category}`
                  : 'Discover how AI agents are transforming businesses across industries'
                }
              </p>
              
              {/* Show "View All" link when category is selected */}
              {category && (
                <Link 
                  href="/blog"
                  className="mt-6 inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors font-medium text-sm px-4 py-1.5 border border-blue-500/30 rounded-full hover:bg-blue-500/10 group"
                >
                  <svg className="w-3.5 h-3.5 mr-2 transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  View all topics
                </Link>
              )}
            </div>
            
            {/* Category pills with modern styling - Adjusted for better visibility */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-4xl mx-auto mb-4 px-4">
              {/* Featured category always appears first if there are featured articles */}
              <Link 
                href="/blog?category=Featured" 
                className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                  category === 'Featured'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/20'
                    : 'bg-slate-800/70 text-blue-300 hover:bg-slate-800 hover:text-blue-200 border border-slate-700'
                }`}
                prefetch={false}
              >
                Featured
              </Link>
              {allCategories.map(cat => (
                <Link 
                  key={cat}
                  href={`/blog?category=${encodeURIComponent(cat)}`} 
                  className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                    category === cat
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/20'
                      : 'bg-slate-800/70 text-blue-300 hover:bg-slate-800 hover:text-blue-200 border border-slate-700'
                  }`}
                  prefetch={false}
                >
                  {cat}
                </Link>
              ))}
            </div>
            
            {/* Static site notice */}
            <div className="text-center mb-12">
              <span className="text-xs text-blue-400/70 bg-blue-500/10 rounded-full px-4 py-1.5 border border-blue-500/20">
                Note: Category selection may require page refresh in static mode
              </span>
            </div>
          </div>
        </div>
        
        {/* Blog post grid with featured post - Wider container */}
        <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-5 lg:px-6 relative -mt-4">
          {/* Section heading for blog posts grid - Updated with modern design */}
          <div className="flex items-center mb-8 mt-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 mr-3 border border-blue-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display tracking-wide">
                {category ? `${category} Articles` : 'All Articles'}
              </h2>
              {category && (
                <span className="mt-1 inline-block bg-blue-500/20 text-blue-400 text-xs rounded-full px-3 py-1">
                  {sortedPosts.length} {sortedPosts.length === 1 ? 'article' : 'articles'}
                </span>
              )}
            </div>
          </div>
          
          {/* Blog posts in modern magazine-style layout with balanced proportions */}
          <div className="max-w-5xl mx-auto space-y-10">
            {sortedPosts.map((post, index) => (
              <article 
                key={post.id}
                className="group"
              >
                <div className="flex flex-col gap-5">                  
                  <div className="relative bg-slate-900/40 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
                    {/* Decorative glowing elements */}
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/30 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl"></div>
                    
                    <div className="relative p-5 lg:p-5">
                      <div className="flex flex-col md:flex-row md:items-stretch gap-4 lg:gap-5">
                        {/* Image with title overlay - adjusted proportions */}
                        <div className="md:w-2/5 relative">
                          <div className="relative h-40 overflow-hidden rounded-xl aspect-video lg:h-full shadow-lg min-h-[180px] bg-gradient-to-br from-slate-800 to-slate-900">
                            {/* Improved overlay for better text visibility */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-slate-900/40 z-10"></div>
                            <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay z-5"></div>
                            
                            {/* Featured icon overlay in top-right corner */}
                            <div className="absolute top-3 right-3 z-30 bg-blue-500/80 backdrop-blur-sm p-2.5 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300">
                              {post.isFeatured ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              )}
                            </div>
                            
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40 mix-blend-overlay z-10"></div>
                            <div className="absolute inset-0 bg-slate-800/70 z-5"></div>
                            <Image 
                              src={post.featuredImage}
                              alt={post.title}
                              fill
                              loading="lazy"
                              sizes="(max-width: 1024px) 100vw, 50vw"
                              className="object-cover scale-105 hover:scale-105 transition-transform duration-700 ease-in-out"
                              unoptimized={true}
                              style={{objectFit: 'cover'}}
                            />
                            
                            {/* Title overlay with gradient for readability - Enhanced gradient for better visibility */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 from-10% via-slate-900/80 via-50% to-slate-900/50 z-20 flex flex-col justify-end p-4 lg:p-6">
                              {/* Categories with better contrast */}
                              <div className="flex flex-wrap gap-2 mb-3 relative z-30">
                                {post.isFeatured && (
                                  <span className="px-2.5 py-0.5 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-full text-xs font-medium border border-amber-500/50 shadow-sm">
                                    Featured
                                  </span>
                                )}
                                {post.categories.map(category => (
                                  <ClientLink 
                                    key={category}
                                    href={`/blog?category=${encodeURIComponent(category)}`}
                                    className="px-2.5 py-0.5 bg-blue-600/70 text-white rounded-full text-xs font-medium hover:bg-blue-600/90 transition-all backdrop-blur-sm border border-blue-500/50 shadow-sm"
                                  >
                                    {category}
                                  </ClientLink>
                                ))}
                              </div>
                              
                              {/* Title with better line height and wrapping */}
                              <h2 className="text-xl md:text-xl lg:text-2xl font-bold text-white font-display tracking-tight leading-[1.15] mb-3 line-clamp-2">
                                {post.title}
                              </h2>
                              
                              {/* Mobile-only CTA */}
                              <div className="flex lg:hidden mt-1">
                                <Link 
                                  href={`/blog/${post.slug}`}
                                  className="inline-flex items-center text-white text-xs font-medium bg-blue-600/60 px-2.5 py-1 rounded-full hover:bg-blue-600/80 transition-colors"
                                >
                                  Read article
                                  <svg className="ml-1.5 w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Content - Side by side on large screens - balanced proportions */}
                        <div className="md:w-3/5 relative z-20 flex flex-col pl-0 md:pl-4">
                          {/* Excerpt with improved readability */}
                          <p className="text-sm md:text-base text-gray-300 mb-4 font-light leading-relaxed flex-grow">
                            {post.excerpt}
                          </p>
                          
                          <div className="mt-auto">
                            {/* Author and metadata with modern design */}
                            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                              <div className="flex items-center">
                                <div className="relative">
                                  <Image 
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full border-2 border-white/20 object-cover"
                                    unoptimized={true}
                                  />
                                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                                </div>
                                <div className="ml-3">
                                  <p className="text-white font-medium text-sm">{post.author.name}</p>
                                  <div className="flex items-center text-gray-400 text-xs">
                                    <span>{formatDate(post.publishDate)}</span>
                                    <span className="mx-2">•</span>
                                    <span>{getReadingTime(post.content)} min read</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Modern gradient CTA button - desktop only */}
                            <div className="hidden lg:block">
                              <Link 
                                href={`/blog/${post.slug}`}
                                className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-medium transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-blue-500/30 group"
                              >
                                Read article
                                <svg className="ml-2 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Refined separator */}
                <div className="mt-10 pt-5 border-t border-slate-800 relative">
                  <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination controls with modern design */}
          <div className="max-w-5xl mx-auto mt-16 mb-6 flex justify-center gap-3">
            <button className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md shadow-blue-600/20">1</button>
            
            <button className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Call-to-action section - Updated with modern design and glassmorphism */}
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-5 lg:px-6 mt-24 relative">
          <div className="flex items-center mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 mr-3 border border-purple-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white font-display tracking-wide">Discover Our AI Solutions</h2>
          </div>
          
          <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 backdrop-blur-md border border-slate-700/50 relative overflow-hidden shadow-xl">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
            
            {/* Small decorative elements */}
            <div className="absolute top-10 right-10 h-20 w-20 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl"></div>
            <div className="absolute bottom-10 left-1/4 h-16 w-16 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-xl"></div>
            
            {/* Fine grid pattern for texture */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5"></div>
            
            <div className="relative z-10">
              <div className="max-w-4xl">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-5 font-display tracking-tight leading-tight">
                  Discover Our AI Agents<span className="text-blue-400">.</span>
                </h3>
                <p className="text-gray-300 mb-8 max-w-3xl text-base font-light leading-relaxed">
                  Ready to implement AI automation in your business? Explore our range of specialized AI agents designed to enhance different aspects of your customer journey, from lead generation to sales, appointment setting, and customer support.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                <Link 
                  href="/products/anaya-webAgent"
                  className="flex flex-col p-5 bg-slate-900/70 backdrop-blur-sm rounded-xl border border-slate-800 hover:border-blue-800/50 hover:bg-slate-900 hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Icon header with glow effect */}
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3 group-hover:bg-blue-500/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    </svg>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Anaya WebAgent</h3>
                  <p className="text-gray-400 text-sm mb-5 flex-grow leading-relaxed">Voice-guided website navigation and customer support for intuitive user experiences.</p>
                  
                  <div className="flex items-center text-blue-400 text-sm font-medium mt-auto">
                    Learn more
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </Link>
                
                <Link 
                  href="/products/rocketsingh-salesAgent"
                  className="flex flex-col p-5 bg-slate-900/70 backdrop-blur-sm rounded-xl border border-slate-800 hover:border-purple-800/50 hover:bg-slate-900 hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Icon header with glow effect */}
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3 group-hover:bg-purple-500/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">RocketSingh Sales Agent</h3>
                  <p className="text-gray-400 text-sm mb-5 flex-grow leading-relaxed">Conversational AI sales agent that handles customer inquiries and qualification.</p>
                  
                  <div className="flex items-center text-purple-400 text-sm font-medium mt-auto">
                    Learn more
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </Link>
                
                <Link 
                  href="/products/sam-leadGenAgent"
                  className="flex flex-col p-5 bg-slate-900/70 backdrop-blur-sm rounded-xl border border-slate-800 hover:border-amber-800/50 hover:bg-slate-900 hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Icon header with glow effect */}
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3 group-hover:bg-amber-500/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">Sam Lead Generation Agent</h3>
                  <p className="text-gray-400 text-sm mb-5 flex-grow leading-relaxed">Specialized voice agents for lead generation and qualification.</p>
                  
                  <div className="flex items-center text-amber-400 text-sm font-medium mt-auto">
                    Learn more
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </Link>
              </div>
              
              <div className="mt-10 text-center">
                <Link
                  href="/products"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-base font-medium shadow-lg shadow-blue-900/30 hover:shadow-xl hover:shadow-purple-900/40 hover:-translate-y-1 transition-all duration-300 group"
                >
                  View All AI Agents
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default BlogPage; 