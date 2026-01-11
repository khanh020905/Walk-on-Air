import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Search, ShoppingBag, Menu, LogOut, Heart } from "lucide-react";
import { useCart } from "../../context/cart-context/cartContext";

import { useAuth } from "../../context/auth-context/authContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <ShoppingBag size={20} fill="currentColor" />
            </div>

            <span className="text-xl font-bold tracking-tight">
              Walk on Air
            </span>
          </div>
        </Link>
        {/* Nav Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-gray-600">
          <NavLink
            to="/men-collection"
            className={({ isActive }) =>
              isActive ? "text-blue-600" : "hover:text-blue-600 transition"
            }
          >
            Men
          </NavLink>
          <NavLink
            to="/women-collection"
            className={({ isActive }) =>
              isActive ? "text-blue-600" : "hover:text-blue-600 transition"
            }
          >
            Women
          </NavLink>
          <NavLink
            to="/kids-collection"
            className={({ isActive }) =>
              isActive ? "text-blue-600" : "hover:text-blue-600 transition"
            }
          >
            Kids
          </NavLink>
          <NavLink
            to="/sale"
            className={({ isActive }) =>
              isActive
                ? "text-red-600 font-bold"
                : "text-red-500 hover:text-red-600 transition"
            }
          >
            Sale
          </NavLink>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-6">
          {/* Search Bar */}
          <div className="relative left-8 hidden md:block w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          {/* Favorites Button */}
          <Link
            to="/favorite"
            className="relative left-5 p-2 hover:bg-gray-100 rounded-full transition text-gray-600 hover:text-red-500"
          >
            <Heart size={20} />
          </Link>

          {/* Cart Button */}
          <Link
            to="/cart"
            className="relative p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[10px] font-bold text-white flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <Menu size={24} />
          </div>

          {/* Auth Section: Conditional Rendering */}
          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                {/* 1. AVATAR LOGIC: Check if user has a picture */}
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover border-2 border-blue-100 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border-2 border-blue-50">
                    {user.username
                      ? user.username.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                )}

                {/* User Name Text */}
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-700 leading-tight max-w-[100px] truncate">
                    {user.username}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">
                    Member
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-500 transition hover:bg-red-50 rounded-full"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:inline-block px-5 py-2 text-sm font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
