// src/components/AIChatWidget.jsx

import React, { useState } from "react";
import { useAssistant } from "../context/AssistantContext";

const AIChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, addMessage } = useAssistant();

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    addMessage({ role: "user", content: input });

    // Simulate assistant response
    setTimeout(() => {
      addMessage({
        role: "assistant",
        content: "Thanks! I'm thinking... (This is just a mock reply for now.)",
      });
    }, 800);

    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="bg-white shadow-lg rounded-lg w-80 max-h-[400px] flex flex-col border border-gray-300">
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between">
            <span className="font-semibold">Freelance Assistant AI</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((msg, idx) => (
              <div key={idx} className={`p-2 rounded ${msg.role === "user" ? "bg-gray-100 text-right" : "bg-blue-50 text-left"}`}>
                {msg.content}
              </div>
            ))}
          </div>
          <div className="flex border-t">
            <input
              type="text"
              className="flex-1 p-2 text-sm border-none outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me something..."
            />
            <button onClick={handleSend} className="px-3 bg-blue-500 text-white text-sm">
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-md"
        >
          💬 Ask AI
        </button>
      )}
    </div>
  );
};

export default AIChatWidget;
