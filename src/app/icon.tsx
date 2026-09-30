import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="32" height="32">
          <g fill="#EAE6DF">
            <rect x="156" y="96" width="64" height="320" />
            <path d="M 220 96 h 32 a 104 104 0 0 1 0 208 h -32 v -64 h 32 a 40 40 0 0 0 0 -80 h -32 z" />
            <rect x="220" y="352" width="136" height="64" />
          </g>
        </svg>
      </div>
    ),
    { ...size }
  )
}
