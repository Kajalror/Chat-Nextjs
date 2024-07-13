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
import MenuIcon from '@mui/icons-material/Menu';



export default function ChatScreenPage(_conversationId) {

  const _extantion = [ "jpg", "jpeg", "png", "webp", 'mp4', 'mp3' ];

  const [user, setUser] = useState(
    typeof window !== "undefined"
      ? JSON.parse(localStorage?.getItem('user:details'))
      : null
  );


  // console.log("user storage local--- ", user);
  // console.log("user storage id find--", user?.id);
 
 
  const messageRef = useRef(null);

  const router = useRouter();

  const socket = useRef(null);


  const conversationID = _conversationId.params.chat;

  // const conversationID = router.query;

  const [receiverDetails, setReceiverDetails] = useState();

  // console.log(" setReceiverDetails--", receiverDetails);

  const parts = conversationID.split("-");
  const receiverId = parts[0];
  const _USerID = parts[1];


  // console.log(" Receiver--", receiverId);
  // console.log("_USerID", _USerID);
  // const userId = _USerID;
  // console.log("userID userId-->>>:", userId);

  // const retailerId = receiverId;
  // console.log("Reciver retailerId   -->>: ", retailerId);


  const [messages, setMessages] = useState([]); 
  console.log(" setMessages from state--", messages);

  const [message, setMessage] = useState(" ");
  console.log(" Message--", message);

  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
 
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [fileLoading, setFileLoading] = useState(false); 
  

  // const [offset, setOffset] = useState(0);
  // console.log("setOffset", offset);

  // const [limit, setLimit] = useState(10);
  // console.log("setLimit", limit);

  // const [MoreMessages, setMoreMessages] = useState(true); 
 


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
    const storedUser = localStorage?.getItem('user:details');
    if (storedUser) {
      const parsedUser = JSON?.parse(storedUser);
      if (typeof parsedUser === 'object' && parsedUser !== null) {
        setUser(parsedUser);
      } else {
        throw new Error('Parsed user is not an object');
      }
    }
   
  }, []);
  

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
          // fetchMessages(conversationID, receiver, offset, limit);
          // fetchMessages(conversationID, resData.receiver, offset, limit);

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
// }, [conversationID, isClient, user, router, offset, limit]);






  
const fetchMessages =  useCallback( async(_conversationId, receiverDetails ) => {
    try{
         // &offset=${offset}&limit=${limit}
      const res = await fetch(
        `http://localhost:7000/api/message/${_conversationId}?senderId=${user?.id}&&receiverId=${receiverDetails?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch messages: ${res.status} ${res.statusText}`);
      }
      const resData = await res.json();
      console.log("res data-->>> ", resData);
      setMessages(resData.slice(Math.max(resData.length - 10, 0)));
      // if (resData.length < limit) {
      //   setMoreMessages(false); 
      // }
    }catch(e){
      console.error("Error fetching messages:", e);
    }
  }, [ user?.id]);

   
// const loadMoreMessages = () => {
//   if (MoreMessages) { 
//     console.log("Loading more messages...");
//     setOffset((prevOffset) => prevOffset + limit);
//   } };

