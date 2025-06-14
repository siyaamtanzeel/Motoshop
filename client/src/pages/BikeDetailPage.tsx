import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { createOrder } from "../services/orderService";
import { createPayment } from "../services/paymentService";
import type { Bike } from "../slices/bikeSlice";

const BikeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { bikes } = useSelector((state: RootState) => state.bikes) as {
    bikes: Bike[];
  };
  const bike = bikes.find((b: Bike) => b._id === id);
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [buySuccess, setBuySuccess] = useState(false);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    address: "",
    phone: "",
    city: "",
    postcode: "",
  });

  if (!bike) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Motorcycle not found
          </h2>
          <p className="mt-2 text-gray-600">
            The motorcycle you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700">
            <ArrowLeftIcon className="h-5 w-5" />
            Go back
          </button>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % bike.images.length);
  };

  const prevImage = () => {
    setActiveImage(
      (prev) => (prev - 1 + bike.images.length) % bike.images.length
    );
  };

  const handleBuy = async () => {
    if (!user) {
      navigate("/login", { state: { from: `/bikes/${bike._id}` } });
      return;
    }

    if (!showShippingForm) {
      setShowShippingForm(true);
      setShippingDetails({
        name: user.name || "",
        address: "",
        phone: "",
        city: "",
        postcode: "",
      });
      return;
    }

    // Validate shipping details
    const missingFields = Object.entries(shippingDetails).filter(
      ([_, value]) => !value.trim()
    );
    if (missingFields.length > 0) {
      setBuyError(
        `Please fill in: ${missingFields.map(([key]) => key).join(", ")}`
      );
      return;
    }

    setBuying(true);
    setBuyError(null);
    try {
      const order = await createOrder(bike._id);
      console.log("Order created:", order);
      const payment = await createPayment(order._id, shippingDetails);
      console.log("Payment initiated:", payment);

      if (payment.GatewayPageURL) {
        window.location.href = payment.GatewayPageURL;
        return;
      }
      setBuySuccess(true);
    } catch (err: any) {
      console.error("Payment error:", err);
      if (err.message === "Please login to continue") {
        navigate("/login", { state: { from: `/bikes/${bike._id}` } });
        return;
      }
      setBuyError(err.message || "Failed to process payment");
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="font-medium">Back to motorcycles</span>
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-w-16 aspect-h-9 bg-gray-100 rounded-xl overflow-hidden">
                <motion.img
                  key={activeImage}
                  src={bike.images[activeImage] || "/placeholder.jpg"}
                  alt={bike.title}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                {bike.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-colors">
                      <ChevronLeftIcon className="h-6 w-6 text-gray-900" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-colors">
                      <ChevronRightIcon className="h-6 w-6 text-gray-900" />
                    </button>
                  </>
                )}
              </div>
              {bike && bike.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {bike.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative flex-shrink-0 rounded-lg overflow-hidden ${
                        idx === activeImage
                          ? "ring-2 ring-primary-500"
                          : "hover:opacity-75"
                      }`}>
                      <img
                        src={img}
                        alt={`${bike.title} view ${idx + 1}`}
                        className="h-20 w-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {bike.title}
                </h1>
                <div className="mt-4 flex items-center gap-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ${bike.price.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      (24 reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600">{bike.description}</p>
              </div>

              {bike.category && (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 text-sm font-medium bg-primary-50 text-primary-700 rounded-full">
                    {bike.category}
                  </span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Specifications
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(bike.specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <WrenchScrewdriverIcon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          {key}
                        </dt>
                        <dd className="text-sm font-semibold text-gray-900">
                          {String(value)}
                        </dd>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 border-t border-gray-200 pt-6">
                {showShippingForm ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Shipping Details</h3>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={shippingDetails.name}
                      onChange={(e) =>
                        setShippingDetails({
                          ...shippingDetails,
                          name: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      value={shippingDetails.address}
                      onChange={(e) =>
                        setShippingDetails({
                          ...shippingDetails,
                          address: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-lg"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={shippingDetails.phone}
                      onChange={(e) =>
                        setShippingDetails({
                          ...shippingDetails,
                          phone: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-lg"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={shippingDetails.city}
                        onChange={(e) =>
                          setShippingDetails({
                            ...shippingDetails,
                            city: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Postal Code"
                        value={shippingDetails.postcode}
                        onChange={(e) =>
                          setShippingDetails({
                            ...shippingDetails,
                            postcode: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  </div>
                ) : null}
                {buySuccess ? (
                  <div className="w-full px-8 py-4 bg-green-100 text-green-800 rounded-xl text-center font-semibold">
                    Order placed! We'll contact you soon.
                  </div>
                ) : (
                  <button
                    className="w-full px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-60"
                    onClick={handleBuy}
                    disabled={buying}>
                    {buying
                      ? "Processing..."
                      : showShippingForm
                      ? "Proceed to Payment"
                      : "Buy Now"}
                  </button>
                )}
                {buyError && (
                  <div className="w-full px-8 py-3 bg-red-100 text-red-700 rounded-xl text-center font-medium mt-2">
                    {buyError}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <TruckIcon className="h-6 w-6 text-gray-400" />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">Free Delivery</p>
                      <p className="text-gray-500">2-3 business days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <ShieldCheckIcon className="h-6 w-6 text-gray-400" />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">
                        2 Year Warranty
                      </p>
                      <p className="text-gray-500">Parts & labor</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <WrenchScrewdriverIcon className="h-6 w-6 text-gray-400" />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">Free Service</p>
                      <p className="text-gray-500">First 3 months</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeDetailPage;
