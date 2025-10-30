"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  HiAcademicCap,
  HiUsers,
  HiLightBulb,
  HiTrendingUp,
  HiGlobeAlt,
  HiSparkles,
} from "react-icons/hi";

const reasons = [
  {
    icon: HiAcademicCap,
    title: "Academic Excellence",
    description:
      "Comprehensive curriculum designed to meet industry standards and academic rigor.",
  },
  {
    icon: HiUsers,
    title: "Expert Faculty",
    description:
      "Learn from experienced professors and industry professionals dedicated to your success.",
  },
  {
    icon: HiLightBulb,
    title: "Innovation & Research",
    description:
      "State-of-the-art labs and research facilities fostering creativity and innovation.",
  },
  {
    icon: HiTrendingUp,
    title: "Industry-Ready Skills",
    description:
      "Practical training and internships preparing you for real-world challenges.",
  },
  {
    icon: HiGlobeAlt,
    title: "Global Exposure",
    description:
      "International collaborations and exchange programs broadening your horizons.",
  },
  {
    icon: HiSparkles,
    title: "Holistic Development",
    description:
      "Focus on overall personality development through sports, arts, and cultural activities.",
  },
];

export default function WhyChooseJKKN() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="why-choose"
      ref={ref}
      className="py-20 bg-primary-cream relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-green/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-green/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-primary-green">JKKN</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover what makes JKKN Institution the preferred choice for
            thousands of students
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className="w-16 h-16 bg-primary-green/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-green group-hover:scale-110 transition-all duration-300">
                <reason.icon className="text-4xl text-primary-green group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {reason.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
