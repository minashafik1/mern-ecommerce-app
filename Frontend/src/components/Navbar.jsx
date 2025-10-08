
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useSelector, useDispatch } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { logoutUser } from "../services/api";
import { toggleLang } from "../redux/slices/langSlice";
import { clearWishlist } from "../redux/slices/wishlistSlice"; 

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const wishlistItems = useSelector((state) => state.wishlist.items || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());           
      dispatch(clearWishlist());    
      navigate("/login");           
    } catch (err) {
      console.error("Logout failed:", err.message || err);
    }
  };

  const currentLang = useSelector((state) => state.myLang.lang);
  const myContent = useSelector((state) => state.myLang.content);
  const changeLanguage = () => {
    dispatch(toggleLang());
  };

  // Define menu items
  const menuItems = [
    { label: myContent.home, to: "/home" },
    { label: myContent.products, to: "/products" },
  ];

  if (!token) {
    menuItems.push({ label: myContent.login, to: "/login" });
  } else {
    menuItems.push({
      label: myContent.cart,
      to: "/cart",
      icon: <ShoppingCartIcon />,
      count: cartItems.length,
    });
    menuItems.push({
      label: myContent.wishlist,
      to: "/wishlist",
      icon: <FavoriteIcon />,
      count: wishlistItems.length,
    });
    menuItems.push({ label: myContent.profile, to: "/profile" });
    menuItems.push({ label: myContent.logout, action: handleLogout });
  }

  const drawer = (
    <Box sx={{ width: 250 }} onClick={handleDrawerToggle}>
      <Typography variant="h6" sx={{ my: 2, textAlign: "center" }}>
        {myContent.app}
      </Typography>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={item.to ? RouterLink : "button"}
              to={item.to || ""}
              onClick={item.action || undefined}
            >
              {item.count ? (
                <Badge badgeContent={item.count} color="error">
                  <ListItemText primary={item.label} />
                </Badge>
              ) : (
                <ListItemText primary={item.label} />
              )}
            </ListItemButton>
          </ListItem>
        ))}

        <Button
          fullWidth
          variant="outlined"
          onClick={changeLanguage}
          sx={{ mt: 1 }}
        >
          {myContent.changeLang} ({currentLang})
        </Button>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {myContent.app}
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1 }}>
            {menuItems.map((item) =>
              item.to ? (
                <Button
                  key={item.label}
                  color="inherit"
                  component={RouterLink}
                  to={item.to}
                  startIcon={
                    item.count !== undefined ? (
                      <Badge badgeContent={item.count} color="error">
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon || null
                    )
                  }
                >
                  {item.label}
                </Button>
              ) : (
                <Button key={item.label} color="inherit" onClick={item.action}>
                  {item.label}
                </Button>
              )
            )}

            {/* Language Switch */}
            <Button color="inherit" onClick={() => changeLanguage()}>
              {currentLang === "ar" ? "EN" : "AR"}
            </Button>
          </Box>

          {/* Mobile Menu Icon */}
          <IconButton
            color="inherit"
            edge="end"
            sx={{ display: { sm: "none" } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor={currentLang === "ar" ? "left" : "right"}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
