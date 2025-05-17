import React from "react";

const ManualEntry = () => {
  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold">Manual Expense Entry</h2>

      <form className="bg-white p-6 rounded-lg shadow border border-gray-200 space-y-4 max-w-xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            className="w-full border px-3 py-2 rounded text-sm border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded text-sm border-gray-300"
            placeholder="e.g. Taxi fare to airport"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select className="w-full border px-3 py-2 rounded text-sm border-gray-300">
            <option>Income</option>
            <option>Expenses</option>
            <option>Travel</option>
            <option>Supplies</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded text-sm border-gray-300"
            placeholder="e.g. 250.00"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded"
        >
          Save Entry
        </button>
      </form>
    </div>
  );
};

export default ManualEntry;
