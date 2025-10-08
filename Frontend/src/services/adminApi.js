// src/services/adminApi.js
import axios from "axios";

const API_BASE = "http://localhost:3001/api";


const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------- Auth ----------
export const loginUser = async (credentials) => {
  try {
    const response = await api.post(`${API_BASE}/signin`, {
      email: credentials.email,
      password: credentials.password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

// ---------- Products ----------
export const getProducts = async () => {
  const response = await api.get("/productss");
  console.log(response.data);
  return response.data;
};

export const addProduct = async (productData, categoryId) => {
  const token = localStorage.getItem("adminToken");
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(
    `${API_BASE}/products/${categoryId}`,
    productData,
    config
  );
  return response.data;
};

export const updateProduct = async (productId, productData) => {
  const token = localStorage.getItem("adminToken");
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(
    `${API_BASE}/products/${productId}`,
    productData,
    config
  );
  return response.data.data; // updated product
};

export const deleteProduct = async (productId) => {
  const token = localStorage.getItem("adminToken");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.delete(`${API_BASE}/products/${productId}`, config);
  return response.data;
};

// ---------- Categories ----------
export const getCategories = async () => {
  const token = localStorage.getItem("adminToken");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(`${API_BASE}/categories`, config);
  return response.data; // { message, categories }
};

export const addCategory = async (categoryData) => {
  const token = localStorage.getItem("adminToken");
  const config = {
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
  };
  const response = await axios.post(`${API_BASE}/categories`, categoryData, config);
  return response.data; // { message, category }
};

export const updateCategory = async (categoryId, categoryData) => {
  const token = localStorage.getItem("adminToken");
  const config = {
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
  };
  const response = await axios.put(`${API_BASE}/categories/${categoryId}`, categoryData, config);
  return response.data; // { message, updatedCategory }
};

export const deleteCategory = async (categoryId) => {
  const token = localStorage.getItem("adminToken");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.delete(`${API_BASE}/categories/${categoryId}`, config);
  return response.data; // { message }
};


// ---------- Users ----------
export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

// ---------- Cart ----------
export const getCart = async () => {
  const response = await api.get("/carts");
  return response.data;
};

export const getCarts = async () => {
  try {
    const token = localStorage.getItem("adminToken");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${API_BASE}/carts`, config);
    return response.data; // { message, carts: [...] }
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch carts" };
  }
};

export const deleteCartApi = async (cartId) => {
  try {
    const token = localStorage.getItem("adminToken");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(`${API_BASE}/carts/${cartId}`, config);
    return response.data; // { message }
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete cart" };
  }
};
// ---------- Orders ----------
export const getOrders = async () => {
  const token = localStorage.getItem("adminToken");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(`${API_BASE}/orders`, config);
  return response.data; // should include { orders: [...] } from backend
};

export const updateOrderStatus = async (orderId, status) => {
  const token = localStorage.getItem("adminToken");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.patch(`${API_BASE}/orders/${orderId}`, { status }, config);
  return response.data; // should include { order: {...} }
};

export const deleteOrder = async (orderId) => {
  const token = localStorage.getItem("adminToken");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.delete(`${API_BASE}/orders/${orderId}`, config);
  return response.data; // message
};

export default api;
