import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

function Navbar({ onOpenLogin, onOpenSignup }) {
  return (
    <header className="bg-white shadow-lg border-b-2 border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
        <Link to="/" className="flex items-center -my-16">
          <img
            src="/hyperlocal.png"
            alt="HyperLocal Logo"
            className="h-56 w-auto hover:opacity-90 transition"
          />
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenLogin}
            className="px-5 py-2 text-sm font-medium text-[#185697] border-2 border-[#185697] rounded-lg hover:bg-[#185697] hover:text-white transition"
          >
            Login
          </button>
          <button
            onClick={onOpenSignup}
            className="px-5 py-2 bg-[#F69130] text-white text-sm font-bold rounded-lg hover:bg-[#e57f1f] transition shadow-lg"
          >
            Sign Up
          </button>
        </div>
      </nav>
    </header>
  );
}

function Hero({ onOrderNow }) {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#185697] mb-6 leading-tight">
          Fast Local
          <span className="block text-[#F69130]">Deliveries</span>
        </h1>
        <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
          Groceries, medicines, and custom orders delivered to your doorstep in
          minutes
        </p>
        <button
          onClick={onOrderNow}
          className="px-10 py-4 bg-[#F69130] text-white text-lg font-bold rounded-lg hover:bg-[#e57f1f] transition shadow-xl"
        >
          Get Started
        </button>
      </div>
    </section>
  );
}

