import BrushIcon from '@/Icons/BrushIcon'
import Link from 'next/link'
import React from 'react'

export default function Header() {
  return (
    <header className="px-4  mt-4 lg:px-6 h-14 flex items-center justify-center">
    <Link href="/" className="flex items-center justify-center" prefetch={false}>
      <BrushIcon  />
      <span className="sr-only">Creator Studio</span>
    </Link>
     <nav className='ml-auto flex gap-4 '>
     <Link href="#" className="text-sm font-medium hover:underline " prefetch={false}>
          Features
        </Link>
        <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
          Pricing
        </Link>
        <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
          About
        </Link>
        <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
          Contact
        </Link>
     </nav>
  </header>
  )
}
