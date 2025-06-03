"use client";

import Link from 'next/link';
import Breadcrumb from '../components/Breadcrumb';
import { siteData } from '../data/siteData';
import Image from 'next/image';
import { useState } from 'react';

export default function AboutPage() {
  // Get the team data from siteData
  const teamMembers = siteData.team;

  return (
    <>
      {/* Breadcrumb navigation */}
      <div className="fixed-breadcrumb w-full">
        <Breadcrumb 
          items={[
            { label: 'Home', href: '/' },
            { label: 'About', isActive: true }
          ]}
          sticky={true}
        />
      </div>
      
      <div className="min-h-screen bg-slate-950 pb-8 pt-8 w-full">
        {/* Header section with animated gradient background - reduced padding */}
        <div className="relative py-6 overflow-hidden w-full">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-slate-950 z-0"></div>
          <div className="absolute inset-0 bg-circuit-pattern opacity-10 z-0"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 relative z-10">
            <div className="text-center">
              <span className="relative inline-block z-10 animate-fade-in">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur animate-pulse"></div>
                <span className="relative px-3 py-1 text-xs font-medium text-blue-400 bg-slate-900/80 backdrop-blur-sm rounded-full border border-blue-600/20">
                  Our Vision
                </span>
              </span>
              <h1 className="mt-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 text-2xl md:text-3xl lg:text-4xl font-bold font-display tracking-wider relative inline-block">
                Pioneering the Future of AI Automation
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-shine"></span>
              </h1>
              <p className="mt-2 max-w-2xl mx-auto text-base md:text-lg text-gray-300 font-light tracking-wide">
                We're on a mission to transform businesses through intelligent automation, making advanced AI technologies accessible to companies of all sizes.
              </p>
            </div>
          </div>
        </div>
        
        {/* Main content section - with reduced spacing */}
        <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 relative z-10">
          {/* About Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-14">
            <div className="order-2 lg:order-1 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-white/5 h-full overflow-hidden relative group transition-all duration-500 hover:bg-slate-800/50 hover:border-white/10 hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-full h-full flex items-center justify-center">
                  <div className="relative z-10 p-6 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white animate-pulse-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-blue-400 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-blue-400 to-purple-400 transition-colors duration-500">Innovation at Our Core</h3>
                    <p className="text-gray-300 group-hover:text-gray-100 transition-colors duration-300">We continuously push the boundaries of what's possible with AI automation, creating solutions that anticipate and exceed business needs.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 animate-gradient-x">Our Story</h2>
              <p className="text-gray-300 mb-3">
                Founded in 2021, brain9ai emerged from a vision to make cutting-edge AI technologies accessible to businesses of all sizes. What began as a small team of passionate technologists has grown into a leading provider of intelligent agent solutions.
              </p>
              <p className="text-gray-300 mb-4">
                Our journey has been driven by a simple belief: that automation should enhance human capabilities, not replace them. We've developed a suite of AI-powered tools and services that streamline operations, improve decision-making, and create exceptional experiences for both businesses and their customers.
              </p>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-white/5 p-3 hover:bg-slate-800/50 hover:border-white/10 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <div className="text-2xl font-bold text-blue-400 animate-pulse-slow">100+</div>
                  <div className="text-xs text-gray-400">Businesses Transformed</div>
                </div>
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-white/5 p-3 hover:bg-slate-800/50 hover:border-white/10 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <div className="text-2xl font-bold text-purple-400 animate-pulse-slow">15k+</div>
                  <div className="text-xs text-gray-400">Automation Hours</div>
                </div>
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-white/5 p-3 hover:bg-slate-800/50 hover:border-white/10 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <div className="text-2xl font-bold text-blue-400 animate-pulse-slow">98%</div>
                  <div className="text-xs text-gray-400">Client Satisfaction</div>
                </div>
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-white/5 p-3 hover:bg-slate-800/50 hover:border-white/10 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <div className="text-2xl font-bold text-purple-400 animate-pulse-slow">24/7</div>
                  <div className="text-xs text-gray-400">AI-Powered Support</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Our Values */}
          <div className="mb-14 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3 animate-gradient-x">Our Core Values</h2>
              <p className="text-gray-300 max-w-3xl mx-auto text-sm md:text-base">
                These principles guide everything we do as we create the future of AI automation
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-white/5 p-6 relative overflow-hidden group transition-all duration-500 hover:bg-slate-800/50 hover:border-white/10 hover:shadow-2xl animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="text-blue-400 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 animate-pulse-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-blue-400 to-purple-400 transition-colors duration-500">Innovation</h3>
                <p className="text-gray-400 text-sm group-hover:text-gray-100 transition-colors duration-300">We constantly push the boundaries of what's possible with AI and automation, staying at the forefront of technological advancement.</p>
              </div>
              
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-white/5 p-6 relative overflow-hidden group transition-all duration-500 hover:bg-slate-800/50 hover:border-white/10 hover:shadow-2xl animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="text-blue-400 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 animate-pulse-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-blue-400 to-purple-400 transition-colors duration-500">Customer Focus</h3>
                <p className="text-gray-400 text-sm group-hover:text-gray-100 transition-colors duration-300">Our customers' success is our success. We design every solution with the end user in mind, ensuring intuitive experiences.</p>
              </div>
              
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-white/5 p-6 relative overflow-hidden group transition-all duration-500 hover:bg-slate-800/50 hover:border-white/10 hover:shadow-2xl animate-fade-in-up" style={{ animationDelay: '700ms' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="text-blue-400 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 animate-pulse-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-blue-400 to-purple-400 transition-colors duration-500">Integrity</h3>
                <p className="text-gray-400 text-sm group-hover:text-gray-100 transition-colors duration-300">We operate with transparency and ethical standards, building trust through honest communication and data protection.</p>
              </div>
            </div>
          </div>
          
          {/* Team Section - reduced spacing */}
          <div className="mb-14 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3 animate-gradient-x">Our Leadership Team</h2>
              <p className="text-gray-300 max-w-3xl mx-auto text-sm md:text-base">
                Meet the experts driving our vision forward
              </p>
            </div>
            
            <div className="relative p-6 md:p-8 bg-slate-900/30 rounded-2xl border border-white/5 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-50"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                {teamMembers.map((member, index) => (
                  <div 
                    key={index} 
                    className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-white/5 p-6 text-center relative overflow-hidden group transition-all duration-500 hover:bg-slate-800/50 hover:border-white/10 hover:shadow-2xl animate-fade-in-up"
                    style={{ animationDelay: `${index * 100 + 900}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="mb-5 relative">
                      <div className="relative w-28 h-28 mx-auto hover:scale-105 transition-transform duration-500">
                        {/* Pixar-style circular frame with shadow depth */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent shadow-xl overflow-hidden border-4 border-white/20">
                          <div className="absolute inset-0 rounded-full shadow-inner bg-gradient-to-br from-white/30 via-transparent to-black/30"></div>
                          <div className="absolute inset-[6px] rounded-full bg-slate-800/40 shadow-inner"></div>
                          <div className="absolute inset-[10px] rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                            {/* Display team member image with fallback */}
                            <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-700 flex items-center justify-center">
                              {member.image ? (
                                <Image 
                                  src={member.image}
                                  alt={member.name}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  priority={index < 4}
                                />
                              ) : (
                                <span className="flex items-center justify-center text-white text-2xl font-bold opacity-80">
                                  {member.name.charAt(0)}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Highlight reflection */}
                          <div className="absolute top-[-15%] left-[10%] w-[80%] h-[30%] bg-white/20 rounded-full rotate-[-20deg] blur-sm animate-pulse"></div>
                        </div>
                        
                        {/* Decorative elements */}
                        <div className="absolute -left-2 -top-2 w-3 h-3 rounded-full bg-blue-500/20 blur-md animate-pulse-slow"></div>
                        <div className="absolute -right-1 -bottom-1 w-2 h-2 rounded-full bg-purple-500/20 blur-md animate-pulse-slower"></div>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-blue-400 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-blue-400 to-purple-400 transition-colors duration-500">{member.name}</h3>
                    <p className="text-purple-400 text-sm mb-3">{member.role}</p>
                    <div className="h-px w-16 mx-auto bg-gradient-to-r from-blue-400/30 to-purple-400/30 mb-3"></div>
                    <p className="text-gray-400 text-sm group-hover:text-gray-100 transition-colors duration-300 leading-relaxed">{member.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* CTA Section - reduced spacing */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
            <div className="relative z-10 p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-white/5 shadow-xl transition-all duration-500 hover:bg-slate-800/50 hover:border-white/10 hover:shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl"></div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3 animate-gradient-x">Join Our Journey</h2>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto text-sm md:text-base">
                  Partner with us to transform your business with cutting-edge AI automation solutions.
                </p>
                <div className="flex justify-center gap-3">
                  <Link href="/contact" className="btn-primary group transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-bounce-subtle">
                    <span className="flex items-center">
                      Contact Us
                      <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </Link>
                  <Link href="/services" className="btn-outline group transform transition-all duration-300 hover:scale-105">
                    <span>Explore Services</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 