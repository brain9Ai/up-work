// Static export version - API routes don't work in static exports
// This file is only a placeholder

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

export async function POST() {
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