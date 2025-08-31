import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import {ReactNode} from 'react'
const Rootlayout = ({children}: {children: ReactNode}) => {
  return (
    <div className='root-layout'>
      <nav>
        <Link href="/" className='flex items-center gap-2'>
        <Image src="/vantage.png" alt="VantageAI" width={38} height={32}/>
      <h2 className='text-primary-100'>VantageAI</h2>
      </Link>
      </nav>
      {children}
    </div>
  )
}

export default Rootlayout
