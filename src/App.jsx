import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/context/auth-context/authContext";
import { CartProvider } from "./components/context/cart-context/cartContext";

import RegisterForm from "./components/register-form/registerForm";
import LoginForm from "./components/login-form/loginForm";
import Home from "./components/home/home";
import ForgotPasswordForm from "./components/login-form/forgot-password/forgotPassword";
import MenCollection from "./components/main-collection/menCollection";
import WomenCollection from "./components/main-collection/womenCollection";
import KidCollection from "./components/main-collection/kidCollection";
import ProductDetail from "./components/product-detail/productDetail";
import CartPage from "./components/cart/CartPage";
import FavoritePage from "./components/favorite-page/favoritePage";
import ChatBot from "./components/chatbot/ChatBot";
import { useState } from "react";
import Sale from "./components/main-collection/Sale";

function App() {
  const [category, setCategory] = useState("All");
  const [products, setProducts] = useState([]);

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route
              path="/men-collection"
              element={
                <MenCollection
                  category={category}
                  setCategory={setCategory}
                  products={products}
                  setProducts={setProducts}
                />
              }
            />
            <Route
              path="/women-collection"
              element={
                <WomenCollection
                  category={category}
                  setCategory={setCategory}
                />
              }
            />
            <Route
              path="/kids-collection"
              element={
                <KidCollection category={category} setCategory={setCategory} />
              }
            />
            <Route
              path="/product/:id"
              element={
                <ProductDetail category={category} products={products} />
              }
            />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/favorite" element={<FavoritePage />} />
            <Route
              path="/sale"
              element={<Sale category={category} setCategory={setCategory} />}
            />
          </Routes>
          <ChatBot />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
