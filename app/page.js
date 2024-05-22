

import { useClient } from 'next/client';
import { Routes, Route  } from 'react-router-dom';
import UserPage from "./user/page";
import Form from '@/components/form/page';


const ProtectedRoute = ({children, auth= false })=>{
  const Router = useClient();
  const isLoggedIn = localStorage.getItem('user:tokens')!== null  || false;
      console.log("isLoggedIn:>>>>", isLoggedIn );

  if(isLoggedIn && auth){
    console.log("authentication---signed_in");
    return Router.push("/users/sign_in" )
  }
  else if(isLoggedIn && ['/users/sign_in', '/users/sign_up']?.includes(window.location.pathname) ){
    console.log("user navigate : >> ");
    return Router.push("/user" )
  }
  return children;
}

export default function Home() {
  return (
   
        <Routes>
          <Route path='/user' element={
          <ProtectedRoute auth = { true }>
            <UserPage />
          </ProtectedRoute>
          } />
          <Route path='/users/sign_in' element={
            <ProtectedRoute>
              <Form isSignInPage={ true }/>
            </ProtectedRoute>
          } />
          <Route path='/users/sign_up' element={
              <ProtectedRoute>
            <Form isSignInPage={ false }/>
          </ProtectedRoute>
          } />
        </Routes>
  );
}
