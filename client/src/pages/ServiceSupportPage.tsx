import React, { useState } from "react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    id: "01",
    question: "What are your packaging conditions?",
    answer:
      "We use professional and secure packaging methods to ensure your motorcycle arrives safely. Each bike is carefully wrapped and protected with foam padding and sturdy cardboard boxes. For larger motorcycles, we use wooden crates for additional protection during transit.",
  },
  {
    id: "02",
    question: "What are your payment terms?",
    answer:
      "Accept T/T 30% as deposit, 70% before delivery. After you pay the balance, we will show you the photos of the product and packaging.",
  },
  {
    id: "03",
    question: "What are your delivery terms?",
    answer:
      "We offer various shipping methods including sea freight, air freight, and express delivery. Standard delivery time is 15-30 days depending on your location and chosen shipping method.",
  },
  {
    id: "04",
    question: "How is your delivery time?",
    answer:
      "Delivery time varies based on the shipping method and destination. Typically, it takes 3-5 days for production, and shipping times are: Express: 3-7 days, Air freight: 7-10 days, Sea freight: 15-30 days.",
  },
  {
    id: "05",
    question: "What is your warranty policy?",
    answer:
      "We provide a 12-month warranty for major components and 6 months for regular parts. The warranty covers manufacturing defects and does not include damage from misuse or normal wear and tear.",
  },
];

const ServiceSupportPage: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src="https://cache.miancp.com:2083/data/www.ducasubike.com/images/support_banner.png"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <h1 className="text-white text-5xl font-bold">Service Support</h1>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="border-b border-gray-200 overflow-hidden">
              <button
                className="w-full py-5 px-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}>
                <div className="flex items-center gap-4">
                  <span className="text-red-600 font-semibold">{faq.id}</span>
                  <span className="font-medium text-xl text-left">
                    {faq.question}
                  </span>
                </div>
                <span className="text-2xl transform transition-transform">
                  {openId === faq.id ? "−" : "+"}
                </span>
              </button>
              {openId === faq.id && (
                <div className="px-4 pb-5">
                  <div className="pl-12 text-gray-600">{faq.answer}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
          <p className="text-gray-600 mb-8">
            Our support team is available 24/7 to assist you with any questions
            or concerns.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="mailto:support@motoshop.com"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
              Contact Support
            </a>
            <a
              href="tel:+8613328107966"
              className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSupportPage;
