import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CategoryCarousel from "./CategoryCarousel";
import NewsEvents from "./NewsEvents";

const Hero: React.FC = () => {
  return (
    <div className="relative z-40 w-full">
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black py-20">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://t4.ftcdn.net/jpg/05/24/69/81/360_F_524698156_mcxxv7TF17y68je1E1NsWbYXzy0HvJzs.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white pt-20 md:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto space-y-6 md:space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Experience the Thrill of{" "}
              <span className="text-primary-500">Electric Power</span>
            </h1>

            <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto px-4">
              Discover our premium collection of electric motorcycles.
              <br className="hidden sm:block" /> Sustainable power meets
              unmatched performance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 md:pt-8 px-4">
              <Link
                to="/bikes"
                className="btn btn-primary text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-full hover:scale-105 transform transition"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById("categories");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}>
                Explore Bikes
              </Link>
              <Link
                to="/about"
                className="btn btn-secondary text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-full bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition">
                Learn More
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-12 md:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto px-4">
            <div className="flex flex-col items-center space-y-2 p-4 md:p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10">
              <span className="text-3xl md:text-4xl font-bold text-primary-500">
                100+
              </span>
              <span className="text-sm md:text-base text-gray-300">
                Models Available
              </span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 md:p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10">
              <span className="text-3xl md:text-4xl font-bold text-primary-500">
                5K+
              </span>
              <span className="text-sm md:text-base text-gray-300">
                Happy Customers
              </span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 md:p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10">
              <span className="text-3xl md:text-4xl font-bold text-primary-500">
                24/7
              </span>
              <span className="text-sm md:text-base text-gray-300">
                Customer Support
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230ea5e9'%3E%3Cpath d='M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h8.25c1.035 0 1.875-.84 1.875-1.875V15z' /%3E%3Cpath d='M22.5 15h-6v2.625c0 1.035-.84 1.875-1.875 1.875h.375A3.75 3.75 0 0 0 18.75 15h3.75v-3.75a3 3 0 0 0-3-3h-1.5v7.5h4.5V15zm-18-7.5v6h-3V7.5h3z' /%3E%3C/svg%3E"
                  alt="Battery Icon"
                  className="w-6 h-6"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Electric Power
              </h3>
              <p className="text-gray-600">
                Zero emissions with outstanding performance and range
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230ea5e9'%3E%3Cpath d='M5.85 3.5a.75.75 0 0 0-1.117-1 9.719 9.719 0 0 0-2.348 4.876.75.75 0 0 0 1.479.248A8.219 8.219 0 0 1 5.85 3.5zM19.267 2.5a.75.75 0 1 0-1.118 1 8.22 8.22 0 0 1 1.987 4.124.75.75 0 0 0 1.48-.248A9.72 9.72 0 0 0 19.266 2.5z' /%3E%3Cpath d='M12 2.25A6.75 6.75 0 0 0 5.25 9v.75a8.217 8.217 0 0 1-2.119 5.52.75.75 0 0 0 .298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 1 0 7.48 0 24.583 24.583 0 0 0 4.83-1.244.75.75 0 0 0 .298-1.205A8.217 8.217 0 0 1 18.75 9.75V9a6.75 6.75 0 0 0-6.75-6.75z' /%3E%3C/svg%3E"
                  alt="Safety Icon"
                  className="w-6 h-6"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Advanced Safety
              </h3>
              <p className="text-gray-600">
                State-of-the-art safety features for peace of mind
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230ea5e9'%3E%3Cpath d='M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z' /%3E%3Cpath d='M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5z' /%3E%3C/svg%3E"
                  alt="Charging Icon"
                  className="w-6 h-6"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fast Charging
              </h3>
              <p className="text-gray-600">
                Quick charging capabilities for minimal downtime
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230ea5e9'%3E%3Cpath d='M10.5 1.875a1.125 1.125 0 0 1 2.25 0v8.219c.517.162 1.02.382 1.5.659V3.375a1.125 1.125 0 0 1 2.25 0v10.937a4.505 4.505 0 0 0-3.25 2.373 8.963 8.963 0 0 1-.24-2.206c0-3.483 2.043-6.511 5.027-7.969a1.125 1.125 0 0 1 1.064 1.969c-2.325 1.15-3.841 3.507-3.841 6 0 .624.089 1.229.252 1.8a1.125 1.125 0 1 1-2.13.727 8.935 8.935 0 0 1-.372-2.527c0-1.751.506-3.384 1.38-4.766V1.875z' /%3E%3Cpath d='M12 16.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9z' /%3E%3C/svg%3E"
                  alt="Smart Features Icon"
                  className="w-6 h-6"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Smart Features
              </h3>
              <p className="text-gray-600">
                Cutting-edge technology for enhanced riding experience
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Carousel */}
      <CategoryCarousel />

      {/* News & Events Section */}
      <NewsEvents />
    </div>
  );
};

export default Hero;
