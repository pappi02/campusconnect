import React, { useState } from "react";
import { Clock, ShoppingBasket, Truck, Plus, Minus } from "lucide-react";

const faqData = [
  {
    question: "How does CampusDelivery work?",
    answer:
      "CampusDelivery connects you with local grocery vendors, farmers, and wholesalers to deliver fresh groceries directly to your doorstep. Simply browse, add items to your cart, and check out. We'll handle the rest!",
  },
  {
    question: "Can I schedule a delivery time?",
    answer:
      "Yes! During checkout, you can choose from available time slots to schedule your preferred delivery time. Same-day and next-day delivery options are available based on your location.",
  },
  {
    question: "What if an item I ordered is out of stock?",
    answer:
      "If an item is unavailable, we will notify you immediately and offer suitable replacements or a full refund for that item. You can also choose to be notified when it's restocked.",
  },
];

const AboutDelivery = () => {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <section className="px-2 lg:px-4 py-3 bg-white w-full">
      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">
        About Delivery
      </h2>

      {/* Top Icons Section */}
      <div className="grid grid-cols-3 gap-2 text-center mb-3">
        <div className="flex flex-col items-center text-xs px-1">
          <Clock className="mb-2 text-blue-600" size={28} />
          <h3 className="font-semibold text-sm mb-1">How long to wait?</h3>
          <p className="text-gray-600 text-xs">
            Quick delivery options based on your location and vendor selection.
          </p>
        </div>
        <div className="flex flex-col items-center text-xs px-1">
          <ShoppingBasket className="mb-2 text-blue-600" size={28} />
          <h3 className="font-semibold text-sm mb-1">What will they bring?</h3>
          <p className="text-gray-600 text-xs">
            Groceries, farm-fresh produce, and essentials straight to your door.
          </p>
        </div>
        <div className="flex flex-col items-center text-xs px-1">
          <Truck className="mb-2 text-blue-600" size={28} />
          <h3 className="font-semibold text-sm mb-1">How will they bring?</h3>
          <p className="text-gray-600 text-xs">
            Secure, timely, and contactless delivery by verified riders.
          </p>
        </div>
      </div>

      {/* Bottom Section: FAQ + Contact */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {/* FAQs */}
        <div className="md:col-span-2 flex flex-col gap-2 text-sm">
          {faqData.map((faq, idx) => (
            <div
              key={idx}
              className="bg-gray-200 rounded-md p-2 cursor-pointer"
              onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
            >
              <div className="flex justify-between items-center">
                <p className="font-medium text-gray-800 text-sm">{faq.question}</p>
                {openIndex === idx ? <Minus size={16} /> : <Plus size={16} />}
              </div>
              {openIndex === idx && (
                <p className="mt-1 text-gray-600 text-xs">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>

        {/* Contact Us */}
        <div className="bg-gray-200 rounded-md p-3 flex flex-col justify-between text-center text-sm">
          <div>
            <Plus size={28} className="text-blue-600 mx-auto mb-1" />
            <h4 className="font-semibold text-sm mb-1">Still have questions?</h4>
            <p className="text-gray-600 text-xs mb-3">
              Reach out and we’ll respond shortly!
            </p>
          </div>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-sm px-4 py-1.5 rounded-full transition">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutDelivery;
