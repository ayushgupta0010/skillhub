"use client";

import { PageMain } from "../components/pageMain.jsx";
import { useState } from "react";

export default function MessagesPage() {
  const [currentChat, setCurrentChat] = useState({ name: "", lastContact: "", messages: [] });

  const messages = [
    {
      name: "Bob",
      lastContact: new Date("1/18/26"),
      messages: [
        { time: new Date("1/18/26 09:00:00"), from: "Bob", content: "hey man" },
        { time: new Date("1/18/26 09:05:00"), from: "me", content: "smells like up dog in here" }
      ]
    },
    {
      name: "Alice",
      lastContact: new Date("1/17/26"),
      messages: [
        { time: new Date("1/17/26 14:20:00"), from: "Alice", content: "Did you see the notes from the meeting?" }
      ]
    },
    {
      name: "Charlie",
      lastContact: new Date("1/18/26"),
      messages: [
        { time: new Date("1/18/26 10:30:00"), from: "Charlie", content: "Lunch at 12?" },
        { time: new Date("1/18/26 10:32:00"), from: "me", content: "No." }
      ]
    },
    {
      name: "Diana",
      lastContact: new Date("1/15/26"),
      messages: [
        { time: new Date("1/15/26 18:00:00"), from: "Diana", content: "Happy Birthday!" }
      ]
    },
    {
      name: "Evan",
      lastContact: new Date("1/18/26"),
      messages: [
        { time: new Date("1/18/26 08:15:00"), from: "Evan", content: "Dude I fucking love Porygon-Z" }
      ]
    },
    {
      name: "Ayush",
      lastContact: new Date("1/15/26"),
      messages: [
        { time: new Date("1/15/26 08:14:00"), from: "Ayush", content: "Dude which color" },
        { time: new Date("1/15/26 08:15:00"), from: "me", content: "I dont know what you're talking about man" },
      ]
    },
    {
      name: "Cysyk",
      lastContact: new Date("1/1/26"),
      messages: [
        { time: new Date("1/1/26 08:15:00"), from: "Cysyk", content: "Oops haha I ran into your car again" },
        { time: new Date("12/31/25 08:14:00"), from: "Cysyk", content: "Oh silly me I blew up SERC again murdering thousands" },
        { time: new Date("12/1/25 08:14:00"), from: "Cysyk", content: "Have you seen the giggler?" }
      ]
    }
  ];

  return (
    <PageMain>
      <h1 className="text-3xl font-bold mb-4">Messages</h1>
      <hr className="mb-6 border-zinc-600" />

      <div className="flex h-[80vh] bg-zinc-600/50">
        {/* Chat List */}
        <div className="w-1/4 border overflow-y-scroll border-zinc-600 bg-zinc-500/50">
          {messages.map((chat) => (
            <div
              key={chat.name}
              className={`p-4 border-b border-zinc-600 cursor-pointer hover:bg-zinc-700/30 transition-colors ${
                currentChat.name === chat.name ? "bg-zinc-700/50" : ""
              }`}
              onClick={() => setCurrentChat(chat)}
            >
              <h2 className="text-lg font-semibold">{chat.name}</h2>
              <p className="text-xs text-zinc-900">{chat.lastContact.toLocaleString()}</p>
              <p className="text-sm truncate">{chat.messages[chat.messages.length - 1].from}: {chat.messages[chat.messages.length - 1].content}</p>
            </div>
          ))}
        </div>

        {/* Chat Window */}
        <div className="w-3/4 flex flex-col justify-between p-4">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-zinc-600 pb-2 mb-4">
            <h2 className="text-2xl font-bold">{currentChat.name || "Select a chat"}</h2>
            {currentChat.lastContact && (
              <p className="text-sm text-zinc-900">{currentChat.lastContact.toLocaleString()}</p>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 flex-col flex overflow-y-auto space-y-3">
            {currentChat.messages.map((message) => (
              <div
                key={message.time.toISOString()}
                className={`p-3 rounded-lg ${
                  message.from === "me" ? "bg-blue-600 text-white self-end" : "bg-zinc-800 text-white self-start"
                } max-w-[70%]`}
              >
                <div className="flex justify-between text-xs text-zinc-300 mb-1">
                  <span>{message.from}</span>
                  <span>{message.time.toLocaleTimeString()}</span>
                </div>
                <p className="text-left">{message.content}</p>
              </div>
            ))}
          </div>

          {/* Input placeholder */}
          <div className="flex flex-row items-center ">
            <div className=" w-full">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full p-2 rounded-lg border border-zinc-600 bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button className="w-1/12 h-full rounded-lg bg-red-500  border border-zinc-600">Send</button>
          </div>
        </div>
      </div>
    </PageMain>
  );
}
