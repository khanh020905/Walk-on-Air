import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../layout/nav-bar/nav-bar";
import Footer from "../layout/footer/footer";
import { Star, Heart, Minus, Plus, ChevronDown } from "lucide-react";
import { useCart } from "../../components/context/cart-context/cartContext";

const ProductDetail = ({ category, products }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [shippingOpen, setShippingOpen] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);

  const token = localStorage.getItem("jwt");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
          {
            method: "GET",
            headers: headers,
          }
        );

        if (res.ok) {
          const data = await res.json();
          const backendProduct = data.data;

          const safeProduct = {
            ...backendProduct,
            images:
              backendProduct.images && backendProduct.images.length > 0
                ? backendProduct.images
                : [backendProduct.imageUrl],
            colors: backendProduct.colors || ["#000000"],
            sizes: backendProduct.sizes || ["Standard"],
            reviews: backendProduct.reviews || 0,
            rating: backendProduct.rating || 0,
            description:
              backendProduct.description || "No description available.",
          };

          setProduct(safeProduct);
          setIsFavorite(safeProduct.favorite === true);
        } else {
          console.log("Failed to fetch product");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id, token]);

  // --- TOGGLE FAVORITE LOGIC ---
  const toggleFavorite = async () => {
    // 1. Check Login
    if (!token) {
      alert("Please Login first to add favorites");
      return;
    }

    // 2. Determine New Status
    const newStatus = !isFavorite;

    // 3. Optimistic UI Update (Update immediately)
    setIsFavorite(newStatus);

    // 4. Send to Backend
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
      console.error(error);
      // 5. Revert UI if backend fails
      alert("Something went wrong. Please try again.");
      setIsFavorite(!newStatus);
    }
  };

  // --- FETCH RELATED PRODUCTS ---
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
        const res = await fetch(
          `${backendUrl}/api/products?page=0&sizeLimit=5`
        );
        if (res.ok) {
          const data = await res.json();
          setRelatedProducts(data.data.content);
        }
      } catch (error) {
        console.error("Failed to fetch related products", error);
      }
    };

    fetchRelatedProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Navbar />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <span>/</span>
          <Link to="/men-collection" className="hover:text-blue-600">
            Men
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Image Gallery */}
          <div className="flex-1">
            <div className="relative bg-gray-100 rounded-3xl overflow-hidden mb-6 aspect-square max-w-xl mx-auto lg:mx-0">
              {/* --- FAVORITE BUTTON --- */}
              <button
                onClick={toggleFavorite}
                className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-900 hover:bg-white transition z-10"
              >
                <Heart
                  size={20}
                  fill={isFavorite ? "currentColor" : "none"}
                  className={isFavorite ? "text-red-500" : "text-gray-900"}
                />
              </button>

              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover mix-blend-multiply"
              />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === idx
                      ? "border-blue-600"
                      : "border-transparent hover:border-blue-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx}`}
                    className="w-full h-full object-cover mix-blend-multiply"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex-1 max-w-lg">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-blue-600 font-medium mb-4">{product.category}</p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {/* Rating Logic */}
              <div className="flex items-center gap-1 text-yellow-400 text-sm">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill="currentColor"
                    stroke="none"
                    className={
                      i < Math.floor(product.rating) ? "" : "text-gray-200"
                    }
                  />
                ))}
                <span className="text-blue-600 hover:underline cursor-pointer ml-1">
                  ({product.reviews} reviews)
                </span>
              </div>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Color Selection */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                Color
              </h3>
              <div className="flex items-center gap-3">
                {product.colors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(idx)}
                    className={`w-8 h-8 rounded-full border-2 transition flex items-center justify-center ${
                      selectedColor === idx
                        ? "border-blue-600 ring-2 ring-blue-100"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {selectedColor === idx && (
                      <span className="block w-2 h-2 bg-white rounded-full shadow-sm"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                  Select Size
                </h3>
                <button className="text-blue-600 text-sm font-medium hover:underline">
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 rounded-lg text-sm font-semibold border transition ${
                      selectedSize === size
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-900 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <div className="flex items-center border border-gray-200 rounded-lg px-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-gray-500 hover:text-gray-900"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-medium text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-gray-500 hover:text-gray-900"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() =>
                  addToCart(
                    product,
                    quantity,
                    selectedSize,
                    product.colors[selectedColor]
                  )
                }
                className="flex-1 bg-blue-600 text-white font-bold rounded-lg py-3 px-6 hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                Add to Cart
              </button>
            </div>

            {/* Collapsible Info ... (Kept same as before) */}
            <div className="border-t border-gray-200">
              <div className="border-b border-gray-200">
                <button
                  onClick={() => setDetailsOpen(!detailsOpen)}
                  className="w-full py-4 flex items-center justify-between text-left font-bold text-gray-900"
                >
                  Product Details
                  <ChevronDown
                    size={20}
                    className={`transform transition ${
                      detailsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {detailsOpen && (
                  <div className="pb-4 text-gray-600">
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Engineered mesh upper</li>
                      <li>Nike React technology</li>
                      <li>Zoom Air units</li>
                      <li>Rubber outsole</li>
                    </ul>
                  </div>
                )}
              </div>
              {/* Shipping section ... */}
            </div>
          </div>
        </div>

        {/* --- CUSTOMER REVIEWS SECTION --- */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Customer Reviews
          </h2>
          <div className="bg-gray-50 rounded-2xl p-8 flex flex-col md:flex-row gap-12">
            {/* Left: Summary */}
            <div className="md:w-1/3">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-extrabold text-gray-900">
                  {product.rating ? product.rating.toFixed(1) : "0.0"}
                </span>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      fill="currentColor"
                      size={20}
                      className={
                        i < Math.round(product.rating || 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-500 mb-6">
                Based on {product.reviews || 0} reviews
              </p>

              {/* Rating Bars (Mock Data for Visuals) */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2 text-sm">
                    <span className="w-3 text-gray-600 font-medium">
                      {star}
                    </span>
                    <Star
                      size={12}
                      className="text-yellow-400"
                      fill="currentColor"
                    />
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{
                          width:
                            star === 5
                              ? "70%"
                              : star === 4
                              ? "20%"
                              : star === 3
                              ? "5%"
                              : "2%",
                        }}
                      ></div>
                    </div>
                    <span className="text-gray-400 w-8 text-right">
                      {star === 5
                        ? "70%"
                        : star === 4
                        ? "20%"
                        : star === 3
                        ? "5%"
                        : "2%"}
                    </span>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 border border-gray-300 rounded-lg font-bold text-gray-900 hover:bg-white transition bg-white shadow-sm hover:shadow-md">
                Write a Review
              </button>
            </div>

            {/* Right: Review List (Mock Data) */}
            <div className="flex-1 space-y-8">
              {/* Review 1 */}
              <div className="border-b border-gray-200 pb-8 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                      JD
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">John Doe</h4>
                      <div className="flex text-yellow-400 text-xs mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} fill="currentColor" size={12} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">2 days ago</span>
                </div>
                <h5 className="font-bold text-gray-900 mb-2">
                  Perfect for daily runs
                </h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  These shoes are incredibly comfortable right out of the box.
                  I've put about 50 miles on them so far and they hold up great.
                  The cushioning is just right for my morning 5k.
                </p>
              </div>

              {/* Review 2 */}
              <div className="border-b border-gray-200 pb-8 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                      SM
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Sarah Miller</h4>
                      <div className="flex text-yellow-400 text-xs mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            fill="currentColor"
                            size={12}
                            className={i < 4 ? "" : "text-gray-300"}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">1 week ago</span>
                </div>
                <h5 className="font-bold text-gray-900 mb-2">
                  Good but runs small
                </h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Great design and colors. However, I found them to be a bit
                  tight around the toe box. I would recommend going half a size
                  up if you have wider feet. Otherwise, excellent quality.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* You Might Also Like */}
        <div className="mt-20 mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              You Might Also Like
            </h2>
            <Link
              to="/men-collection"
              className="text-blue-600 font-semibold hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts && relatedProducts.length > 0 ? (
              relatedProducts
                .filter((item) => item.id !== Number(id))
                .slice(0, 4)
                .map((item) => (
                  <Link
                    to={`/product/${item.id}`}
                    key={item.id}
                    className="group cursor-pointer"
                  >
                    <div className="relative bg-gray-100 rounded-2xl overflow-hidden mb-3 aspect-square">
                      <img
                        src={item.imageUrl}
                        alt="Suggestion"
                        className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition duration-500"
                      />
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm">
                      {item.name}
                    </h4>
                    <p className="text-gray-500 text-xs mb-1">
                      {item.category}
                    </p>
                    <p className="font-bold text-gray-900">${item.price}</p>
                  </Link>
                ))
            ) : (
              <p>No recommendations available.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
