import React, { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

const Notification = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-24 left-330 transform -translate-x-1/2 z-[100] transition-all duration-300 ease-in-out">
      <div className="bg-white border-l-4 border-green-500 rounded-r-lg shadow-xl px-6 py-4 flex items-center gap-4 min-w-[320px] animate-fade-in-down">
        <div className="bg-green-100 p-2 rounded-full">
          <CheckCircle className="text-green-600" size={20} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 text-sm">Success</h4>
          <p className="text-gray-600 text-sm">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Notification;
