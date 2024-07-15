import BrushIcon from '@/Icons/BrushIcon'
import Link from 'next/link'
import React from 'react'

export default function Header() {
  return (
   <header className="px-4 lg:px-6 flex items-center"> 
        <Link href="#" className='flex items-center justify-center' > 
            <BrushIcon width={12} height={12} />
        </Link> 
  </header>
  )
}
