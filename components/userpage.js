"use client";

import { useState, useEffect } from "react";
import Head from "./heading";
import Card from "./card";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UserPage() {
 
  const [user, setUser] = useState(
    typeof window !== "undefined"
      ? JSON.parse(localStorage?.getItem('user:details'))
      : null
  );


  console.log("user --- ", user);

 
  const [isClient, setIsClient] = useState(false);
  const _USerID = user?.id;

  const [users, setUsers] = useState([]);  

  const Router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const storedUser = localStorage?.getItem('user:details');
    if (storedUser) {
        try {
            const parsedUser = JSON?.parse(storedUser);
            if (typeof parsedUser === 'object' && parsedUser !== null) {
                setUser(parsedUser);
              } else {
                throw new Error('Parsed user is not an object');
              }
          } catch (error) {
            console.error("Error parsing stored user:", error);
            localStorage.removeItem("user:details");
            
            Router.replace("/users/sign_in");
          }
    }
    else {
      Router.replace("/users/sign_in");
    }
  }, [Router]);


  useEffect(() => {
    if(user){
      const fetchUsers = async () => {
        const res = await fetch(`http://localhost:7000/api/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const resData = await res.json();
        setUsers(resData);
      };
      fetchUsers();
    }
  }, []);

  const Handle = async ( _retailerId, _USerID) => {
    try {
      const loggedInUser = JSON.parse(localStorage?.getItem("user:details"));
      // const loggedInUser = JSON.parse(sessionStorage?.getItem("user:details"));
      console.log("userDetails>>: ", loggedInUser);
   
      // ${loggedInUser?.id}
      const response = await fetch(`http://localhost:7000/api/conversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          retailerId: _retailerId,
          userId: _USerID,
        }),
      })
      .then(resp => resp.json())
      .then((responseData ) => {

        console.log("API response : ", responseData?.conversationId );

        Router.push(`/user/${responseData?.conversationId}`);

      }).catch((err) => {

        console.log("API err: ", err);
      });;


      
      // if (_conversationId === _conversationId) {
      //   Router.push(`/user/${_conversationId}`);
      // }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!isClient) {
    return null;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    try{
      localStorage.removeItem("user:tokens");
      localStorage.removeItem("user:details");
      console.log("User logged out");
      alert("LogOut!")
      Router.replace("/users/sign_in");
      // Router.push("/users/sign_in");
    }
    catch(error){
      console.error("Logout failed:", error);
    }

  };
  

  return (
    <>
      <Card>
        <Head>
          <div className=" row flex flex-1 p-2 w-full justify-between">
            <div className="flex mx-2 my-1">
              <div className="flex m-1">
                <Image
                  src="/avatar.jpg"
                  className="inline-block rounded-full ring-2 ring-white w-[55px] h-[55px] "
                  alt="avatar2" width={60} height={50}
                  style={{ borderRadius: "50%" }}
                />
              </div>
              <div className="mx-2 pt-2">
                <h2 className="m-1"> {user?.fullName} </h2>
                <p className="m-1" style={{ fontSize: "14px" }}>
                  {user?.email}
                </p>
              </div>

            </div>
            <div className="pt-5 p-2 ">
              <button type="button" className="bg-purple-1 p-1" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </Head>
        <div className="flex flex-col w-[95%]  pl-5 ">
          <div className="w-[100%]">
            {users.map((otherUser, index) => {
             
              return (
                <div className=" w-[100%] " key={index}>
                  <div
                    className=" mt-3 flex border-b-2 cursor-pointer"
                    onClick={() =>
                      Handle( otherUser?.receiverId, _USerID)
                    }
                  >
                    <div className="flex m-4 w-[100px] ">
                      <Image
                        src="/avatar.jpg"
                        className="inline-block rounded-full ring-2 ring-white w-[50px] h-[50px] rounded-1/2"
                        alt="avatar2" width={50} height={50}
                      />
                    </div>
                    <div className="flex flex-col w-[60%] ">
                      <h3> {otherUser.fullName} </h3>

                      <p style={{ fontSize: "12px", color: "grey" }}>
                        {/* {_conversationId} */}
                        {otherUser?.receiverId}
                      </p>
                      <p style={{ fontSize: "12px", color: "grey" }}>
                       {_USerID}
                      </p>

                      <p style={{ fontSize: "12px", color: "grey" }}>
                        {otherUser["email"]}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </>
  );
}


