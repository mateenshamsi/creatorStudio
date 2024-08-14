import Link from 'next/link'
import React from 'react'

function RemoveBg() {
  return (
    <div className='mt-4 flex items-center justify-center '> 
    <Link href="/removeBg"><button className="p-4">Remove Bg</button></Link>
    </div>
   )
}

export default RemoveBg
