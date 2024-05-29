import { useEffect } from 'react';
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children, auth = false }) => {
  const router = useRouter();
  
  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('user:tokens') !== null;
console.log("isLoggedIn--", isLoggedIn);
  useEffect(() => {
    if (!isLoggedIn && auth) {
      router.push('/users/sign_in');
    } 
    else if (isLoggedIn && ['/users/sign_in', '/users/sign_up'].includes(router.pathname)) {
      router.push('/user');
    }
  }, [isLoggedIn, auth, router]);

  if (!isLoggedIn && auth) {
    console.log("Authent error");
    return null;
  }

  return children;
};

export default ProtectedRoute;
