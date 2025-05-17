import React, { useEffect, useState } from "react";
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

// Tax Relief Reference
const taxReliefCategories = [
  { category: "Education Fees (Self)", maxClaim: 7000 },
  { category: "Husband/Wife/Alimony Payments", maxClaim: 4000 },
  { category: "Life Insurance (Self & Spouse)", maxClaim: 3000 },
  { category: "PRS (Private Retirement Scheme)", maxClaim: 3000 },
  { category: "EPF (Employee Provident Fund)", maxClaim: 4000 },
  { category: "SOCSO & EIS", maxClaim: 350 },
  { category: "Education or Medical Insurance", maxClaim: 3000 },
  { category: "EV Charging Facilities", maxClaim: 2500 },
  { category: "Medical Expenses on Serious Diseases", maxClaim: 10000 },
  { category: "Lifestyle", maxClaim: 2500 },
  { category: "Sports Equipment & Activities", maxClaim: 1000 },
  { category: "Child Relief (< 18 years)", maxClaim: 2000 },
  { category: "Child Relief (> 18 years & studying)", maxClaim: 8000 },
  { category: "Childcare Fees (< 6 years)", maxClaim: 3000 },
  { category: "SSPN's Scheme (education savings)", maxClaim: 8000 },
  { category: "Breastfeeding Equipment", maxClaim: 1000 },
  { category: "Disabled Individual", maxClaim: 6000 },
  { category: "Disabled Child Relief", maxClaim: 6000 },
  { category: "Disabled Spouse", maxClaim: 5000 },
  { category: "Basic Supporting Equipment", maxClaim: 6000 },
  { category: "Medical Expenses for Parents", maxClaim: 8000 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#D71E1E"];

const Reports = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("transactions");
    if (stored) {
      setTransactions(JSON.parse(stored));
    }
  }, []);

  const expenseData = transactions
    .filter((t) => t.category.toLowerCase() !== "income")
    .reduce((acc, curr) => {
      const existing = acc.find((a) => a.name === curr.category);
      if (existing) existing.value += parseFloat(curr.amount);
      else acc.push({ name: curr.category, value: parseFloat(curr.amount) });
      return acc;
    }, []);

  const incomeTotal = transactions
    .filter((t) => t.category.toLowerCase() === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const expenseTotal = transactions
    .filter((t) => t.category.toLowerCase() !== "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const netBalance = incomeTotal - expenseTotal;

  const handleExport = () => {
    const headers = ["Date", "Description", "Category", "Amount"];
    const rows = transactions.map((t) =>
      [t.date, t.description, t.category, t.amount].join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "full-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportIncome = () => {
    const incomeTxs = transactions.filter(
      (t) => t.category.toLowerCase() === "income"
    );
    const headers = ["Date", "Description", "Category", "Amount"];
    const rows = incomeTxs.map((t) =>
      [t.date, t.description, t.category, t.amount].join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "income-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reliefSuggestions = taxReliefCategories.map((relief) => {
    const matchingTx = transactions.filter(
      (t) => t.category.toLowerCase() === relief.category.toLowerCase()
    );
    const totalSpent = matchingTx.reduce(
      (sum, t) => sum + parseFloat(t.amount),
      0
    );
    return {
      category: relief.category,
      maxClaim: relief.maxClaim,
      claimed: Math.min(totalSpent, relief.maxClaim),
      remaining: Math.max(0, relief.maxClaim - totalSpent),
      percentage: Math.min(100, (totalSpent / relief.maxClaim) * 100)
    };
  }).filter(r => r.claimed > 0); // Show only used reliefs

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Financial Report</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Total Income</h3>
          <p className="text-xl font-semibold text-green-600">RM {incomeTotal.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Total Expenses</h3>
          <p className="text-xl font-semibold text-red-600">RM {expenseTotal.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Net Balance</h3>
          <p className={`text-xl font-semibold ${netBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
            RM {netBalance.toFixed(2)}
          </p>
        </div>
      </div>

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

      <div className="bg-white p-4 rounded shadow">
        <h4 className="text-lg font-semibold mb-4">LHDN Tax Deduction Suggestions</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2 border-b">Category</th>
                <th className="text-right p-2 border-b">Matched Amount (RM)</th>
                <th className="text-right p-2 border-b">Max Claimable (RM)</th>
                <th className="text-right p-2 border-b">Deduction (RM)</th>
              </tr>
            </thead>
            <tbody>
              {taxReliefCategories.map((relief, idx) => {
                const matchingTx = transactions.filter(
                  (t) => t.category.toLowerCase() === relief.category.toLowerCase()
                );
                const totalSpent = matchingTx.reduce(
                  (sum, t) => sum + parseFloat(t.amount),
                  0
                );
                const deductionAmount = Math.min(totalSpent, relief.maxClaim);
                
                return (
                  <tr key={idx} className={`border-b hover:bg-gray-50 ${totalSpent > 0 ? 'font-medium' : ''}`}>
                    <td className="p-2">{relief.category}</td>
                    <td className="text-right p-2">{totalSpent.toFixed(2)}</td>
                    <td className="text-right p-2">{relief.maxClaim.toFixed(2)}</td>
                    <td className="text-right p-2 text-blue-600">{deductionAmount > 0 ? deductionAmount.toFixed(2) : '0.00'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-right">
          <p className="font-medium">
            Estimated Total Deductible: <span className="text-blue-600 text-lg">RM {
              taxReliefCategories.reduce((sum, relief) => {
                const matchingTx = transactions.filter(
                  (t) => t.category.toLowerCase() === relief.category.toLowerCase()
                );
                const totalSpent = matchingTx.reduce(
                  (sum, t) => sum + parseFloat(t.amount),
                  0
                );
                return sum + Math.min(totalSpent, relief.maxClaim);
              }, 0).toFixed(2)
            }</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
        <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={handleExport}>
          Export Full Report
        </Button>
        <Button className="bg-green-600 text-white hover:bg-green-700" onClick={handleExportIncome}>
          Export Income Report
        </Button>
      </div>
    </div>
  );
};

export default Reports;