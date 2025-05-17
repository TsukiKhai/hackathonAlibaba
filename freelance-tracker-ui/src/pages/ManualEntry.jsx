import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ManualEntry = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    date: "",
    description: "",
    category: "Expenses",
    amount: "",
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.date || !form.description || !form.amount) {
      setMessage({ type: "error", text: "Please fill in all required fields." });
      return;
    }

    const stored = localStorage.getItem("transactions");
    const transactions = stored ? JSON.parse(stored) : [];
    const updatedTransactions = [...transactions, form];
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));

    setMessage({ type: "success", text: "Entry saved successfully!" });

    setForm({
      date: "",
      description: "",
      category: "Expenses",
      amount: "",
    });

    // Navigate after delay
    setTimeout(() => navigate("/dashboard"), 1500);
  };

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center">Manual Expense Entry</h2>

      {/* Tips box */}
      <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 p-4 rounded">
        <strong>Tip:</strong> Use this form to enter expenses that aren't tied to a receipt.
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow border border-gray-200 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm border-gray-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm border-gray-300"
            placeholder="e.g. Taxi fare to airport"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm border-gray-300"
          >
            <option>Income</option>
            <option>Expenses</option>
            <option>Travel</option>
            <option>Supplies</option>
            <option>Medical</option>
            <option>Insurance</option>
            <option>Professional Development</option>
            <option>Lifestyle</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (RM)</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm border-gray-300"
            placeholder="e.g. 250.00"
            step="0.01"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded w-full"
        >
          Save Entry
        </button>

        {message && (
          <div
            className={`text-center mt-2 font-medium ${
              message.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
};

export default ManualEntry;
