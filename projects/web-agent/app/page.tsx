'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from './components/Navbar';
import HireNowButton from './components/HireNowButton';
import { siteData } from './data/siteData';
import { OrganizationSchema, WebsiteSchema } from './components/SEO/StructuredData';
import { registerScrollHelpers } from './components/utils/scrollHelper';
import dynamic from 'next/dynamic';

// Use dynamic import for agent view
const MainView = dynamic(() => import('./components/agent/views/MainView'), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center">Loading voice assistant...</div>
});

// Function to get icons for agent types
const getAgentIcon = (role: string) => {
  if (role.includes('Web')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4Z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12H16" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8V16" />
        <circle cx="12" cy="12" r="9" strokeWidth={1} strokeDasharray="1 3" />
      </svg>
    );
  } else if (role.includes('Sales')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  } else if (role.includes('Lead Generation')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  } else if (role.includes('Appointment')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  } else if (role.includes('Social Media')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    );
  } else {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );
  }
};

// Function to get text color for agent types
const getTextColor = (role: string) => {
  if (role.includes('Web')) return 'text-blue-400';
  if (role.includes('Sales')) return 'text-purple-400';
  if (role.includes('Lead Generation')) return 'text-amber-400';
  if (role.includes('Appointment')) return 'text-emerald-400';
  if (role.includes('Social Media')) return 'text-pink-400';
  return 'text-blue-400';
};