// useEffect(() => {
//   if (offset > 0) {
//     fetchMessages(conversationID, { id: receiverId }, offset, limit); }
// }, [offset, conversationID, receiverId, fetchMessages]);
 


  const validateMessage = (message) => {
    const alphabets = /^[A-Za-z\s]*$/;
    const Words = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine" ];
    const containWord = Words.some(word => message.toLowerCase().includes(word));
    console.log("variable-- ", alphabets);
    return alphabets?.test(message) && !containWord;
  };


 useEffect(() => { 
    socket.current = io("http://localhost:8011"); 
    socket.current.on("connect", () => {
      console.log("Connected to socket server");
    });
    socket.current.on("messages", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    return () => {
      socket.current.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

 
  const sendMessage = async (messages) => { 
    console.log("Send Message function called"); 
    setMessage("");
    console.log("Message state after clear:", message);
    setSelectedFile(null);
    setPreviewImage(null);
    setFileLoading(false);
    console.log("loading state after clear:");

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
      console.log("result---", resData)
      fileUrl = resData?.url;
      console.log("File uploaded successfully:", fileUrl);
      setFileLoading(false);
    } catch (err) {
      console.error("Error uploading file:", err);
      // setFileLoading(false);
      return;
    }
  }

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
      createdAt: new Date().toISOString(),
    };

    socket.current.emit("message", newMessage);

    // console.log("Message sent>>:",  newMessage);

    try {
      const res = await fetch(`http://localhost:7000/api/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });

      if(!res.ok){
        console.log("failed to send message", res.status, res.statusText);
      }
      const resData = await res.json();
      console.log("res from msg api ------ ", resData);
      
      // setMessage("");
      // setSelectedFile(null);
      // setPreviewImage(null);
      // setFileLoading(false);
      setMessages((prevMessages) => [ ...prevMessages ]);
     
      
    } catch (err) {
      console.log("Error sending file:", err);
      setFileLoading(false); 
    }
  };


    if (!isClient || loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg font-bold">Loading...</p>
        </div>
      );
    }


  return (
    <>
      <div className="w-[99.7%] m-0 p-0 flex justify-center border row">
        <div className="w-[60%] bg-white h-screen flex flex-col items-center col-lg-8 col-md-10 col-sm-12 col-12 border">
            <div className=" w-[100%] border border-b-grey-800 flex flex-1 justify-between p-1 px-3 w-full">
              <div className=" m-1 p-1 flex justify-between">
                <div> 
                  <Image
                    src={image}
                    className="inline-block rounded-full border ring-2 ring-white w-[60px] h-[60px] rounded-full m-1"
                    alt="avatar2" width={70} height={70}
                    />
                </div>
                <div className="mt-3 ml-2">
                  <h3 className=" font-dark text-sm text-red-400" style={{ fontSize: "15px" }} >
                      {receiverDetails && (
                        <>
                          <span> {receiverDetails?.fullName} </span>
                        </>
                      )}
                    </h3>
                    <p>{conversationID}</p> 
                </div>
              </div>
              <div className="m-0 px-2 ">
                <button className="justify-content-center mt-6">
                  <MenuIcon  />
                </button>
              </div>
            </div>
          
          <div
            style={{ height: "70vh" }}
            className="w-full overflow-y-scroll shadow-sm m-auto p-2">

              <div className="flex justify-center">
                {/* {
                  MoreMessages && (
                    <button 
                      className="mt-4 p-2 bg-blue-500 text-white rounded"
                      onClick={loadMoreMessages} >
                      Load More
                    </button>
                   )
                } */}

              </div>
                


            {
              Array.isArray(messages) &&
              messages.map((msg, index) => {
                const isCurrentUserMessage = msg?.userId === user?.id;
                // console.log("Message User ID:", user?.id);
                // console.log("Current User ID:", msg?.userId);
                return(
                <div
                  key={index}
                  className={`message-bubble max-w-[50%] rounded-b-xl p-2 mb-3 border ${
                    isCurrentUserMessage ? "bg-[#D5D9DC] ml-auto rounded-tl-xl": "bg-[#85A6C1] rounded-tr-xl"
                      
                  }`}
                  // ref={index === messages.length - 1 ? messageRef : null}
                  ref={messageRef}
                   >
                     {
                     _extantion.includes(msg.message.split('.').pop()) ? 
                       
                        <div>
                          <img src={`http://localhost:7000${msg.message}`} alt="sent file image" className="max-w-full h-auto" />  
                        </div>
                        :                   
                          msg.message 
                      } 
                   
                </div>
                )
            } 

            )
            
            }
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
              onChange={(e) => setMessage(e?.target?.value)}
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


 {/* 

                    _extantion.includes(msg.message.split('.').pop()) === 'mp4' ?
                           <video controls className="max-w-full h-auto">
                             <source src={`https://localhost:7000${msg.message}`} type="video/mp4" className=" max-w-full h-auto" />
                             Your browser does not support the video tag.
                           </video>
                              
  
  
  
  
  
  {
            _extantion.includes(msg.message.split('.').pop()) === 'mp4' ?
              <video controls className="max-w-full h-auto">
                <source src={`http://localhost:7000${msg.message}`} type="video/mp4" className=" max-w-full h-auto" />
                Your browser does not support the video tag.
              </video>  :  <img src={`http://localhost:7000${msg.message}`} alt="sent file" className="max-w-full h-auto" />
                msg.message 
             }



         */}