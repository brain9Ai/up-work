'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import BrainLogo from './BrainLogo';

// Use dynamic import for agent view
const WidgetView = dynamic(() => import('./agent/views/WidgetView'), {
  ssr: false,
  loading: () => <div className="w-12 h-12 rounded-full bg-slate-800 animate-pulse"></div>
});

const Footer = () => {
  const pathname = usePathname();
  const isHomePage = pathname === '/' || pathname === '/home';
  const [isMobile, setIsMobile] = useState(false);

  // Check viewport size on client-side only
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <footer className="relative border-t border-slate-800 overflow-hidden">
      {/* Only render WidgetView if not on homepage */}
      {!isHomePage && (
        <div className="fixed bottom-8 right-8 z-50">
          <div className="relative">
            <WidgetView />
            <div className="hidden md:block absolute -top-12 right-0 text-xs bg-slate-900/80 backdrop-blur-sm text-blue-300 p-2 px-3 rounded-full border border-blue-500/20 shadow-lg whitespace-nowrap animate-float-delay">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                Ask Anaya for help
              </span>
            </div>
          </div>
        </div>
      )}
      
      <div className="absolute inset-0 opacity-5">
        <div className="bg-circuit-pattern h-full w-full"></div>
      </div>
      
      {/* Mobile footer - minimized with only essential links */}
      <div className="md:hidden w-full px-4 py-5 relative z-10">
        <div className="flex flex-col items-center space-y-4">
          {/* Logo */}
          <div className="flex items-center justify-center">
            <BrainLogo className="h-6 w-6 mr-1" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 text-xl font-bold">
              brain9<span className="text-blue-400">ai</span>
            </span>
          </div>
          
          {/* Only show the first section from home page for mobile */}
          <div className="flex justify-center space-x-4 pt-2">
            <Link href="/contact" className="text-xs text-gray-300 hover:text-blue-300 transition-colors">Contact</Link>
          </div>

          {/* Only show the first section from home page for mobile */}
          <div className="flex justify-center space-x-4 pt-2">
            <Link href="/about" className="text-xs text-gray-300 hover:text-blue-300 transition-colors">About</Link>
          </div>
          
          {/* Copyright notice - simplified */}
          <div className="text-xs text-gray-500 pt-2">
            © {new Date().getFullYear()} brain9ai
          </div>
        </div>
      </div>
      
      {/* Desktop footer - full version */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8 relative z-10">
        {/* Mobile footer layout - Stacked design for better small screen experience */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <div className="flex items-center mb-4">
              <BrainLogo className="h-7 w-7 sm:h-8 sm:w-8 mr-2" />
              <div className="neon-text text-lg sm:text-xl font-bold">AI Automation</div>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">
              Navigating the future of business with next-generation AI solutions.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a href="https://www.facebook.com/brain9ai" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://x.com/brain9ai" className="text-gray-400 hover:text-black transition-colors">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://instagram.com/brain9.ai" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://github.com/brain9ai" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Products</h3>
            <ul className="space-y-1 sm:space-y-2">
              <li><Link href="/products" className="text-gray-300 hover:text-blue-300 transition-colors text-xs sm:text-sm">Auto-Lead-Generator</Link></li>
              <li><Link href="/products" className="text-gray-300 hover:text-blue-300 transition-colors text-xs sm:text-sm">Sales Agent</Link></li>
              <li><Link href="/products" className="text-gray-300 hover:text-blue-300 transition-colors text-xs sm:text-sm">Appointment Setter</Link></li>
              <li><Link href="/products" className="text-gray-300 hover:text-blue-300 transition-colors text-xs sm:text-sm">Pricing</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Services</h3>
            <ul className="space-y-1 sm:space-y-2">
              <li><Link href="/services" className="text-gray-300 hover:text-blue-300 transition-colors text-xs sm:text-sm">Workflow Automation</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-blue-300 transition-colors text-xs sm:text-sm">CRM Integration</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-blue-300 transition-colors text-xs sm:text-sm">VAPI Voice Automation</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-blue-300 transition-colors text-xs sm:text-sm">Data Automation</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Company</h3>
            <ul className="space-y-1 sm:space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-blue-300 transition-colors text-xs sm:text-sm">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-blue-300 transition-colors text-xs sm:text-sm">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Responsive bottom section */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-xs sm:text-sm order-2 sm:order-1 mt-4 sm:mt-0 text-center sm:text-left">
            <span className="inline-flex items-center">
              <BrainLogo className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              &copy; {new Date().getFullYear()} AI Automation Solutions. All rights reserved.
            </span>
          </p>
          
          {/* Quick links for mobile - in a row */}
          <div className="flex space-x-3 order-1 sm:order-2">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded opacity-20 blur-sm"></div>
              <a href="#" className="relative px-2 sm:px-3 py-1 bg-slate-900 rounded text-[10px] sm:text-xs text-blue-400 border border-blue-500/30">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  FAQ
                </span>
              </a>
            </div>
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded opacity-20 blur-sm"></div>
              <a href="#" className="relative px-2 sm:px-3 py-1 bg-slate-900 rounded text-[10px] sm:text-xs text-blue-400 border border-blue-500/30">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                  Support
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 