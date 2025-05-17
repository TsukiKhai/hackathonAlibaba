import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import AssistantChat from "@/components/AssistantChat"; // 💬 Import AI Assistant

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(stored);
  }, []);

  const handleDelete = (indexToDelete) => {
    const updated = transactions.filter((_, idx) => idx !== indexToDelete);
    setTransactions(updated);
    localStorage.setItem("transactions", JSON.stringify(updated));
  };

  const incomeTotal = transactions
    .filter((t) => t.category.toLowerCase() === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const expenseTotal = transactions
    .filter((t) => t.category.toLowerCase() !== "income")
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const net = incomeTotal - expenseTotal;

  return (
    <main className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-500">Total Income</h3>
            <p className="text-2xl font-bold text-green-600">
              RM {incomeTotal.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-500">Total Expenses</h3>
            <p className="text-2xl font-bold text-red-600">
              RM {expenseTotal.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-500">Net Balance</h3>
            <p
              className={`text-2xl font-bold ${
                net >= 0 ? "text-green-700" : "text-red-700"
              }`}
            >
              RM {net.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">All Transactions</h3>
        <div className="overflow-auto border rounded shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 p-4">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((tx, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2 border">{tx.date}</td>
                    <td className="p-2 border">{tx.description}</td>
                    <td className="p-2 border">{tx.category}</td>
                    <td className="p-2 border">
                      RM {parseFloat(tx.amount).toFixed(2)}
                    </td>
                    <td className="p-2 border">
                      <button
                        onClick={() => handleDelete(idx)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 💬 Freelance AI Assistant */}
      <AssistantChat transactions={transactions} />
    </main>
  );
};

export default Dashboard;
