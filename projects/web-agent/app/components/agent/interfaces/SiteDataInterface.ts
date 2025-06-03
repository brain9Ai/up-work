/**
 * SiteDataInterface.ts
 * 
 * This file defines the interface between the main application's site data
 * and the agent system. By defining these interfaces, we create a clear
 * contract that the agent system expects, while allowing the main application
 * to structure its data however it wants, as long as it can be mapped to
 * these interfaces when passed to the agent system.
 */

export interface CompanyInfo {
  name: string;
  tagline?: string;
  description?: string;
  founded?: number;
  location?: string;
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  socialMedia?: Record<string, string>;
}

export interface NavigationLink {
  name: string;
  path: string;
}

export interface NavigationInfo {
  mainLinks?: NavigationLink[];
  [key: string]: any;
}

export interface ProductInfo {
  id: string;
  name: string;
  role?: string;
  shortDescription?: string;
  fullDescription?: string;
  features?: string[];
  benefits?: string[];
  pricing?: string;
  isFree?: boolean;
  [key: string]: any;
}

export interface ServiceInfo {
  id: string;
  name: string;
  shortDescription?: string;
  fullDescription?: string;
  tools?: string[];
  useCase?: string;
  [key: string]: any;
}

export interface FaqInfo {
  question: string;
  answer: string;
}

export interface SiteData {
  company: CompanyInfo;
  navigation?: NavigationInfo;
  products?: ProductInfo[];
  services?: ServiceInfo[];
  faqs?: FaqInfo[];
  [key: string]: any;
}

export interface WebAgentInfo {
  name: string;
  role?: string;
  description?: string;
  assistantId?: string;
  voiceId?: string;
  [key: string]: any;
}

/**
 * Provides type checking for site data coming from the main application
 * @param data Any data structure from the main application
 * @returns The same data, but typed as SiteData
 */
export function validateSiteData(data: any): SiteData {
  // Could add validation logic here if needed
  return data as SiteData;
}

/**
 * Provides type checking for web agent info coming from the main application
 * @param data Any data structure from the main application
 * @returns The same data, but typed as WebAgentInfo
 */
export function validateWebAgentInfo(data: any): WebAgentInfo {
  // Could add validation logic here if needed
  return data as WebAgentInfo;
} 