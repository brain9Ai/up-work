import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import logger from '../../utils/logger';

export const runtime = 'edge';

// Define the size of the image
const width = 1200;
const height = 630;

export async function GET(req: NextRequest) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'brain9ai';
    const subtitle = searchParams.get('subtitle') || 'Intelligent Agent Solutions';
    const type = searchParams.get('type') || 'default';

    // Generate the image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom right, #0F172A, #1E293B)',
            position: 'relative',
          }}
        >
          {/* Grid pattern overlay */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(#3B82F6 1px, transparent 1px)',
              backgroundSize: '30px 30px',
              opacity: 0.1,
            }}
          />
          
          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              maxWidth: '90%',
              textAlign: 'center',
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '40px',
              }}
            >
              <span
                style={{
                  fontSize: 60,
                  fontWeight: 'bold',
                  background: 'linear-gradient(to right, #60A5FA, #3B82F6)',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  marginRight: '10px',
                }}
              >
                brain9
              </span>
              <span
                style={{
                  fontSize: 60,
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                ai
              </span>
            </div>
            
            {/* Title */}
            <h1
              style={{
                fontSize: 70,
                fontWeight: 'bold',
                color: 'white',
                lineHeight: 1.2,
                margin: 0,
                marginBottom: '20px',
                textShadow: '0px 4px 8px rgba(0,0,0,0.2)',
              }}
            >
              {title}
            </h1>
            
            {/* Subtitle */}
            <h2
              style={{
                fontSize: 40,
                fontWeight: 'normal',
                color: '#CBD5E1',
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              {subtitle}
            </h2>
          </div>
          
          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: 24,
                color: '#CBD5E1',
              }}
            >
              brain9ai.com
            </span>
          </div>
        </div>
      ),
      {
        width,
        height,
      }
    );
  } catch (error) {
    logger.error('Failed to generate OpenGraph image');
    return new Response('Failed to generate OpenGraph image', { status: 500 });
  }
} 