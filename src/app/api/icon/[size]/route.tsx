import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ size: string }> }) {
  const { size: paramSize } = await params;
  const size = parseInt(paramSize) || 192;
  
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#111111',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={size} height={size}>
          <g fill="#EAE6DF">
            <rect x="156" y="96" width="64" height="320" />
            <path d="M 220 96 h 32 a 104 104 0 0 1 0 208 h -32 v -64 h 32 a 40 40 0 0 0 0 -80 h -32 z" />
            <rect x="220" y="352" width="136" height="64" />
          </g>
        </svg>
      </div>
    ),
    { width: size, height: size }
  );
}
