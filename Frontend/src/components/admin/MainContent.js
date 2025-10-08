import React, { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Backdrop,
  Paper,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  fetchCategories,
  fetchUsers,
  fetchCart,
  fetchOrders,
} from "../../redux/slices/admin/adminDashboardSlice";

const DashboardOverview = () => {
  const dispatch = useDispatch();
  const { products, categories, users, cart, orders, loading, error } = useSelector(
    (state) => state.adminDashboard
  );

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchUsers());
    dispatch(fetchCart());
    dispatch(fetchOrders());
  }, [dispatch]);

  const totals = {
    totalProducts: Array.isArray(products) ? products.length : 0,
    totalCategories: Array.isArray(categories) ? categories.length : 0,
    totalUsers: Array.isArray(users) ? users.length : 0,
    totalCarts: Array.isArray(cart) ? cart.length : 0,
    totalOrders: Array.isArray(orders) ? orders.length : 0,
  };

  const cards = [
    { label: "Total Products", value: totals.totalProducts, color: "#e0f7fa" },
    { label: "Total Categories", value: totals.totalCategories, color: "#fff3e0" },
    { label: "Total Users", value: totals.totalUsers, color: "#e8f5e9" },
    { label: "Total Carts", value: totals.totalCarts, color: "#fffde7" },
    { label: "Total Orders", value: totals.totalOrders, color: "#fce4ec" },
  ];

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", overflowY: "auto", p: 3, position: "relative" }}>
      {/* Spinner Overlay */}
      <Backdrop open={loading} sx={{ color: "#fff", zIndex: 9999 }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress color="inherit" size={80} />
          <Typography sx={{ mt: 2, fontSize: 18 }}>Loading Dashboard...</Typography>
        </Box>
      </Backdrop>

      {/* Error */}
      {error && (
        <Typography color="error" variant="h6" sx={{ textAlign: "center", mt: 8 }}>
          Error: {error}
        </Typography>
      )}

      {/* Dashboard Cards */}
      {!loading && !error && (
        <Container>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              mb: 6,
              fontWeight: "bold",
              textAlign: "center",
              letterSpacing: 1,
              color: "#333",
            }}
          >
            Admin Dashboard Overview
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {cards.map((card) => (
              <Grid item xs={12} sm={6} md={2.4} key={card.label}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 3,
                    bgcolor: card.color,
                    borderRadius: 3,
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                    {card.label}
                  </Typography>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: "bold" }}>
                    {card.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
    </Box>
  );
};

export default DashboardOverview;
