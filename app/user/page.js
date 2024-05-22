"use client";

import { useState, useEffect } from "react";
import Card from "../../components/card";
import Head from "../../components/heading";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const Avatar =
    "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

  const [user, setUser] = useState(
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user: details"))
      : null
  );

  const [isClient, setIsClient] = useState(false);
  const _USerID = user?.id;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setIsClient(true);
    const storedUser = localStorage.getItem("user: details");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const Router = useRouter();

  useEffect(() => {
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
  }, []);

  const Handle = async (_conversationId, _retailerId, _USerID) => {
    try {
      if (!_conversationId) {
        console.log("--handle conversation error --- ");
        return;
      }
      const response = await fetch("http://localhost:7000/api/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          retailerId: _retailerId,
          userId: _USerID,
          _conversationId: _conversationId,
        }),
      });
      console.log("API response status: ", response.status);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      if (_conversationId === _conversationId) {
        Router.push(`/user/${_conversationId}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!isClient) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("user:tokens");
    localStorage.removeItem("user:details");
    Router.push("/users/sign_in");
    alert("LogOut!")
  };

  return (
    <>
      <Card>
        <Head>
          <div className=" flex flex-1 p-2 w-full justify-between">
            <div className="flex mx-2 my-1">
              <div className="flex m-1">
                <img
                  src={Avatar}
                  className="inline-block rounded-full ring-2 ring-white w-[55px] h-[55px]"
                  alt="avatar2"
                  style={{ border: "1px solid black", borderRadius: "50%" }}
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
            {users.map((user, index) => {
              let _conversationId = user?.receiverId + "-" + _USerID;

              return (
                <div className=" w-[100%] " key={index}>
                  <div
                    className=" mt-3 flex border-b-2 cursor-pointer"
                    onClick={() =>
                      Handle(_conversationId, user?.receiverId, _USerID)
                    }
                  >
                    <div className="flex m-4 w-[100px] ">
                      <img
                        src={Avatar}
                        className="inline-block rounded-full ring-2 ring-white w-[50px] h-[50px] rounded-1/2"
                        alt="avatar2"
                      />
                    </div>
                    <div className="flex flex-col w-[60%] ">
                      <h3> {user.fullName} </h3>

                      <p style={{ fontSize: "12px", color: "grey" }}>
                        {_conversationId}
                      </p>
                      <p style={{ fontSize: "12px", color: "grey" }}>
                        {user["email"]}
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


