import React from "react";
import {
  Star,
  Truck,
  RefreshCw,
  Leaf,
  Play,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

import Navbar from "../layout/nav-bar/nav-bar";
import Footer from "../layout/footer/footer";

const Home = () => {
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/products?page=0&sizeLimit=4`
        );
        if (response.ok) {
          const data = await response.json();
          // Filter products that have one of the relevant badges
          const filtered = data.data.content.filter((p) =>
            ["New Arrival", "New Version", "Trending", "Sale"].includes(p.badge)
          );
          // If filtering yields too few results from the first page, you might just want to show whatever came back
          // or implement a specific backend endpoint for "featured" items.
          // For now, let's prioritize the ones with badges, but fill up to 4 if needed from the general list.

          const filled = [
            ...filtered,
            ...data.data.content.filter((p) => !filtered.includes(p)),
          ].slice(0, 4);
          setProducts(filled);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-white font-sans text-gray-900">
      <Navbar />

      {/* --- Hero Section (FULL SCREEN) --- */}
      <section className="relative bg-gray-50 min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 font-bold text-xs rounded-full tracking-wide uppercase">
                New Release 2024
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-gray-900">
                Step into <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  the Future.
                </span>
              </h1>
              <p className="text-lg text-gray-500 max-w-md leading-relaxed">
                Experience the perfect blend of comfort and style with our
                latest urban collection. Engineered for those who never stop
                moving.
              </p>
              <div className="flex items-center gap-4">
                <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition transform hover:-translate-y-1">
                  Explore Collection
                </button>
                <button className="px-8 py-4 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition flex items-center gap-2">
                  <Play
                    size={18}
                    fill="currentColor"
                    className="text-gray-900"
                  />{" "}
                  Watch Video
                </button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-4">
                  {[1, 2, 3].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="User"
                      className="w-10 h-10 rounded-full border-4 border-gray-50"
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-bold text-gray-900">
                    Trusted by 10k+
                  </span>{" "}
                  runners
                </div>
              </div>
            </div>

            {/* Visual/Image */}
            <div className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200 to-purple-200 rounded-full filter blur-[100px] opacity-60"></div>
              <div className="relative bg-white/40 backdrop-blur-xl border border-white/50 p-6 rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition duration-500">
                <img
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"
                  alt="Hero Shoe"
                  className="w-full h-auto drop-shadow-2xl -mt-20 rotate-12 scale-110 hover:scale-125 transition duration-500"
                />
                <div className="bg-white/80 backdrop-blur-md p-4 rounded-xl mt-8 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      Featured
                    </p>
                    <h3 className="font-bold text-gray-900">Nike Air Max 90</h3>
                  </div>
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold shadow-lg">
                    $140
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Brands Banner --- */}
      <div className="border-y border-gray-100 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center opacity-40 grayscale hover:grayscale-0 transition duration-500 overflow-hidden">
          <span className="text-2xl font-black tracking-widest">FITBIT</span>
          <span className="text-2xl font-black tracking-widest">NIKE</span>
          <span className="text-2xl font-black tracking-widest">ADIDAS</span>
          <span className="text-2xl font-black tracking-widest">PUMA</span>
          <span className="text-2xl font-black tracking-widest">REEBOK</span>
        </div>
      </div>

      {/* --- New Arrivals --- */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              New Arrivals
            </h2>
            <p className="text-gray-500 mt-2">Fresh kicks for the season.</p>
          </div>
          <Link
            to="/sale"
            className="text-blue-600 font-bold hover:underline flex items-center gap-1"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500 text-lg">
                No products available at the moment.
              </p>
            </div>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                image={product.imageUrl}
                title={product.name}
                oldPrice={product.originalPrice}
                isNew={
                  product.badge === "New Arrival" ||
                  product.badge === "New Version"
                }
                isSale={product.badge === "Sale"}
              />
            ))
          )}
        </div>
      </section>

      {/* --- Features Section --- */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Truck className="text-blue-600" size={24} />}
            title="Free Shipping"
            desc="On all orders over $50"
          />
          <FeatureCard
            icon={<Leaf className="text-green-600" size={24} />}
            title="Eco-Friendly"
            desc="Sustainable materials"
          />
          <FeatureCard
            icon={<RefreshCw className="text-purple-600" size={24} />}
            title="30-Day Returns"
            desc="Hassle-free exchange policy"
          />
        </div>
      </section>

      {/* 3. USE FOOTER COMPONENT */}
      <Footer />
    </div>
  );
};

// --- Helper Components (Can be moved to separate files too, but okay here for now) ---
import { Link } from "react-router-dom";

// ...

const ProductCard = ({
  id,
  image,
  title,
  category,
  price,
  oldPrice,
  rating,
  isNew,
  isSale,
}) => (
  <Link to={`/product/${id}`} className="group cursor-pointer block">
    <div className="relative bg-gray-100 rounded-2xl p-4 mb-4 overflow-hidden h-64 flex items-center justify-center">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {isNew && (
          <span className="bg-white text-gray-900 text-xs font-bold px-2 py-1 rounded shadow-sm">
            NEW
          </span>
        )}
        {isSale && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
            SALE
          </span>
        )}
      </div>
      <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition transform translate-y-2 group-hover:translate-y-0">
        <ShoppingBag size={16} className="text-gray-900" />
      </button>
      <img
        src={image}
        alt={title}
        className="w-full drop-shadow-lg group-hover:scale-110 transition duration-500"
      />
    </div>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-xs font-semibold mb-1">{category}</p>
        <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition">
          {title}
        </h3>
        <div className="flex items-center gap-1 mt-1">
          <Star size={12} className="text-yellow-400 fill-current" />
          <span className="text-xs font-bold text-gray-600">{rating}</span>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-blue-600 text-lg">${price}</p>
        {oldPrice && (
          <p className="text-gray-400 text-sm line-through">${oldPrice}</p>
        )}
      </div>
    </div>
  </Link>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition">
    <div className="p-3 bg-gray-50 rounded-xl">{icon}</div>
    <div>
      <h3 className="font-bold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  </div>
);

// --- Dummy Data ---
const products = [
  {
    id: 1,
    title: "Air Stride X1",
    category: "Running",
    price: "120.00",
    rating: 4.8,
    isNew: true,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Urban Flow",
    category: "Lifestyle",
    price: "95.00",
    oldPrice: "120.00",
    rating: 4.6,
    isSale: true,
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Retro Kicks",
    category: "Casual",
    price: "110.00",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Cloud Runner",
    category: "Performance",
    price: "135.00",
    rating: 5.0,
    isNew: true,
    image:
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1000&auto=format&fit=crop",
  },
];

export default Home;
