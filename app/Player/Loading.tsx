import React from 'react'
import Image from 'next/image'

const Loading = () => {
  return (
    <div>
        <Image src="/logologo.png" alt="Logo" height={80} width={80}  className=' animate-bounce' loading="eager"/>
    </div>
  )
}

export default Loading