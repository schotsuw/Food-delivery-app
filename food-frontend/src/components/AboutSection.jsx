import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@mui/material";
import { NavLink } from "react-router";

const navigationItems = [
  { label: "Frequent Questions", icon: "❓" },
  { label: "Who we are?", icon: "🏢" },
  { label: "Partner Program", icon: "🤝" },
  { label: "Help & Support", icon: "🆘" },
];

const faqQuestions = [
  "How does FoodFetch work?",
  "What payment methods are accepted?",
  "Can I track my order in real-time?",
  "Are there any special discounts or promotions available?",
  "Is FoodFetch available in my area?",
];

const processSteps = [
  {
    title: "Place an Order!",
    description: "Order easily via our website or mobile app.",
    icon: "🍔",
  },
  {
    title: "Track Progress",
    description: "Monitor your order status and estimated delivery time.",
    icon: "🎯",
  },
  {
    title: "Get Your Order!",
    description: "Enjoy your meal with fast & reliable delivery!",
    icon: "✅",
  },
];

const testimonials = [
  {
    name: "Sarah L.",
    review:
      "FoodFetch makes ordering so simple! I love the real-time tracking feature.",
    avatar: "👩‍🍳",
  },
  {
    name: "Michael B.",
    review: "Best food delivery service! Always fresh and on time.",
    avatar: "👨‍💼",
  },
];

export default function AboutSection() {
  const [activeNav, setActiveNav] = useState("Frequent Questions");
  const [activeQuestion, setActiveQuestion] = useState("How does FoodFetch work?");

  // Scroll animation triggers
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* Navigation Section */}
        <motion.div 
          ref={sectionRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Know more about us!
          </h2>
          <div className="flex flex-wrap gap-3">
            {navigationItems.map(({ label, icon }) => (
              <motion.div 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.95 }} 
                key={label}
              >
                <Button
                  variant={activeNav === label ? "contained" : "text"}
                  className={`rounded-full px-4 py-2 cursor-pointer ${
                    activeNav === label ? "!bg-red-500 !text-white" : "!text-gray-700"
                  }`}
                  onClick={() => setActiveNav(label)}
                >
                  {icon} {label}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ & Process Steps */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-2xl p-8 mb-12 shadow-lg"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* FAQ Section */}
            <motion.div className="space-y-4">
              {faqQuestions.map((question, index) => (
                <motion.button
                  key={question}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.2 }}
                  className={`w-full text-left p-4 rounded-lg transition-all font-medium text-lg cursor-pointer ${
                    activeQuestion === question
                      ? "bg-red-500 text-white shadow-md"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveQuestion(question)}
                >
                  {question}
                </motion.button>
              ))}
            </motion.div>

            {/* Process Steps */}
            <motion.div className="grid gap-4">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: index * 0.3, duration: 0.5 }}
                  className="bg-gray-100 rounded-lg p-6 flex flex-col items-center text-center shadow-sm"
                >
                  <div className="text-4xl mb-2">{step.icon}</div>
                  <h3 className="font-semibold text-xl">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mt-12"
        >
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            What Our Customers Say
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.3 }}
                className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center"
              >
                <div className="text-4xl mb-3">{testimonial.avatar}</div>
                <p className="text-gray-700 italic mb-2">"{testimonial.review}"</p>
                <h4 className="font-semibold">{testimonial.name}</h4>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Join Us Today Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-12 bg-red-500 text-white py-12 px-6 rounded-lg shadow-md"
        >
          <h3 className="text-3xl font-semibold mb-4">
            Join FoodFetch Today!
          </h3>
          <p className="text-lg mb-6">
            Get exclusive discounts, track your orders in real-time, and enjoy 
            seamless food delivery. Sign up now and be part of the fastest-growing 
            food delivery service!
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <NavLink to="/login-signup">
              <Button 
                variant="contained"
                className="!bg-white !text-red-500 !px-6 !py-3 !rounded-full !font-semibold cursor-pointer"
              >
                Sign Up Now
              </Button>
              </NavLink>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outlined"
                className="!border-white !text-white !px-6 !py-3 !rounded-full !font-semibold cursor-pointer"
              >
                Download App
              </Button>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}