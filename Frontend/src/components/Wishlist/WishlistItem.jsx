
import React from "react";
import { Box, Typography, Button, CardMedia, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../../redux/slices/wishlistSlice";

const WishlistItem = ({ product }) => {
  const dispatch = useDispatch();
  const { content: myContent, lang } = useSelector((state) => state.myLang);

  const handleRemove = () => {
    dispatch(removeFromWishlist(product._id));
  };

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        borderRadius: 2,
        height: "100%",
        flexDirection: lang === "ar" ? "row-reverse" : "row",
      }}
    >
      <CardMedia
        component="img"
        image={product.Images?.[0] || "https://via.placeholder.com/150"}
        alt={product.name}
        sx={{
          width: 120,
          height: 120,
          objectFit: "cover",
          borderRadius: 2,
          ml: lang === "ar" ? 2 : 0,
          mr: lang === "ar" ? 0 : 2,
        }}
      />

      <Box sx={{ flex: 1, textAlign: lang === "ar" ? "right" : "left" }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          {product.name}
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "#e91e63", fontWeight: 600, mb: 1 }}
        >
          ${product.price}
        </Typography>

        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={handleRemove}
        >
          {myContent.remove || "Remove"}
        </Button>
      </Box>
    </Paper>
  );
};

export default WishlistItem;

