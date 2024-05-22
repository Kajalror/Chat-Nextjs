import React from 'react'


const protectedRoute = () => {

    const ProtectedRoute = ({children, auth=false })=>{
        const isLoggedIn = localStorage.getItem('user:tokens')  || false;
            console.log("isLoggedIn:>>>>", isLoggedIn );
      
        if(isLoggedIn && auth){
          console.log("authentication---signed_in");
          return <Navigate to={`/users/sign_in`} />
        }
        else if(isLoggedIn && ['/users/sign_in', '/users/sign_up']?.includes(window.location.pathname) ){
          console.log("dashboard navigate : >> ");
          return <Navigate to={`/`} />
        }
        return children;
       
      }
  return (
    <>

    </>
  )
}

export default protectedRoute
