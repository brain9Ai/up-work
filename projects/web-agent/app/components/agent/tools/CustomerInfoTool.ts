'use client';

import { Tool } from '../ToolManager';
import currentSessionId, { customerStore } from '../SessionManager';

// Direct integration with n8n webhook
const N8N_WEBHOOK_URL = 'https://brain9.app.n8n.cloud/webhook/book-appointment-and-store-customer-info';

// Get the session ID from the shared customer info store
const getSessionId = () => currentSessionId;

interface CustomerInfoArgs {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  interest?: string;
  notes?: string;
  // New standardized fields
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerCompany?: string;
}

const CustomerInfoTool: Tool = {
  name: 'store_customer_info',
  definition: {
    type: "function",
    function: {
      name: "store_customer_info",
      description: "Store customer information through n8n workflow. Use this when a user expresses interest in brain9.ai's products or services and they're willing to share their contact details. This should be used whenever new customer details are discovered during the conversation.",
      parameters: {
        type: "object",
        properties: {
          customerName: {
            type: "string",
            description: "Customer's full name"
          },
          customerEmail: {
            type: "string",
            description: "Customer's email address"
          },
          customerPhone: {
            type: "string",
            description: "Customer's phone number (if provided)"
          },
          customerCompany: {
            type: "string",
            description: "Customer's company or organization name (if provided)"
          },
          interest: {
            type: "string",
            description: "What product or service the customer is interested in (e.g., 'WebAgent', 'Sales Agent', 'Lead Generation', etc.)"
          },
          notes: {
            type: "string",
            description: "Any additional information about the customer's needs or requirements"
          }
        },
        required: ["customerName"]
      }
    },
    async: true,
    messages: [
      {
        type: "request-start",
        content: "I'm saving your information now. This will only take a moment..."
      },
      {
        type: "request-response-delayed",
        content: "Still processing your information. Thank you for your patience.",
        timingMilliseconds: 2000
      },
      {
        type: "request-complete",
        content: "Thank you! Your information has been saved. Our team will use this to provide you with personalized assistance."
      },
      {
        type: "request-failed",
        content: "I'm sorry, but I couldn't save your information at this time. Let's continue our conversation, and we can try again later if needed."
      }
    ]
  },
  handler: async (params: CustomerInfoArgs) => {
    console.log('Customer information storage requested:', params);
    
    try {
      // Support both old and new field names
      const name = params.customerName || params.name || '';
      const email = params.customerEmail || params.email || '';
      const phone = params.customerPhone || params.phone || '';
      const company = params.customerCompany || params.company || '';
      
      // Check if we have a valid name (required field)
      if (!name) {
        throw new Error("Customer name is required");
      }
      
      // Check if this contains new information compared to what we already have
      const currentData = customerStore.getData();
      const hasNewInfo = Object.entries({
        name,
        email,
        phone,
        company,
        interest: params.interest || '',
        notes: params.notes || '',
      }).some(([key, value]) => {
        // If the value is provided and either we don't have it yet or it's different
        return value && (!currentData[key] || currentData[key] !== value);
      });
      
      // Update our in-memory store with this data
      customerStore.updateData({
        name,
        email,
        phone, 
        company,
        interest: params.interest || '',
        notes: params.notes || '',
      });
      
      // Get the session ID - this ensures we use the same ID across tools
      const sessionId = getSessionId();
      
      // Prepare the data for the n8n webhook
      const customerData = {
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        customerCompany: company,
        interest: params.interest || '',
        notes: params.notes || '',
        timestamp: new Date().toISOString(),
        sessionId: sessionId,
        toolName: 'store-customer-info',
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
        hasNewInfo: hasNewInfo,  // Flag to indicate if this updates existing data
        requestType: 'agent'
      };
      
      console.log('Sending customer data directly to n8n webhook:', customerData);
      
      // Send the customer information directly to the n8n webhook
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to store customer information: ${response.status} ${errorText}`);
      }
      
      let responseData;
      try {
        responseData = await response.json();
        console.log('Received response from n8n webhook:', responseData);
      } catch (e) {
        // If the response isn't JSON, use the text
        const responseText = await response.text();
        console.log('Received text response from n8n webhook:', responseText);
        responseData = { message: responseText };
      }
      
      return {
        success: true,
        message: "Thank you for sharing your information. This will help our team provide you with personalized assistance tailored to your needs.",
        data: responseData,
        sessionId: sessionId
      };
    } catch (error) {
      console.error('Error storing customer information:', error);
      return {
        success: false,
        message: `I couldn't save your information at this time, but we can continue our conversation. You can also reach out to our team directly through our contact page.`,
        error: error instanceof Error ? error.message : String(error),
        sessionId: getSessionId()
      };
    }
  }
};

export default CustomerInfoTool; 
 
 