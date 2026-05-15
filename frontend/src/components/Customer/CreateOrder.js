import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CreateOrder = ({ onOrderCreated }) => {
  const [formData, setFormData] = useState({
    category: "groceries",
    items_text: "",
    pickup_address: "",
    delivery_address: "",
  });
  const [loading, setLoading] = useState(false);
  const [nlpSuggestion, setNlpSuggestion] = useState(null);
  const [nlpLoading, setNlpLoading] = useState(false);
  const debounceTimer = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL || "";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // NLP processing with debounce
  useEffect(() => {
    if (formData.items_text.trim().length > 10) {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        processNLP(formData.items_text);
      }, 1500);
    } else {
      setNlpSuggestion(null);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [formData.items_text]);

  const processNLP = async (text) => {
    try {
      setNlpLoading(true);
      const response = await axios.post(
        `${API_URL}/api/orders/process-nlp`,
        { text, category: formData.category },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.suggestion && response.data.suggestion !== text) {
        setNlpSuggestion(response.data);
      } else {
        setNlpSuggestion(null);
      }
    } catch (error) {
      console.error("NLP processing error:", error);
    } finally {
      setNlpLoading(false);
    }
  };

  const applySuggestion = () => {
    if (nlpSuggestion) {
      setFormData({
        ...formData,
        items_text: nlpSuggestion.suggestion,
      });
      setNlpSuggestion(null);
      toast.success("Suggestion applied!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/orders`, formData);
      toast.success("Order created successfully!");
      setFormData({
        category: "groceries",
        items_text: "",
        pickup_address: "",
        delivery_address: "",
      });
      onOrderCreated();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  const categoryIcons = {
    groceries: "🛒",
    medicines: "💊",
    custom: "📦",
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl border-2 border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-[#185697] to-[#2a6ba8] p-6">
        <h2 className="text-2xl font-bold text-white">Create New Order</h2>
        <p className="text-blue-100 mt-1">
          Tell us what you need and we'll deliver it
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Category Selection */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-semibold text-[#185697] mb-3"
          >
            Select Category
          </label>
          <div className="grid grid-cols-3 gap-3">
            {["groceries", "medicines", "custom"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.category === cat
                    ? "border-[#F69130] bg-orange-50 shadow-md"
                    : "border-gray-200 hover:border-[#185697] hover:bg-gray-50"
                }`}
              >
                <div className="text-3xl mb-2">{categoryIcons[cat]}</div>
                <div
                  className={`text-sm font-semibold capitalize ${
                    formData.category === cat
                      ? "text-[#F69130]"
                      : "text-gray-700"
                  }`}
                >
                  {cat}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Items List */}
        <div>
          <label
            htmlFor="items_text"
            className="block text-sm font-semibold text-[#185697] mb-2"
          >
            Items List
          </label>
          <div className="relative">
            <textarea
              id="items_text"
              name="items_text"
              rows={5}
              required
              value={formData.items_text}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#185697] focus:border-transparent transition resize-none"
              placeholder="List the items you need... (You can write in Hindi or English)"
            />
            {nlpLoading && (
              <div className="absolute top-3 right-3">
                <svg
                  className="animate-spin h-5 w-5 text-[#185697]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            )}
          </div>

          {/* NLP Suggestion Box */}
          {nlpSuggestion && (
            <div className="mt-3 p-4 bg-green-50 border-2 border-[#5CB85C] rounded-xl">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#5CB85C] font-semibold text-sm">
                      ✨ Clearer Version Suggested
                    </span>
                    {nlpSuggestion.detectedLanguage && (
                      <span className="text-xs bg-[#5CB85C] text-white px-2 py-1 rounded-full">
                        {nlpSuggestion.detectedLanguage}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">
                    {nlpSuggestion.suggestion}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={applySuggestion}
                      className="px-4 py-2 bg-[#5CB85C] text-white text-sm font-semibold rounded-lg hover:bg-[#4a9d4a] transition"
                    >
                      Use This
                    </button>
                    <button
                      type="button"
                      onClick={() => setNlpSuggestion(null)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 transition"
                    >
                      Keep Original
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="mt-2 text-xs text-gray-500 flex items-start gap-1">
            <span>💡</span>
            <span>
              Write in any language! Our AI will help clarify your order for the
              delivery partner.
            </span>
          </p>
        </div>

        {/* Pickup Address */}
        <div>
          <label
            htmlFor="pickup_address"
            className="block text-sm font-semibold text-[#185697] mb-2"
          >
            📍 Pickup Address
          </label>
          <textarea
            id="pickup_address"
            name="pickup_address"
            rows={3}
            required
            value={formData.pickup_address}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#185697] focus:border-transparent transition resize-none"
            placeholder="Where should the delivery partner pick up the items?"
          />
        </div>

        {/* Delivery Address */}
        <div>
          <label
            htmlFor="delivery_address"
            className="block text-sm font-semibold text-[#185697] mb-2"
          >
            🏠 Delivery Address
          </label>
          <textarea
            id="delivery_address"
            name="delivery_address"
            rows={3}
            required
            value={formData.delivery_address}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#185697] focus:border-transparent transition resize-none"
            placeholder="Where should the items be delivered?"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#F69130] text-white text-lg font-bold rounded-xl hover:bg-[#e57f1f] transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Order...
              </>
            ) : (
              "Create Order"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrder;
