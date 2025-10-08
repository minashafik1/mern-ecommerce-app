
import axios from "axios";

const API_BASE = "http://localhost:3001/api/cart";

export const getCart = (token) =>
  axios.get(API_BASE, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addToCart = (token, productId, quantity) =>
  axios.post(
    API_BASE,
    { product: productId, quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const updateCart = (token, id, quantity) =>
  axios.patch(
    `${API_BASE}/${id}`,
    { quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const removeFromCart = (token, id) =>
  axios.delete(`${API_BASE}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const clearCart = (token) =>
  axios.delete(API_BASE, {
    headers: { Authorization: `Bearer ${token}` },
  });




