import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation for Favicon (replaces default Vercel logo)
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 13,
          background: 'linear-gradient(135deg, #B87B10 0%, #7A4E05 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontWeight: 900,
          borderRadius: 7,
          border: '1px solid rgba(255, 255, 255, 0.4)',
          letterSpacing: '-0.5px',
          fontFamily: 'sans-serif',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      >
        CSE
      </div>
    ),
    {
      ...size,
    }
  );
}
