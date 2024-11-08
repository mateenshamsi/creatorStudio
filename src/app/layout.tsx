// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required
import { Manrope } from 'next/font/google';
import Head from './head';
import { cn } from '../libs/utils';
import './globals.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next'
import {ClerkProvider} from '@clerk/nextjs'
import Header from '@/components/Header';
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
  description: "From Inspiration to Creation, We've Got You Covered",
};
interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body 
        className={cn(
          'antialiased',
          fontHeading.variable,
          fontBody.variable
        )}
      >
        <ClerkProvider signUpUrl='/sign-up' signInUrl='/sign-in' signInFallbackRedirectUrl={null}> 
        {/* <Header/> */}
        {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
