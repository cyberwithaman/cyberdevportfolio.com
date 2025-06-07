import { NextRequest } from 'next/server';

export type RouteContext = {
  params: Promise<{
    [key: string]: string;
  }>;
};

export type RouteHandler = (
  request: NextRequest,
  context: RouteContext
) => Promise<Response>;

// Next.js specific types
declare module 'next' {
  interface RouteSegment {
    params: Promise<{
      [key: string]: string;
    }>;
  }
} 