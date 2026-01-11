import React, { useEffect, useState } from "react";
import Navbar from "../layout/nav-bar/nav-bar";
import Footer from "../layout/footer/footer";
import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingBag } from "lucide-react"; // Added Icons

const FavoritePage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("jwt");

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        const url = `${backendUrl}/api/products?favorite=true&page=0&sizeLimit=100`;

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          const fetchedProducts = data.data.content || [];
          setFavorites(fetchedProducts);
        }
      } catch (error) {
        console.error("Failed to fetch favorites", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token]);

  // --- 2. REMOVE FAVORITE (Optimistic Update) ---
  const removeFavorite = async (e, id) => {
    e.preventDefault(); // Prevent navigating to product page
    e.stopPropagation();

    if (!token) return;

    // A. Backup current state (in case we need to revert)
    const previousFavorites = [...favorites];

    // B. Optimistic Update: Remove from UI immediately
    setFavorites((prev) => prev.filter((product) => product.id !== id));

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      // C. Call Backend
      const res = await fetch(
        `${backendUrl}/api/products/update-favorite/${id}?favorite=false`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to remove favorite");
      }
      // Success: Do nothing, UI is already updated
    } catch (error) {
      console.error(error);
      alert("Failed to remove item. Please try again.");
      // D. Revert: Put the item back if server failed
      setFavorites(previousFavorites);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-blue-600 font-semibold">
          Loading Wishlist...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
            <Link to="/" className="hover:text-blue-600">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">Favorites</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                My Wishlist
              </h1>
              <p className="text-gray-500 mt-2">
                {favorites.length} items saved
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        {favorites.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-6">
              <Heart size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-500 mb-8 text-center max-w-sm">
              Explore our collection and tap the heart icon to save items for
              later.
            </p>
            <Link
              to="/men-collection"
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-3xl p-4 transition hover:shadow-xl border border-transparent hover:border-gray-100 relative flex flex-col"
              >
                {/* Image Area */}
                <div className="relative aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden mb-4">
                  {/* Remove Button */}
                  <button
                    onClick={(e) => removeFavorite(e, product.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 transition z-10 shadow-sm"
                    title="Remove from favorites"
                  >
                    <Trash2 size={16} />
                  </button>

                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.imageUrl || product.images?.[0]} // Defensive image selection
                      alt={product.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700 mix-blend-multiply"
                    />
                  </Link>
                </div>

                {/* Content Area */}
                <div className="px-2 flex-grow flex flex-col">
                  <Link to={`/product/${product.id}`} className="block">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 hover:text-blue-600 transition truncate">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 font-medium mb-3">
                    {product.category}
                  </p>

                  {/* Price & Action */}
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-lg font-bold ${
                          product.originalPrice
                            ? "text-red-500"
                            : "text-blue-600"
                        }`}
                      >
                        ${product.price?.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Optional: Add to Cart Mini Button */}
                    <Link
                      to={`/product/${product.id}`}
                      className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-blue-600 hover:text-white transition"
                    >
                      <ShoppingBag size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default FavoritePage;
