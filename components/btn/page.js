import React from 'react'

const Button = ({
    label="Button",
    type="button",
    className="",
    disabled= false,
}) => {
  return (  
   
    <button type={type} 
        className={` bg-[#4779A1] hover:bg-[#ACC1D2] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  w-[70%] px-5 py-2.5 text-center ${className}`}
         disabled={disabled}>
        {label}
    </button>    
   
  )
}

export default Button;
