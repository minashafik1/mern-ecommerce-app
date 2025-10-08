
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Chip,
  Divider,
  Stack,
} from "@mui/material";
import axios from "axios";
import { ShoppingCart, Favorite, ArrowBack } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync } from "../../redux/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/slices/wishlistSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  
  const { content: myContent, lang } = useSelector((state) => state.myLang);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const wishlistItems = useSelector((state) => state.wishlist.items || []);
  const user = useSelector((state) => state.auth.user);

  const isInCart = cartItems.some((item) => item.product?._id === id);
  const isInWishlist = wishlistItems.some((item) => item._id === id);
  const isOutOfStock = !product?.quantity || product.quantity < 1;

  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/products/product/${id}`
        );
        setProduct(response.data.data);
      } catch (err) {
        setError(
          myContent.productDetails?.error || "Failed to fetch product details"
        );
        console.error("Error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, myContent]);

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login", { state: { redirectTo: `/product/${id}` } });
      return;
    }
    if (!isInCart) {
      dispatch(addToCartAsync({ productId: id, quantity: 1 }));
    }
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" align="center" sx={{ mt: 5 }}>
        {error}
      </Typography>
    );

  if (!product)
    return (
      <Typography align="center" sx={{ mt: 5 }}>
        {myContent.productDetails?.notFound || "Product not found"}
      </Typography>
    );

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        backgroundColor: "#fafafa",
        minHeight: "100vh",
        direction: lang === "ar" ? "rtl" : "ltr",
        textAlign: lang === "ar" ? "right" : "left",
      }}
    >
      {/* 🔹 زر الرجوع */}
      <Stack sx={{ mb: 3 }} direction={lang === "ar" ? "row-reverse" : "row"}>
        <Button
          variant="outlined"
          startIcon={lang === "ar" ? null : <ArrowBack />}
          endIcon={lang === "ar" ? <ArrowBack /> : null}
          onClick={() => navigate("/products")}
        >
          {myContent.productDetails?.backToProducts || "Back to Products"}
        </Button>
      </Stack>

      <Grid
        container
        spacing={4}
        sx={{
          maxWidth: 1200,
          mx: "auto",
          alignItems: "flex-start",
        }}
      >
      
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={product.Images?.[0] || "https://via.placeholder.com/600"}
            alt={product.name}
            sx={{
              width: "100%",
              height: { xs: 300, md: 500 },
              objectFit: "cover",
              borderRadius: 3,
              boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            }}
          />
        </Grid>

        
        <Grid item xs={12} md={6}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 2, color: "#212121" }}
          >
            {product.name}
          </Typography>

          <Chip
            label={
              product.category?.name ||
              myContent.productDetails?.uncategorized ||
              "Uncategorized"
            }
            color="primary"
            variant="outlined"
            sx={{ mb: 2, fontWeight: 600 }}
          />

          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: "#2e7d32", mb: 2 }}
          >
            ${product.price}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: isOutOfStock ? "#d32f2f" : "#388e3c",
            }}
          >
            {myContent.productDetails?.stock || "Stock"}:{" "}
            {isOutOfStock
              ? myContent.productDetails?.outOfStock || "Out of stock"
              : product.quantity}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, lineHeight: 1.6 }}
          >
            {product.description ||
              myContent.productDetails?.noDescription ||
              "No description available."}
          </Typography>

          
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              flexDirection: lang === "ar" ? "row-reverse" : "row",
            }}
          >
            <Button
              onClick={handleAddToCart}
              variant="contained"
              startIcon={<ShoppingCart />}
              disabled={isOutOfStock || isInCart}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1,
                fontWeight: 600,
                background: isOutOfStock
                  ? "linear-gradient(45deg, #9e9e9e, #757575)"
                  : isInCart
                  ? "linear-gradient(45deg, #1976d2, #1565c0)"
                  : "linear-gradient(45deg, #388e3c, #2e7d32)",
              }}
            >
              {isOutOfStock
                ? myContent.productDetails?.outOfStock || "Out of Stock"
                : isInCart
                ? myContent.productDetails?.addedToCart || "Added to Cart"
                : myContent.productDetails?.addToCart || "Add to Cart"}
            </Button>

            <Button
              onClick={handleWishlistToggle}
              variant={isInWishlist ? "contained" : "outlined"}
              startIcon={<Favorite />}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1,
                fontWeight: 600,
                background: isInWishlist ? "#e53935" : "transparent",
                color: isInWishlist ? "#fff" : "#e53935",
                borderColor: "#e53935",
              }}
            >
              {isInWishlist
                ? myContent.productDetails?.removeWishlist ||
                  "Remove Wishlist"
                : myContent.productDetails?.addWishlist || "Add to Wishlist"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetails;
