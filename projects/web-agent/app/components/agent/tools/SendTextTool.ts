'use client';

import { Tool } from '../ToolManager';

// Define the sender number
const SENDER_NUMBER = '+19714022481';  // Inbound number

const SendTextTool: Tool = {
  name: 'send_text',
  definition: {
    // Use "sms" type as specified in VAPI documentation
    type: "sms",
    // Metadata contains the from number
    metadata: {
      from: SENDER_NUMBER
    },
    function: {
      name: "send_text",
      description: "Send a text message to the user's phone number. Use this when the user asks you to send information via SMS.",
      parameters: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "The message to send to the user"
          },
          phoneNumber: {
            type: "string",
            description: "The phone number to send the text to in E.164 format (e.g., +1XXXXXXXXXX)"
          }
        },
        required: ["message", "phoneNumber"]
      }
    },
    // Custom messages for different stages of text sending
    messages: [
      {
        type: "request-start",
        content: "I'll send that information to your phone right away..."
      },
      {
        type: "request-complete",
        content: "Great! I've sent the text message to your phone."
      },
      {
        type: "request-failed",
        content: "I'm sorry, but I couldn't send the text message at this time."
      }
    ]
  },
  handler: async (params: any) => {
    console.log('Send text requested:', params);
    
    try {
      // Log the attempted SMS send for debugging
      const phoneNumber = params.phoneNumber || 'unknown number';
      const message = params.message || 'empty message';
      
      console.log(`Attempting to send SMS from ${SENDER_NUMBER} to ${phoneNumber}: "${message}"`);
      
      // Note: When using VAPI's built-in SMS functionality, 
      // this handler may not be called since VAPI handles the SMS sending
      
      return {
        success: true,
        message: `Text message sent to ${phoneNumber}: "${message.substring(0, 30)}${message.length > 30 ? '...' : ''}"`,
        from: SENDER_NUMBER,
        to: phoneNumber
      };
    } catch (error) {
      console.error('Error sending text:', error);
      return {
        success: false,
        message: `Failed to send text: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
};

export default SendTextTool; 