import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    date: "",
    description: "",
    category: "Income",
    amount: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date || !form.description || !form.amount) return;

    setTransactions([...transactions, { ...form }]);
    setForm({ date: "", description: "", category: "Income", amount: "" });
  };

  const totalIncome = transactions
    .filter((t) => t.category === "Income")
    .reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

  const totalExpenses = transactions
    .filter((t) => t.category === "Expenses")
    .reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

  return (
    <main className="p-8 space-y-8">
      <h2 className="text-2xl font-bold">Overview</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-500">Income</h3>
            <p className="text-2xl font-bold">${totalIncome.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-500">Expenses</h3>
            <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <p className="text-sm text-gray-500">Net</p>
            <p className="text-xl font-bold">
              ${(totalIncome - totalExpenses).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Form to Add Transaction */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h3 className="text-lg font-semibold">Add Transaction</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm mb-1">Date</label>
            <Input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Description</label>
            <Input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border rounded w-full p-2"
            >
              <option>Income</option>
              <option>Expenses</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Amount</label>
            <Input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>
          <div className="col-span-4 text-right">
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
              Add Transaction
            </Button>
          </div>
        </form>
      </div>

      {/* Transactions Table */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions added yet.</p>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm text-left border border-gray-200">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 border">Date</th>
                  <th className="p-3 border">Description</th>
                  <th className="p-3 border">Category</th>
                  <th className="p-3 border">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {transactions.map((tx, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-3 border">{tx.date}</td>
                    <td className="p-3 border">{tx.description}</td>
                    <td className="p-3 border">{tx.category}</td>
                    <td className="p-3 border">${parseFloat(tx.amount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default Dashboard;
