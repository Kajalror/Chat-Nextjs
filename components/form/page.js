"use client";

import React, { useState, useEffect } from "react";
import Input from "../input/page";
import Button from "../btn/page";
import { useRouter } from "next/navigation";

const Form = ({ isSignInPage = true }) => {
    const [data, setData] = useState({
        ...(isSignInPage ? {} : { fullName: '' }),
        email: '',
        password: ''
      });

      const [user, setUser] = useState(null);
      console.log("user form page-:", user);
     

      useEffect(() => {
        const storedUserDetails = localStorage.getItem("user:details");
        if (storedUserDetails) {
          setUser(JSON.parse(storedUserDetails));
        }
      }, []);

  const router = useRouter();

  useEffect(() => {
    console.log("Data after update:", data);
  }, [data]);



  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("data: handleSubmit-  ", data);
  
    if (!data.email || !data.password || (!isSignInPage && !data.fullName)) {
      alert("Please fill all required fields");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:7000/api/${isSignInPage ? "login" : "register"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        }
      );
       
        console.log("login response---", res);
      

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        alert(`Error: ${res.status} - ${errorText}`);
        return;
      }
      const resData = await res.json();

      // console.log("token 2", resData?.user?.tokens);
     

      if (resData?.user && resData?.user?.tokens) {
        // localStorage.setItem("user", resData?.user?.tokens);
        localStorage.setItem('user:tokens', resData?.user?.tokens);
        localStorage.setItem('user:details', JSON.stringify(resData?.user));
       
        console.log("New user logged in:", resData?.user);

        setUser(resData?.user);
        setTimeout(() => {
          router?.push("/user");
        }, 1000);

        // router?.push("/user");
      } else {
        alert("Unexpected response format!");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("An error occurred while processing your request.");
    }
  };



  return (
    <div className="bg-[#f9faff] h-screen flex justify-center items-center">
      <div className=" bg-white w-[33%] h-[89%] shadow-lg rounded-lg flex flex-col justify-center items-center">
        <div className=" text-4xl font-extrabold">
          Welcome {isSignInPage ? "Back" : ""}
        </div>
        <div className="text-xl font-light mb-8">
          {isSignInPage
            ? "Sign in to get explored"
            : "Sign up now to get started"}
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center"
        >
          {!isSignInPage && (
            <Input
              label="Full Name"
              name="Name"
              placeholder="Enter your name"
              className="mb-2 w-[70%]"
              value={data?.fullName}
              onChange={(e) => setData({ ...data, fullName: e.target.value })}
            />
          )}
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="Enter your email"
            className="mb-2 w-[70%]"
            value={data?.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <Input
            label="password"
            name="Password"
            type="password"
            placeholder=" Enter your password"
            className="mb-5 w-[70%]"
            value={data?.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <Button
            label={isSignInPage ? "Sign In" : "Sign Up"}
            type="submit"
            className="w-[70%] mb-2"
          />
        </form>
        <div className="w-1/2 text-sm font-medium">
          {isSignInPage
            ? "Didn't have an account? "
            : "Already have an account?"}
          <span
            className="text-primary cursor-pointer underline"
            onClick={() => {
              router.push(`/users/${isSignInPage ? "sign_up" : "sign_in"}`);
            }}
          >
            {isSignInPage ? "sign up " : "sign in "}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Form;
