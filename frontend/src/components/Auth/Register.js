import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
    pan_number: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
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
    setLoading(true);

    let payload = formData;
    if (profileImage) {
      const fd = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== undefined && formData[key] !== null) {
          fd.append(key, formData[key]);
        }
      });
      fd.append("profile_image", profileImage);
      payload = fd;
    }

    const result = await register(payload);

    if (result.success) {
      toast.success("Registration successful!");
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
            to="/login"
            className="px-5 py-2 text-sm font-medium text-[#185697] border-2 border-[#185697] rounded-lg hover:bg-[#185697] hover:text-white transition"
          >
            Login
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#185697]">
                Create Account
              </h2>
              <p className="mt-2 text-gray-600">Join HyperLocal today</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold text-[#185697] mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#185697] focus:border-transparent transition"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

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
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#185697] focus:border-transparent transition"
                  placeholder="Enter phone number"
                  value={formData.phone}
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

              <div>
                <label className="block text-sm font-semibold text-[#185697] mb-2">
                  Register As
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, role: "customer" })
                    }
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                      formData.role === "customer"
                        ? "bg-[#185697] text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "agent" })}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                      formData.role === "agent"
                        ? "bg-[#185697] text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Agent
                  </button>
                </div>
              </div>

              {formData.role === "agent" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-[#185697] mb-2">
                      PAN Card Number
                    </label>
                    <input
                      id="pan_number"
                      name="pan_number"
                      type="text"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#185697] focus:border-transparent transition uppercase"
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      value={formData.pan_number}
                      onChange={handleChange}
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
                            {profileImage ? profileImage.name : "Choose photo"}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#F69130] text-white font-bold rounded-xl hover:bg-[#e57f1f] transition shadow-lg disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#F69130] font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
