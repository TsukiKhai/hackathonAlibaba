import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Tesseract from "tesseract.js";

const suggestCategory = (text) => {
  const keywordMap = {
    laptop: "Lifestyle",
    macbook: "Lifestyle",
    apple: "Lifestyle",
    book: "Lifestyle",
    mph: "Lifestyle",
    popular: "Lifestyle",
    clinic: "Medical",
    hospital: "Medical",
    insurance: "Insurance",
    policy: "Insurance",
    training: "Professional Development",
    course: "Professional Development",
    udemy: "Professional Development",
  };

  const lowerText = text.toLowerCase();
  for (let keyword in keywordMap) {
    if (lowerText.includes(keyword)) {
      return keywordMap[keyword];
    }
  }
  return "Expenses"; // default to Expenses if no match
};

const Upload = () => {
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    category: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // success/error message
  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setMessage(null);
    setLoading(true);

    try {
      const result = await Tesseract.recognize(file, "eng");
      const ocrText = result.data.text;

      // Amount (RM)
      const amountMatch = ocrText.match(/RM\s?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i);
      const amount = amountMatch ? amountMatch[1].replace(/,/g, "") : "";

      // Date
      const dateMatch = ocrText.match(
        /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b/
      );
      const rawDate = dateMatch ? new Date(dateMatch[0]) : new Date();
      const formattedDate = rawDate.toISOString().split("T")[0];

      // Description
      const lines = ocrText.split("\n").map((line) => line.trim()).filter(Boolean);
      const description = lines.find((line) => /RM/i.test(line)) || lines[0] || "";

      // Category suggestion
      const category = suggestCategory(ocrText);

      setFormData({
        date: formattedDate,
        description: description.slice(0, 100),
        category,
        amount,
      });
      setMessage({ type: "success", text: "Receipt scanned successfully!" });
    } catch (err) {
      console.error("OCR failed:", err);
      setMessage({ type: "error", text: "Failed to scan receipt. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTransaction = () => {
    if (!formData.amount || !formData.description.trim()) {
      setMessage({ type: "error", text: "Please enter a valid description and amount." });
      return;
    }

    const storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    const newTransactions = [...storedTransactions, formData];
    localStorage.setItem("transactions", JSON.stringify(newTransactions));

    setFormData({ date: "", description: "", category: "", amount: "" });
    setImage(null);
    setMessage({ type: "success", text: "Transaction added successfully!" });

    // Navigate after a short delay so user sees message
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div className="space-y-6 p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center">Upload Receipt</h2>

      {/* Tips box */}
      <div className="bg-blue-50 border border-blue-300 text-blue-700 p-4 rounded">
        <strong>Tip:</strong> Upload a clear photo of your receipt. The system will automatically extract
        the date, amount, and suggest a category.
      </div>

      {/* Upload Section */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <Input type="file" accept="image/*" onChange={handleImageUpload} />

          {loading && (
            <div className="text-center text-blue-600 font-semibold">Processing image, please wait...</div>
          )}

          {image && !loading && (
            <div className="flex space-x-4 items-start">
              <img
                src={URL.createObjectURL(image)}
                alt="Receipt"
                className="w-32 h-32 object-cover border"
              />
              <div className="space-y-2 flex-1">
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
                <Button
                  onClick={handleAddTransaction}
                  disabled={!formData.amount || !formData.description.trim()}
                >
                  Add Transaction
                </Button>
              </div>
            </div>
          )}

          {/* Messages */}
          {message && (
            <div
              className={`mt-2 text-center font-semibold ${
                message.type === "error" ? "text-red-600" : "text-green-600"
              }`}
            >
              {message.text}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Upload;
