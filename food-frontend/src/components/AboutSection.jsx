import { useState } from 'react';
import { Button } from '@mui/material';

const navigationItems = [
  "Frequent Questions",
  "Who we are?",
  "Partner Program",
  "Help & Support"
];

const faqQuestions = [
  "How does Order.UK work?",
  "What payment methods are accepted?",
  "Can I track my order in real-time?",
  "Are there any special discounts or promotions available?",
  "Is Order.UK available in my area?"
];

const processSteps = [
  {
    title: "Place an Order!",
    description: "Place order through our website or Mobile app",
    icon: "🍔"
  },
  {
    title: "Track Progress",
    description: "Your can track your order status with delivery time",
    icon: "🎯"
  },
  {
    title: "Get your Order!",
    description: "Receive your order at a lighting fast speed!",
    icon: "✅"
  }
];

const statistics = [
  { value: "546+", label: "Registered Riders" },
  { value: "789,900+", label: "Orders Delivered" },
  { value: "690+", label: "Restaurants Partnered" },
  { value: "17,457+", label: "Food Items" }
];

export default function AboutSection() {
  const [activeNav, setActiveNav] = useState("Frequent Questions");
  const [activeQuestion, setActiveQuestion] = useState("How does Order.UK work?");

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h2 className="text-2xl font-bold mb-4 md:mb-0">Know more about us!</h2>
          <div className="flex flex-wrap gap-2">
            {navigationItems.map((item) => (
              <Button
                key={item}
                variant={activeNav === item ? "outlined" : "text"}
                className={`rounded-full ${
                  activeNav === item ? "!border-primary !text-primary" : ""
                }`}
                onClick={() => setActiveNav(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            {/* FAQ Questions */}
            <div className="space-y-4">
              {faqQuestions.map((question) => (
                <button
                  key={question}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    activeQuestion === question
                      ? "bg-primary text-white"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>

            {/* Process Steps */}
            <div className="grid gap-4">
              {processSteps.map((step) => (
                <div
                  key={step.title}
                  className="bg-gray-100 rounded-lg p-6 flex flex-col items-center text-center"
                >
                  <div className="text-4xl mb-2">{step.icon}</div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-8 text-gray-600 max-w-3xl mx-auto">
            <p>
              Order.UK simplifies the food ordering process. Browse through our
              diverse menu, select your favorite dishes, and proceed to checkout.
              Your delicious meal will be on its way to your doorstep in no time!
            </p>
          </div>
        </div>

        {/* Statistics Bar */}
        <div className="bg-primary rounded-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8">
            {statistics.map((stat) => (
              <div
                key={stat.label}
                className="text-center text-white"
              >
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}