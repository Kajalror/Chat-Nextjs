
import React from 'react'
import Link from 'next/link'

const page = () => {
  return (
    <>
     {/* bg-[#dfe6ed]  */}
    <div className='  w-full h-[99vh] flex justify-center align-center text-center ' style={{ backgroundImage: "url('/Wallpaper.jfif')", backgroundSize: 'cover', backgroundPosition: 'center', height:'100vh'}}>
        <div className=' flex flex-col justify-center  w-[50%] h-[50vh] p-3 pt-4 ' style={{fontSize:"35px", marginTop:'7%', fontWeight: 'bold', fontStyle: 'italic', color:'#ab306f' }}> 
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
