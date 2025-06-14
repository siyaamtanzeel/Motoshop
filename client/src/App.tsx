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
      <footer className="relative z-30 bg-gray-100 text-center py-6 text-gray-500 mt-12 border-t">
        &copy; {new Date().getFullYear()} MotoShop. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
