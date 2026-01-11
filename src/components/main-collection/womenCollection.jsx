import React, { useEffect, useState } from "react";
import Navbar from "../layout/nav-bar/nav-bar";
import Footer from "../layout/footer/footer";
import { ChevronDown, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const AVAILABLE_SIZES = [
  "5",
  "5.5",
  "6",
  "6.5",
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
];

const WomenCollection = ({ category, setCategory }) => {
  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([80, 240]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [numberOfProducts, setNumberOfProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("jwt");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `${import.meta.env.VITE_BACKEND_URL}/api/products?page=${
          currentPage - 1
        }&sizeLimit=12&mainCategory=Women`;

        if (category !== "All" && category) url += `&category=${category}`;
        if (selectedSize) url += `&size=${selectedSize}`;
        url += `&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}`;

        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(url, { method: "GET", headers });

        if (res.ok) {
          const data = await res.json();
          const fetchedProducts = data.data.content;

          setProducts(fetchedProducts);
          setTotalPages(data.data.totalPages);
          setNumberOfProducts(data.data.totalElements);

          if (token) {
            const initialFavIds = fetchedProducts
              .filter((p) => p.favorite === true)
              .map((p) => p.id);
            setFavorites(initialFavIds);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, [currentPage, category, selectedSize, priceRange, token]);

  const toggleFavorite = async (id) => {
    if (!token) {
      alert("Please Login first to add favorites");
      return;
    }
    const isCurrentlyFav = favorites.includes(id);
    const newStatus = !isCurrentlyFav;

    setFavorites((prev) => {
      if (isCurrentlyFav) {
        return prev.filter((favId) => favId !== id);
      } else {
        return [...prev, id];
      }
    });

    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/products/update-favorite/${id}?favorite=${newStatus}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update");
      }
    } catch (error) {
      console.log(error);
      alert("Failed to update favorite. Please try again.");
      setFavorites((prev) => {
        if (isCurrentlyFav) {
          return [...prev, id];
        } else {
          return prev.filter((favId) => favId !== id);
        }
      });
    }
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setCurrentPage(1);
    setSelectedSize(null);
  };

  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = Number(value);
    setPriceRange(newRange);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSizeClick = (size) => {
    if (selectedSize === size) setSelectedSize(null);
    else setSelectedSize(size);
    setCurrentPage(1);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
      <Navbar />

      {/* Header Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
            <Link to="/">Home</Link> <span className="text-gray-300">/</span>
            <span>Women</span> <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
              {category || "All"}
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                Women's Collection
              </h1>
              <p className="text-gray-500 mt-2">
                {numberOfProducts} items found
              </p>
            </div>
            {/* Sort Button (Static for now) */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700">
                Featured <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* --- SIDEBAR --- */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-10">
            {/* Categories */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Categories
              </h3>
              <div className="space-y-3">
                {[
                  "All",
                  "Running",
                  "Lifestyle",
                  "Training",
                  "Walking",
                  "Trail",
                ].map((cat) => (
                  <label
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center transition ${
                        cat === (category || "All")
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300 group-hover:border-blue-500"
                      }`}
                    >
                      {cat === (category || "All") && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        cat === (category || "All")
                          ? "font-semibold text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="pointer text-lg font-bold text-gray-900">
                  Size
                </h3>
                <button
                  onClick={() => setSelectedSize(null)}
                  className="cursor-pointer text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Reset
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {AVAILABLE_SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeClick(size)}
                    className={`cursor-pointer py-2.5 rounded-lg text-sm font-semibold transition border ${
                      selectedSize === size
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Price Range</h3>
              </div>
              <div className="px-2">
                {/* Inputs */}
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(0, e.target.value)}
                    className="w-full p-2 text-sm border rounded-lg"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(1, e.target.value)}
                    className="w-full p-2 text-sm border rounded-lg"
                  />
                </div>
                {/* Slider */}
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(1, e.target.value)}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>
          </div>

          {/* --- PRODUCT GRID --- */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                {selectedSize ? (
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      We will stock in the future
                    </h3>
                    <p className="text-gray-500">
                      Working on getting size {selectedSize} back.
                    </p>
                  </div>
                ) : (
                  <p className="text-lg text-gray-500">No products found.</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-3xl p-4 transition hover:shadow-xl border border-transparent hover:border-gray-100"
                  >
                    <div className="relative aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden mb-6">
                      {product.badge && (
                        <span
                          className={`absolute top-4 left-4 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider rounded-full z-10 ${product.badgeColor}`}
                        >
                          {product.badge}
                        </span>
                      )}

                      {/* --- HEART BUTTON --- */}
                      <button
                        onClick={(e) => {
                          e.preventDefault(); // Stop navigation
                          toggleFavorite(product.id);
                        }}
                        className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-900 hover:bg-white transition z-10"
                      >
                        <Heart
                          size={18}
                          // This ensures the button reflects state IMMEDIATELY
                          fill={
                            favorites.includes(product.id)
                              ? "currentColor"
                              : "none"
                          }
                          className={
                            favorites.includes(product.id)
                              ? "text-red-500"
                              : "text-gray-900"
                          }
                        />
                      </button>

                      <Link to={`/product/${product.id}`}>
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                        />
                      </Link>
                    </div>

                    <div className="px-2">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="text-xl font-bold text-gray-900 mb-1 hover:text-blue-600 transition">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 font-medium mb-3">
                        {product.category}
                      </p>
                      <div className="flex items-center gap-3">
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
                          <span className="text-sm text-gray-400 font-medium line-through">
                            ${product.originalPrice?.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* --- PAGINATION --- */}
            {products.length > 0 && (
              <div className="mt-16 flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg border font-semibold ${
                        currentPage === page
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WomenCollection;
