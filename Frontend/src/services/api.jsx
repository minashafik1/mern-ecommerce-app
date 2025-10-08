import axios from "axios";

const API_BASE = "http://localhost:3001/api";

// ---------- Auth ----------

// Login
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE}/signin`, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

// Register
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE}/signup`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

// Get current user profile
export const getProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.user; // returns {id, name, email, ...}
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch profile" };
  }
};

// Logout
export const logoutUser = async () => {
  try {
    const token = localStorage.getItem("token");
    await axios.post(
      `${API_BASE}/logout`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    localStorage.removeItem("token");
    return true;
  } catch (err) {
    throw err.response?.data || { message: "Logout failed" };
  }
};

// ---------- Products ----------
export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE}/productss`);
    return response.data.products;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch products" };
  }
};

export const searchProducts = async (query) => {
  if (!query) return [];
  try {
    const response = await axios.post(
      `${API_BASE}/products/searchProduct?query=${query}`
    );
    return response.data.data; // products array
  } catch (error) {
    throw error.response?.data || { message: "Search failed" };
  }
};

// ---------- Categories ----------
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE}/categories`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data.categories;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch categories" };
  }
};




// -------------------- Orders -----------------------
export const createOrder = async (orderData) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${API_BASE}/orders`, orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Order creation failed" };
  }
};

export const orderSuccess = async (orderId) => {
  try {
    const res = await axios.get(`${API_BASE}/orders/success?orderId=${orderId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Order success fetch failed" };
  }
};

export const orderCancel = async (orderId) => {
  try {
    const res = await axios.get(`${API_BASE}/orders/cancel?orderId=${orderId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Order cancel fetch failed" };
  }
};


const API = axios.create({ baseURL: "http://localhost:3001" });
//  Wishlist APIs
export const getWishlist = () =>
  API.get("/api/wishlist", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

export const addToWishlist = (productId) =>
  API.post(
    "/api/wishlist",
    { productId },
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );

export const removeFromWishlist = (productId) =>
  API.delete(`/api/wishlist/${productId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });