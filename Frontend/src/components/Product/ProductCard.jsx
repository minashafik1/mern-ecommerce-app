import React from "react";
import { Card, CardMedia, CardContent, Typography, Button, IconButton, Box } from "@mui/material";
import { Visibility, Favorite, FavoriteBorder, ShoppingCart, RemoveShoppingCart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../../redux/slices/wishlistSlice";
import { addToCartAsync, removeCartItemAsync } from "../../redux/slices/cartSlice";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const wishlistItems = useSelector((state) => state.wishlist.items);
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const user = useSelector((state) => state.auth.user);
  const currentLang = useSelector((state) => state.myLang.lang);
  const content = useSelector((state) => state.myLang.content).productCard;

  const isInWishlist = wishlistItems.some((item) => item._id === product._id);
  const isInCart = cartItems.some((item) => item.product?._id === product._id);
  const isOutOfStock = !product.quantity || product.quantity < 1;

  const handleViewDetails = () => {
    navigate(`/product/${product._id}`);
  };

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleCartToggle = () => {
    if (!user) {
      navigate("/login", { state: { redirectTo: `/product/${product._id}`, addToCart: product._id } });
      return;
    }

    if (isInCart) {
      const cartItem = cartItems.find((item) => item.product?._id === product._id);
      if (cartItem) dispatch(removeCartItemAsync(cartItem._id));
    } else {
      dispatch(addToCartAsync({ productId: product._id, quantity: 1 }));
    }
  };

  return (
    <Card
      sx={{
        width: 280,
        height: 430,
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
        },
        position: "relative",
        direction: currentLang === "ar" ? "rtl" : "ltr",
      }}
    >
      <IconButton
        onClick={handleToggleWishlist}
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 2,
          backgroundColor: "#fff",
          color: isInWishlist ? "#e53935" : "#999",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          "&:hover": {
            backgroundColor: isInWishlist ? "#ffcdd2" : "#f5f5f5",
            transform: "scale(1.1)",
          },
        }}
      >
        {isInWishlist ? <Favorite fontSize="medium" /> : <FavoriteBorder fontSize="medium" />}
      </IconButton>

      <CardMedia
        component="img"
        image={product.Images?.[0] || "https://via.placeholder.com/300"}
        alt={product.name}
        sx={{ height: 200, width: "100%", objectFit: "cover", borderBottom: "1px solid #eee" }}
      />

      <CardContent sx={{ p: 2.5, display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            textAlign: "center",
            color: "#222",
            lineHeight: 1.3,
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: "2.6em",
          }}
        >
          {product.name}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            textAlign: "center",
            color: isOutOfStock ? "#d32f2f" : "#2e7d32",
            mb: 2,
          }}
        >
          {isOutOfStock ? content.outOfStock : `$${product.price}`}
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: "auto" }}>
          <Button
            variant="contained"
            startIcon={<Visibility />}
            onClick={handleViewDetails}
            fullWidth
            sx={{
              borderRadius: 3,
              py: 1,
              fontWeight: 600,
              background: "linear-gradient(45deg, #1976d2, #1565c0)",
              "&:hover": { background: "linear-gradient(45deg, #1565c0, #0d47a1)" },
            }}
          >
            {content.viewDetails}
          </Button>

          <Button
            onClick={handleCartToggle}
            variant="contained"
            startIcon={isInCart ? <RemoveShoppingCart /> : <ShoppingCart />}
            disabled={isOutOfStock}
            fullWidth
            sx={{
              borderRadius: 3,
              py: 1,
              fontWeight: 600,
              background: isOutOfStock
                ? "linear-gradient(45deg, #9e9e9e, #757575)"
                : isInCart
                ? "linear-gradient(45deg, #d32f2f, #b71c1c)"
                : "linear-gradient(45deg, #388e3c, #2e7d32)",
              "&:hover": {
                background: isOutOfStock
                  ? "linear-gradient(45deg, #9e9e9e, #616161)"
                  : isInCart
                  ? "linear-gradient(45deg, #b71c1c, #7f0000)"
                  : "linear-gradient(45deg, #2e7d32, #1b5e20)",
              },
            }}
          >
            {isOutOfStock
              ? content.outOfStock
              : isInCart
              ? content.removeFromCart
              : content.addToCart}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