function CategoryCard({ title, description, icon }) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-[#185697] hover:shadow-xl transition-all duration-300 group">
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[#185697] mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function HowStep({ number, title, description }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#185697] text-white font-bold text-2xl mb-6 shadow-lg">
        {number}
      </div>
      <h3 className="text-xl font-bold text-[#185697] mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function AuthModal({ open, onClose, mode = "login", onSwitchMode }) {
  const [activeRole, setActiveRole] = useState("customer");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const ref = useRef(null);
  const { login, register } = useAuth();

  useEffect(() => {
    if (open) {
      setTimeout(() => ref.current?.focus(), 100);
    } else {
      setEmailOrPhone("");
      setPassword("");
      setName("");
      setPhone("");
      setPanNumber("");
      setProfileImage(null);
      setImagePreview(null);
      setActiveRole("customer");
    }
  }, [open]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "login") {
      const result = await login(emailOrPhone, password);
      if (result.success) {
        toast.success("Login successful");
        onClose();
      } else {
        toast.error(result.error || "Login failed");
      }
      return;
    }

    // For signup with file upload
    if (profileImage || panNumber) {
      const formData = new FormData();
      formData.append("name", name || emailOrPhone.split("@")[0]);
      formData.append("email", emailOrPhone);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("role", activeRole);
      if (panNumber) formData.append("pan_number", panNumber);
      if (profileImage) formData.append("profile_image", profileImage);

      const result = await register(formData);
      if (result.success) {
        toast.success("Registration successful");
        onClose();
      } else {
        toast.error(result.error || "Registration failed");
      }
    } else {
      const payload = {
        name: name || emailOrPhone.split("@")[0],
        email: emailOrPhone,
        phone: phone,
        password,
        role: activeRole,
      };

      const result = await register(payload);
      if (result.success) {
        toast.success("Registration successful");
        onClose();
      } else {
        toast.error(result.error || "Registration failed");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-[#185697]">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ✕
            </button>
          </div>

          {mode === "signup" && (
            <div className="flex gap-3 mb-8">
              {["customer", "agent"].map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                    activeRole === role
                      ? "bg-[#185697] text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-[#185697] mb-2">
                    Full Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#185697] focus:border-transparent transition"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#185697] mb-2">
                    Phone Number
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#185697] focus:border-transparent transition"
                    placeholder="Enter phone number"
                  />
                </div>

                {activeRole === "agent" && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-[#185697] mb-2">
                        PAN Card Number
                      </label>
                      <input
                        value={panNumber}
                        onChange={(e) =>
                          setPanNumber(e.target.value.toUpperCase())
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#185697] focus:border-transparent transition uppercase"
                        placeholder="ABCDE1234F"
                        maxLength={10}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Required for delivery partners
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#185697] mb-2">
                        Profile Photo
                      </label>
                      <div className="flex items-center gap-4">
                        {imagePreview && (
                          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#5CB85C]">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <label className="flex-1 cursor-pointer">
                          <div className="px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#185697] transition text-center">
                            <span className="text-sm text-gray-600">
                              {profileImage
                                ? profileImage.name
                                : "Choose photo"}
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Upload a clear photo for verification
                      </p>
                    </div>
                  </>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-[#185697] mb-2">
                Email Address
              </label>
              <input
                ref={ref}
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                type="email"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#185697] focus:border-transparent transition"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#185697] mb-2">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#185697] focus:border-transparent transition"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#F69130] text-white font-bold rounded-xl hover:bg-[#e57f1f] transition shadow-lg"
            >
              {mode === "login" ? "Login" : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {mode === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={() => {
                  if (onSwitchMode) {
                    onSwitchMode(mode === "login" ? "signup" : "login");
                  }
                }}
                className="text-[#F69130] font-semibold hover:underline"
              >
                {mode === "login" ? "Sign up" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [authOpen, setAuthOpen] = useState({ open: false, mode: "login" });

  const openLogin = () => setAuthOpen({ open: true, mode: "login" });
  const openSignup = () => setAuthOpen({ open: true, mode: "signup" });
  const closeAuth = () => setAuthOpen({ open: false, mode: "login" });

  return (
    <div className="min-h-screen bg-white">
      <Navbar onOpenLogin={openLogin} onOpenSignup={openSignup} />

      <main>
        <Hero onOrderNow={openSignup} />

        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-[#185697] text-center mb-16">
              What We Deliver
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <CategoryCard
                icon="🛒"
                title="Groceries"
                description="Fresh groceries from your local stores delivered quickly to your doorstep"
              />
              <CategoryCard
                icon="💊"
                title="Medicines"
                description="Get your medicines delivered safely with prescription upload support"
              />
              <CategoryCard
                icon="📦"
                title="Custom Orders"
                description="Anything from local shops, we'll pick it up and deliver it for you"
              />
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-[#185697] text-center mb-16">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <HowStep
                number="1"
                title="Place Your Order"
                description="Select category and add items you need with pickup and delivery addresses"
              />
              <HowStep
                number="2"
                title="Agent Accepts"
                description="Nearby verified delivery partner accepts your order in real-time"
              />
              <HowStep
                number="3"
                title="Track & Receive"
                description="Live tracking updates and instant notifications until delivery"
              />
            </div>
          </div>
        </section>

        <section className="bg-[#5CB85C] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white rounded-2xl p-12 shadow-2xl">
              <h2 className="text-4xl font-bold text-[#185697] mb-4">
                Trusted & Verified Partners
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                All our delivery partners are verified and background-checked
                for your safety
              </p>
              <div className="flex justify-center gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-[#185697]">500+</div>
                  <div className="text-gray-600">Verified Agents</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#185697]">10k+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#185697]">50k+</div>
                  <div className="text-gray-600">Deliveries</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#185697] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Join thousands of happy customers using HyperLocal
            </p>
            <button
              onClick={openSignup}
              data-signup
              className="px-10 py-4 bg-[#F69130] text-white text-lg font-bold rounded-lg hover:bg-[#e57f1f] transition shadow-xl"
            >
              Sign Up Now
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-[#185697] border-t border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center items-center mb-6">
              <Link to="/">
                <img
                  src="/hyperlocal.png"
                  alt="HyperLocal Logo"
                  className="h-48 w-auto hover:opacity-90 transition"
                />
              </Link>
            </div>
            <p className="text-blue-200 mb-4">
              © 2025 HyperLocal Delivery. All rights reserved.
            </p>
            <div className="flex justify-center gap-6 text-sm text-blue-300">
              <Link
                to="/under-development"
                className="hover:text-[#F69130] transition"
              >
                Terms
              </Link>
              <Link
                to="/under-development"
                className="hover:text-[#F69130] transition"
              >
                Privacy
              </Link>
              <a
                href="https://github.com/shubhranshu-pandey"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F69130] transition"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal
        open={authOpen.open}
        onClose={closeAuth}
        mode={authOpen.mode}
        onSwitchMode={(newMode) => setAuthOpen({ open: true, mode: newMode })}
      />
    </div>
  );
}
