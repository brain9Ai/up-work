'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteData } from '../data/siteData';
import BrainLogo from './BrainLogo';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Handle scroll for background change
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 py-1.5 sm:py-2 px-4 sm:px-5 transition-all duration-300 ${
          isScrolled || mobileMenuOpen ? 'bg-slate-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1100px] mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className={`flex items-center text-lg font-bold transition-all duration-300 ${
            isScrolled ? 'scale-90' : ''
          }`}>
            <BrainLogo className="h-4 w-4 md:h-5 md:w-5 mr-1.5" />
            <span className="font-display tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              brain9<span className="text-blue-400">ai</span>
            </span>
          </Link>
          
          {/* Desktop menu - right aligned with animations */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="hidden md:flex space-x-2">
              <Link 
                href="/products" 
                className={`px-2 py-1 rounded-md text-sm font-medium font-display tracking-wide ${
                  pathname === '/products' || pathname.startsWith('/products/') 
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500' 
                    : 'text-gray-300 hover:text-white'
                } transition-colors`}
              >
                Our Agents
              </Link>
              <Link 
                href="/services" 
                className={`px-2 py-1 rounded-md text-sm font-medium font-display tracking-wide ${
                  pathname === '/services' || pathname.startsWith('/services/') 
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500' 
                    : 'text-gray-300 hover:text-white'
                } transition-colors`}
              >
                Services
              </Link>
              <Link 
                href="/blog" 
                className={`px-2 py-1 rounded-md text-sm font-medium font-display tracking-wide ${
                  pathname === '/blog' || pathname.startsWith('/blog/') 
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500' 
                    : 'text-gray-300 hover:text-white'
                } transition-colors`}
              >
                Blog
              </Link>
              <Link 
                href="/about" 
                className={`px-2 py-1 rounded-md text-sm font-medium font-display tracking-wide ${
                  pathname === '/about' || pathname.startsWith('/about/') 
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500' 
                    : 'text-gray-300 hover:text-white'
                } transition-colors`}
              >
                About
              </Link>
            </div>
            <div className="hidden md:flex">
              <Link 
                href="/contact" 
                className="ml-2 inline-flex items-center px-2.5 py-1 border border-transparent text-sm font-medium font-display tracking-wide rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Contact Us
              </Link>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center justify-end w-[40px]">
          <button 
              className="text-gray-300 hover:text-white focus:outline-none relative z-50 min-w-[24px]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
              <div className="relative w-6 h-5 flex flex-col justify-between overflow-visible">
              <span className={`w-full h-0.5 bg-current transform transition-all duration-300 ${
                mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}></span>
              <span className={`w-full h-0.5 bg-current transition-all duration-300 ${
                mobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}></span>
              <span className={`w-full h-0.5 bg-current transform transition-all duration-300 ${
                mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}></span>
            </div>
          </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile menu overlay - separate from nav for better z-index management */}
      <div 
        className={`fixed inset-0 bg-slate-900/95 backdrop-blur-md z-40 transform transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } md:hidden`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="h-full flex flex-col p-6 pt-20 overflow-y-auto">
          {/* Brand logo at top */}
          <div className="mb-8 flex justify-center items-center">
            <BrainLogo className="h-7 w-7 mr-2" />
            <span className="font-display tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 text-2xl font-bold">
              brain9<span className="text-blue-400">ai</span>
            </span>
          </div>
          
          {/* Navigation links with improved spacing and visual cues */}
          <div className="space-y-4">
            {[
              { href: '/products', label: 'Our Agents' },
              { href: '/services', label: 'Services' },
              { href: '/blog', label: 'Blog' },
              { href: '/about', label: 'About' },
              { href: '/contact', label: 'Contact' }
            ].map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between py-4 px-4 rounded-lg text-lg font-display tracking-wide ${
                  pathname === item.href || pathname.startsWith(item.href + '/') 
                    ? 'bg-blue-900/30 text-white border-l-4 border-blue-500' 
                    : 'text-gray-300 hover:bg-slate-800/60 active:bg-slate-800'
                } transition-colors`}
              >
                <span>{item.label}</span>
                {pathname === item.href || pathname.startsWith(item.href + '/') ? (
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </Link>
            ))}
          </div>
          
          {/* Contact button at bottom of menu */}
          <div className="mt-auto mb-10 pt-8">
            <Link 
              href="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full block py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium font-display tracking-wide text-center text-lg shadow-lg"
            >
              Get in Touch
            </Link>
          </div>
          
          {/* Social links */}
          <div className="pt-6 border-t border-slate-800">
            <div className="flex justify-center space-x-6">
              <a href="https://x.com/brain9ai" className="text-gray-400 hover:text-black transition-colors">
                <span className="sr-only">X (Twitter)</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://instagram.com/brain9.ai" className="text-gray-400 hover:text-blue-400 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar; 