/**
 * CustomToolExample.ts
 * 
 * This file demonstrates how to create and register a custom tool for the WebAgent system.
 * This example implements a FAQ tool that can answer predefined frequently asked questions.
 */

import toolManager, { Tool } from '../ToolManager';
import { SiteData } from '../interfaces/SiteDataInterface';

/**
 * FAQ Tool definition
 * 
 * This tool allows the agent to look up answers to frequently asked questions.
 */
const FaqTool: Tool = {
  name: 'faq_lookup',
  
  // This definition will be provided to the LLM
  definition: {
    type: 'function',
    function: {
      name: 'faq_lookup',
      description: 'Look up answers to frequently asked questions',
      parameters: {
        type: 'object',
        properties: {
          question: {
            type: 'string',
            description: 'The question to look up an answer for. Can be the exact question or a similar question.'
          },
          fallback_response: {
            type: 'string',
            description: 'A fallback response to provide if no matching FAQ is found'
          }
        },
        required: ['question']
      }
    }
  },
  
  // This handler implements the tool's functionality
  handler: async (args, context) => {
    try {
      // Extract question and fallback from arguments
      const { question, fallback_response } = args;
      
      // Check if we have site data in context
      if (!context?.siteData) {
        console.error('FAQ Tool: No site data available in context');
        return {
          success: false,
          message: 'FAQ data not available',
          matchingFaq: null
        };
      }
      
      // Get the FAQ data from context
      const siteData = context.siteData as SiteData;
      const faqs = siteData.faqs || [];
      
      // If we don't have any FAQs, return failure
      if (!faqs.length) {
        console.log('FAQ Tool: No FAQs found in site data');
        return {
          success: false,
          message: fallback_response || 'I don\'t have information about that question.',
          matchingFaq: null
        };
      }
      
      // Simple matching algorithm: find the FAQ with highest similarity
      let bestMatch = null;
      let highestScore = 0;
      
      for (const faq of faqs) {
        // Calculate simple similarity score based on word overlap
        const score = calculateSimilarity(question.toLowerCase(), faq.question.toLowerCase());
        
        if (score > highestScore) {
          highestScore = score;
          bestMatch = faq;
        }
      }
      
      // Require a minimum similarity threshold
      const SIMILARITY_THRESHOLD = 0.3;
      
      if (bestMatch && highestScore >= SIMILARITY_THRESHOLD) {
        console.log(`FAQ Tool: Found match with score ${highestScore}:`, bestMatch);
        return {
          success: true,
          message: bestMatch.answer,
          matchingFaq: {
            question: bestMatch.question,
            score: highestScore
          }
        };
      }
      
      // No matching FAQ found
      console.log('FAQ Tool: No matching FAQ found for question:', question);
      return {
        success: false,
        message: fallback_response || 'I don\'t have specific information about that question.',
        matchingFaq: null
      };
    } catch (error) {
      console.error('Error in FAQ Tool:', error);
      return {
        success: false,
        message: 'An error occurred while processing the FAQ lookup',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
};

/**
 * Calculate similarity between two strings based on word overlap
 * This is a simple implementation for demonstration purposes
 */
function calculateSimilarity(str1: string, str2: string): number {
  // Convert strings to sets of words
  const words1 = new Set(str1.toLowerCase().split(/\s+/).filter(w => w.length > 2));
  const words2 = new Set(str2.toLowerCase().split(/\s+/).filter(w => w.length > 2));
  
  // Find intersection and union of words
  const intersection = new Set([...words1].filter(word => words2.has(word)));
  const union = new Set([...words1, ...words2]);
  
  // Calculate Jaccard similarity coefficient
  return intersection.size / union.size;
}

/**
 * Register the FAQ tool with the tool manager
 */
export const registerFaqTool = () => {
  toolManager.registerTool(FaqTool);
  console.log('FAQ Tool registered successfully');
};

/**
 * Example usage in your application:
 * 
 * import { registerFaqTool } from './tools/FaqTool';
 * 
 * // Register the tool during app initialization
 * registerFaqTool();
 */

export default FaqTool; 