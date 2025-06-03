import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { siteData } from '../../data/siteData';
import { Metadata, ResolvingMetadata } from 'next';
import ReactMarkdown from 'react-markdown';
import Breadcrumb from '../../components/Breadcrumb';
import ClientLink from '../../components/ClientLink';
import ReadMoreButton from '../../components/ReadMoreButton';

// Define types for the metadata generation params
type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

// Generate metadata for the page based on the blog post data
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Find the blog post by slug
  const post = siteData.blogPosts.find(post => post.slug === params.slug);
  
  // If post not found, return default metadata
  if (!post) {
    return {
      title: 'Post Not Found | brain9ai Blog',
      description: 'The requested blog post could not be found.',
    }
  }
  
  // Extract metadata from post
  const previousImages = (await parent).openGraph?.images || [];
  const siteUrl = process.env.SITE_URL || 'https://brain9ai.com';
  
  return {
    title: post.title,
    description: post.excerpt,
    keywords: [...post.tags, ...post.categories],
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${siteUrl}/blog/${post.slug}`,
      siteName: 'brain9ai Blog',
      images: [
        {
          url: `${siteUrl}${post.featuredImage}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
        ...previousImages,
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: post.publishDate,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [`${siteUrl}${post.featuredImage}`],
    },
  }
}

