import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'experimental-edge',
};

export default function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // ?title=<title>
    const hasTitle = searchParams.has('title');
    const title = hasTitle ? searchParams.get('title')?.slice(0, 100) : '';

    return new ImageResponse(<Component title={title} />, {
      width: 1200,
      height: 630,
    });
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}

const Component = ({ title }: { title: string }) => {
  return (
    <div
      style={{
        display: 'flex',
        width: '1200px',
        height: '630px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '2px',
            backgroundColor: '#199861',
            transform: 'translate(-50%, 0%) rotate(135deg)',
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '2px',
            backgroundColor: '#199861',
            transform: 'translate(50%, 0) rotate(135deg)',
          }}
        />
      </div>
      <div
        style={{
          margin: '0 auto',
          width: '70%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <span
          style={{
            fontWeight: '700',
            fontSize: `${96 / Math.max(title.length / 19, 1)}px`,
          }}
        >
          {title}
        </span>
        <span style={{ fontWeight: '500', fontSize: '48px' }}>
          {"uzimaru's blog"}
        </span>
      </div>
    </div>
  );
};