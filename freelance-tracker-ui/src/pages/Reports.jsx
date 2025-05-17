import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";

const transactions = [
  { type: "Income", category: "Freelance", amount: 5000 },
  { type: "Income", category: "Consulting", amount: 3000 },
  { type: "Expense", category: "Food", amount: 250 },
  { type: "Expense", category: "Travel", amount: 450 },
  { type: "Expense", category: "Office Supplies", amount: 320 },
];

const expenseData = transactions
  .filter((t) => t.type === "Expense")
  .reduce((acc, curr) => {
    const existing = acc.find((a) => a.name === curr.category);
    if (existing) existing.value += curr.amount;
    else acc.push({ name: curr.category, value: curr.amount });
    return acc;
  }, []);

const incomeTotal = transactions
  .filter((t) => t.type === "Income")
  .reduce((sum, t) => sum + t.amount, 0);

const expenseTotal = transactions
  .filter((t) => t.type === "Expense")
  .reduce((sum, t) => sum + t.amount, 0);

const netBalance = incomeTotal - expenseTotal;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Reports = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Financial Report</h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Total Income</h3>
          <p className="text-xl font-semibold text-green-600">${incomeTotal.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Total Expenses</h3>
          <p className="text-xl font-semibold text-red-600">${expenseTotal.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Net Balance</h3>
          <p className={`text-xl font-semibold ${netBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
            ${netBalance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-lg font-semibold mb-2">Expense Breakdown</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-lg font-semibold mb-2">Expenses by Category</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expenseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export Button */}
      <div className="text-right">
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          Export Report
        </Button>
      </div>
    </div>
  );
};

export default Reports;
