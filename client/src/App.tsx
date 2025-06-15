import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BikeListPage from "./pages/BikeListPage";
import AdminPanel from "./pages/AdminPanel";
import BikeDetailPage from "./pages/BikeDetailPage";
import NewsDetailPage from "./pages/NewsDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ServiceSupportPage from "./pages/ServiceSupportPage";
import { fetchBikes } from "./slices/bikeSlice";
import { setAuth } from "./slices/authSlice";
import api from "./api";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import "./App.css";
import { PaymentStatusPage } from "./pages/PaymentStatusPage";

function App() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          // Set auth state from localStorage
          dispatch(setAuth({ token, user: JSON.parse(storedUser) }));

          // Add token to default headers
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Optional: Verify token with backend
          await api.get("/auth/verify");
        } catch (err) {
          // If token is invalid, clear everything
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          delete api.defaults.headers.common["Authorization"];
          dispatch(setAuth({ token: null, user: null }));
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchBikes({}) as any);
  }, [dispatch]);

  return (
    <div className="relative min-h-screen">
      <div className="relative z-50">
        <Navbar />
      </div>
      <div className="relative z-40">
        {(location.pathname === "/" || location.pathname === "/bikes") && (
          <Hero />
        )}
      </div>
      <main className="relative z-30 min-h-[60vh]">
        <Routes>
          <Route path="/" element={<Navigate to="/bikes" />} />
          <Route path="/bikes" element={<BikeListPage />} />
          <Route path="/bikes/:id" element={<BikeDetailPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/support" element={<ServiceSupportPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/admin"
            element={
              user?.role === "admin" ? <AdminPanel /> : <Navigate to="/login" />
            }
          />
          <Route path="/payment/:status" element={<PaymentStatusPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
      <footer className="bg-[#1E1E1E] text-gray-300 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Product Column */}
            <div>
              <h3 className="text-white text-xl font-semibold mb-6">Product</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/bikes"
                    className="hover:text-white transition-colors">
                    Electric Motorcycle
                  </a>
                </li>
                <li>
                  <a
                    href="/bikes?category=scooter"
                    className="hover:text-white transition-colors">
                    Electric Scooter
                  </a>
                </li>
                <li>
                  <a
                    href="/bikes?category=kick-scooter"
                    className="hover:text-white transition-colors">
                    Electric Kick Scooter
                  </a>
                </li>
                <li>
                  <a
                    href="/bikes?category=bicycle"
                    className="hover:text-white transition-colors">
                    Electric Bicycle
                  </a>
                </li>
              </ul>
            </div>

            {/* News Column */}
            <div>
              <h3 className="text-white text-xl font-semibold mb-6">News</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/news"
                    className="hover:text-white transition-colors">
                    Latest Updates
                  </a>
                </li>
                <li>
                  <a
                    href="/events"
                    className="hover:text-white transition-colors">
                    Events
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h3 className="text-white text-xl font-semibold mb-6">Support</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/support/service"
                    className="hover:text-white transition-colors">
                    Service Support
                  </a>
                </li>
                <li>
                  <a
                    href="/support/download"
                    className="hover:text-white transition-colors">
                    Download Center
                  </a>
                </li>
              </ul>
            </div>

            {/* About Column */}
            <div>
              <h3 className="text-white text-xl font-semibold mb-6">About</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/about"
                    className="hover:text-white transition-colors">
                    About MotoShop
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="/cases"
                    className="hover:text-white transition-colors">
                    Customer Case
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h3 className="text-white text-xl font-semibold mb-6">Contact</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex flex-col gap-1">
                  <span className="text-white">Address:</span>
                  <span>123 Electric Avenue, Tech District</span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-white">Tel:</span>
                  <a
                    href="tel:+8613328107966"
                    className="hover:text-white transition-colors">
                    +86 133 2810 7966
                  </a>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-white">Email:</span>
                  <a
                    href="mailto:info@motoshop.com"
                    className="hover:text-white transition-colors">
                    info@motoshop.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center text-gray-500 text-sm mt-16 pt-8 border-t border-gray-800">
            Copyright © {new Date().getFullYear()} MotoShop. All Rights
            Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
