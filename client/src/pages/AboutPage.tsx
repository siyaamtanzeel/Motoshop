import React from "react";
import {
  TruckIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {" "}
      {/* pt-16 ensures content starts below navbar */}
      {/* Hero Section */}
      <div className="relative bg-primary-900 text-white py-24">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-primary-800/90 z-10" />
          <img src="/about-hero.jpg" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-extrabold tracking-tight mb-6">
              About MotoShop
            </h1>
            <p className="text-xl leading-relaxed text-primary-100">
              We're passionate about motorcycles and committed to providing the
              best riding experience to our customers.
            </p>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="prose prose-lg">
              <p className="text-gray-600">
                Founded in 2020, MotoShop has grown from a small local
                dealership to one of the most trusted motorcycle marketplaces in
                the region. We believe in providing not just vehicles, but
                complete riding solutions to our customers.
              </p>
              <p className="text-gray-600 mt-4">
                Our team consists of passionate riders and industry experts who
                understand the importance of finding the perfect motorcycle for
                each individual's needs and preferences.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
              <UserGroupIcon className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                1000+ Happy Riders
              </h3>
              <p className="text-gray-600">
                Join our growing community of satisfied customers
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
              <TruckIcon className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Fast Delivery
              </h3>
              <p className="text-gray-600">
                Quick and secure delivery to your doorstep
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
              <ShieldCheckIcon className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quality Guarantee
              </h3>
              <p className="text-gray-600">
                All bikes are thoroughly inspected
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
              <WrenchScrewdriverIcon className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Expert Support
              </h3>
              <p className="text-gray-600">24/7 assistance from our team</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "John Doe",
                role: "Founder & CEO",
                image:
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
              },
              {
                name: "Jane Smith",
                role: "Head of Sales",
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
              },
              {
                name: "Mike Johnson",
                role: "Lead Technician",
                image:
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
              },
            ].map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-primary-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
