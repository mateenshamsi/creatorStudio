'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  SignUp,
  SignUpButton
} from '@clerk/nextjs'
import HeaderLogo from '@/Icons/HeaderLogo'


const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-20 backdrop-blur-md border-b border-blue-500 shadow-lg">
    <nav className="container mx-auto px-6 py-3">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-white text-2xl font-bold">
          Creator Studio
        </Link>
        <ul className="flex space-x-6">
          <li><Link href="/" className="text-white hover:text-blue-400 transition-colors">Home</Link></li>
          <li><Link href="/about" className="text-white hover:text-blue-400 transition-colors">About</Link></li>
          <li><Link href="/services" className="text-white hover:text-blue-400 transition-colors">Services</Link></li>
          <li><Link href="/contact" className="text-white hover:text-blue-400 transition-colors">Contact</Link></li>

          {/* Conditionally show Sign In or Sign Out */}
          <SignedIn>
            {/* Show User profile and sign-out button */}
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            {/* Show Sign In button */}
            <SignInButton>
              <button className="text-white hover:text-blue-400 transition-colors">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton >
              <button className="text-white hover:text-blue-400 transition-colors">
                Sign Up
              </button>
            </SignUpButton>
 
          </SignedOut>
        </ul>
      </div>
    </nav>
  </header>
)

const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-black opacity-50"></div>
    <div
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='0' x2='0' y1='0' y2='1'%3E%3Cstop offset='0' stop-color='%23080E2C'/%3E%3Cstop offset='1' stop-color='%23000B38'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpattern id='b' width='32' height='32' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='16' cy='16' r='14' fill='%23000000' fill-opacity='0.4'/%3E%3C/pattern%3E%3Crect width='100%25' height='100%25' fill='url(%23a)'/%3E%3Crect width='100%25' height='100%25' fill='url(%23b)' fill-opacity='0.4'/%3E%3C/svg%3E")`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
      }}
    ></div>
    <svg className="absolute inset-0 w-full h-full">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.00001" numOctaves="5" />
        <feDisplacementMap in="SourceGraphic" scale="100" />
      </filter>
      <rect width="100%" height="100%" opacity="0.1" />
    </svg>
  </div>
)

export default function EnhancedHeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-gray-900">
      <AnimatedBackground />
      <Header />
      <div className="container relative z-10 flex flex-col items-center justify-center min-h-screen py-32 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <HeaderLogo height={43 * 2.5} width={10 * 2.5} className="container bg-center flex"></HeaderLogo>
            {/* main logo with name  */}
          </motion.div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            Unleash Your Creativity
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-300 md:text-2xl">
            From Inspiration to Creation, We've Got You Covered
          </p>
          <motion.div
            className="flex flex-wrap justify-center gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Button asChild variant="outline" size="lg" className="text-lg border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
              <Link href="/removebg">
                Try ImageStudio
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
              <Link href="/chatStudio">
                Try ChatStudio
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
              <Link href="https://clearcut.streamlit.app/">
                Try SoundStudio
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}