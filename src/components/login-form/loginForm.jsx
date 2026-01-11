import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, ShoppingBag, Star, User } from "lucide-react";
import Footer from "../layout/footer/footer";
import { useAuth } from "../context/auth-context/authContext";
import { GoogleLogin } from "@react-oauth/google";

const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("http://localhost:8080/api/user/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.data);
        localStorage.setItem("userId", data.data.id);
        setStatus({ type: "success", message: "Google Login Successfully!" });
        navigate("/");
      } else {
        throw new Error(data.message || "Google Login failed");
      }
    } catch (error) {
      console.error("Google Auth Error:", error);
      setStatus({ type: "error", message: "Google Authentication failed" });
    }
  };

  const handleLoginFail = () => {
    setStatus({ type: "error", message: "Google Login Failed" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch("http://localhost:8080/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.data);
        localStorage.setItem("userId", data.data.id);
        setStatus({ type: "success", message: "Welcome back!" });
        setTimeout(() => navigate("/"), 1000);
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <div className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden w-full max-w-6xl flex flex-col md:flex-row min-h-[700px]">
          {/* Left Side (Visual) */}
          <div className="hidden md:flex md:w-1/2 bg-blue-600 relative p-12 flex-col justify-between overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "40px 40px",
              }}
            ></div>
            <div className="relative z-10 flex flex-col h-full justify-center items-center">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl w-full max-w-sm relative group hover:scale-105 transition duration-500">
                <div className="absolute -top-6 -left-6 bg-yellow-400 text-blue-900 p-4 rounded-2xl shadow-lg transform -rotate-12">
                  <Star fill="currentColor" size={24} />
                  <span className="block text-xs font-bold text-center mt-1">
                    TOP
                  </span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop"
                  alt="Sneaker"
                  className="w-full drop-shadow-2xl rounded-2xl mb-6 transform group-hover:-rotate-6 transition duration-500"
                />
                <div className="space-y-2">
                  <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                    New Arrival
                  </span>
                  <h2 className="text-4xl font-extrabold text-white leading-tight">
                    Walk on <br /> Air.
                  </h2>
                  <p className="text-blue-100 text-sm opacity-90">
                    Experience the ultimate blend of style and comfort.
                  </p>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white text-blue-900 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShoppingBag size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">
                      Limited Offer
                    </p>
                    <p className="text-lg font-black">50% OFF</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side (Form) */}
          <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                  Welcome Back
                </h1>
                <p className="text-gray-500">
                  Step back into style. Please enter your details.
                </p>
              </div>

              {status.message && (
                <div
                  className={`p-4 mb-6 rounded-xl text-sm font-medium flex items-center gap-2 ${
                    status.type === "error"
                      ? "bg-red-50 text-red-600"
                      : "bg-green-50 text-green-600"
                  }`}
                >
                  {status.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Input */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Username or Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <User size={20} />
                    </div>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition text-gray-900 font-medium"
                      placeholder="Username or email"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Lock size={20} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition text-gray-900 font-medium"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <Link
                      to="/forgot-password"
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition transform active:scale-[0.98] shadow-lg shadow-blue-600/30"
                >
                  Log In
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-wider">
                  <span className="px-4 bg-white text-gray-400 font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Buttons - CORRECTED */}
              <div className="w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleLoginFail}
                  theme="outline"
                  size="large"
                  width="100%"
                />
              </div>

              <p className="text-center mt-8 text-gray-500 font-medium">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 font-bold hover:underline ml-1"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginForm;
