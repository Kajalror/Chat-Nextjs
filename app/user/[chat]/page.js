"use client";

import ChatCard from "../../../components/chatcard";
import Input from "../../../components/input/page";
import { useState, useEffect, useRef,  useCallback } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import image from "../../../public/image.jpg";
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';


export default function ChatScreenPage(_conversationId) {

  const _extantion=["jpg", "jpeg", "png", "webp", 'mp4', 'mp3' ];

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
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [fileLoading, setFileLoading] = useState(false); 

  const messageRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event?.target?.files[0];
    console.log("Selected file ---:", file);    
    if (file) {
      setSelectedFile(file);
      console.log("Selected file:", file);
      // for preview image
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result); 
      reader.readAsDataURL(file);
    }
  };


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
      // socket?.emit("addUser", user?._USerID);
      socket?.on("getUsers", (users) => {
        console.log("activeUsers--", users);
      });
      socket?.on("getMessage", (data) => {
        console.log("data getMessage_:>>", data);
        setMessages((prev) => ({
          ...prev,
          messages: [
            ...prev?.messages,
            { user: data?.user, message: data?.message, isFile: data?.isFile },
          ],
        }));
      });
    }
  }, [socket, user]);

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
    if (isClient && conversationID && user) {
      checkConversation();
    }
}, [conversationID, isClient, user, router]);
  const fetchMessages =  useCallback( async(_conversationId, receiverDetails) => {
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
    console.log("variable-- ", alphabets);
    return alphabets?.test(message) && !containWord;
    
  };
  
  const sendMessage = async (messages) => {
    if (!validateMessage(message) || !message.trim() && !selectedFile) {
      console.error("Invalid message content  or no file selected");
      return;
    }
    
  let fileUrl = "";
  if (selectedFile) {
    setFileLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const res = await fetch(`http://localhost:7000/api/upload`, {
        method: "POST",
        body: formData,
      });
      const resData = await res.json();
      fileUrl = resData?.url;
      console.log("File uploaded successfully:", fileUrl);
    } catch (err) {
      console.error("Error uploading file:", err);
      setFileLoading(false);
      return;
    }
  }

  

    socket?.emit("sendMessage", {
      _conversationId: conversationID,
      userId: user?.id,
      // message: fileUrl ? fileUrl : message,
      message: fileUrl || message,
      // retailerId: receiverDetails?.id, 
      retailerId: receiverId,
      isFile: Boolean(selectedFile),
    });

    console.log(
      "sendMessages :>>",
      message,
      fileUrl,
      conversationID,
      user?.id,
      receiverId
    );
    
    if (!messages || !conversationID) {
      console.error("Invalid messages or conversationId");
      return;
    }

    const newMessage = {
      userId: user?.id,
      retailerId: receiverId,
      message: selectedFile ? fileUrl : message,
      _conversationId: conversationID,
      isFile: Boolean(selectedFile),
    };
    // console.log("--->>>>>>>>>>>", retailerId)
          // body: JSON.stringify({
          //   _conversationId: conversationID,
          //   userId: user?.id,
          //   // message: fileUrl ? fileUrl : message,
          //   message: fileUrl || message,
          //   retailerId: receiverDetails?.receiverId,
          //   isFile: !fileUrl,
          // }),
  

    try {
      const res = await fetch(`http://localhost:7000/api/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });
      const resData = await res.json();
      console.log("res from msg api ------ ", resData);
     
      setMessage("");
      setSelectedFile(null);
      setPreviewImage(null);
      setFileLoading(false);
      fetchMessages(conversationID, receiverDetails?.id);
      // alert("Message sent successfully!");
     
    } catch (err) {
      console.log("Error sending file:", err);
      setFileLoading(false); 
    }
  };

    // if (!isClient) {
    //   return null;
    // }
    // if (loading) {
    //   return (
    //     <div className="w-full flex justify-center mt-5">Chat Loading...</div>
    //   );
    // }

    if (!isClient || loading || messagesLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg font-bold">Loading...</p>
        </div>
      );
    }


  return (
    <>
      <div className="w-[99.9%] flex justify-center">
        <div className="w-[60%] bg-white h-screen flex flex-col items-center ">
          <div className="w-[100%] border border-b-grey-500 h-[100px]">
            <div className="flex flex-1 justify-between p-1 px-3 w-full">
              <div className="flex m-1 p-1 justify-between">
                <Image
                  src={image}
                  className="inline-block rounded-full border ring-2 ring-white w-[60px] h-[60px] rounded-full m-1"
                  alt="avatar2" width={70} height={70}
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
                  className={`message-bubble max-w-[50%] rounded-b-xl p-2 mb-3 border ${
                    msg?.id === user?.id
                      ? "bg-[#D5D9DC] ml-auto rounded-tl-xl"
                      : "bg-[#85A6C1] rounded-tr-xl"
                  }`}
                  ref={messageRef} >
                     {
                     _extantion.includes(msg.message.split('.').pop()) ? 
                        // _extantion.includes(msg.message.split('.').pop()) === 'mp4' ?
                        //    <video controls className="max-w-full h-auto">
                        //      <source src={`http://localhost:7000${msg.message}`} type="video/mp4" className=" max-w-full h-auto" />
                        //      Your browser does not support the video tag.
                        //    </video>
                        //        : 
                        <div>
                          <img src={`http://localhost:7000${msg.message}`} alt="sent file image" className="max-w-full h-auto" />  
                        </div>
                        
                        :                   
                          msg.message 
                      } 
                    {/* {
                      _extantion.includes(msg.message.split('.').pop()) === 'mp4' ?
                        <video controls className="max-w-full h-auto">
                          <source src={`http://localhost:7000${msg.message}`} type="video/mp4" className=" max-w-full h-auto" />
                          Your browser does not support the video tag.
                        </video>  :  <img src={`http://localhost:7000${msg.message}`} alt="sent file" className="max-w-full h-auto" />
                          msg.message 
                       }
                    */}
                </div>
              ))
            )}
          </div>
          <div>
            {previewImage && (
              <div className="preview-image-container p-3 w-[100%] max-w-full h-auto">
                <Image
                  src={previewImage}
                  alt="Selected File Preview"
                  width={170} 
                  height={170}
                  />
              </div>
            )}
             {fileLoading && (
              <div className="w-full flex justify-center mt-5">
                Uploading file, please wait...
              </div>  
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
             
             <input
              placeholder="select file"
              type="file"
              id="fileInput"
              className="hidden w-[60%] ml-3"
              onChange={(e) => handleFileChange(e)}
              />

            <button className=" ml-8 p-2 cursor-pointer bg-[#5F6587] text-white" 
              onClick={() => document.getElementById("fileInput").click()}> 
              <AddIcon /> 
            </button>
             
            <button
              className={` ml-8 p-2 cursor-pointer bg-[#5F6587] text-white ${
                 !message || !validateMessage(message) && "pointer-events-none"
              } `}
              onClick={() => sendMessage(messages)} >
              <SendIcon/>
            </button>
          </ChatCard>
        </div>
      </div>
    </>
  );
}
