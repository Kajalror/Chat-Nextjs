"use client";

import ChatCard from "@/components/chatcard";
import Input from "../../../components/input/page";
import { useState, useEffect, useRef,  useCallback } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";


export default function ChatScreenPage(_conversationId) {
  const Avatar =
    "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

  const [user, setUser] = useState(
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user: details"))
      : null
  );

  const router = useRouter();

  const conversationID = _conversationId.params.chat;

  const [receiverDetails, setReceiverDetails] = useState();
  // console.log(" setReceiverDetails--", receiverDetails);

  const parts = conversationID.split("-");

  const receiverId = parts[0];

  const _USerID = parts[1];

  const [messages, setMessages] = useState([]);
 
  const [message, setMessage] = useState("");

  const [socket, setSocket] = useState(null);

  const [isClient, setIsClient] = useState(false);

  const [loading, setLoading] = useState(true);

  const [messagesLoading, setMessagesLoading] = useState(true);

  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);
  }, []);

  useEffect(() => {
    setIsClient(true);
    const storedUser = localStorage.getItem("user: details");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      const newSocket = io("http://localhost:8080");
      setSocket(newSocket);
      return () => newSocket.close();
    }
  }, [isClient]);

  useEffect(() => {
    if (socket && user) {
      socket?.emit("addUser", user?.id);
      socket?.on("getUsers", (user) => {
        console.log("activeUsers--", user);
      });
      socket?.on("getMessage", (data) => {
        console.log("data getMessage_:>>", data);
        setMessages((prev) => ({
          ...prev,
          messages: [
            ...prev?.messages,
            { user: data?.user, message: data?.message },
          ],
        }));
      });
    }
  }, [socket, user]);

  const messageRef = useRef(null);

  useEffect(() => {
    messageRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const checkConversation = async () => {
      try {
        const res = await fetch(
          `http://localhost:7000/api/conversation/${conversationID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res?.ok) {
          const resData = await res.json();
          const { conversation, receiver } = resData;

          setReceiverDetails(receiver);
          fetchMessages(conversationID, receiver);
          setLoading(false);

        } else if (res.status === 404) {
          console.log("Conversation not found");
          setLoading(false);
          router.push(`/user`);
        } else {
          console.error("Error fetching conversation data:", res.statusText);
        }
      } catch (error) {
        console.error("Error checking conversation:", error);
      }
    };
    if (isClient) {
      checkConversation();
    }
  }, [conversationID, isClient, router]);


  

  const fetchMessages =  useCallback ( async(_conversationId, receiverDetails) => {

    setMessagesLoading(true);
    const res = await fetch(
      `http://localhost:7000/api/message/${_conversationId}?senderId=${user?.id}&&receiverId=${receiverDetails?.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const resData = await res.json();
    setMessages(resData);
    setMessagesLoading(false);
  }, [ user?.id]);


  const validateMessage = (message) => {
    const alphabets = /^[A-Za-z\s]*$/;
    const Words = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine" ];
    const containWord = Words.some(word => message.toLowerCase().includes(word));
    // console.log("variable-- ", alphabets);
    return alphabets?.test(message) && !containWord;
  };
  // console.log("alphabets--", validateMessage(message))

  const sendMessage = async (messages) => {

    if (!validateMessage(message) || !message.trim()) {
      console.error("Invalid message content");
      return;
    }

    socket?.emit("sendMessage", {
      _conversationId: conversationID,
      userId: user?.id,
      message,
      retailerId: receiverDetails?.id,
    });
    console.log(
      "sendMessages :>>",
      message,
      conversationID,
      user?.id,
      receiverDetails?.id
    );
    
    if (!messages || !conversationID) {
      console.error("Invalid messages or conversationId");
      return;
    }

    try {
      const res = await fetch(`http://localhost:7000/api/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _conversationId: conversationID,
          userId: user?.id,
          message,
          retailerId: receiverDetails?.receiverId,
        }),
      });
      const resData = await res.json();
      setMessage("");
      fetchMessages(conversationID, receiverDetails?.id);
     
    } catch (err) {
      console.log("Error sending file:", err);
    }
  };

    if (!isClient) {
      return null;
    }

    if (loading) {
      return (
        <div className="w-full flex justify-center mt-5">Chat Loading...</div>
      );
    }


  return (
    <>
      <div className="w-[99.9%] flex justify-center">
        <div className="w-[60%] bg-white h-screen flex flex-col items-center ">
          <div className="w-[100%] border border-b-grey-500 h-[100px]">
            <div className="flex flex-1 justify-between p-1 px-3 w-full">
              <div className="flex m-1 p-1 justify-between">
                <img
                  src={Avatar}
                  className="inline-block rounded-full border ring-2 ring-white w-[60px] h-[60px] rounded-full m-1"
                  alt="avatar2"
                />
                <div>
                  <div className="ml-2 mt-4">
                    <h3
                      className=" font-dark text-sm text-red-400"
                      style={{ fontSize: "15px" }}
                    >
                      {receiverDetails && (
                        <>
                          <span> {receiverDetails?.fullName} </span>
                          
                        </>
                      )}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="m-0 px-2">
                <button className="justify-content-center mt-6">icon</button>
              </div>
            </div>
          </div>
          <div
            style={{ height: "70vh" }}
            className="w-full overflow-y-scroll shadow-sm m-auto p-2">
            {messagesLoading ? (
              <div className="w-full flex justify-center mt-5">
                Loading messages...
              </div>
            ) : (
              Array.isArray(messages) &&
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message-bubble max-w-[50%] rounded-b-xl p-2 mb-3 ${
                    msg?.id === user?.id
                      ? "bg-[#D5D9DC] ml-auto rounded-tl-xl"
                      : "bg-[#85A6C1] rounded-tr-xl"
                  }`}
                  ref={messageRef} >
                  {msg.message}
                </div>
              ))
            )}
          </div>

          <ChatCard>
            <Input
              placeholder="Type a message..."
              className="w-[60%] ml-3"
              value={message}
              type="text"
              name="text"
              onChange={(e) => setMessage(e.target.value)}
              inputClassName=" p-2 border-0 shadow-md rounded-full bg-[#f9faff] focus:ring-0 focus:border-0 outline-none"
            />
            <button
              className={` ml-8 p-2 cursor-pointer bg-[#5F6587] text-white ${
                
                 !message || !validateMessage(message) && "pointer-events-none"
              } `}
              onClick={() => sendMessage(messages)} >
              send
            </button>
          </ChatCard>
        </div>
      </div>
    </>
  );
}
