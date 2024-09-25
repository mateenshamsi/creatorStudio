// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required
import { Manrope } from 'next/font/google';
import { cn } from '@/lib/utils';
import '../../app/globals.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next'

const fontHeading = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
});

const fontBody = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: "Creator Studio",
  description: "From Inspiration to Creation, We’ve Got You Covered",
};
interface ChatLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: ChatLayoutProps) {
  return (
    <html lang="en">
      <body 
        className={cn(
          'antialiased',
          fontHeading.variable,
          fontBody.variable
        )}
      >
       
        {children}
      </body>
    </html>
  );
}
