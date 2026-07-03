import React, { useRef, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from "react-router-dom";
import Header from "./Layout/Header";
import Footer from "./Layout/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Auth from "./Auth/Auth";
import ProductDetailPage from "./Product/ProductDetailPage";
import CartPage from "./Cart/CartPage";
import CheckoutPage from "./Cart/CheckoutPage";
import OrderHistory from "./Cart/OrderHistory";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/AdminProducts";
import AdminCategories from "./admin/AdminCategories";
import AdminNewProduct from "./admin/AdminNewProduct";
import AdminEditPage from "./admin/AdminEditProduct";
import AdminOrders from "./admin/AdminOrders";
import AdminOrderDetails from "./admin/AdminOrderDetail";
import UserManagement from "./admin/UserManagement";
import SupportCenter from "./FooterPages/SupportCenter";
import Contact from "./FooterPages/Contact";
import FAQs from "./FooterPages/FAQs";
import UserProfile from "./Auth/UserProfile";
import EditProfile from "./Auth/EditProfile";
import DealPage from "./Promo/DealPage";
import DealtDetailPage from "./Promo/DealDetailPage";
import AdminFreeShipping from "./admin/AdminFreeShipping";

const ScrollHandler = () => {
  const { pathname, state } = useLocation();
  const newArrivalsRef = useRef(null);

  useEffect(() => {
    if (pathname === "/" && state?.scrollTo === "newArrivals") {
      setTimeout(() => {
        newArrivalsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [pathname, state]);

  return null;
};

const MainLayout = ({ newArrivalsRef }) => {
  return (
    <>
      <Header newArrivalsRef={newArrivalsRef} />
      <Outlet />
      <Footer />
    </>
  );
};

const App = () => {
  const newArrivalsRef = useRef(null);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);

  const handleAddToCart = (product) => {
    const existing = cartItems.find(
      item => item.id === product.id && item.color === product.color && item.size === product.size
    );

    if (existing) {
      setCartItems(prev =>
        prev.map(item =>
          item.id === product.id && item.color === product.color && item.size === product.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems(prev => [...prev, { ...product, quantity: 1 }]);
    }
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  return (
    <Router>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <ScrollHandler />

        <Routes>
          {/* Main Layout Routes (with Header and Footer) */}
          <Route element={<MainLayout newArrivalsRef={newArrivalsRef} />}>
            <Route path="/" element={<Home newArrivalsRef={newArrivalsRef} />} />
            <Route path="/deals" element={<DealPage />} />
            <Route path="/deal/:id" element={<DealtDetailPage />} />

            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetailPage onAddToCart={handleAddToCart} />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/cart" element={<CartPage cartItems={cartItems} setCartItems={setCartItems} />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/support" element={<SupportCenter />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/urprofile" element={<UserProfile />} />
            <Route path="/editprofile" element={<EditProfile />} />
          </Route>

          {/* Admin Routes (without Header and Footer) */}
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
          <Route path="/admin/categories" element={<AdminLayout><AdminCategories /></AdminLayout>} />
          <Route path="/admin/newproduct" element={<AdminLayout><AdminNewProduct existingProducts={[]}
            setProducts={(newList) => console.log('Updated products:', newList)}
            isAdmin={true} /></AdminLayout>} />
          <Route path="/admin/editproduct/:id" element={<AdminLayout><AdminEditPage products={products} onUpdateProduct={handleUpdateProduct} /></AdminLayout>} />
          <Route path="/admin/orders" element={<AdminLayout><AdminOrders /></AdminLayout>} />
          <Route path="/admin/free-shipping" element={<AdminLayout><AdminFreeShipping /></AdminLayout>} />

          <Route path="/admin/orders/details" element={<AdminLayout><AdminOrderDetails /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><UserManagement /></AdminLayout>} />


        </Routes>
      </div>
    </Router>
  );
};

export default App;