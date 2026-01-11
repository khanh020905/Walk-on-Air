import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Heart,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  X,
} from "lucide-react";
import { useCart } from "../../components/context/cart-context/cartContext";

import Navbar from "../../components/layout/nav-bar/nav-bar";
import Notification from "../../components/common/Notification";

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState({
    isVisible: false,
    message: "",
  });
  const navigate = useNavigate();

  const showNotification = (message) => {
    setNotification({ isVisible: true, message });
  };

  const closeNotification = () => {
    setNotification({ ...notification, isVisible: false });
  };

  const handlePaymentComplete = async () => {
    setIsProcessing(true);
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("Please log in to complete your order.");
        return;
      }

      const orderItems = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const payload = {
        userId: userId,
        orderItems: orderItems,
        paymentMethod: "BANK_TRANSFER",
      };

      const baseUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

      const response = await fetch(
        `http://localhost:8080/api/orders/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Payment failed");
      }

      const data = await response.json();

      if (data.code === 1000) {
        clearCart();
        setShowCheckout(false);
        showNotification(
          "Order placed successfully! Please check your email for the bill."
        );
        setTimeout(() => {
          navigate("/");
        }, 3500);
      } else {
        showNotification(
          "Failed to place order: " + (data.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-blue-600">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Your Cart</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Your Bag</h1>
          <p className="text-gray-500 mt-2">
            {cartItems.length} items in your cart are reserved for 60 minutes.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="flex-1 space-y-6">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 transition hover:shadow-md"
                >
                  {/* Image */}
                  <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.images ? item.images[0] : item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Size: {item.size} | Color: {item.color}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    <p className="text-green-600 text-sm font-medium mb-4">
                      In Stock
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.size,
                                item.color,
                                item.quantity - 1
                              )
                            }
                            className="p-2 text-gray-500 hover:text-gray-900 transition"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-medium text-gray-900 text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.size,
                                item.color,
                                item.quantity + 1
                              )
                            }
                            className="p-2 text-gray-500 hover:text-gray-900 transition"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() =>
                            removeFromCart(item.id, item.size, item.color)
                          }
                          className="text-gray-400 hover:text-red-500 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <button className="text-sm text-blue-600 font-medium hover:underline">
                        Move to Favorites
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500 mb-6">Your cart is empty.</p>
                <Link
                  to="/men-collection"
                  className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition"
                >
                  Start Shopping
                </Link>
              </div>
            )}

            <Link
              to="/men-collection"
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
            >
              <ArrowLeft size={18} />
              Continue Shopping
            </Link>
          </div>

          {/* Sidebar */}
          <div className="lg:w-96 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Estimate</span>
                  <span className="font-medium text-green-600">
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax Estimate</span>
                  <span className="font-medium text-gray-900">
                    ${tax.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 mb-6">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-gray-900 block">
                      ${total.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500">
                      (includes ${tax.toFixed(2)} tax)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                  <button className="bg-gray-100 text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                    Apply
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
                <span>Secure Checkout</span>
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                <Heart size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Need Help?</h4>
                <p className="text-xs text-gray-500 mb-2 leading-relaxed">
                  Call us at 1-800-SHOES-00 or chat with our support team.
                </p>
                <button className="text-blue-600 text-sm font-bold hover:underline">
                  Chat Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCheckout(false)}
          />
          <div className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-fade-in-up">
            <button
              onClick={() => setShowCheckout(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full transition"
            >
              <X size={20} />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <img
                  src="/mock_qr_code_bank.png"
                  alt="Bank Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Scan to Pay
              </h3>
              <p className="text-gray-500 mb-8">
                Please scan the QR code below with your banking app to complete
                the payment of{" "}
                <span className="font-bold text-gray-900">
                  ${total.toFixed(2)}
                </span>
              </p>

              <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-gray-200 inline-block mb-8">
                <img
                  src="/mock_qr_code_bank.png"
                  alt="Payment QR Code"
                  className="w-48 h-48 object-contain mix-blend-multiply"
                />
              </div>

              <div className="space-y-3">
                <button
                  onClick={handlePaymentComplete}
                  disabled={isProcessing}
                  className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessing
                    ? "Processing..."
                    : "I have completed the payment"}
                </button>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="w-full bg-white text-gray-700 font-bold py-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Notification
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={closeNotification}
      />
    </div>
  );
};

export default CartPage;
