// Static export version - API routes don't work in static exports
// This file is only a placeholder

import { NextResponse } from 'next/server';
import { API_CONFIG, getExternalApiUrl, transformFormData } from '@/app/utils/api';

export async function GET() {
  return new Response(
    JSON.stringify({ 
      message: "API endpoints are not available in static exports. Please use the hosted version of the site." 
    }),
    { 
      status: 200,
      headers: { 'content-type': 'application/json' }
    }
  );
}

/**
 * API endpoint to book appointments and forward to n8n webhook
 */
export async function POST(request: Request) {
  try {
    // Parse the incoming request
    const payload = await request.json();
    
    // Validate the payload
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    // Log the original payload for debugging
    console.log('Original payload received:', JSON.stringify(payload, null, 2));
    
    // Transform the payload to use standardized field names
    const transformedPayload = transformFormData(payload);
    
    // Log the transformed payload for debugging
    console.log('Transformed payload:', JSON.stringify(transformedPayload, null, 2));
    
    // Add appointment-specific metadata if not present
    const enhancedPayload = {
      ...transformedPayload,
      appointmentRequested: true,
      appointmentRequestDate: new Date().toISOString()
    };
    
    // Log the final enhanced payload for debugging
    console.log('Enhanced payload to send:', JSON.stringify(enhancedPayload, null, 2));
    
    // Construct the n8n webhook URL
    const n8nUrl = getExternalApiUrl('n8n', API_CONFIG.endpoints.n8nBookAppointment);
    
    // Forward the data to n8n webhook
    const response = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(enhancedPayload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to forward request to n8n:', errorText);
      return NextResponse.json(
        { error: 'Failed to process appointment request' },
        { status: 500 }
      );
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Appointment request processed successfully'
    });
  } catch (error) {
    console.error('Error in book-appointment API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
} 