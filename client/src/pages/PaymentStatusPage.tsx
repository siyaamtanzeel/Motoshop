import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

export const PaymentStatusPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate(orderId ? `/orders/${orderId}` : "/profile");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, orderId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        {status === "success" ? (
          <div className="text-center space-y-4">
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              Payment Successful!
            </h2>
            <p className="text-gray-600">
              Your payment has been processed successfully. You will be
              redirected to your order details shortly.
            </p>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <XCircleIcon className="mx-auto h-16 w-16 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">Payment Failed</h2>
            <p className="text-gray-600">
              {searchParams.get("reason") ||
                "There was an issue processing your payment. Please try again later."}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