export default function Home() {
  // Get the top 3 agents from siteData
  const topThreeAgents = siteData.products.slice(0, 3);
  const [isMobile, setIsMobile] = useState(false);
  
  // New state for use case showcase
  const [activeIndustry, setActiveIndustry] = useState<number>(0);
  const [activeUseCase, setActiveUseCase] = useState(0);

  // Initialize the window-level scroll helper
  useEffect(() => {
    // Register scroll helper for direct access
    registerScrollHelpers();
  }, []);

  // Add window-level functions for direct state manipulation and scrolling
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Add direct methods to window for external access
      (window as any).anayaSetActiveIndustry = (index: number) => {
        console.log('Direct call to set active industry:', index);
        setActiveIndustry(index);
        return true;
      };
      
      (window as any).anayaSetActiveUseCase = (index: number) => {
        console.log('Direct call to set active use case:', index);
        setActiveUseCase(index);
        return true;
      };
      
      // Add a function to scroll to sections by ID
      (window as any).anayaScrollToSection = (sectionId: string) => {
        console.log(`Trying to scroll to section: ${sectionId}`);
        const section = document.getElementById(sectionId);
        if (section) {
          console.log(`Found section ${sectionId}, scrolling into view`);
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return true;
        } else {
          console.error(`Section ${sectionId} not found`);
          return false;
        }
      };
      
      return () => {
        // Clean up window methods
        delete (window as any).anayaSetActiveIndustry;
        delete (window as any).anayaSetActiveUseCase;
        delete (window as any).anayaScrollToSection;
      };
    }
  }, []);

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

  useEffect(() => {
    // Function to toggle talking animation
    const toggleTalking = (isActive: boolean) => {
      const elements = [
        document.getElementById('anaya-mouth-mobile'),
        document.getElementById('anaya-overlay-mobile'),
        document.getElementById('anaya-waves-mobile'),
        document.getElementById('anaya-mouth-desktop'),
        document.getElementById('anaya-overlay-desktop'),
        document.getElementById('anaya-waves-desktop')
      ];
      
      elements.forEach(el => {
        if (el) {
          if (isActive) {
            el.classList.add('active');
          } else {
            el.classList.remove('active');
          }
        }
      });
    };

    // Listen for speech events from WebAgent/MainView component
    const handleSpeechStart = () => toggleTalking(true);
    const handleSpeechEnd = () => toggleTalking(false);
    
    window.addEventListener('anaya-speaking-start', handleSpeechStart);
    window.addEventListener('anaya-speaking-end', handleSpeechEnd);
    
    // Listen for messages from WebAgent
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'anaya-speaking') {
        toggleTalking(event.data.speaking);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    // Cleanup
    return () => {
      window.removeEventListener('anaya-speaking-start', handleSpeechStart);
      window.removeEventListener('anaya-speaking-end', handleSpeechEnd);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Function to handle navigation between use cases
  const handleUseCaseChange = (newIndex: number) => {
    if (newIndex >= 0 && newIndex <= 4) {
      setActiveUseCase(newIndex);
    }
  };

  // Industries and use cases data
  const industries = ['E-Commerce', 'Restaurants', 'Hotels', 'Blogs & Media', 'SaaS'];
  const useCases = ['Product Search', 'Product Recommendations', 'Customer Engagement', 'Lead Capture', 'Support Connection'];

  // Add event listeners for industry and use case selection
  useEffect(() => {
    // Handle industry selection event
    const handleIndustrySelection = (event: CustomEvent) => {
      const { index } = event.detail;
      console.log('Received industry selection event:', index);
      if (index >= 0 && index < industries.length) {
        console.log('Setting active industry to:', index);
        setActiveIndustry(index);
      }
    };
    
    // Handle use case selection event
    const handleUseCaseSelection = (event: CustomEvent) => {
      const { index } = event.detail;
      console.log('Received use case selection event:', index);
      if (index >= 0 && index < useCases.length) {
        console.log('Setting active use case to:', index);
        setActiveUseCase(index);
      }
    };
    
    // Add event listeners - using 'window' object explicitly
    if (typeof window !== 'undefined') {
      console.log('Adding event listeners for industry and use case selection');
      window.addEventListener('anaya-select-industry', handleIndustrySelection as EventListener);
      window.addEventListener('anaya-select-use-case', handleUseCaseSelection as EventListener);
    }
    
    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        console.log('Removing event listeners for industry and use case selection');
        window.removeEventListener('anaya-select-industry', handleIndustrySelection as EventListener);
        window.removeEventListener('anaya-select-use-case', handleUseCaseSelection as EventListener);
      }
    };
  }, []); // Remove dependencies to ensure listeners are not recreated unnecessarily

  // Define content for active industry and use case
  const getExampleContent = (industryIndex: number, useCaseIndex: number) => {
    const industry = industries[industryIndex] || 'Default';
    const useCase = useCases[useCaseIndex] || 'Default';
    
    switch(industry) {
      case 'E-Commerce':
        switch(useCaseIndex) {
          case 0: // Product Search
            return {
              title: `${useCase} for E-Commerce`,
              description: "Anaya can search and display specific products directly, eliminating the need for customers to navigate complex category structures or use filters. This creates a frictionless shopping experience similar to having a personal shopping assistant.",
              example: "I'm looking for a waterproof jacket under $100 that's good for hiking",
              response: "I've found 3 waterproof hiking jackets under $100. The North Face Venture 2 is currently on sale for $89.99 with excellent waterproofing. Would you like me to show you this jacket along with the other options, or would you prefer a specific color or size?",
              benefits: ["Eliminates manual product searching", "Reduces shopping abandonment", "Simplifies finding specific product attributes"],
              icon: "search"
            };
          case 1: // Product Recommendations
            return {
              title: `${useCase} for E-Commerce`,
              description: "Anaya recommends products based on browsing history, current market trends, featured items, special offers, and complementary products - all without intrusive popups. This creates a personalized shopping experience that feels helpful rather than pushy.",
              example: "What would go well with the blue dress I just added to cart?",
              response: "The sapphire cocktail dress you selected pairs beautifully with our silver teardrop earrings, which are currently featured in our trending accessories collection. Many customers also purchase our matching clutch, currently on 20% discount. Would you like to see images of these items?",
              benefits: ["Replaces intrusive popups with conversational suggestions", "Incorporates current trends and offers naturally", "Increases cross-sell opportunities"],
              icon: "gift"
            };
          case 2: // Customer Engagement
            return {
              title: `${useCase} for E-Commerce`,
              description: "When customers arrive on your site, Anaya proactively explains your store's purpose and unique offerings. She can guide visitors to relevant pages based on their needs, even navigating them directly to those pages - breaking away from traditional text-based navigation.",
              example: "I'm new here. What kind of store is this?",
              response: "Welcome! We're an eco-friendly outdoor gear shop specializing in sustainable hiking and camping equipment. We have a unique trade-in program for used gear and donate 5% of profits to conservation efforts. Would you like me to show you our bestselling products, take you to our sustainability page, or help you find something specific?",
              benefits: ["Breaks the traditional text-based website concept", "Reduces bounce rates with immediate engagement", "Creates personalized user journeys"],
              icon: "chat"
            };
          case 3: // Lead Capture
            return {
              title: `${useCase} for E-Commerce`,
              description: "Anaya transforms your entire website into a lead magnet by naturally capturing visitor information through conversation, eliminating the need for extensive form-filling. This approach feels helpful rather than intrusive, increasing conversion rates.",
              example: "Do you have this camera in stock? I'd like to know when it's available.",
              response: "The Sony A7IV is currently out of stock, but we're expecting a shipment next week. I'd be happy to notify you when it arrives - could I get your email address? I'll also include a special 10% discount code in the notification as a thank you for your patience.",
              benefits: ["Converts the entire site into a natural lead magnet", "Eliminates extensive form filling", "Captures leads through helpful conversation"],
              icon: "mail"
            };
          case 4: // Support Connection
            return {
              title: `${useCase} for E-Commerce`,
              description: "Connect customers with appropriate support channels based on their needs, whether it's order tracking, returns, or technical product questions. Anaya can handle common inquiries and escalate complex issues.",
              example: "I need to return the shoes I ordered, they're too small",
              response: "I'm sorry the shoes didn't fit. I can help you with the return process right now. Your order #45789 is eligible for free returns within 30 days. Would you like me to email you a return label, or would you prefer to speak with a customer service representative about an exchange instead?",
              benefits: ["Reduced support ticket volume", "Faster issue resolution", "Higher customer satisfaction"],
              icon: "lifesaver"
            };
        }
        break;
      case 'Restaurants':
        switch(useCaseIndex) {
          case 0: // Menu Search
            return {
              title: `${useCase} for Restaurants`,
              description: "Anaya instantly finds and displays specific menu items directly to customers, eliminating the need to scan through lengthy menus. She can filter by ingredients, dietary restrictions, or flavor preferences in seconds.",
              example: "What vegetarian options do you have that are gluten-free?",
              response: "I've found 4 vegetarian, gluten-free options on our menu. Our Mediterranean Vegetable Plate with hummus and tahini is our most popular, followed by the Portobello Mushroom Steak. Would you like me to show images of these dishes, or would you prefer to see the nutritional information?",
              benefits: ["Eliminates menu scanning", "Instantly filters by dietary needs", "Provides images and additional details on demand"],
              icon: "menu"
            };
          case 1: // Dish Recommendations
            return {
              title: `${useCase} for Restaurants`,
              description: "Based on dining history, current specials, chef's recommendations, and seasonal ingredients, Anaya suggests dishes that match customer preferences without requiring them to explore the entire menu.",
              example: "I usually like spicy food. What do you recommend today?",
              response: "Based on your preference for spicy dishes, I'd recommend our new Szechuan Chicken special that the chef introduced today. It features locally-sourced peppers and a secret house-made sauce. For something slightly milder but still flavorful, our Korean BBQ Bowl is trending with customers who enjoy spice. Would you like to know the ingredients?",
              benefits: ["Incorporates daily specials and trending dishes", "Personalizes recommendations based on preferences", "Eliminates need to browse the full menu"],
              icon: "star"
            };
          case 2: // Customer Engagement
            return {
              title: `${useCase} for Restaurants`,
              description: "When customers visit your restaurant website, Anaya proactively explains your culinary concept, signature dishes, and current promotions. She can guide visitors to reservation pages, special event information, or menus based on their interests.",
              example: "What kind of food do you serve here?",
              response: "We're a farm-to-table Mediterranean restaurant specializing in dishes from Greece, Turkey, and Lebanon. Our signature mezze platters and wood-fired seafood are customer favorites. We're currently offering a special prix fixe menu for our 5-year anniversary celebration. Would you like to see our regular menu, learn about our anniversary special, or make a reservation?",
              benefits: ["Creates immediate understanding of restaurant concept", "Guides visitors to relevant information", "Highlights promotions and events naturally"],
              icon: "chat"
            };
          case 3: // Lead Capture
            return {
              title: `${useCase} for Restaurants`,
              description: "Anaya captures visitor information through natural conversation about reservations, special events, or catering, eliminating the need for extensive form-filling while building your customer database for marketing.",
              example: "Do you have any events for New Year's Eve?",
              response: "Yes, we're hosting a New Year's celebration with a special tasting menu, live music, and midnight champagne toast for $95 per person. We're booking quickly but still have a few tables available. Would you like me to check availability for your party? I'd just need your name, email, and how many people would be in your group.",
              benefits: ["Captures contact information through helpful conversation", "Builds marketing database without forms", "Increases event and promotion bookings"],
              icon: "mail"
            };
          case 4: // Order Customization
            return {
              title: `${useCase} for Restaurants`,
              description: "Allow guests to easily customize their orders based on preferences or allergies. Anaya understands complex modifications and ensures they're correctly transmitted to the kitchen.",
              example: "Can I get the pasta without garlic and with extra mushrooms?",
              response: "Absolutely! I'll customize your Fettuccine Alfredo to be prepared without garlic and with a double portion of wild mushrooms. Would you also like to substitute the regular pasta for our gluten-free option, or keep the traditional pasta?",
              benefits: ["Higher customer satisfaction", "Reduced order errors", "Better accommodation of dietary needs"],
              icon: "edit"
            };
        }
        break;
      case 'Hotels':
        switch(useCaseIndex) {
          case 0: // Amenity Information
            return {
              title: `${useCase} for Hotels`,
              description: "Anaya instantly searches and presents specific hotel amenities and services, eliminating the need for guests to navigate through multiple pages or tabs to find information.",
              example: "Does your hotel have a pool and what are the hours?",
              response: "Yes, we have two pools: our rooftop infinity pool is open daily from 6am to 10pm, while our indoor spa pool operates from 7am to 9pm. The rooftop pool has a bar service available from 11am until sunset. Would you like me to show you images of the pools or direct you to our spa services page for more information?",
              benefits: ["Eliminates searching through multiple website pages", "Provides comprehensive information instantly", "Can display images and additional details on request"],
              icon: "water"
            };
          case 1: // Local Recommendations
            return {
              title: `${useCase} for Hotels`,
              description: "Based on guest preferences, weather conditions, local events, and insider knowledge, Anaya recommends relevant activities and dining options, functioning as a virtual concierge 24/7.",
              example: "What are some good family activities near the hotel tomorrow?",
              response: "Since tomorrow's forecast shows sunny weather, I'd recommend the Interactive Science Museum (10 minutes walk) which has a new dinosaur exhibit kids love. There's also a boat tour of the harbor that's running a family special. For indoor options, the Children's Theater is showing 'The Lion King' at 2pm and 7pm. Would you like me to show the locations on a map or help with tickets for any of these?",
              benefits: ["Incorporates real-time factors like weather and events", "Functions as a 24/7 virtual concierge", "Provides personalized recommendations based on guest type"],
              icon: "map"
            };
          case 2: // Customer Engagement
            return {
              title: `${useCase} for Hotels`,
              description: "When visitors arrive on your hotel website, Anaya proactively explains your property's unique features, current promotions, and signature experiences. She guides potential guests to relevant sections based on their interests - whether that's rooms, dining, or activities.",
              example: "What makes this hotel special?",
              response: "Our boutique hotel combines historic architecture with modern luxury - we're housed in a renovated 19th century bank building. Our rooftop restaurant offers panoramic city views and has earned a Michelin star. We're unique in offering complimentary electric bike rentals and private guided neighborhood tours. Would you like to explore our room options, learn about our current 'Stay 3, Pay 2' promotion, or see our dining menus?",
              benefits: ["Creates immediate understanding of hotel's unique value", "Guides visitors to relevant sections based on interest", "Highlights promotions and special offers naturally"],
              icon: "chat"
            };
          case 3: // Lead Capture
            return {
              title: `${useCase} for Hotels`,
              description: "Anaya captures visitor contact information through natural conversation about availability, special packages, or event planning, transforming casual browsing into qualified leads without requiring extensive forms.",
              example: "Do you have availability for a weekend in June for an anniversary?",
              response: "June is a beautiful time to celebrate your anniversary with us. We have several romantic packages including our 'Celebration' suite with champagne service and spa credits. To check specific availability for your preferred weekend, I'd just need your email address and the dates you're considering - then I can send you our best available rates along with details on our special anniversary amenities.",
              benefits: ["Converts browsing into qualified leads", "Eliminates dependency on booking forms", "Captures information in a helpful, non-intrusive way"],
              icon: "mail"
            };
          case 4: // Special Requests
            return {
              title: `${useCase} for Hotels`,
              description: "Handle special guest requests and arrangements with ease. Anaya can coordinate anniversary surprises, business needs, or accessibility accommodations.",
              example: "We're celebrating our anniversary. Can you do anything special?",
              response: "Congratulations on your anniversary! We'd be delighted to make your stay special. I can arrange for a complimentary bottle of champagne and chocolate-covered strawberries to be placed in your room upon arrival. We also offer a romantic dinner package at our rooftop restaurant with a special dessert. Would you be interested in either of these options, or perhaps a couple's massage at our spa?",
              benefits: ["Increased guest loyalty", "Higher special occasion bookings", "Better personalization of stays"],
              icon: "heart"
            };
        }
        break;
      case 'Blogs & Media':
        switch(useCaseIndex) {
          case 0: // Content Discovery
            return {
              title: `${useCase} for Blogs & Media`,
              description: "Anaya instantly finds and displays relevant articles, videos, or podcasts from your vast content library, eliminating the need for visitors to browse through categories or use search functions.",
              example: "Do you have any articles about content marketing for startups?",
              response: "I've found 5 articles specifically about content marketing for startups. Our most comprehensive is 'Content Marketing on a Shoestring Budget' published last month. We also have a case study series featuring success stories from tech startups. Would you like me to show you this article now, provide summaries of the top 3 pieces, or narrow down to a specific aspect of content marketing?",
              benefits: ["Eliminates manual content searching", "Finds exactly matching content instantly", "Can summarize or preview content on request"],
              icon: "search"
            };
          case 1: // Content Recommendations
            return {
              title: `${useCase} for Blogs & Media`,
              description: "Based on reading history, trending topics, and visitor interests, Anaya recommends relevant content from your library, including featured articles, new releases, and premium offerings - all without intrusive popups.",
              example: "I enjoyed that article about SEO basics. What should I read next?",
              response: "Since you enjoyed our SEO basics article, I think you'd find value in our newly published 'Advanced On-Page SEO Techniques' which expands on those concepts. This article is currently trending with our readers. We also just released a premium SEO audit template that complements these articles. Would you like me to show you the advanced article now or tell you more about the audit template?",
              benefits: ["Incorporates trending content and new releases", "Recommends premium offerings naturally", "Creates personalized content journeys"],
              icon: "book"
            };
          case 2: // Customer Engagement
            return {
              title: `${useCase} for Blogs & Media`,
              description: "When visitors first arrive, Anaya proactively explains your publication's focus, popular content sections, and current featured series. She guides users to content that matches their interests, even navigating them directly to those sections.",
              example: "What kind of content do you publish here?",
              response: "We're a digital marketing publication focusing on SEO, content strategy, and social media marketing. Our in-depth guides are popular with beginners, while our case studies appeal to experienced marketers. We're currently featuring a series on 'AI in Marketing' that's generating significant discussion. Would you like to explore our beginner guides, check out the AI series, or tell me about a specific marketing topic you're interested in?",
              benefits: ["Creates immediate understanding of content focus", "Breaks the traditional navigation model", "Guides users to their interest areas directly"],
              icon: "chat"
            };
          case 3: // Newsletter Signups
            return {
              title: `${useCase} for Blogs & Media`,
              description: "Anaya transforms your entire site into a lead generation tool by naturally capturing visitor information through conversation about content interests, eliminating the need for popup forms or subscription banners.",
              example: "I'd like to stay updated on new marketing articles",
              response: "I'd be happy to help you stay updated on our marketing content. Our weekly newsletter 'Marketing Insights' delivers our newest articles, exclusive tips, and industry trends every Tuesday. It's very popular with our readers, and you can customize your content preferences after signing up. Could I get your email address to subscribe you? I'll make sure you receive our latest marketing content collection as a welcome gift.",
              benefits: ["Eliminates subscription popups and banners", "Captures leads through natural conversation", "Offers immediate value in exchange for contact info"],
              icon: "mail"
            };
          case 4: // Resource Access
            return {
              title: `${useCase} for Blogs & Media`,
              description: "Guide users to valuable resources like downloadable guides, templates, webinars, or research papers related to your content. Anaya can qualify leads before directing them to high-value assets.",
              example: "Do you have any templates for creating a content calendar?",
              response: "Yes, we have several content calendar templates available! Our most popular is the 'Annual Content Strategy Calendar' in Excel format that includes content types, channels, KPIs, and seasonal planning sections. We also offer a 'Social Media Content Calendar' template and a 'Blog Editorial Calendar' with SEO components. These are available in our resource library - would you like me to share the download link for any of these templates?",
              benefits: ["Increased resource downloads", "Better lead qualification", "Higher conversion rates"],
              icon: "download"
            };
        }
        break;
      case 'SaaS':
        switch(useCaseIndex) {
          case 0: // Product Information
            return {
              title: `${useCase} for SaaS`,
              description: "Anaya instantly finds and explains specific product features, eliminating the need for users to search through feature lists, FAQs, or documentation pages to find answers to their questions.",
              example: "How does your CRM integration work with Salesforce?",
              response: "Our Salesforce integration works through a secure API connection with two-way data sync. It takes about 15 minutes to set up using our guided wizard - no coding required. The integration syncs contacts, opportunities, and custom objects with real-time updates. Would you like me to show you a quick demo of the setup process, or direct you to our detailed documentation with specific field mapping information?",
              benefits: ["Eliminates searching through documentation", "Provides immediate, specific answers", "Can demonstrate features visually upon request"],
              icon: "info"
            };
          case 1: // Feature Recommendations
            return {
              title: `${useCase} for Blogs & Media`,
              description: "Based on usage patterns, customer goals, and newest capabilities, Anaya recommends relevant features that users might not know about, increasing product adoption and value perception.",
              example: "I need to track how my team is using the platform",
              response: "For team usage tracking, I recommend our Analytics Dashboard which was enhanced last month with new team metrics. It now includes login frequency, feature utilization heat maps, and productivity patterns that you can filter by team member or department. This is available on your current Professional plan. Would you like me to show you how to set up automated weekly reports, or give you a quick tour of the new analytics features?",
              benefits: ["Highlights newly released features", "Increases awareness of available capabilities", "Demonstrates value of current subscription"],
              icon: "star"
            };
          case 2: // Customer Engagement
            return {
              title: `${useCase} for SaaS`,
              description: "When visitors arrive on your site, Anaya proactively explains your platform's core value proposition, key differentiators, and how it solves specific industry problems. She guides potential customers to relevant information based on their role and needs.",
              example: "What exactly does your software do?",
              response: "We provide an AI-powered project management platform designed specifically for creative agencies. Unlike generic tools, our software handles resource allocation across multiple client projects with automated time tracking and profitability analysis. Our clients typically save 15 hours per week on administrative tasks. Would you like to see how it works for design teams specifically, learn about our client reporting features, or understand our pricing model?",
              benefits: ["Creates immediate understanding of value proposition", "Tailors information to visitor's specific needs", "Guides visitors to most relevant sections"],
              icon: "chat"
            };
          case 3: // Lead Capture
            return {
              title: `${useCase} for SaaS`,
              description: "Anaya transforms your entire site into a qualification tool by naturally gathering visitor information through conversations about their needs, eliminating reliance on forms while generating higher quality leads.",
              example: "Does your platform handle multiple currencies for international teams?",
              response: "Yes, our platform fully supports multiple currencies with automated exchange rate updates and consolidated reporting in your base currency. This feature is popular with our international customers. To provide you with more specific information about how this would work for your team's particular countries and currencies, could I get your email address? I'd be happy to send you our international usage guide along with a short video showing the multi-currency dashboards in action.",
              benefits: ["Qualifies leads through natural conversation", "Eliminates dependency on contact forms", "Gathers specific qualification information"],
              icon: "mail"
            };
          case 4: // Upgrade Guidance
            return {
              title: `${useCase} for SaaS`,
              description: "Help users understand when and why to upgrade to higher subscription tiers based on their needs and usage patterns. Anaya can provide personalized recommendations.",
              example: "We're adding more team members. What plan should we consider?",
              response: "Based on your growing team size, I recommend considering our Business plan. Your current Professional plan includes 10 user seats, while the Business plan supports unlimited users and adds team management features like user groups, advanced permissions, and enhanced security controls. The cost per user actually decreases at the Business level for teams larger than 15 members. Would you like to see a detailed comparison of the Professional vs. Business features, or should I connect you with an account manager to discuss a custom enterprise solution?",
              benefits: ["Higher upgrade rates", "Better plan fit", "Increased customer lifetime value"],
              icon: "arrow-up"
            };
        }
        break;
      default:
        return {
          title: useCase,
          description: "Customize this use case for your specific industry needs.",
          example: "Example conversation here",
          response: "Example response here",
          benefits: ["Benefit 1", "Benefit 2", "Benefit 3"],
          icon: "star"
        };
    }
  };

  // Function to get icon for specific use cases
  const getUseCaseIcon = (iconName: string) => {
    switch(iconName) {
      case 'search':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      case 'gift':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        );
      case 'chat':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'mail':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'lifesaver':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'menu':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        );
      case 'calendar':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'star':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      case 'water':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" />
          </svg>
        );
      // Add more icons as needed
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  return (
    <main className="flex-1 flex flex-col relative min-h-screen">
      {/* Add structured data for SEO */}
      <OrganizationSchema />
      <WebsiteSchema />
      
      {/* Fixed background effects with higher z-index */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -2 }}>
        {/* Solid background gradient that won't change on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black"></div>
        
        {/* Enhanced background visuals - more variety of shapes, colors and positions */}
        <div className="hidden md:block absolute top-20 left-1/3 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="hidden md:block absolute bottom-20 right-1/3 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="hidden md:block absolute top-40 right-1/4 w-[300px] h-[300px] bg-teal-900/10 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="hidden md:block absolute bottom-96 left-1/4 w-[250px] h-[250px] bg-pink-900/10 rounded-full blur-xl animate-float-slow"></div>
        
        {/* Hexagon shape using clip-path */}
        <div className="hidden md:block absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-indigo-900/10 blur-2xl animate-rotate-slow" 
          style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', animationDelay: '3s' }}></div>
        
        {/* Diamond shape */}
        <div className="hidden md:block absolute bottom-1/4 left-1/3 w-[200px] h-[200px] bg-amber-900/10 blur-xl animate-rotate-slow" 
          style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', animationDelay: '1.5s' }}></div>
          
        {/* Simplified mobile background elements - with more variety */}
        <div className="md:hidden absolute top-10 right-10 w-[200px] h-[200px] bg-blue-900/15 rounded-full blur-3xl"></div>
        <div className="md:hidden absolute bottom-40 left-10 w-[150px] h-[150px] bg-purple-900/15 rounded-full blur-3xl"></div>
        <div className="md:hidden absolute top-1/3 left-0 w-[100px] h-[100px] bg-teal-900/15 rounded-full blur-2xl animate-pulse-slow"></div>
        <div className="md:hidden absolute bottom-20 right-5 w-[80px] h-[80px] bg-pink-900/15 rounded-full blur-xl animate-float"></div>
      </div>
      
      {/* Grid pattern overlay with particles */}
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-30 md:opacity-50" style={{ zIndex: -1 }}>
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-float opacity-70"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-float-delay opacity-70"></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-teal-400 rounded-full animate-float-slow opacity-70"></div>
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-pink-400 rounded-full animate-float-delay opacity-70"></div>
      </div>
      
      {/* Navbar */}
      <Navbar />
      
      {/* Mobile-optimized content */}
      <div className="md:hidden flex-1 flex flex-col pt-12 overflow-hidden max-w-full">
        {/* Mobile hero section - reduced spacing */}
        <div className="px-3 py-4 flex flex-col items-center text-center overflow-hidden w-full">
          <div className="relative w-28 h-28 mb-2 animate-card-hover">
            {/* Animated glow effect */}
            <div className="absolute inset-0 rounded-full overflow-hidden bg-gradient-to-r from-blue-600/40 to-purple-600/40 animate-pulse contain-strict"></div>
            
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ripple-mobile contain-strict"></div>
            <div className="absolute inset-[-4px] rounded-full border border-purple-500/20 animate-ripple-mobile contain-strict" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute inset-[-8px] rounded-full border border-blue-500/10 animate-ripple-mobile contain-strict" style={{ animationDelay: '1s' }}></div>
            
            {/* Orbital ring animation */}
            <div className="absolute inset-[-8px] rounded-full border-2 border-blue-500/30 animate-spin-slow"></div>
            <div className="absolute inset-[-4px] rounded-full border border-purple-500/20 animate-spin-reverse-slow"></div>
            
            {/* Small floating particles */}
            <div className="absolute top-0 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-float opacity-70"></div>
            <div className="absolute bottom-3 -left-2 w-2 h-2 bg-purple-400 rounded-full animate-float-delay opacity-70"></div>
            <div className="absolute top-1/2 right-0 w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-90"></div>
            
            <div className="absolute inset-1 rounded-full overflow-hidden bg-slate-900 flex items-center justify-center z-10 animate-glow-pulse">
              <div className="avatar-container w-full h-full contain-strict">
                <Image 
                  src="/agents/anaya.png" 
                  alt="Anaya AI Agent"
                  width={120}
                  height={120}
                  className="object-cover"
                />
                <div className="talking-mouth" id="anaya-mouth-mobile"></div>
                <div className="avatar-overlay" id="anaya-overlay-mobile"></div>
                <div className="animated-sound-waves" id="anaya-waves-mobile">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="sound-bar"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <h1 className="text-xl font-bold mb-1">
            Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 relative">
              Anaya
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 animate-shine"></span>
            </span>
          </h1>
          
          <p className="text-xs text-gray-300 mb-3 max-w-xs">
            Your AI WebAgent for business automation needs
          </p>
          
          {/* Voice assistant component - mobile friendly with reduced height */}
          <div className="w-full max-w-[280px] mx-auto overflow-hidden" style={{ minHeight: "150px" }}>
            <MainView isHomePage={true} />
          </div>
          
          {/* Mobile quick actions - more compact */}
          <div className="mt-4 flex flex-col w-full gap-2">
            <HireNowButton 
              buttonClassName="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium text-center text-sm animate-glow-pulse"
              buttonText="Hire Now"
            />
            <Link href="/products" className="w-full py-2 px-4 rounded-lg bg-slate-800 border border-blue-500/30 text-white font-medium text-center text-sm">
              Browse AI Agents
            </Link>
            <Link href="/services" className="w-full py-2 px-4 rounded-lg bg-slate-800 border border-purple-500/30 text-white font-medium text-center text-sm">
              View Services
            </Link>
          </div>
        </div>
        
        {/* Mobile product highlights - more compact */}
        <div className="px-3 pt-4 pb-3">
          <h2 className="text-base font-bold mb-3 px-1">Popular AI Agents</h2>
          
          {/* Single column display for mobile - more compact */}
          <div className="flex flex-col space-y-3">
            {topThreeAgents.map((agent, index) => {
              const textColorClass = getTextColor(agent.role);
              return (
                <div 
                  key={agent.id} 
                  className={`w-full p-3 rounded-lg bg-slate-900/70 border border-slate-800 animate-card-enter animate-fade-stagger relative`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Icon moved to right corner */}
                  <div className={`absolute top-2 right-2 p-1 rounded-full ${textColorClass} bg-slate-800 border border-slate-700 z-20`}>
                    {getAgentIcon(agent.role)}
                  </div>
                  
                  <div className="flex items-start mb-2">
                    <div className="relative mr-2 flex-none animate-card-hover" style={{ animationDelay: `${index * 0.2}s` }}>
                      {/* Agent image with subtle animation - smaller size */}
                      <div className="relative w-12 h-12 rounded-full overflow-hidden animate-glow-pulse" style={{ animationDelay: `${index * 0.3}s` }}>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
                        <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-ripple-mobile"></div>
                        <div className="absolute inset-[-4px] rounded-full border border-purple-500/20 animate-ripple-mobile" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute inset-[-8px] rounded-full border border-blue-500/10 animate-ripple-mobile" style={{ animationDelay: '1s' }}></div>
                        
                        {/* Orbital ring animation */}
                        <div className="absolute inset-[-6px] rounded-full border-2 border-blue-500/30 animate-spin-slow"></div>
                        <div className="absolute inset-[-3px] rounded-full border border-purple-500/20 animate-spin-reverse-slow"></div>
                        
                        {/* Small floating particles */}
                        <div className="absolute top-0 -right-1 w-1 h-1 bg-blue-400 rounded-full animate-float opacity-70"></div>
                        <div className="absolute bottom-2 -left-1 w-1 h-1 bg-purple-400 rounded-full animate-float-delay opacity-70"></div>
                        
                        <Image 
                          src={`/agents/${agent.name.toLowerCase()}.png`}
                          alt={agent.name}
                          width={48}
                          height={48}
                          className="object-cover z-10"
                        />
                      </div>
                    </div>
                    <div className="min-w-0 pr-6">
                      <h3 className="font-medium text-sm truncate">{agent.name}</h3>
                      <p className={`text-xs ${textColorClass}`}>{agent.role}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 mb-2 line-clamp-2">{agent.shortDescription}</p>
                  <Link 
                    href={`/products/${agent.id}`} 
                    className={`text-xs ${textColorClass} hover:underline flex items-center`}
                  >
                    Learn more
                    <svg className="h-3 w-3 ml-1 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Mobile features highlight - Removed as requested in previous edits */}
        <div className="px-3 py-2 bg-gradient-to-b from-slate-900/60 to-transparent">
          {/* Mobile "Why Choose brain9ai" section removed */}
        </div>
        
        {/* Mobile Articles section */}
        <div className="px-3 pt-2 pb-4">
          {/* Mobile Featured Articles section removed */}
        </div>
      </div>
      
      {/* Desktop-optimized content */}
      <div className="hidden md:flex flex-1 flex-col items-center justify-center px-4 relative z-10 pt-20">
        <div className="max-w-6xl w-full mx-auto flex flex-col items-center">
          
          {/* Voice agent section - improved spacing */}
          <div className="w-full flex flex-col py-6 md:py-10 items-center">
            {/* First row - Anaya image and intro text */}
            <div className="w-full flex flex-col items-center mb-8">
              {/* Row 1: Anaya image - with the same animations as mobile view */}
              <div className="relative w-48 h-48 md:w-60 md:h-60 mb-4 animate-card-hover">
                {/* Animated glow effect */}
                <div className="absolute inset-0 rounded-full overflow-hidden bg-gradient-to-r from-blue-600/40 to-purple-600/40 animate-pulse contain-strict"></div>
                
                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ripple-mobile contain-strict"></div>
                <div className="absolute inset-[-4px] rounded-full border border-purple-500/20 animate-ripple-mobile contain-strict" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute inset-[-8px] rounded-full border border-blue-500/10 animate-ripple-mobile contain-strict" style={{ animationDelay: '1s' }}></div>
                
                {/* Orbital ring animation */}
                <div className="absolute inset-[-8px] rounded-full border-2 border-blue-500/30 animate-spin-slow contain-strict"></div>
                <div className="absolute inset-[-4px] rounded-full border border-purple-500/20 animate-spin-reverse-slow contain-strict"></div>
                
                {/* Small floating particles */}
                <div className="absolute top-0 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-float opacity-70 contain-strict"></div>
                <div className="absolute bottom-3 -left-2 w-2 h-2 bg-purple-400 rounded-full animate-float-delay opacity-70 contain-strict"></div>
                <div className="absolute top-1/2 right-0 w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-90 contain-strict"></div>
                
                <div className="absolute inset-0 rounded-full overflow-hidden bg-slate-900 flex items-center justify-center z-10 animate-glow-pulse contain-strict">
                  <div className="avatar-container w-full h-full contain-strict">
                    <Image 
                      src="/agents/anaya.png" 
                      alt="Anaya AI Agent"
                      width={240}
                      height={240}
                      className="object-cover"
                    />
                    <div className="talking-mouth" id="anaya-mouth-desktop"></div>
                    <div className="avatar-overlay" id="anaya-overlay-desktop"></div>
                    <div className="animated-sound-waves" id="anaya-waves-desktop">
                      {Array(5).fill(0).map((_, i) => (
                        <div key={i} className="sound-bar"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Row 2: Title - with the same styling as mobile */}
              <h1 className="text-2xl md:text-3xl font-bold mb-3 neon-text text-center">
                Meet <span className="font-extrabold relative inline-block bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Anaya
                  <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full animate-shine"></span>
                </span>
              </h1>
              
              <p className="text-gray-300 text-center mb-6">
                Your AI WebAgent for business automation needs
              </p>
            </div>
            
            {/* Voice agent component - more compact */}
            <div className="w-full flex flex-col items-center mb-6">
                {/* Voice agent using MainView */}
                <MainView isHomePage={true} />
              
              {/* Quick action buttons - improved spacing */}
              <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center mx-auto">
                <HireNowButton 
                  buttonClassName="btn-primary group animate-glow-pulse"
                  buttonText={
                    <>
                      <span className="flex items-center">
                        Hire Now
                        <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </>
                  }
                />
                <Link href="/products" className="btn-secondary group">
                  <span className="flex items-center">
                    Explore Our Agents
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </Link>
                <Link href="/services" className="btn-secondary group">
                  <span className="flex items-center">
                    Our Services
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Improved spacing before Top Agents section */}
          <div className="w-full mt-4 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold neon-text mb-2">Our Top AI Agents</h2>
              <p className="text-gray-300 text-sm max-w-2xl mx-auto">Empowering businesses with intelligent automation</p>
            </div>
            
            {/* Desktop agent cards - using the mobile style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topThreeAgents.map((agent, index) => {
                const textColorClass = getTextColor(agent.role);
                // Create unique visual elements for each card
                const gradientBg = index === 0 
                  ? "from-blue-600/5 via-indigo-600/5 to-blue-600/5" 
                  : index === 1 
                  ? "from-purple-600/5 via-pink-600/5 to-purple-600/5" 
                  : "from-emerald-600/5 via-teal-600/5 to-emerald-600/5";
                
                const borderColor = index === 0 
                  ? "border-blue-800/30" 
                  : index === 1 
                  ? "border-purple-800/30" 
                  : "border-emerald-800/30";
                  
                const cornerDecoration = index === 0 ? (
                  <div className="absolute -top-2 -right-2 w-12 h-12">
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500/40"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-blue-500/20 rounded-tr-xl"></div>
                  </div>
                ) : index === 1 ? (
                  <div className="absolute -top-1 -left-1 w-16 h-16 rotate-45 overflow-hidden opacity-30">
                    <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-purple-500 to-transparent"></div>
                  </div>
                ) : (
                  <div className="absolute -bottom-2 -right-2">
                    <div className="w-10 h-10 rounded-full border-2 border-emerald-500/20 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full border border-emerald-500/40"></div>
                    </div>
                  </div>
                );
                
                return (
                  <div 
                    key={agent.id} 
                    className={`p-6 bg-slate-900/70 border ${borderColor} rounded-xl animate-card-enter animate-fade-stagger relative overflow-hidden`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Unique corner decoration for each card */}
                    {cornerDecoration}
                    
                    {/* Background gradient unique to each card */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradientBg} opacity-50`}></div>
                    
                    {/* Icon in right corner */}
                    <div className={`absolute top-4 right-4 p-2 rounded-full ${textColorClass} bg-slate-800 border border-slate-700 z-20`}>
                      {getAgentIcon(agent.role)}
                </div>
                
                    <div className="flex flex-col items-center text-center relative z-10">
                      {/* Agent image with animation */}
                      <div className="relative w-24 h-24 mb-4 animate-card-hover" style={{ animationDelay: `${index * 0.2}s` }}>
                        <div className="relative w-full h-full rounded-full overflow-hidden animate-glow-pulse contain-strict" style={{ animationDelay: `${index * 0.3}s` }}>
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse contain-strict"></div>
                          <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-ripple-mobile contain-strict"></div>
                          <div className="absolute inset-[-4px] rounded-full border border-purple-500/20 animate-ripple-mobile contain-strict" style={{ animationDelay: '0.5s' }}></div>
                          <div className="absolute inset-[-8px] rounded-full border border-blue-500/10 animate-ripple-mobile contain-strict" style={{ animationDelay: '1s' }}></div>
                          
                          {/* Orbital ring animation - unique for each card */}
                          {index === 0 && (
                            <div className="absolute inset-[-8px] rounded-full border-2 border-blue-500/30 animate-spin-slow contain-strict"></div>
                          )}
                          {index === 1 && (
                            <div className="absolute inset-[-6px] rounded-full border border-purple-500/30 animate-spin-reverse-slow contain-strict"></div>
                          )}
                          {index === 2 && (
                            <div className="absolute inset-[-10px] rounded-full border-dashed border-2 border-emerald-500/20 animate-spin-slow contain-strict"></div>
                          )}
                          
                          {/* Small floating particles */}
                          <div className="absolute top-0 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-float opacity-70 contain-strict"></div>
                          <div className="absolute bottom-3 -left-2 w-2 h-2 bg-purple-400 rounded-full animate-float-delay opacity-70 contain-strict"></div>
                          <div className="absolute top-1/2 right-0 w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-90 contain-strict"></div>
                          
                          <Image 
                            src={`/agents/${agent.name.toLowerCase()}.png`}
                            alt={agent.name}
                            width={96}
                            height={96}
                            className="object-cover z-10"
                          />
                </div>
              </div>
              
                      <h3 className="text-lg font-semibold mb-2">{agent.name}</h3>
                      <p className={`text-sm font-medium ${textColorClass} mb-1`}>{agent.role}</p>
                      <p className="text-gray-400 text-sm mb-4">{agent.shortDescription}</p>
                      <Link 
                        href={`/products/${agent.id}`} 
                        className={`${textColorClass} text-sm hover:opacity-80 mt-auto flex items-center justify-center`}
                      >
                        Learn more
                        <svg className="h-4 w-4 ml-1 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* WebAgent USP Section - Moved before Why Choose brain9ai section */}
      <section id="transform-your-website" className="py-16 md:py-24 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-6xl mx-auto px-4 lg:px-0">
          {/* Section Header */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-3">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 relative">
                Transform Your Website with Anaya
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 animate-shine"></span>
              </span>
            </h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Seamlessly integrate voice-powered AI to showcase your products and engage your customers
            </p>
          </div>
          
          {/* Main Content Area - Desktop */}
          <div className="hidden md:flex flex-col md:flex-row items-center gap-8">
            {/* Left: WebAgent Visualization */}
            <div className="w-full md:w-1/2 relative">
              <div className="relative rounded-lg overflow-hidden border border-blue-500/30 shadow-glow-blue">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 animate-pulse-slow"></div>
                
                {/* Stylized e-commerce website mockup */}
                <div className="relative">
                  {/* Browser header */}
                  <div className="bg-slate-800 px-4 py-3 flex items-center border-b border-slate-700">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="mx-auto bg-slate-700 rounded-full px-4 py-1 text-xs text-slate-300 max-w-xs">
                      yourstore.com
                    </div>
                  </div>
                  
                  {/* Browser content - illustration of e-commerce website with Anaya */}
                  <div className="bg-slate-900 p-4 relative min-h-[320px]">
                    {/* Site mockup with products */}
                    <div className="absolute top-0 left-0 right-0 h-12 bg-slate-800/90 flex items-center px-4">
                      <div className="flex space-x-4 text-xs text-slate-300">
                        <div className="px-2 py-1 border-b-2 border-blue-500">Home</div>
                        <div className="px-2 py-1">Products</div>
                        <div className="px-2 py-1">Categories</div>
                        <div className="px-2 py-1">Contact</div>
                      </div>
                      <div className="ml-auto">
                        <div className="bg-slate-700 rounded px-1 text-xs flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          Search products...
                        </div>
                      </div>
                    </div>
                    
                    {/* Product grid mockup */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[1, 2].map((item) => (
                        <div key={item} className="bg-slate-800/60 rounded p-1 border border-slate-700/60">
                          <div className="bg-slate-700/50 rounded h-12 mb-1"></div>
                          <div className="h-1 bg-slate-700/50 rounded mb-0.5 w-3/4"></div>
                          <div className="h-1 bg-slate-700/50 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Anaya floating assistant */}
                    <div className="absolute bottom-3 right-3 w-20 h-20">
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md animate-pulse-slow"></div>
                      
                      {/* Assistant bubble */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-purple-600/40 rounded-full overflow-hidden border border-blue-400/30 flex items-center justify-center">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden">
                          <Image 
                            src="/agents/anaya.png" 
                            alt="Anaya WebAgent"
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </div>
                      </div>
                      
                      {/* Sound waves */}
                      <div className="absolute inset-[-4px] rounded-full border border-blue-400/30 animate-ping-slow opacity-60"></div>
                    </div>
                    
                    {/* Search inquiry speech bubble */}
                    <div className="absolute top-12 right-16 max-w-[100px] bg-slate-800/90 backdrop-blur-sm p-1.5 rounded-lg border border-blue-500/30 text-[8px]">
                      "Show me headphones"
                    </div>
                    
                    {/* Product recommendation speech bubble */}
                    <div className="absolute bottom-20 right-4 max-w-[110px] bg-purple-900/40 backdrop-blur-sm p-1.5 rounded-lg border border-purple-500/30 text-[8px]">
                      "I recommend this model based on your needs"
                    </div>
                    
                    {/* Product highlight */}
                    <div className="absolute bottom-28 left-6 w-16 h-16 border-2 border-blue-500/50 rounded-lg animate-pulse-slow"></div>
                    
                    {/* Accessibility indicator */}
                    <div className="absolute top-4 right-4 bg-slate-800/90 rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
            </div>
            
            {/* Right: Key Benefits/Text Content */}
            <div className="w-full md:w-1/2 space-y-6">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Anaya: Your Interactive Product Specialist
              </h3>
              
              <p className="text-gray-300">
                Integrate Anaya seamlessly into your website to transform how customers discover and engage with your products. 
                Unlike static catalogs or basic search, Anaya creates an interactive shopping experience that guides customers 
                through your offerings with personalized recommendations.
              </p>
              
              <div className="space-y-4 mt-4">
                {[
                  {
                    title: "Intelligent Product Search",
                    description: "Anaya understands natural language queries to help customers find exactly what they're looking for",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    )
                  },
                  {
                    title: "Personalized Recommendations",
                    description: "Suggest relevant products based on customer preferences, past behavior, and current inquiries",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    )
                  },
                  {
                    title: "Enhanced Customer Engagement",
                    description: "Keep visitors on your site longer with interactive conversations about your products and services",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    )
                  },
                  {
                    title: "Improved Accessibility",
                    description: "Make your products accessible to everyone with voice-guided navigation and assistance",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                    )
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-slate-800 p-2 rounded-lg mr-3 flex-none">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">{feature.title}</h4>
                      <p className="text-xs text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4">
                <Link href="/products/anaya-webAgent" className="inline-flex items-center px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">
                  <span>Discover Anaya WebAgent</span>
                  <svg className="ml-2 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Mobile optimized version */}
          <div className="md:hidden space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                Anaya: Your Interactive Product Specialist
              </h3>
              <p className="text-gray-300 text-sm">
                Transform how customers discover and engage with your products through voice-powered AI.
              </p>
            </div>
            
            {/* Mobile illustration - improved styling */}
            <div className="relative rounded-lg overflow-hidden border border-blue-500/30 shadow-glow-blue mx-auto max-w-[300px]">
              {/* Browser header */}
              <div className="bg-slate-800 px-4 py-2 flex items-center border-b border-slate-700">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="mx-auto bg-slate-700 rounded-full px-3 py-0.5 text-[10px] text-slate-300 max-w-[120px] truncate">
                  yourstore.com
                </div>
              </div>
              
              {/* E-commerce site mockup */}
              <div className="bg-slate-900 p-3 relative" style={{ height: '200px' }}>
                {/* Mini header */}
                <div className="h-6 bg-slate-800/80 flex items-center justify-between px-2 text-[8px] text-slate-300">
                  <div>Home</div>
                  <div>Products</div>
                  <div>Categories</div>
                  <div className="bg-slate-700 rounded px-1">Search</div>
                </div>
                
                {/* Mini product grid */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[1, 2].map((item) => (
                    <div key={item} className="bg-slate-800/60 rounded p-1 border border-slate-700/60">
                      <div className="bg-slate-700/50 rounded h-10 mb-1"></div>
                      <div className="h-1 bg-slate-700/50 rounded mb-0.5 w-3/4"></div>
                      <div className="h-1 bg-slate-700/50 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
                
                {/* Anaya assistant */}
                <div className="absolute bottom-3 right-3 w-16 h-16">
                  <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md animate-pulse-slow"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-purple-600/40 rounded-full overflow-hidden border border-blue-400/30 flex items-center justify-center">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image 
                        src="/agents/anaya.png" 
                        alt="Anaya WebAgent"
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute inset-[-4px] rounded-full border border-blue-400/30 animate-ping-slow opacity-60"></div>
                </div>
                
                {/* Product highlight */}
                <div className="absolute bottom-20 left-4 w-12 h-12 border-2 border-blue-500/50 rounded-lg animate-pulse-slow"></div>
                
                {/* Speech bubbles */}
                <div className="absolute top-12 right-16 max-w-[90px] bg-slate-800/90 backdrop-blur-sm p-1.5 rounded-lg border border-blue-500/30 text-[8px]">
                  "Show me headphones"
                </div>
                <div className="absolute bottom-20 right-4 max-w-[90px] bg-purple-900/40 backdrop-blur-sm p-1.5 rounded-lg border border-purple-500/30 text-[8px]">
                  "I recommend this model"
                </div>
              </div>
            </div>
            
            {/* Key features for mobile - more condensed layout */}
            <div className="space-y-2 mt-2">
              {[
                {
                  title: "Intelligent Product Search",
                  description: "Help customers find exactly what they need",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )
                },
                {
                  title: "Personalized Recommendations",
                  description: "Suggest products based on customer preferences",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  )
                },
                {
                  title: "Enhanced Engagement",
                  description: "Keep visitors on your site with interactive conversations",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  )
                }
              ].map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-slate-800 p-1.5 rounded-lg mr-2 flex-none">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-medium mb-0.5">{feature.title}</h4>
                    <p className="text-[10px] text-gray-400">{feature.description}</p>
                  </div>
                </div>
              ))}
              
              <div className="pt-2 text-center">
                <Link href="/products/anaya-webAgent" className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors">
                  <span>Discover Anaya WebAgent</span>
                  <svg className="ml-1 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Industry Use Cases Section - Now directly after "See Anaya in Action" section */}
      <section id="anaya-in-action" className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto px-4 lg:px-0">
          {/* Section Header with enhanced visual variety */}
          <div className="text-center mb-8 md:mb-12 relative">
            {/* Decorative elements - more variety */}
            <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2 w-12 h-12 border-2 border-blue-500/20 rounded-full opacity-70 animate-pulse-slow contain-strict"></div>
            <div className="absolute top-1/2 right-1/4 transform -translate-y-1/2 w-12 h-12 border-2 border-purple-500/20 rounded-full opacity-70 animate-pulse-slow contain-strict" style={{ animationDelay: '1s' }}></div>
            
            {/* Rotating angular shape decoration */}
            <div className="absolute top-0 left-1/3 w-16 h-16 opacity-20 animate-spin-slow contain-strict" 
              style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', animationDuration: '30s' }}>
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-transparent"></div>
            </div>
            
            {/* New geometric shapes for more variety */}
            <div className="absolute -top-4 right-1/3 w-10 h-10 opacity-30"
              style={{ clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)' }}>
              <div className="w-full h-full bg-gradient-to-r from-purple-500 to-transparent animate-float-slow contain-strict"></div>
            </div>
            
            <div className="absolute bottom-0 right-1/4 w-8 h-8 border border-emerald-500/20 rounded-sm rotate-12 animate-float-slow contain-strict"></div>
            
            {/* Enhanced title styling */}
            <div className="relative inline-block">
              <h2 className="text-2xl md:text-4xl font-bold mb-3 relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  See Anaya In Action
                </span>
                
                {/* Animated underline with glow effect */}
                <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 animate-shimmer contain-strict"></div>
                <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/40 to-purple-500/40 blur-sm animate-pulse-slow contain-strict"></div>
                <div className="absolute -bottom-4 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
              </h2>
              
              {/* Decorative animated icons */}
              <div className="absolute -right-12 -top-6 text-blue-400/70 animate-float-slow contain-strict">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              
              <div className="absolute -left-12 -top-6 text-purple-400/70 animate-float contain-strict" style={{ animationDelay: '1s' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            
            {/* Enhanced separator */}
            <div className="relative w-24 h-1 mx-auto my-4">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent rounded-full"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent rounded-full animate-pulse-slow contain-strict"></div>
            </div>
            
            {/* Enhanced descriptive text */}
            <p className="text-gray-300 text-lg max-w-3xl mx-auto relative">
              Discover how Anaya transforms customer experiences across different industries
              <span className="block mt-2 text-sm text-blue-400/80">Intelligent, contextual conversations that drive results</span>
              
              {/* Decorative dots with animation */}
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                <span className="block w-1.5 h-1.5 rounded-full bg-blue-500/50 animate-pulse contain-strict"></span>
                <span className="block w-1.5 h-1.5 rounded-full bg-purple-500/50 animate-pulse contain-strict" style={{ animationDelay: '0.5s' }}></span>
                <span className="block w-1.5 h-1.5 rounded-full bg-blue-500/50 animate-pulse contain-strict" style={{ animationDelay: '1s' }}></span>
              </span>
            </p>
          </div>
          
          {/* Industry tabs */}
          <div className="flex justify-center mb-6 mt-2 gap-3 bg-slate-900/60 backdrop-blur-sm rounded-xl p-2 anaya-industry-buttons">
            {industries.map((industry, i) => (
              <button
                key={i}
                onClick={() => setActiveIndustry(i)}
                data-industry-index={i}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeIndustry === i
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
          
          {/* Use case tabs */}
          <div className="grid grid-cols-5 border-b border-slate-700/50 mb-6 anaya-usecase-buttons">
            {useCases.map((useCase, i) => (
              <button
                key={i}
                onClick={() => setActiveUseCase(i)}
                data-use-case-index={i}
                className={`py-3 text-sm font-medium transition-all duration-200 ${
                  activeUseCase === i
                    ? 'text-blue-400 border-b-2 border-blue-500'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                {useCase}
              </button>
            ))}
          </div>
          
          {/* Use Case Showcase - Desktop */}
          <div className="hidden md:block">
            {/* Simple placeholder for the use case showcase */}
            <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-blue-500/20 overflow-hidden">
              {/* Content for the active industry and use case */}
              <div className="p-6 relative">
                {/* Decorative background elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl"></div>
                
                {/* Animated decorative shapes */}
                <div className="absolute top-1/4 right-1/4 w-12 h-12 opacity-20 animate-spin-slow contain-strict" 
                  style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}>
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-transparent"></div>
                </div>
                
                <div className="absolute bottom-1/4 left-1/4 w-8 h-8 border border-purple-500/30 rounded-md rotate-45 animate-float-slow contain-strict"></div>
                
                {/* Industry-specific background elements */}
                {activeIndustry === 0 && (
                  <div className="absolute -z-10 inset-0 overflow-hidden opacity-10">
                    {/* E-commerce decorative elements */}
                    <div className="absolute top-5 left-10 w-8 h-8 animate-float-slow contain-strict">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div className="absolute bottom-16 right-12 w-10 h-10 animate-float-delay contain-strict">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="absolute top-20 right-14 w-6 h-6 animate-float contain-strict">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  </div>
                )}
                
                {activeIndustry === 1 && (
                  <div className="absolute -z-10 inset-0 overflow-hidden opacity-10">
                    {/* Restaurant decorative elements */}
                    <div className="absolute top-8 left-14 w-10 h-10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M12 8c1.1 0 2.1-.3 3-.8 1.3-.8 2-.9 3-1 .9-.1 1.5.7 1.5 1.5v5.5a1.5 1.5 0 01-1.5 1.5c-1 0-1.7.2-3 1-.9.5-1.9.8-3 .8s-2.1-.3-3-.8c-1.3-.8-2-.9-3-1a1.5 1.5 0 01-1.5-1.5V7.7c0-.8.6-1.6 1.5-1.5 1 .1 1.7.2 3 1 .9.5 1.9.8 3 .8z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M15 14c.2 1 .4 1.8.6 2.6.4 1.4-.8 2.8-2.1 2.4-1.6-.6-3-.6-4.6 0-1.3.4-2.5-1-2.1-2.4.2-.8.4-1.6.6-2.6" />
                      </svg>
                    </div>
                    <div className="absolute bottom-10 right-12 w-8 h-8">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="absolute top-20 right-20 w-6 h-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M21 15.5c-.523 0-1.046.15-1.5.4a4.5 4.5 0 00-6 0 4.5 4.5 0 00-6 0 3 3 0 00-3 0" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M16 9l2 3l-2 3" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M8 9l-2 3l2 3" />
                      </svg>
                    </div>
                  </div>
                )}
                
                {activeIndustry === 2 && (
                  <div className="absolute -z-10 inset-0 overflow-hidden opacity-10">
                    {/* Hotel decorative elements */}
                    <div className="absolute top-6 left-16 w-10 h-10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="absolute bottom-14 right-16 w-8 h-8">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="absolute top-18 right-10 w-8 h-8">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                )}
                
                {activeIndustry === 3 && (
                  <div className="absolute -z-10 inset-0 overflow-hidden opacity-10">
                    {/* Blogs & Media decorative elements */}
                    <div className="absolute top-7 left-12 w-9 h-9">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <div className="absolute bottom-12 right-14 w-8 h-8">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <div className="absolute top-20 right-12 w-7 h-7">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                )}
                
                {activeIndustry === 4 && (
                  <div className="absolute -z-10 inset-0 overflow-hidden opacity-10">
                    {/* SaaS decorative elements */}
                    <div className="absolute top-8 left-10 w-10 h-10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    </div>
                    <div className="absolute bottom-16 right-12 w-8 h-8">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="absolute top-18 right-16 w-9 h-9">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                )}
                
                {/* Title section with enhanced styling */}
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold relative inline-block">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                      {getExampleContent(activeIndustry, activeUseCase)?.title || `${industries[activeIndustry]}: ${useCases[activeUseCase]}`}
                    </span>
                    <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/50 to-purple-500/50 animate-pulse-slow"></div>
                  </h3>
                  
                  {/* Icon for the use case */}
                  <div className="flex justify-center mt-4">
                    <div className="p-2 bg-slate-800/70 rounded-full border border-blue-500/20 shadow-glow-sm">
                      {getUseCaseIcon(getExampleContent(activeIndustry, activeUseCase)?.icon || 'default')}
                    </div>
                  </div>
                </div>
                
                {/* Enhanced content display with conversation example and product images */}
                <div className="flex flex-col md:flex-row items-start gap-6">
                  {/* Left: Example description, benefits and product visuals */}
                  <div className="w-full md:w-1/2 space-y-4">
                    <p className="text-gray-300 text-sm">
                      {getExampleContent(activeIndustry, activeUseCase)?.description || "Customize this use case for your specific industry needs."}
                    </p>
                    
                    {/* NEW: Product visualization section */}
                    <div className="bg-slate-800/30 rounded-lg p-4 border border-blue-500/20 backdrop-blur-sm">
                      <h4 className="text-sm font-medium text-blue-400 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {activeIndustry === 0 ? "Featured Products" : 
                         activeIndustry === 1 ? "Menu Items" : 
                         activeIndustry === 2 ? "Property Photos" : "Related Items"}
                      </h4>
                      
                      {/* Product grid */}
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {/* Dynamic product visualization based on use case type */}
                        {activeUseCase === 0 && (
                          // Search visualization
                          <>
                            <div className={`bg-slate-900/60 rounded-lg p-2 border ${
                              activeIndustry === 0 ? 'border-blue-500/50' : 
                              activeIndustry === 1 ? 'border-amber-500/50' :
                              activeIndustry === 2 ? 'border-teal-500/50' :
                              activeIndustry === 3 ? 'border-purple-500/50' :
                              'border-indigo-500/50'
                            } transition-colors duration-300`}>
                              <div className="aspect-square relative mb-1 overflow-hidden rounded-md">
                                <div className={`absolute inset-0 bg-gradient-to-br ${
                                  activeIndustry === 0 ? 'from-blue-800/30 to-purple-800/30' : 
                                  activeIndustry === 1 ? 'from-amber-800/30 to-red-800/30' :
                                  activeIndustry === 2 ? 'from-teal-800/30 to-blue-800/30' :
                                  activeIndustry === 3 ? 'from-purple-800/30 to-pink-800/30' :
                                  'from-indigo-800/30 to-cyan-800/30'
                                }`}></div>
                                <div className="h-full w-full flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${
                                    activeIndustry === 0 ? 'text-blue-500/70' : 
                                    activeIndustry === 1 ? 'text-amber-500/70' :
                                    activeIndustry === 2 ? 'text-teal-500/70' :
                                    activeIndustry === 3 ? 'text-purple-500/70' :
                                    'text-indigo-500/70'
                                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                  </svg>
                                </div>
                                <div className={`absolute inset-0 border-2 ${
                                  activeIndustry === 0 ? 'border-blue-500/70' : 
                                  activeIndustry === 1 ? 'border-amber-500/70' :
                                  activeIndustry === 2 ? 'border-teal-500/70' :
                                  activeIndustry === 3 ? 'border-purple-500/70' :
                                  'border-indigo-500/70'
                                } animate-pulse`}></div>
                              </div>
                              <p className="text-xs text-center text-gray-300 truncate">{
                                activeIndustry === 0 ? "Product Search" : 
                                activeIndustry === 1 ? "Menu Search" :
                                activeIndustry === 2 ? "Amenity Search" :
                                activeIndustry === 3 ? "Content Search" :
                                "Feature Search"
                              }</p>
                              <p className={`text-[10px] text-center ${
                                activeIndustry === 0 ? 'text-blue-400' : 
                                activeIndustry === 1 ? 'text-amber-400' :
                                activeIndustry === 2 ? 'text-teal-400' :
                                activeIndustry === 3 ? 'text-purple-400' :
                                'text-indigo-400'
                              }`}>{
                                activeIndustry === 0 ? "14 items found" : 
                                activeIndustry === 1 ? "8 dishes found" :
                                activeIndustry === 2 ? "5 services found" :
                                activeIndustry === 3 ? "12 articles found" :
                                "9 features found"
                              }</p>
                            </div>
                            
                            <div className="col-span-2 bg-slate-900/60 rounded-lg p-2 border border-slate-700/70">
                              <div className="h-full flex flex-col">
                                <div className={`bg-slate-800/70 rounded-md p-1.5 mb-1 ${
                                  activeIndustry === 0 ? 'border-l-2 border-blue-500/30' : 
                                  activeIndustry === 1 ? 'border-l-2 border-amber-500/30' :
                                  activeIndustry === 2 ? 'border-l-2 border-teal-500/30' :
                                  activeIndustry === 3 ? 'border-l-2 border-purple-500/30' :
                                  'border-l-2 border-indigo-500/30'
                                }`}>
                                  <div className="flex items-center">
                                    <div className={`w-3 h-3 ${
                                      activeIndustry === 0 ? 'bg-blue-400/50' : 
                                      activeIndustry === 1 ? 'bg-amber-400/50' :
                                      activeIndustry === 2 ? 'bg-teal-400/50' :
                                      activeIndustry === 3 ? 'bg-purple-400/50' :
                                      'bg-indigo-400/50'
                                    } rounded-full mr-1.5`}></div>
                                    <div className="h-2 bg-slate-700 rounded w-full"></div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-1.5 flex-grow">
                                  {[1, 2, 3, 4].map((item) => (
                                    <div key={item} className={`bg-slate-800/50 rounded-md p-1 flex flex-col ${
                                      item === 1 && activeIndustry === 0 ? 'ring-1 ring-blue-500/30' : 
                                      item === 2 && activeIndustry === 1 ? 'ring-1 ring-amber-500/30' :
                                      item === 3 && activeIndustry === 2 ? 'ring-1 ring-teal-500/30' :
                                      item === 4 && activeIndustry === 3 ? 'ring-1 ring-purple-500/30' :
                                      ''
                                    }`}>
                                      <div className="h-2 w-2/3 bg-slate-700 rounded mb-1"></div>
                                      <div className="h-1.5 w-1/2 bg-slate-700/70 rounded"></div>
                                    </div>
                                  ))}
                                </div>
                                <div className={`mt-1.5 h-1.5 ${
                                  activeIndustry === 0 ? 'bg-blue-500/30' : 
                                  activeIndustry === 1 ? 'bg-amber-500/30' :
                                  activeIndustry === 2 ? 'bg-teal-500/30' :
                                  activeIndustry === 3 ? 'bg-purple-500/30' :
                                  'bg-indigo-500/30'
                                } rounded-full w-full`}></div>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {activeUseCase === 1 && (
                          // Recommendation visualization
                          <>
                            <div className="bg-slate-900/60 rounded-lg p-2 border border-purple-500/50 transition-colors duration-300">
                              <div className="aspect-square relative mb-1 overflow-hidden rounded-md">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-800/30 to-pink-800/30"></div>
                                <div className="h-full w-full flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                  </svg>
                                </div>
                                <div className="absolute inset-0 border-2 border-purple-500/70 animate-pulse"></div>
                              </div>
                              <p className="text-xs text-center text-gray-300 truncate">Top Pick</p>
                              <p className="text-[10px] text-center text-purple-400">98% match</p>
                            </div>
                            
                            <div className="col-span-2 bg-slate-900/60 rounded-lg p-2">
                              <div className="text-xs font-medium text-purple-400 mb-1.5">Based on your preferences</div>
                              <div className="flex items-center space-x-2">
                                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                                  <div className="bg-purple-500 h-full w-3/4 rounded-full"></div>
                                </div>
                                <span className="text-[10px] text-purple-300">75%</span>
                              </div>
                              <div className="flex items-center space-x-2 mt-1.5">
                                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                                  <div className="bg-blue-500 h-full w-1/2 rounded-full"></div>
                                </div>
                                <span className="text-[10px] text-blue-300">50%</span>
                              </div>
                              <div className="flex items-center space-x-2 mt-1.5">
                                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                                  <div className="bg-emerald-500 h-full w-1/4 rounded-full"></div>
                                </div>
                                <span className="text-[10px] text-emerald-300">25%</span>
                              </div>
                              <div className="mt-2 text-[10px] text-gray-400">Popular with similar customers</div>
                            </div>
                          </>
                        )}
                        
                        {activeUseCase === 2 && (
                          // Engagement visualization
                          <>
                            <div className="bg-slate-900/60 rounded-lg p-2 border border-teal-500/50 transition-colors duration-300">
                              <div className="aspect-square relative mb-1 overflow-hidden rounded-md">
                                <div className="absolute inset-0 bg-gradient-to-br from-teal-800/30 to-blue-800/30"></div>
                                <div className="h-full w-full flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                  </svg>
                                </div>
                                <div className="absolute inset-0 border-2 border-teal-500/70 animate-pulse"></div>
                              </div>
                              <p className="text-xs text-center text-gray-300 truncate">Welcome Guide</p>
                              <p className="text-[10px] text-center text-teal-400">Interactive Tour</p>
                            </div>
                            
                            <div className="col-span-2 bg-slate-900/60 rounded-lg p-2">
                              <div className="flex space-x-2 items-center mb-2">
                                <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <div className="ml-1">
                                  <div className="text-xs font-medium text-white">Store Features</div>
                                  <div className="text-[10px] text-gray-400">What would you like to explore?</div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-1">
                                <div className="text-[10px] py-1 px-1.5 bg-teal-900/30 rounded border border-teal-500/30 text-center text-teal-300">Products</div>
                                <div className="text-[10px] py-1 px-1.5 bg-slate-800/80 rounded border border-slate-700/50 text-center text-gray-300">Services</div>
                                <div className="text-[10px] py-1 px-1.5 bg-slate-800/80 rounded border border-slate-700/50 text-center text-gray-300">About Us</div>
                                <div className="text-[10px] py-1 px-1.5 bg-slate-800/80 rounded border border-slate-700/50 text-center text-gray-300">Contact</div>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {activeUseCase === 3 && (
                          // Lead Capture visualization
                          <>
                            <div className="bg-slate-900/60 rounded-lg p-2 border border-amber-500/50 transition-colors duration-300">
                              <div className="aspect-square relative mb-1 overflow-hidden rounded-md">
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-800/30 to-orange-800/30"></div>
                                <div className="h-full w-full flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <div className="absolute inset-0 border-2 border-amber-500/70 animate-pulse"></div>
                              </div>
                              <p className="text-xs text-center text-gray-300 truncate">Contact Info</p>
                              <p className="text-[10px] text-center text-amber-400">Special Offers</p>
                            </div>
                            
                            <div className="col-span-2 bg-slate-900/60 rounded-lg p-2">
                              <div className="text-xs font-medium text-amber-400 mb-2">Stay Updated</div>
                              <div className="space-y-1.5">
                                <div className="flex items-center p-1 bg-slate-800/70 rounded border border-slate-700/50">
                                  <span className="text-[10px] text-gray-400 mr-1.5">Email:</span>
                                  <div className="h-1.5 bg-amber-500/40 rounded w-full"></div>
                                </div>
                                <div className="flex items-center p-1 bg-slate-800/30 rounded border border-slate-700/30">
                                  <span className="text-[10px] text-gray-400 mr-1.5">Name:</span>
                                  <div className="h-1.5 bg-slate-700 rounded w-full"></div>
                                </div>
                                <div className="flex items-center p-1 bg-slate-800/30 rounded border border-slate-700/30">
                                  <span className="text-[10px] text-gray-400 mr-1.5">Interest:</span>
                                  <div className="h-1.5 bg-slate-700 rounded w-full"></div>
                                </div>
                                <div className="flex justify-end">
                                  <div className="px-2 py-0.5 bg-amber-600 rounded text-[10px] text-white">Subscribe</div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {activeUseCase === 4 && (
                          // Support Connection visualization
                          <>
                            <div className="bg-slate-900/60 rounded-lg p-2 border border-rose-500/50 transition-colors duration-300">
                              <div className="aspect-square relative mb-1 overflow-hidden rounded-md">
                                <div className="absolute inset-0 bg-gradient-to-br from-rose-800/30 to-red-800/30"></div>
                                <div className="h-full w-full flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                  </svg>
                                </div>
                                <div className="absolute inset-0 border-2 border-rose-500/70 animate-pulse"></div>
                              </div>
                              <p className="text-xs text-center text-gray-300 truncate">Support</p>
                              <p className="text-[10px] text-center text-rose-400">24/7 Assistance</p>
                            </div>
                            
                            <div className="col-span-2 bg-slate-900/60 rounded-lg p-2">
                              <div className="text-xs font-medium text-rose-400 mb-1.5">Connect with Support</div>
                              <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></div>
                                    <span className="text-[10px] text-gray-300">Live Chat</span>
                                  </div>
                                  <span className="text-[8px] text-gray-400">Available now</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></div>
                                    <span className="text-[10px] text-gray-300">Phone Support</span>
                                  </div>
                                  <span className="text-[8px] text-gray-400">2 min wait</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></div>
                                    <span className="text-[10px] text-gray-300">Email Ticket</span>
                                  </div>
                                  <span className="text-[8px] text-gray-400">~3hr response</span>
                                </div>
                                <div className="w-full h-16 bg-slate-800/50 rounded mt-1 border border-slate-700/40 p-1">
                                  <div className="text-[8px] text-gray-400">Type your question here...</div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {/* Product recommendation message */}
                      <div className="mt-3 flex justify-center">
                        <div className="px-3 py-1 bg-blue-900/30 rounded-full border border-blue-500/30 text-xs text-gray-200 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 h-3 mr-1 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Anaya has selected the perfect item for you
                        </div>
                      </div>
                    </div>
                    
                    {/* Benefits section */}
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-blue-500/20 backdrop-blur-sm">
                      <h4 className="text-sm font-medium text-blue-400 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Key Benefits
                      </h4>
                      <ul className="space-y-2">
                        {(getExampleContent(activeIndustry, activeUseCase)?.benefits || ["Enhanced user experience", "Increased engagement", "Improved conversion rates"]).map((benefit, index) => (
                          <li key={index} className="text-xs text-gray-300 flex items-start">
                            <span className="text-green-400 mr-2 flex-shrink-0">•</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Right: Conversation example with visual indicators */}
                  <div className="w-full md:w-1/2 bg-slate-900/60 backdrop-blur-sm rounded-xl border border-blue-500/20 overflow-hidden">
                    {/* Conversation header */}
                    <div className="bg-slate-800 p-3 border-b border-slate-700/50 flex items-center justify-between">
                      <h4 className="text-sm font-medium text-white flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                        Voice Conversation
                      </h4>
                      <div className="flex items-center">
                        <div className="flex space-x-1 mr-2">
                          <div className="w-1.5 h-3 bg-blue-500/80 rounded-full animate-sound-wave"></div>
                          <div className="w-1.5 h-2 bg-blue-500/60 rounded-full animate-sound-wave" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-1.5 h-4 bg-blue-500/90 rounded-full animate-sound-wave" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1.5 h-2 bg-blue-500/70 rounded-full animate-sound-wave" style={{ animationDelay: '0.3s' }}></div>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Chat content - enhanced for voice interaction */}
                    <div className="p-4 space-y-4">
                      {/* User voice input - with microphone and wave visualization */}
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mr-2 flex-shrink-0 relative">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                          {/* Audio waves around microphone icon */}
                          <span className="absolute -right-0.5 top-1 h-1 w-1 bg-amber-400 rounded-full animate-ping-slow opacity-75"></span>
                        </div>
                        <div className="flex-1">
                          <div className="bg-slate-800/70 rounded-lg rounded-tl-none p-3 text-xs text-gray-300 shadow-sm backdrop-blur-sm relative overflow-hidden">
                            {getExampleContent(activeIndustry, activeUseCase)?.example || "How can Anaya help with this?"}
                            
                            {/* Live transcription indicator */}
                            <div className="absolute bottom-1.5 right-2 flex items-center">
                              <span className="text-[9px] text-amber-400 mr-1 opacity-75">Voice detected</span>
                              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
                            </div>
                          </div>
                          
                          {/* Voice detection visualization bar */}
                          <div className="mt-1 flex space-x-0.5 justify-center">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => {
                              const height = [2, 3, 4, 2, 1, 3, 4, 2, 1, 2, 3, 1][i % 12];
                              return (
                                <div 
                                  key={i}
                                  className={`w-0.5 bg-amber-400/60 rounded-full`}
                                  style={{ 
                                    height: `${height * 2}px`,
                                    animation: 'soundBars 1s infinite',
                                    animationDelay: `${i * 0.05}s` 
                                  }}
                                ></div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      
                      {/* Anaya assistant indicator with AI features - New addition to fill blank space */}
                      <div className="flex items-center justify-center my-2">
                        <div className="w-12 h-12 rounded-full bg-blue-500/30 flex items-center justify-center relative p-0.5 border border-blue-400/30">
                          <Image 
                            src="/agents/anaya.png" 
                            alt="Anaya AI"
                            width={48}
                            height={48}
                            className="object-cover rounded-full"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-3 h-3 border border-slate-800"></div>
                          <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-pulse-slow"></div>
                        </div>
                      </div>
                      
                      {/* AI processing indicator */}
                      <div className="bg-slate-800/60 rounded-lg p-2 backdrop-blur-sm border border-blue-500/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-400 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-[10px] text-blue-300 font-medium">Anaya is listening</span>
                          </div>
                          <div className="flex space-x-1">
                            {[1, 2, 3].map((i) => (
                              <div 
                                key={i}
                                className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"
                                style={{ animationDelay: `${i * 0.15}s` }}
                              ></div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Quick suggestion chips */}
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {[
                            `Tell me about ${industries[activeIndustry]}`, 
                            `How does ${useCases[activeUseCase]} work?`, 
                            "Show me examples"
                          ].map((text, i) => (
                            <div 
                              key={i} 
                              className={`text-[9px] px-1.5 py-0.5 rounded-full cursor-pointer transition-colors
                                ${activeIndustry === 0 ? 'bg-blue-900/40 text-blue-300 hover:bg-blue-800/40' : 
                                activeIndustry === 1 ? 'bg-amber-900/40 text-amber-300 hover:bg-amber-800/40' :
                                activeIndustry === 2 ? 'bg-teal-900/40 text-teal-300 hover:bg-teal-800/40' :
                                activeIndustry === 3 ? 'bg-purple-900/40 text-purple-300 hover:bg-purple-800/40' :
                                'bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/40'}`}
                            >
                              {text}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Anaya voice response - with enhanced voice UI */}
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-2 flex-shrink-0 overflow-hidden relative">
                          <Image 
                            src="/agents/anaya.png" 
                            alt="Anaya AI"
                            width={32}
                            height={32}
                            className="object-cover z-10"
                          />
                          
                          {/* Active speaking indicator - animated mouth/sound waves */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-full bg-blue-500/20 absolute"></div>
                            <div className="w-7 h-7 rounded-full border border-blue-400/50 absolute animate-ping-slow opacity-60"></div>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="bg-blue-900/30 backdrop-blur-sm rounded-lg rounded-tl-none p-3 text-xs text-gray-100 shadow-sm relative">
                            {/* Voice wave visualization at top of message */}
                            <div className="flex space-x-1 mb-2 justify-center">
                              {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div 
                                  key={i}
                                  className="w-0.5 bg-blue-400/80 rounded-full animate-sound-wave"
                                  style={{ 
                                    height: `${Math.sin(i/2) * 8 + 4}px`,
                                    animationDelay: `${i * 0.1}s` 
                                  }}
                                ></div>
                              ))}
                            </div>
                            
                            {getExampleContent(activeIndustry, activeUseCase)?.response || "I'd be happy to help you with that. Let me provide you with the information you need..."}
                            
                            {/* Voice speaking indicators */}
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-400 mr-1 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                                <span className="text-[9px] text-blue-300">Speaking...</span>
                              </div>
                              
                              {/* Voice control buttons */}
                              <div className="flex space-x-2">
                                <div className="w-4 h-4 rounded-full bg-slate-800/80 flex items-center justify-center cursor-pointer">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <div className="w-4 h-4 rounded-full bg-slate-800/80 flex items-center justify-center cursor-pointer">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 010-7.072m12.728 0l-3.536 3.536m-10.607 0a9 9 0 010-12.728M9.172 9.172L5.636 5.636M15.536 15.536l3.536 3.536" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Voice wave visualization under bubble */}
                          <div className="mt-1 flex space-x-0.5 justify-center">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) => {
                              // Create a more dynamic wave pattern
                              const heightFactors = [2, 3, 5, 7, 5, 3, 2, 1, 2, 4, 6, 4, 2, 1];
                              const height = heightFactors[i % heightFactors.length];
                              return (
                                <div 
                                  key={i}
                                  className={`w-0.5 ${
                                    activeIndustry === 0 ? 'bg-blue-400/60' : 
                                    activeIndustry === 1 ? 'bg-amber-400/60' :
                                    activeIndustry === 2 ? 'bg-teal-400/60' :
                                    activeIndustry === 3 ? 'bg-purple-400/60' :
                                    'bg-indigo-400/60'
                                  } rounded-full animate-sound-wave`}
                                  style={{ 
                                    height: `${height * 1.5}px`,
                                    animationDelay: `${i * 0.05}s`,
                                    animationDuration: '0.8s'
                                  }}
                                ></div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Voice assistant footer controls */}
                    <div className="bg-slate-800/70 p-3 border-t border-slate-700/50">
                      <div className="flex flex-col">
                        <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-[10px]">Voice-enabled</span>
                          </div>
                          <div>
                            <span className={`px-1.5 py-0.5 bg-slate-700 rounded-full text-[10px] ${
                              activeIndustry === 0 ? 'text-blue-300' : 
                              activeIndustry === 1 ? 'text-amber-300' :
                              activeIndustry === 2 ? 'text-teal-300' :
                              activeIndustry === 3 ? 'text-purple-300' :
                              'text-indigo-300'
                            }`}>
                              {industries[activeIndustry] || "Custom"} Integration
                            </span>
                          </div>
                        </div>
                        
                        {/* Voice input indicator */}
                        <div className="flex items-center justify-center bg-slate-900/60 rounded-full py-1.5 px-4 border border-slate-700/50">
                          <div className="flex space-x-1.5 mr-2">
                            {[1, 2, 3, 4].map((i) => (
                              <div 
                                key={i}
                                className={`w-0.5 ${
                                  activeIndustry === 0 ? 'bg-blue-400/60' : 
                                  activeIndustry === 1 ? 'bg-amber-400/60' :
                                  activeIndustry === 2 ? 'bg-teal-400/60' :
                                  activeIndustry === 3 ? 'bg-purple-400/60' :
                                  'bg-indigo-400/60'
                                } rounded-full animate-sound-wave`}
                                style={{ 
                                  height: `${[4, 6, 8, 5][i-1]}px`,
                                  animationDelay: `${i * 0.1}s` 
                                }}
                              ></div>
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-400">Tap to speak or type a message...</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-2 ${
                            activeIndustry === 0 ? 'text-blue-400' : 
                            activeIndustry === 1 ? 'text-amber-400' :
                            activeIndustry === 2 ? 'text-teal-400' :
                            activeIndustry === 3 ? 'text-purple-400' :
                            'text-indigo-400'
                          }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features highlight section (Why Choose brain9ai) - Moved to the end */}
      <div className="mt-16 max-w-6xl mx-auto w-full px-4 lg:px-0">
        <div className="bg-blue-900/10 p-6 rounded-xl border border-blue-800/20 backdrop-blur-sm relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-teal-500/5 rotate-45 blur-xl"></div>
          
          {/* Animated circuit-like lines in the background */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
            <div className="absolute top-2/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
            <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
            
            <div className="absolute bottom-0 top-0 left-1/4 w-px bg-gradient-to-b from-transparent via-blue-500/50 to-transparent"></div>
            <div className="absolute bottom-0 top-0 left-2/4 w-px bg-gradient-to-b from-transparent via-purple-500/50 to-transparent"></div>
            <div className="absolute bottom-0 top-0 left-3/4 w-px bg-gradient-to-b from-transparent via-teal-500/50 to-transparent"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center">
              <span className="mr-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Why Choose brain9ai</span>
              <div className="w-8 h-px bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse-slow"></div>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: 'Smart Automation',
                  description: 'AI agents that streamline your business processes',
                  icon: (
                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  color: 'blue',
                  delay: '0s'
                },
                {
                  title: 'Voice Enabled',
                  description: 'Natural conversation with our AI assistants',
                  icon: (
                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  ),
                  color: 'purple',
                  delay: '0.2s'
                },
                {
                  title: 'Easy Integration',
                  description: 'Seamlessly works with your existing tools',
                  icon: (
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                    </svg>
                  ),
                  color: 'emerald',
                  delay: '0.4s'
                }
              ].map((feature, index) => {
                // Determine border style and background based on feature color
                const borderColor = feature.color === 'blue' 
                  ? 'border-blue-500/30' 
                  : feature.color === 'purple' 
                  ? 'border-purple-500/30' 
                  : 'border-emerald-500/30';
                
                const bgGradient = feature.color === 'blue' 
                  ? 'from-blue-900/30 to-transparent' 
                  : feature.color === 'purple' 
                  ? 'from-purple-900/30 to-transparent' 
                  : 'from-emerald-900/30 to-transparent';
                  
                return (
                  <div key={index} className="relative p-4 rounded-lg border backdrop-blur-sm animate-fade-in" 
                    style={{ 
                      animationDelay: feature.delay,
                      borderImage: feature.color === 'blue' 
                        ? 'linear-gradient(to right, rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.1)) 1'
                        : feature.color === 'purple'
                        ? 'linear-gradient(to right, rgba(168, 85, 247, 0.3), rgba(168, 85, 247, 0.1)) 1'
                        : 'linear-gradient(to right, rgba(5, 150, 105, 0.3), rgba(5, 150, 105, 0.1)) 1'
                    }}>
                    
                    {/* Background gradient */}
                    <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${bgGradient} opacity-50`}></div>
                    
                    {/* Decorative corner */}
                    <div className="absolute top-0 right-0 w-8 h-8">
                      <div className={`absolute top-0 right-0 w-4 h-4 border-t border-r ${borderColor} rounded-tr-md`}></div>
                    </div>
                    
                    <div className="flex items-start relative z-10">
                      <div className="bg-slate-800 p-2.5 rounded-lg mr-3 flex-none border border-slate-700/70">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-1.5">{feature.title}</h3>
                        <p className="text-xs text-gray-400">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer with responsive design - only for desktop view and large screens */}
      <footer className="hidden md:block w-full px-4 sm:px-6 py-6 sm:py-8 mt-8 sm:mt-16 border-t border-white/10 relative z-10 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4 md:mb-0">
            brain9<span className="text-blue-400">ai</span>
          </div>
          
          <div className="text-xs sm:text-sm text-gray-400">
            © {new Date().getFullYear()} brain9ai - AI Automation Solutions
          </div>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/contact" className="text-gray-300 hover:text-white transition text-sm">Contact</Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition text-sm">About</Link>
          </div>
        </div>
      </footer>
      
      {/* Mobile Industry and Use Case selector - more space efficient */}
      <div className="md:hidden mb-4">
        <div className="bg-slate-900/60 rounded-lg border border-blue-500/20 overflow-hidden">
          {/* Section title - more compact */}
          <div className="p-3 border-b border-slate-700/50 text-center relative">
            <h3 className="text-base font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Industry Examples
            </h3>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
          </div>
          
          {/* Industry selector in dropdown style - more compact */}
          <div className="p-3 border-b border-slate-700/50">
            <div className="relative">
              <select 
                className="w-full px-2 py-1.5 bg-slate-800 rounded-md border border-slate-700/50 text-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                value={activeIndustry}
                onChange={(e) => setActiveIndustry(parseInt(e.target.value))}
              >
                {industries.map((industry, idx) => (
                  <option key={industry} value={idx}>{industry}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Use case selector pills - more compact */}
          <div className="p-2 border-b border-slate-700/50">
            <div className="flex overflow-x-auto pb-1 hide-scrollbar gap-1 px-1">
              {useCases.map((useCase, idx) => (
                <button
                  key={useCase}
                  onClick={() => setActiveUseCase(idx)}
                  className={`whitespace-nowrap px-2 py-1 rounded-full text-[10px] flex-shrink-0 transition-colors ${
                    idx === activeUseCase
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-gray-300 border border-slate-700/50'
                  }`}
                >
                  {useCase}
                </button>
              ))}
            </div>
          </div>
          
          {/* Mobile example display - more compact */}
          <div className="p-3">
            <div className="mb-2">
              <h4 className="text-xs font-medium text-blue-400 mb-1">
                {getExampleContent(activeIndustry, activeUseCase)?.title || `${industries[activeIndustry]}: ${useCases[activeUseCase]}`}
              </h4>
              <p className="text-[10px] text-gray-300 line-clamp-3">
                {getExampleContent(activeIndustry, activeUseCase)?.description || "Customize this use case for your specific industry needs."}
              </p>
            </div>
            
            {/* Conversation example preview - mobile view */}
            <div className="flex space-x-2 items-start mb-3">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="bg-slate-800/70 rounded-lg p-1.5 text-[9px] text-gray-300">
                  {getExampleContent(activeIndustry, activeUseCase)?.example || "How can I use Anaya for this?"}
                </div>
              </div>
            </div>
            <div className="flex space-x-2 items-start">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <Image 
                  src="/agents/anaya.png" 
                  alt="Anaya AI"
                  width={24}
                  height={24}
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="bg-blue-900/30 rounded-lg p-1.5 text-[9px] text-gray-200">
                  <p className="line-clamp-3">
                    {getExampleContent(activeIndustry, activeUseCase)?.response || "I'd be happy to help with that! Here's what you need to know..."}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Benefits - mobile version */}
            <div className="mt-3 pt-3 border-t border-slate-700/30">
              <div className="text-[10px] font-medium text-blue-400 mb-1.5 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Key Benefits
              </div>
              <div className="space-y-1">
                {(getExampleContent(activeIndustry, activeUseCase)?.benefits || ["Enhanced user experience", "Increased engagement", "Improved conversion rates"]).slice(0, 2).map((benefit, index) => (
                  <div key={index} className="text-[9px] text-gray-300 flex items-start">
                    <span className="text-green-400 mr-1 flex-shrink-0">•</span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 