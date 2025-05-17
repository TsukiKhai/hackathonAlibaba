import React, { useState } from "react";

const AssistantChat = ({ transactions }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "assistant",
      text: "Welcome to the team! I'm Freelance AI Assistant, your assistant. How can I help you get started?",
    },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    const response = getAssistantResponse(input, transactions);

    // Add "I'll help you with that!" before the actual response
    const fullResponse = `I'll help you with that!\n${response}`;

    setMessages([...messages, userMessage, { from: "assistant", text: fullResponse }]);
    setInput("");
  };

  const getAssistantResponse = (question, transactions) => {
    const income = transactions
      .filter((t) => t.category.toLowerCase() === "income")
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    const expenses = transactions
      .filter((t) => t.category.toLowerCase() !== "income")
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    const net = income - expenses;

    const q = question.toLowerCase();

    const deductions = {
      "education fees": 7000,
      "husband/wife/alimony payments": 4000,
      "life insurance": 3000,
      "prs": 3000,
      "epf": 4000,
      "socso & eis": 350,
      "education or medical insurance": 3000,
      "ev charging facilities": 2500,
      "medical expenses on serious diseases": 10000,
      "lifestyle": 2500,
      "sports equipment & activities": 1000,
      "child relief": 2000,
      "childcare fees": 3000,
      "sspn's scheme": 8000,
      "breastfeeding equipment": 1000,
      "disabled individual": 6000,
      "disabled child relief": 6000,
      "disabled spouse": 5000,
      "basic supporting equipment": 6000,
      "medical expenses for parents": 8000,
    };

    for (const [category, maxClaim] of Object.entries(deductions)) {
      if (q.includes(category)) {
        return `The max claimable amount for "${category}" is RM ${maxClaim.toFixed(2)}.`;
      }
    }

    if (q.includes("income")) return `You've earned RM ${income.toFixed(2)}.`;
    if (q.includes("expense") || q.includes("spent")) return `Your expenses total RM ${expenses.toFixed(2)}.`;
    if (q.includes("net") || q.includes("balance")) return `Your net balance is RM ${net.toFixed(2)}.`;

    if (q.includes("tax deduction")) {
      return `Some common tax deductions include Education Fees, Life Insurance, EPF, Medical Expenses, and more. Ask me about a specific category for details!`;
    }

    if (q.includes("help")) {
      return `Try asking: 
- "What is my income?" 
- "How much have I spent?" 
- "What's my balance?"
- "Tell me about tax deductions"
- "What's the max claim for education fees?"`;
    }

    return "Let me check our resources for the most relevant information. Try asking about income, expenses, net balance, or tax deductions.";
  };

  return (
    <div className="border rounded p-4 mt-8 shadow-md bg-white flex flex-col">
      <h3 className="text-lg font-semibold mb-2">💬 Freelance AI Assistant</h3>

      <div className="h-48 overflow-y-auto space-y-2 mb-3 bg-gray-50 p-2 rounded text-sm flex flex-col">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded max-w-xs break-words ${
              msg.from === "assistant"
                ? "bg-blue-100 text-left self-start"
                : "bg-green-100 text-right self-end"
            }`}
            style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 border p-2 rounded"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />
        <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded">
          Ask
        </button>
      </div>
    </div>
  );
};

export default AssistantChat;
