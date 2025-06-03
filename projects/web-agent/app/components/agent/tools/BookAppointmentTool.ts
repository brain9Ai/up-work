'use client';

import { Tool } from '../ToolManager';
import currentSessionId, { customerStore } from '../SessionManager';

// Direct integration with n8n webhook
const N8N_WEBHOOK_URL = 'https://brain9.app.n8n.cloud/webhook/book-appointment-and-store-customer-info';

// Interface for the appointment arguments
interface BookAppointmentArgs {
  text: string;
  name: string;
  email?: string;
  phone?: string;
  date?: string;
  time?: string;
  notes?: string;
}

// Store customer data in memory for the session
export const customerInfoStore = customerStore;

const BookAppointmentTool: Tool = {
  name: 'book_appointment_n8n',
  definition: {
    type: "function",
    function: {
      name: "book_appointment_n8n",
      description: "Book an appointment or consultation call with the appropriate team at brain9.ai based on the customer's needs. Use this when a customer expresses interest in getting a demo, consultation, or more information about products or services.",
      parameters: {
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "The main purpose or topic of the appointment (e.g., 'product demo', 'consultation', 'sales inquiry', 'support')"
          },
          name: {
            type: "string",
            description: "Customer's full name"
          },
          email: {
            type: "string",
            description: "Customer's email address for appointment confirmation"
          },
          phone: {
            type: "string",
            description: "Customer's phone number for appointment confirmation (if provided)"
          },
          date: {
            type: "string",
            description: "Preferred date for the appointment (if specified by customer)"
          },
          time: {
            type: "string",
            description: "Preferred time for the appointment (if specified by customer)"
          },
          notes: {
            type: "string",
            description: "Any additional information, specific requirements, or questions the customer has for the appointment"
          }
        },
        required: ["text", "name"]
      }
    },
    async: true,
  },
  
  handler: async (params: BookAppointmentArgs) => {
    console.log('Appointment booking requested:', params);
    
    try {
      // Store this customer information in our session data
      customerInfoStore.updateData({
        name: params.name,
        email: params.email,
        phone: params.phone
      });
      
      // Prepare the data for the n8n webhook
      const appointmentData = {
        text: params.text,
        customerName: params.name,
        customerEmail: params.email || '',
        customerPhone: params.phone || '',
        date: params.date || '',
        time: params.time || '',
        notes: params.notes || '',
        timestamp: new Date().toISOString(),
        sessionId: currentSessionId,
        toolName: 'book-appointment',
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
        requestType: 'appointment'
      };
      
      console.log('Sending appointment data directly to n8n webhook:', appointmentData);
      
      // Send the appointment request directly to the n8n webhook
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to book appointment: ${response.status} ${errorText}`);
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
        message: "I've scheduled your appointment! Our team will confirm the details with you shortly. Is there anything specific you'd like us to prepare for the call?",
        data: responseData,
        sessionId: currentSessionId
      };
    } catch (error) {
      console.error('Error booking appointment:', error);
      return {
        success: false,
        message: "I'm sorry, I couldn't book your appointment at this moment. Please try again later or contact us directly through our contact page.",
        error: error instanceof Error ? error.message : String(error),
        sessionId: currentSessionId
      };
    }
  }
};

export default BookAppointmentTool; 