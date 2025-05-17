import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScanLine, BarChart2, Pencil, Timer, Brain, Stars } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-14">
      {/* Hero Section */}
      <section className="text-center space-y-5">
        <h1 className="text-4xl font-bold text-blue-900">Welcome to Freelance Tracker</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Smart, AI-driven tracking to simplify your freelance finances.
        </p>
        <Button
          className="bg-blue-700 hover:bg-blue-800 text-white"
          onClick={() => navigate("/upload")}
        >
          Start Tracking Instantly
        </Button>
      </section>

      {/* Feature Highlights */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center space-y-3">
              <ScanLine className="mx-auto text-blue-600 w-8 h-8" />
              <h3 className="text-xl font-semibold">Smart Receipt Scan</h3>
              <p className="text-gray-500 text-sm">
                Use OCR to extract transaction data from receipts in seconds.
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center space-y-3">
              <BarChart2 className="mx-auto text-blue-600 w-8 h-8" />
              <h3 className="text-xl font-semibold">Insightful Reports</h3>
              <p className="text-gray-500 text-sm">
                Automatically generate charts and trends to understand your finances.
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center space-y-3">
              <Pencil className="mx-auto text-blue-600 w-8 h-8" />
              <h3 className="text-xl font-semibold">Manual Entry</h3>
              <p className="text-gray-500 text-sm">
                Add custom transactions with ease when automation isn't enough.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-blue-800">
          How Freelance Tracker Helps You
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white rounded-lg shadow p-5 space-y-3">
            <Timer className="mx-auto text-blue-600 w-6 h-6" />
            <h3 className="font-semibold">Save Time Instantly</h3>
            <p className="text-gray-500 text-sm">
              Automate logging to cut down time spent on bookkeeping by 70%.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-5 space-y-3">
            <Brain className="mx-auto text-blue-600 w-6 h-6" />
            <h3 className="font-semibold">Smarter Finances</h3>
            <p className="text-gray-500 text-sm">
              AI suggests categories and flags unusual expenses automatically.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-5 space-y-3">
            <Stars className="mx-auto text-blue-600 w-6 h-6" />
            <h3 className="font-semibold">Tailored to Freelancers</h3>
            <p className="text-gray-500 text-sm">
              Designed with freelancers in mind — from solo designers to devs.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-5 space-y-3">
            <BarChart2 className="mx-auto text-blue-600 w-6 h-6" />
            <h3 className="font-semibold">Visual Progress</h3>
            <p className="text-gray-500 text-sm">
              Track monthly trends and stay ahead with real-time insights.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center mt-10">
        <p className="text-gray-600 text-lg mb-3">Ready to simplify your freelance finances?</p>
        <Button
          className="bg-blue-700 hover:bg-blue-800 text-white"
          onClick={() => navigate("/manual-entry")}
        >
          Add First Entry
        </Button>
      </section>
    </div>
  );
};

export default Home;
