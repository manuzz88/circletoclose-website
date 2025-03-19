import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const width = searchParams.get('width') || '800';
  const height = searchParams.get('height') || '600';
  const text = searchParams.get('text') || '';
  const bg = searchParams.get('bg') || 'gradient';
  
  // Crea un SVG più elegante per eventi di lusso
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
        </linearGradient>
        <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
        </filter>
      </defs>
      
      <!-- Sfondo principale -->
      <rect width="${width}" height="${height}" fill="${bg === 'gradient' ? 'url(#grad)' : bg}" />
      
      <!-- Elementi decorativi -->
      <circle cx="${parseInt(width) * 0.8}" cy="${parseInt(height) * 0.2}" r="${Math.min(parseInt(width), parseInt(height)) * 0.1}" fill="#FFD700" opacity="0.3" filter="url(#blur)" />
      <circle cx="${parseInt(width) * 0.2}" cy="${parseInt(height) * 0.8}" r="${Math.min(parseInt(width), parseInt(height)) * 0.1}" fill="#FFD700" opacity="0.3" filter="url(#blur)" />
      
      <!-- Bordo elegante -->
      <rect x="10" y="10" width="${parseInt(width) - 20}" height="${parseInt(height) - 20}" stroke="#FFD700" stroke-width="1" fill="none" opacity="0.5" />
      
      ${text ? `<!-- Testo principale -->
      <text x="50%" y="50%" font-family="Georgia, serif" font-size="${Math.min(parseInt(width), parseInt(height)) * 0.05}" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
      
      <!-- Decorazione sotto il testo -->
      <line x1="${parseInt(width) * 0.3}" y1="${parseInt(height) * 0.6}" x2="${parseInt(width) * 0.7}" y2="${parseInt(height) * 0.6}" stroke="#FFD700" stroke-width="1" opacity="0.7" />` : ''}
    </svg>
  `;
  
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
}
