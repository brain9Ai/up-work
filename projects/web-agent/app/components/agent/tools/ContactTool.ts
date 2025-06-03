'use client';

import { Tool } from '../ToolManager';

// Sample contact form data structure
interface ContactForm {
  name: string;
  email: string;
  message: string;
  phoneNumber?: string;
}

// Sample contact information
const contactInfo = {
  email: 'contact@beautyai.com',
  phone: '+1 (555) 123-4567',
  address: '123 Beauty Street, Suite 100, San Francisco, CA 94105',
  hours: 'Monday - Friday: 9am - 6pm, Saturday: 10am - 4pm, Sunday: Closed'
};

const createContactTool = (): Tool => {
  return {
    name: 'contact',
    definition: {
      type: 'function',
      function: {
        name: 'contact',
        description: 'Get contact information or submit contact requests',
        parameters: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: ['info', 'submit'],
              description: 'The action to perform - get contact info or submit a contact form'
            },
            formData: {
              type: 'object',
              description: 'Contact form data for submission',
              properties: {
                name: {
                  type: 'string',
                  description: 'Full name of the person'
                },
                email: {
                  type: 'string',
                  description: 'Email address'
                },
                message: {
                  type: 'string',
                  description: 'Message content'
                },
                phoneNumber: {
                  type: 'string',
                  description: 'Phone number (optional)'
                }
              },
              required: ['name', 'email', 'message']
            }
          },
          required: ['action']
        }
      }
    },
    handler: async (params: any) => {
      const { action, formData } = params;
      console.log(`ContactTool: Processing ${action} request`);
      
      switch (action) {
        case 'info':
          return {
            success: true,
            data: contactInfo,
            message: 'Contact information retrieved successfully'
          };
          
        case 'submit':
          if (!formData) {
            return {
              success: false,
              message: 'Form data is required for submit action'
            };
          }
          
          // Validate form data
          const { name, email, message } = formData;
          if (!name || !email || !message) {
            return {
              success: false,
              message: 'Name, email, and message are required'
            };
          }
          
          // In a real app, this would send the data to a backend API
          console.log('Contact form submission:', formData);
          
          return {
            success: true,
            message: 'Thank you for your message. We will contact you shortly.',
            data: { 
              referenceId: `REF-${Date.now()}`,
              submittedAt: new Date().toISOString()
            }
          };
          
        default:
          return {
            success: false,
            message: `Invalid action: ${action}`
          };
      }
    }
  };
};

// Export the contact tool
const contactTool = createContactTool();
export default contactTool; 
 
 