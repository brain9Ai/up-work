'use client';

import { Tool } from '../ToolManager';

// Reference to the n8n webhook used for appointment scheduling
const N8N_WEBHOOK_URL = 'https://brain9.app.n8n.cloud/webhook/fb3afa28-0a24-4009-9dbb-fdf344b586aa';

interface AppointmentArgs {
  name: string;
  email: string;
  date: string;
  time: string;
  service?: string;
  notes?: string;
  duration?: number;
}

interface Appointment extends AppointmentArgs {
  id: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const AppointmentTool: Tool = {
  name: 'schedule_appointment',
  definition: {
    type: "function",
    function: {
      name: "schedule_appointment",
      description: "Schedule a customer appointment for a consultation or service",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Customer's full name"
          },
          email: {
            type: "string",
            description: "Customer's email address for confirmation"
          },
          date: {
            type: "string",
            description: "Appointment date in YYYY-MM-DD format"
          },
          time: {
            type: "string",
            description: "Appointment time in HH:MM format (24-hour)"
          },
          service: {
            type: "string",
            description: "Type of service requested (optional)"
          },
          notes: {
            type: "string",
            description: "Additional notes or special requests (optional)"
          },
          duration: {
            type: "number",
            description: "Expected duration in minutes (optional, defaults to 60)"
          }
        },
        required: ["name", "email", "date", "time"]
      }
    }
  },
  handler: async (args: AppointmentArgs) => {
    // Validate required fields
    if (!args.name || !args.name.trim()) {
      return {
        success: false,
        message: "Customer name is required"
      };
    }

    if (!args.email || !args.email.trim()) {
      return {
        success: false,
        message: "Email address is required"
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(args.email)) {
      return {
        success: false,
        message: "Invalid email format"
      };
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!args.date || !dateRegex.test(args.date)) {
      return {
        success: false,
        message: "Date must be in YYYY-MM-DD format"
      };
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!args.time || !timeRegex.test(args.time)) {
      return {
        success: false,
        message: "Time must be in HH:MM format (24-hour)"
      };
    }

    // Validate appointment is not in the past
    const appointmentDate = new Date(`${args.date}T${args.time}`);
    const now = new Date();
    if (appointmentDate <= now) {
      return {
        success: false,
        message: "Appointment must be in the future"
      };
    }

    // Create appointment object with default values
    const appointment: Appointment = {
      ...args,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      duration: args.duration || 60
    };

    // Store appointment in localStorage
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        // Get existing appointments or initialize empty array
        const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        
        // Check for scheduling conflicts
        const hasConflict = existingAppointments.some((existing: Appointment) => {
          if (existing.status === 'cancelled') return false;
          
          const existingDate = new Date(`${existing.date}T${existing.time}`);
          const existingEndTime = new Date(existingDate.getTime() + (existing.duration || 60) * 60000);
          
          const newAppointmentDate = new Date(`${args.date}T${args.time}`);
          const newAppointmentEndTime = new Date(newAppointmentDate.getTime() + (args.duration || 60) * 60000);
          
          return (
            (newAppointmentDate >= existingDate && newAppointmentDate < existingEndTime) ||
            (newAppointmentEndTime > existingDate && newAppointmentEndTime <= existingEndTime) ||
            (newAppointmentDate <= existingDate && newAppointmentEndTime >= existingEndTime)
          );
        });
        
        if (hasConflict) {
          return {
            success: false,
            message: "There is a scheduling conflict with an existing appointment at this time"
          };
        }
        
        // Add new appointment
        const updatedAppointments = [...existingAppointments, appointment];
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      }
      
      console.log('Appointment scheduled:', appointment);
      
      return {
        success: true,
        message: `Appointment scheduled for ${args.date} at ${args.time}`,
        appointment
      };
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      return {
        success: false,
        message: `Failed to schedule appointment: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
};

export default AppointmentTool; 
 
 