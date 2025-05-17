import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const Upload = () => {
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    category: "",
    amount: "",
  });
  const [transactions, setTransactions] = useState([]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    // Mock extracted data
    setFormData({
      date: "2024-05-01",
      description: "Mock Receipt Item",
      category: "Office Supplies",
      amount: "45.00",
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTransaction = () => {
    setTransactions((prev) => [...prev, { ...formData, image }]);
    setImage(null);
    setFormData({ date: "", description: "", category: "", amount: "" });
  };

  const handleExportCSV = () => {
    const headers = ["Date", "Description", "Category", "Amount"];
    const rows = transactions.map((tx) =>
      [tx.date, tx.description, tx.category, tx.amount].join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">Upload Receipt</h2>

      {/* Upload Section */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <Input type="file" accept="image/*" onChange={handleImageUpload} />
          {image && (
            <div className="flex space-x-4 items-start">
              <img
                src={URL.createObjectURL(image)}
                alt="Receipt"
                className="w-32 h-32 object-cover border"
              />
              <div className="space-y-2">
                <Input
                  name="date"
                  placeholder="Date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
                <Input
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
                <Input
                  name="category"
                  placeholder="Category"
                  value={formData.category}
                  onChange={handleInputChange}
                />
                <Input
                  name="amount"
                  placeholder="Amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                />
                <Button onClick={handleAddTransaction}>Add Transaction</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Transactions</h3>
          <Button onClick={handleExportCSV}>Export CSV</Button>
        </div>
        <div className="overflow-auto border">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={i}>
                  <td className="p-2 border">{tx.date}</td>
                  <td className="p-2 border">{tx.description}</td>
                  <td className="p-2 border">{tx.category}</td>
                  <td className="p-2 border">${tx.amount}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-400">
                    No transactions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Upload;
