import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../slices/authSlice";
import type { RootState } from "../store";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(register({ name, email, password }) as any);
    if ((result as any).meta.requestStatus === "fulfilled") {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-primary-200 px-2">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-primary-100">
        <div className="flex flex-col items-center mb-6">
          <img src="/vite.svg" alt="MotoShop Logo" className="h-12 mb-2" />
          <h2 className="text-2xl font-bold text-primary-700">
            Create an Account
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary-200"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary-200"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary-200"
            required
          />
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold text-lg"
            disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="text-primary-600 hover:underline">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
