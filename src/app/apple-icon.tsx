import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 72,
          background: 'linear-gradient(135deg, #B87B10 0%, #7A4E05 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontWeight: 900,
          borderRadius: 36,
          border: '4px solid rgba(255, 255, 255, 0.4)',
          letterSpacing: '-2px',
          fontFamily: 'sans-serif',
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
