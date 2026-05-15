import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success("Login successful!");
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header with Logo */}
      <header className="bg-white shadow-lg border-b-2 border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <Link to="/" className="flex items-center -my-12 -ml-4">
            <img
              src="/hyperlocal.png"
              alt="HyperLocal Logo"
              className="h-48 w-auto hover:opacity-90 transition"
            />
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 bg-[#F69130] text-white text-sm font-bold rounded-lg hover:bg-[#e57f1f] transition shadow-lg"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#185697]">
                Welcome Back
              </h2>
              <p className="mt-2 text-gray-600">Sign in to your account</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold text-[#185697] mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#185697] focus:border-transparent transition"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#185697] mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#185697] focus:border-transparent transition"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#F69130] text-white font-bold rounded-xl hover:bg-[#e57f1f] transition shadow-lg disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-[#F69130] font-semibold hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-8 p-4 bg-[#5CB85C]/10 border-2 border-[#5CB85C]/30 rounded-xl">
              <h3 className="font-semibold text-[#185697] mb-3 text-center">
                Demo Accounts
              </h3>
              <div className="text-sm text-gray-700 space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Admin:</span>
                  <span>admin@delivery.com / password</span>
                </div>
                <div className="text-xs text-gray-600 text-center mt-2">
                  Or register as Customer or Agent
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