// Generate static params for all blog posts for better SEO and performance
export async function generateStaticParams() {
  return siteData.blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// Format date to readable string
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Component for rendering custom headings
const CustomHeading = ({ level, children }: { level: number, children: React.ReactNode }) => {
  const className = "text-white font-bold font-display tracking-wide my-4 relative z-10";
  
  const underlineClass = "border-b-2 border-blue-500 pb-1 mb-2";
  
  switch (level) {
    case 1:
      return <h1 className={`${className} text-2xl md:text-2xl lg:text-3xl mb-6 leading-[1.2] md:leading-[1.15] max-w-4xl ${underlineClass}`}>{children}</h1>;
    case 2:
      return <h2 className={`${className} text-xl md:text-xl lg:text-2xl mt-12 mb-4 leading-[1.2] md:leading-[1.15] max-w-4xl ${underlineClass}`}>{children}</h2>;
    case 3:
      return <h3 className={`${className} text-lg md:text-lg lg:text-xl mt-10 mb-4 leading-[1.2] md:leading-[1.15] max-w-3xl`}>{children}</h3>;
    case 4:
      return <h4 className={`${className} text-base md:text-base lg:text-lg mb-3 leading-[1.3] md:leading-[1.2] max-w-3xl`}>{children}</h4>;
    case 5:
      return <h5 className={`${className} text-sm md:text-sm lg:text-base mb-2 leading-[1.3] md:leading-[1.2] max-w-3xl`}>{children}</h5>;
    default:
      return <h6 className={`${className} text-xs md:text-xs lg:text-sm mb-2 leading-[1.3] md:leading-[1.2] max-w-3xl`}>{children}</h6>;
  }
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // Find the blog post by slug
  const post = siteData.blogPosts.find(post => post.slug === params.slug);
  
  // If post not found, return 404
  if (!post) {
    notFound();
  }
  
  // Find related agent
  const relatedAgent = siteData.products.find(p => p.id === post.relatedAgent);
  
  // Find related posts (same categories, excluding current post)
  const relatedPosts = siteData.blogPosts
    .filter(p => 
      p.id !== post.id && 
      p.categories.some(cat => post.categories.includes(cat))
    )
    .slice(0, 3);
  
  // Function to check if a URL is internal and convert it to the proper format if needed
  const handleInternalLink = (href: string) => {
    // Check if it's not an external URL (doesn't start with http:// or https://)
    if (!href.startsWith('http://') && !href.startsWith('https://')) {
      // If it's a product link
      if (href.startsWith('/products/') || href.includes('/products/')) {
        const productId = href.split('/').pop();
        const product = siteData.products.find(p => p.id === productId);
        if (product) {
          return `/products/${product.id}`;
        }
      }
      
      // If it's a blog post link
      if (href.startsWith('/blog/') || href.includes('/blog/')) {
        const postSlug = href.split('/').pop();
        const blogPost = siteData.blogPosts.find(p => p.slug === postSlug);
        if (blogPost) {
          return `/blog/${blogPost.slug}`;
        }
      }
      
      // If it's a service link
      if (href.startsWith('/services/') || href.includes('/services/')) {
        const serviceId = href.split('/').pop();
        const service = siteData.services.find(s => s.id === serviceId);
        if (service) {
          return `/services/${service.id}`;
        }
      }
      
      // General internal link
      if (href.startsWith('/')) {
        return href;
      }
    }
    
    return href;
  };
  
  // Generate the JSON-LD structured data for the blog post
  const siteUrl = process.env.SITE_URL || 'https://brain9ai.com';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: `${siteUrl}${post.featuredImage}`,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.title
    },
    publisher: {
      '@type': 'Organization',
      name: 'brain9ai',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      }
    },
    datePublished: post.publishDate,
    dateModified: post.publishDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug}`
    },
    keywords: [...post.tags, ...post.categories].join(',')
  };
  
  return (
    <>
      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Breadcrumb Navigation - positioned at the root level outside the main element */}
      <div className="fixed-breadcrumb">
        <Breadcrumb 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: params.slug, isActive: true }
          ]}
          sticky={true}
        />
      </div>
      
      <main className="bg-slate-950 pb-14 pt-12 w-full">
        {/* Header with featured image - Reduced height */}
        <div className="relative w-full h-[35vh] md:h-[40vh] lg:h-[50vh] overflow-hidden">
          {/* Featured image with overlay */}
          <div className="absolute inset-0 bg-black/70 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 from-5% via-slate-950/80 via-30% to-slate-950/40 z-20"></div>
          <Image 
            src={post.featuredImage}
            alt={post.title}
            fill
            priority
            className="object-cover z-0"
            unoptimized={true}
          />
          
          {/* Title and meta overlay */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-4 md:p-8">
            <div className="max-w-[1100px] mx-auto">
              {/* Categories */}
              <div className="flex flex-wrap gap-1.5 mb-4 relative z-10">
                {post.categories.map(category => (
                  <Link 
                    key={category}
                    href={`/blog?category=${encodeURIComponent(category)}`}
                    className="px-2.5 py-0.5 bg-blue-500/40 text-blue-100 rounded-full text-xs font-medium hover:bg-blue-500/50 transition-colors backdrop-blur-sm"
                  >
                    {category}
                  </Link>
                ))}
              </div>
              
              {/* Title - Smaller and more compact */}
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white font-display tracking-wide leading-[1.2] md:leading-[1.15] mb-4 max-w-4xl">
                {post.title}
              </h1>
              
              {/* Author and date - More compact */}
              <div className="flex items-center mb-4 relative z-10">
                <Image 
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white/20 shadow-lg"
                />
                <div className="ml-3 bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  <p className="text-white font-medium text-sm">{post.author.name}</p>
                  <p className="text-gray-300 text-xs">{post.author.title} • {formatDate(post.publishDate)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content - More compact container */}
        <div className="max-w-[1100px] mx-auto px-4 sm:px-5 lg:px-6 relative -mt-4 z-10">
          <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-800/50 overflow-hidden">
            {/* Content - Reduced padding */}
            <article className="p-5 lg:p-8 relative z-1">
              {/* Excerpt - Smaller font size */}
              <p className="text-base md:text-lg text-blue-300 mb-8 leading-relaxed font-light">{post.excerpt}</p>
              
              {/* Tags - More compact */}
              <div className="flex flex-wrap gap-1.5 mb-8">
                {post.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="px-2.5 py-0.5 bg-slate-800 text-slate-400 rounded-full text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              {/* Table of Contents - More compact */}
              <div className="mb-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <h3 className="text-base font-bold text-white mb-3 font-display tracking-wide">Table of Contents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {post.content.split('\n').filter(line => line.startsWith('## ')).map((line, index) => {
                    const headingText = line.replace('## ', '');
                    const headingId = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    
                    return (
                      <div key={index} className="flex items-center">
                        <div className="w-1 h-1 rounded-full bg-blue-500 mr-2"></div>
                        <a 
                          href={`#${headingId}`}
                          className="text-blue-400 hover:text-blue-300 transition-colors text-xs"
                        >
                          {headingText}
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Markdown content - Smaller typography */}
              <div className="prose prose-base prose-invert prose-blue max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ node, children, ...props }) => <CustomHeading level={1} children={children} {...props} />,
                    h2: ({ node, children, ...props }) => {
                      // Generate ID from heading text but don't display it visually
                      const headingText = children ? children.toString() : '';
                      const id = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      
                      return (
                        <div id={id} className="scroll-mt-16 relative">
                          <CustomHeading level={2} children={headingText} {...props} />
                          <a href={`#${id}`} className="absolute -top-1 -left-4 w-4 h-4 flex items-center justify-center text-slate-500 hover:text-blue-400 opacity-0 hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </a>
                        </div>
                      );
                    },
                    h3: ({ node, children, ...props }) => <CustomHeading level={3} children={children} {...props} />,
                    h4: ({ node, children, ...props }) => <CustomHeading level={4} children={children} {...props} />,
                    h5: ({ node, children, ...props }) => <CustomHeading level={5} children={children} {...props} />,
                    p: ({ node, ...props }) => <p className="text-gray-300 mb-4 leading-relaxed font-light text-sm md:text-base max-w-prose" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 text-gray-300 space-y-2" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 text-gray-300 space-y-2" {...props} />,
                    li: ({ node, ...props }) => <li className="text-gray-300 leading-relaxed font-light pl-1.5 text-sm" {...props} />,
                    blockquote: ({ node, ...props }) => (
                      <blockquote className="border-l-4 border-blue-500 pl-4 py-3 my-6 bg-blue-500/10 rounded-r-lg italic text-blue-200 text-base" {...props} />
                    ),
                    a: ({ node, href, ...props }) => {
                      const isInternal = href && !href.startsWith('http');
                      const linkHref = href ? handleInternalLink(href) : '';
                      
                      return isInternal ? (
                        <Link 
                          href={linkHref} 
                          className="text-blue-400 hover:text-blue-300 underline transition-colors font-medium"
                          {...props}
                        />
                      ) : (
                        <a 
                          href={href} 
                          className="text-blue-400 hover:text-blue-300 underline transition-colors font-medium" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          {...props}
                        />
                      );
                    },
                    strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                    em: ({ node, ...props }) => <em className="italic text-blue-200" {...props} />,
                    code: ({ node, ...props }) => (
                      <code className="bg-slate-800 px-1.5 py-0.5 rounded text-blue-300 font-mono text-xs" {...props} />
                    ),
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
              
              {/* Related posts section - More compact */}
              {relatedPosts.length > 0 && (
                <div className="mt-10 pt-5 border-t border-slate-800">
                  <h3 className="text-lg font-bold text-white mb-3 font-display tracking-wide">Related Articles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {relatedPosts.map(relatedPost => (
                      <Link 
                        href={`/blog/${relatedPost.slug}`}
                        key={relatedPost.id}
                        className="p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors border border-slate-700/50 group"
                      >
                        <div className="h-32 relative rounded-lg overflow-hidden mb-2">
                          <div className="absolute inset-0 bg-slate-900/50 z-10 group-hover:bg-slate-900/30 transition-colors"></div>
                          <Image 
                            src={relatedPost.featuredImage}
                            alt={relatedPost.title}
                            fill
                            className="object-cover"
                            unoptimized={true}
                          />
                        </div>
                        <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors mb-1 font-display tracking-wide text-sm line-clamp-2">
                          {relatedPost.title}
                        </h4>
                        <p className="text-gray-400 text-xs mb-2">{formatDate(relatedPost.publishDate)}</p>
                        
                        <div className="flex items-center text-blue-400 text-xs font-medium">
                          Read article
                          <svg className="ml-1 w-3 h-3 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Related agent section - More compact */}
              {relatedAgent && (
                <div className="mt-8 pt-5 border-t border-slate-800">
                  <h3 className="text-lg font-bold text-white mb-3 font-display tracking-wide">Related AI Agent</h3>
                  <div className="bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700/50 hover:bg-slate-800/80 transition-colors">
                    <Link href={`/products/${relatedAgent.id}`} className="p-3 flex items-center">
                      <div className="relative w-14 h-14 mr-3 shrink-0">
                        <Image 
                          src={`/agents/${relatedAgent.id.split('-')[0].toLowerCase()}.png`} 
                          alt={relatedAgent.name}
                          fill
                          className="object-cover rounded-full"
                          unoptimized={true}
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base mb-0.5 font-display tracking-wide">{relatedAgent.name}</h4>
                        <p className="text-xs text-gray-300">{relatedAgent.shortDescription}</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium mt-1.5">
                          Learn more
                          <svg className="ml-1 w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </article>
          </div>
          
          {/* Back to blog link - More compact */}
          <div className="flex justify-center mt-6">
            <Link 
              href="/blog" 
              className="inline-flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-full text-xs font-medium transition-colors group"
            >
              <svg className="mr-1.5 w-3.5 h-3.5 text-blue-400 group-hover:-translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to All Articles
            </Link>
          </div>
          
          {/* Share section - More compact */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h3 className="text-base font-bold text-white font-display tracking-wide">Share this Article</h3>
              <div className="flex gap-2">
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${siteUrl}/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-800 hover:bg-blue-900 text-gray-400 hover:text-blue-400 transition-colors"
                  aria-label="Share on Twitter"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${siteUrl}/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-800 hover:bg-blue-900 text-gray-400 hover:text-blue-400 transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a 
                  href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`Check out this article: ${siteUrl}/blog/${post.slug}`)}`}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-800 hover:bg-blue-900 text-gray-400 hover:text-blue-400 transition-colors"
                  aria-label="Share via Email"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 