import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { Home, ShoppingCart, Category, People, Receipt } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Assuming you have loading state in Redux
  const loading = useSelector((state) => state.adminDashboard.loading);

  const menuItems = [
    { text: "Dashboard", icon: <Home />, path: "/admin/dashboard" },
    { text: "Products", icon: <ShoppingCart />, path: "/admin/products" },
    { text: "Categories", icon: <Category />, path: "/admin/categories" },
    { text: "Users", icon: <People />, path: "/admin/users" },
    { text: "Cart", icon: <ShoppingCart />, path: "/admin/cart" },
    { text: "Orders", icon: <Receipt />, path: "/admin/orders" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      {/* Spinner Overlay */}
      <Backdrop open={loading} sx={{ color: "#fff", zIndex: 1300 }}>
        <CircularProgress color="inherit" size={60} />
      </Backdrop>

      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "#f5f7fa",
            color: "#1e1e1e",
            height: "100vh",
            borderRight: "1px solid #ddd",
          },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <ListItem
                button
                key={item.text}
                onClick={() => handleNavigation(item.path)}
                selected={isActive}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#4a90e2",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#357abd" },
                  },
                  "&:hover": { backgroundColor: "#e0e7f0" },
                  borderRadius: 1,
                  mx: 1,
                  my: 0.5,
                }}
              >
                <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
