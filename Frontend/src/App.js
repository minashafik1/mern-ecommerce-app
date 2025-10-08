import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Outlet,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import "./App.css";

// User components
import Navbar from "./components/Navbar";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./pages/Home";
import ProductPage from "./pages/Products";
import ProductDetails from "./components/Product/ProductDetails";
import Wish from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import OrderPage from "./pages/Order";
import OrderSuccess from "./components/Order/OrderSuccess";
import OrderCancel from "./components/Order/OrderCancel";

// Admin components
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import ProductsTable from "./components/admin/ProductsTable";
import CartTable from "./components/admin/CartTable";
import OrdersTable from "./components/admin/OrdersTable";
import UsersTable from "./components/admin/UsersTable";
import CategoriesTable from "./components/admin/CategoriesTable";
import DashboardOverview from "./components/admin/MainContent"; 

function AppContent() {
  const currentLang = useSelector((state) => state.myLang.lang);
  const location = useLocation();

  useEffect(() => {
    document.body.dir = currentLang === "ar" ? "rtl" : "ltr";
  }, [currentLang]);

  // Hide navbar on admin dashboard pages
  const hideNavbar =
    location.pathname.startsWith("/admin") &&
    !location.pathname.includes("/login");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Toaster position="bottom-center" reverseOrder={false} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Wish />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/order/success" element={<OrderSuccess />} />
        <Route path="/order/cancel" element={<OrderCancel />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />{" "}
          {/* Default admin dashboard */}
          <Route path="dashboard" element={<DashboardOverview />} />
          <Route path="products" element={<ProductsTable />} />
          <Route path="categories" element={<CategoriesTable />} />
          <Route path="users" element={<UsersTable />} />
          <Route path="cart" element={<CartTable />} />
          <Route path="orders" element={<OrdersTable />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<h2>404 Not Found</h2>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
