import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          overflowY: "auto",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Outlet /> {/* DashboardOverview or any admin page will render here */}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
