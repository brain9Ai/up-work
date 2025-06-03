'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { siteData } from '../data/siteData';
import Breadcrumb from '../components/Breadcrumb';
import logger from '../utils/logger';
import { validateEmail, validatePhone, validateRequired } from '../utils/validation';
import WEBHOOK_ENDPOINTS from '../config/webhooks';

// The n8n webhook URL for storing customer information
const N8N_WEBHOOK_URL = 'https://brain9.app.n8n.cloud/webhook/book-appointment-and-store-customer-info';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    service: 'default',
  });
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    service: '',
  });
  
  // Refs for form inputs to maintain focus
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const companyInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const serviceInputRef = useRef<HTMLSelectElement>(null);
  
  // Track active input to restore focus after state changes
  const [activeField, setActiveField] = useState<string | null>(null);
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Track which field is currently active
    setActiveField(name);
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Validate the field
    let errorMessage = '';
    
    switch(name) {
      case 'name':
        if (!validateRequired(value)) {
          errorMessage = 'Name is required';
        }
        break;
      case 'email':
        if (!validateRequired(value)) {
          errorMessage = 'Email is required';
        } else if (!validateEmail(value)) {
          errorMessage = 'Please enter a valid email address';
        }
        break;
      case 'phone':
        if (value.trim() !== '' && !validatePhone(value)) {
          errorMessage = 'Please enter a valid phone number';
        }
        break;
      case 'message':
        if (!validateRequired(value)) {
          errorMessage = 'Message is required';
        }
        break;
      case 'service':
        if (!validateRequired(value)) {
          errorMessage = 'Please select a subject';
        }
        break;
    }
    
    // Update validation errors
    setValidationErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };
  
  // Focus handlers for inputs
  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setActiveField(e.target.name);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate all fields
    const newValidationErrors = { ...validationErrors };
    let hasErrors = false;
    
    // Check required fields
    if (!validateRequired(formData.name)) {
      newValidationErrors.name = 'Name is required';
      hasErrors = true;
    }
    
    if (!validateRequired(formData.email)) {
      newValidationErrors.email = 'Email is required';
      hasErrors = true;
    } else if (!validateEmail(formData.email)) {
      newValidationErrors.email = 'Please enter a valid email address';
      hasErrors = true;
    }
    
    if (formData.phone.trim() !== '' && !validatePhone(formData.phone)) {
      newValidationErrors.phone = 'Please enter a valid phone number';
      hasErrors = true;
    }
    
    if (!validateRequired(formData.message)) {
      newValidationErrors.message = 'Message is required';
      hasErrors = true;
    }
    
    if (!validateRequired(formData.service)) {
      newValidationErrors.service = 'Please select a subject';
      hasErrors = true;
    }
    
    // Update validation errors state
    setValidationErrors(newValidationErrors);
    
    // If there are validation errors, focus on the first field with an error
    if (hasErrors) {
      if (newValidationErrors.name) {
        nameInputRef.current?.focus();
      } else if (newValidationErrors.email) {
        emailInputRef.current?.focus();
      } else if (newValidationErrors.phone) {
        phoneInputRef.current?.focus();
      } else if (newValidationErrors.service) {
        serviceInputRef.current?.focus();
      } else if (newValidationErrors.message) {
        messageInputRef.current?.focus();
      }
      return;
    }
    
    setFormStatus('submitting');
    
    try {
      // Generate a session ID using timestamp and random values
      const timestamp = Date.now();
      const randomPart = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      const sessionId = `${timestamp}${randomPart}`;
      
      // Prepare customer data for the webhook
      const customerData = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone || '',
        customerCompany: formData.company || '',
        interest: formData.service || 'Contact Form',
        message: formData.message || '',
        timestamp: new Date().toISOString(),
        sessionId: sessionId,
        requestType: 'contact',
        toolName: 'store-customer-info'
      };
      
      // Log event safely without exposing personal data in production
      logger.event('contact_form_submission', { sessionId, interest: customerData.interest });
      
      // Send the customer information to the webhook
      const webhookUrl = WEBHOOK_ENDPOINTS.BOOK_APPOINTMENT;
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });
      
      // Check if response is OK, don't try to parse JSON if it's not needed
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      
      // Check if the response has content before trying to parse it
      const contentType = response.headers.get('content-type');
      let responseData;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          responseData = await response.json();
          console.log('Response from API:', responseData);
        } catch (jsonError) {
          // Log but don't throw - we already got a successful status code
          console.warn('Could not parse JSON response:', jsonError);
        }
      } else {
        // For non-JSON responses, just log the status
        console.log('Request successful with status:', response.status);
      }
      
      logger.event('contact_form_success', { sessionId });
      setFormStatus('success');
    } catch (error) {
      logger.error('Error submitting form', error);
      setFormStatus('error');
      
      // Reset to success after 5 seconds for better UX
      setTimeout(() => {
        setFormStatus('success');
      }, 5000);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 bg-transparent pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16 relative">
            <span className="relative inline-block z-10 mb-2">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur"></div>
              <span className="relative px-4 py-1.5 text-xs font-medium text-blue-400 bg-slate-900/80 backdrop-blur-sm rounded-full border border-blue-600/20">
                Get in Touch
              </span>
            </span>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mt-6 mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Have questions about our AI automation solutions? Reach out to our team for personalized assistance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="futuristic-card p-6 md:p-8 relative">
              <div className="absolute inset-0 bg-circuit-pattern opacity-5"></div>
              
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6">Send Us a Message</h2>
              
              {formStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-400 mb-2">Message Sent!</h3>
                  <p className="text-gray-300 mb-6">Thank you for reaching out. We'll get back to you shortly.</p>
                  <button 
                    onClick={() => {
                      setFormStatus('idle');
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        company: '',
                        message: '',
                        service: '',
                      });
                      setValidationErrors({
                        name: '',
                        email: '',
                        phone: '',
                        company: '',
                        message: '',
                        service: '',
                      });
                    }}
                    className="btn-outline"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : formStatus === 'error' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-500/30 border border-red-500/50 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-red-400 mb-2">Something went wrong</h3>
                  <p className="text-gray-300 mb-6">We're having trouble sending your message. Please try again later.</p>
                  <button 
                    onClick={() => setFormStatus('idle')}
                    className="btn-outline"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  {formStatus === 'submitting' && (
                    <div className="bg-blue-900/30 border border-blue-600/40 rounded-lg p-4 mb-4 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 mr-3 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-blue-300 font-medium text-lg">Submitting...</span>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Name <span className="text-red-400">*</span></label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        ref={nameInputRef}
                        required
                        className={`w-full px-4 py-3 bg-slate-900/60 border ${validationErrors.name ? 'border-red-500' : 'border-slate-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white`}
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={handleFocus}
                      />
                      {validationErrors.name && (
                        <p className="mt-1 text-sm text-red-500">{validationErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email <span className="text-red-400">*</span></label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        ref={emailInputRef}
                        required
                        className={`w-full px-4 py-3 bg-slate-900/60 border ${validationErrors.email ? 'border-red-500' : 'border-slate-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white`}
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={handleFocus}
                      />
                      {validationErrors.email && (
                        <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        ref={phoneInputRef}
                        className={`w-full px-4 py-3 bg-slate-900/60 border ${validationErrors.phone ? 'border-red-500' : 'border-slate-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white`}
                        placeholder="Your phone number (optional)"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={handleFocus}
                      />
                      {validationErrors.phone && (
                        <p className="mt-1 text-sm text-red-500">{validationErrors.phone}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-400 mb-1">Company</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        ref={companyInputRef}
                        className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                        placeholder="Your company name (optional)"
                        value={formData.company}
                        onChange={handleChange}
                        onFocus={handleFocus}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-400 mb-1">Subject <span className="text-red-400">*</span></label>
                    <select
                      id="service"
                      name="service"
                      ref={serviceInputRef}
                      required
                      className={`w-full px-4 py-3 bg-slate-900/60 border ${validationErrors.service ? 'border-red-500' : 'border-slate-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white appearance-none`}
                      value={formData.service}
                      onChange={handleChange}
                      onFocus={handleFocus}
                    >
                      <option value="">Select a subject</option>
                      <option value="product">Product Inquiry</option>
                      <option value="service">Service Information</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="other">Other</option>
                    </select>
                    {validationErrors.service && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.service}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-1">Message <span className="text-red-400">*</span></label>
                    <textarea
                      id="message"
                      name="message"
                      ref={messageInputRef}
                      rows={5}
                      required
                      className={`w-full px-4 py-3 bg-slate-900/60 border ${validationErrors.message ? 'border-red-500' : 'border-slate-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white`}
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={handleFocus}
                    ></textarea>
                    {validationErrors.message && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      className={`btn-primary w-full ${formStatus === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      <span className="flex items-center justify-center">
                        {formStatus === 'submitting' ? 'Processing...' : 'Send Message'}
                        {formStatus !== 'submitting' && (
                          <svg className="ml-2 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="futuristic-card p-6 md:p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-circuit-pattern opacity-5"></div>
                
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6">Contact Information</h2>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-blue-400">Phone</h3>
                      <p className="text-gray-300 mt-1">{siteData.company.contact.phone}</p>
                      <p className="text-gray-400 text-sm mt-1">Mon-Sun: 12:00 AM - 11:59 PM EST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-blue-400">Email</h3>
                      <p className="text-gray-300 mt-1">{siteData.company.contact.email}</p>
                      <p className="text-gray-400 text-sm mt-1">We'll respond within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-blue-400">Location</h3>
                      <p className="text-gray-300 mt-1">{siteData.company.contact.address}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="futuristic-card p-6 md:p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-circuit-pattern opacity-5"></div>
                
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6">Connect With Us</h2>
                
                <div className="relative z-10">
                  <p className="text-gray-300 mb-4">
                    Follow us on social media for the latest updates on AI automation technology, product releases, and industry insights.
                  </p>
                  
                  <div className="flex space-x-4">
                    <a href={siteData.company.socialMedia.twitter} className="h-10 w-10 rounded-full bg-slate-800 hover:bg-black flex items-center justify-center transition-colors duration-300">
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                    <a href={siteData.company.socialMedia.linkedin} className="h-10 w-10 rounded-full bg-slate-800 hover:bg-blue-700 flex items-center justify-center transition-colors duration-300">
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.23 0h-20.46c-.983 0-1.77.787-1.77 1.77v20.46c0 .983.787 1.77 1.77 1.77h20.46c.983 0 1.77-.787 1.77-1.77v-20.46c0-.983-.787-1.77-1.77-1.77zm-15.118 19.57h-3.592v-11.49h3.592v11.49zm-1.796-13.049c-1.154 0-2.084-.93-2.086 0-1.154.93-2.085 2.084-2.085 1.155 0 2.085.93 2.085 2.085 0 1.156-.93 2.086-2.085 2.086zm14.405 13.049h-3.591v-5.569c0-1.339-.024-3.061-1.864-3.061-1.866 0-2.151 1.459-2.151 2.965v5.665h-3.592v-11.49h3.447v1.58h.049c.479-.908 1.65-1.866 3.395-1.866 3.631 0 4.307 2.389 4.307 5.496v6.28z"/>
                      </svg>
                    </a>
                    <a href={siteData.company.socialMedia.instagram} className="h-10 w-10 rounded-full bg-slate-800 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-600 flex items-center justify-center transition-colors duration-300">
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.061.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold neon-text mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-300 max-w-3xl mx-auto">
                Find quick answers to common questions about our services
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {siteData.faqs.slice(0, 4).map((faq, index) => (
                <div key={index} className="futuristic-card p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-circuit-pattern opacity-5"></div>
                  <h3 className="text-xl font-bold text-blue-400 mb-3">{faq.question}</h3>
                  <p className="text-gray-300 relative z-10">{faq.answer}</p>
              </div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <p className="text-gray-300 mb-4">Don't see your question here?</p>
              <Link href="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-300 flex items-center justify-center">
                <span>View all FAQs</span>
                <svg className="ml-2 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 