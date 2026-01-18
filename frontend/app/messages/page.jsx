"use client";

import { PageMain } from "../components/pageMain.jsx";
import { useState, useEffect } from "react";
import axiosClient from "../axiosClient.js";
import { useAuth } from "../components/AuthProvider.jsx";


async function getContacts(accessToken){
  return await axiosClient("api/contact", null, accessToken, "GET")
}

export default function MessagesPage() {
  const [currentChat, setCurrentChat] = useState({ name: "", lastContact: "", messages: [] });
  const { isLoggedIn, accessToken, userData } = useAuth();
  const [messages, setMessages] = useState([])

  
  useEffect(() => {

    const ws = new WebSocket("ws://localhost:5150/ws?token=" + accessToken)
    ws.onopen = () => {
      console.log("web socket is open")
    }

  }, [accessToken]);

  useEffect(() => {
    console.log(accessToken)
    if (!accessToken) return;

    async function loadContacts() {
      const res = await getContacts(accessToken);
      setMessages(res || [])
      console.log("messages")
      console.log(res)
    }

    loadContacts()


  }, [accessToken]);


  return (
    <PageMain>
      <h1 className="text-3xl font-bold mb-4">Messages</h1>
      <hr className="mb-6 border-zinc-900" />

      <div className="flex h-[80vh] bg-zinc-800/50">
        {/* Chat List */}
        <div className="w-1/4 border overflow-y-scroll border-zinc-900 bg-white/20">
          {messages.map((chat, i) => (
            <div
              key={i}
              className={`p-4 border-b border-zinc-600 cursor-pointer hover:bg-zinc-700/30 transition-colors ${
                currentChat.name === chat.name ? "bg-zinc-700/50" : ""
              }`}
              onClick={() => setCurrentChat(chat)}
            >
              <div className="flex flex-row justify-start items-center">
                <img className="w-5 h-5 mr-2" src={chat[1].profile_pic}/>
                <h2 className="text-lg font-semibold">{chat[1].first_name} {chat[1].last_name}</h2>
              </div>
              <p className="text-xs text-zinc-900">{new Date(chat[1].updated_at).toLocaleString()}</p>
              {/* <p className="text-sm truncate">{chat.messages[chat.messages.length - 1].from}: {chat.messages[chat.messages.length - 1].content}</p> */}
            </div>
          ))}
        </div>

        {/* Chat Window */}
        <div className="w-3/4 flex flex-col justify-between p-4">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-zinc-900 pb-2 mb-4">
            <h2 className="text-2xl font-bold">{currentChat.name || "Select a chat"}</h2>
            {currentChat.lastContact && (
              <p className="text-sm text-zinc-900">{currentChat[1].updated_at.toLocaleString()}</p>
            )}
          </div>

          {/* Messages
          <div className="flex-1 flex-col flex overflow-y-auto space-y-3">
            {currentChat.messages.map((message) => (
              <div
                key={message.time.toISOString()}
                className={`p-3 rounded-lg ${
                  message.from === "me" ? "bg-blue-600 text-white self-end min-w-[30%]" : "bg-zinc-800 text-white self-start"
                } max-w-[70%] min-w-[30%]`}
              >
                <div className="flex justify-between text-xs text-zinc-300 mb-1">
                  <span>{message.from}</span>
                  <span>{message.time.toLocaleTimeString()}</span>
                </div>
                <p className="text-left">{message.content}</p>
              </div>
            ))}
          </div> */}

          {/* Input placeholder */}
          <div className="flex flex-row items-center ">
            <div className=" w-full">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full p-2 rounded-lg border border-zinc-600 bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button className="w-1/12 h-full rounded-lg bg-red-500  border border-zinc-600 hover:bg-red-400">Send</button>
          </div>
        </div>
      </div>
    </PageMain>
  );
}
