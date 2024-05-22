
import React from 'react'
import Link from 'next/link'

const page = () => {
  return (
    <>
    <div className=' border w-full h-[99vh] bg-[#dfe6ed] flex justify-center align-center text-center '>
        <div className='border flex flex-col justify-center border w-[50%] h-[40vh] p-3  pt-4 mt-5 '  style={{fontSize:"25px"}}> 
           <h1 className='p-5'> Welcome To ChatApp </h1>
          <div className='p-3'>
            <Link href="/users/sign_in"> <button className='bg-[#2380d9] p-2 text-red-800'>Login chat </button> </Link>
          </div>
          <div className='p-3'>
            <Link href="/users/sign_up"> <button className='bg-[#2380d9] p-2 text-red-800'>  Register </button> </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default page
