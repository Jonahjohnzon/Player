import React from 'react'
import Image from 'next/image'

const Loading = () => {
  return (
    <div>
        <Image src="/logologo.png" alt="Logo" height={40} width={40}  className=' animate-bounce w-auto h-auto' loading="eager"/>
    </div>
  )
}

export default Loading