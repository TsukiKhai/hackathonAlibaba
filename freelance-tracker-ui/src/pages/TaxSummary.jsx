import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const lhdnLimits = {
  Lifestyle: 2500,
  Medical: 8000,
  Insurance: 3000,
  "Professional Development": 1000,
};

const TaxSummary = ({ transactions }) => {
  const totalsByCategory = {};

  transactions.forEach((tx) => {
    if (!tx.category || !tx.amount) return;
    const cat = tx.category.trim();
    const amt = parseFloat(tx.amount);
    if (!totalsByCategory[cat]) totalsByCategory[cat] = 0;
    totalsByCategory[cat] += amt;
  });

  const rows = Object.entries(totalsByCategory).map(([category, total]) => {
    const maxAllowed = lhdnLimits[category] || 0;
    const deductible = Math.min(total, maxAllowed);
    return { category, total, maxAllowed, deductible };
  });

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Tax Deduction Summary</h2>
      <Card>
        <CardContent className="p-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Total Spent (RM)</th>
                <th className="p-2 border">Max Allowed</th>
                <th className="p-2 border">Deductible (RM)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td className="p-2 border">{row.category}</td>
                  <td className="p-2 border">{row.total.toFixed(2)}</td>
                  <td className="p-2 border">{row.maxAllowed}</td>
                  <td className="p-2 border">{row.deductible.toFixed(2)}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-400">
                    No deductible transactions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxSummary;