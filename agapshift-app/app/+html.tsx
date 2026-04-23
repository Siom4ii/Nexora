import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * This file is web-only and used to configure the root HTML for every page in the web build.
 * It's used to add global CSS, meta tags, and more.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* 
          Disable body scrolling on web to make it feel more like a native app.
          ResponsiveContainer and ScrollViews will handle scrolling.
        */}
        <ScrollViewStyleReset />

        {/* Fancy Modern Scrollbar Styling */}
        <style dangerouslySetInnerHTML={{ __html: responsiveScrollbarStyles }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveScrollbarStyles = `
  /* Modern Scrollbar for WebKit browsers */
  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    border: 3px solid transparent;
    background-clip: content-box;
    transition: background 0.2s ease;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
    background-clip: content-box;
  }

  /* Dark Mode Adjustments - Using a more "glass" effect */
  @media (prefers-color-scheme: dark) {
    ::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      background-clip: content-box;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.25);
      background-clip: content-box;
    }
  }

  /* Smooth scrolling for the whole page */
  html {
    scroll-behavior: smooth;
  }

  /* General web polish */
  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow: hidden; 
  }

  #root {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
`;
