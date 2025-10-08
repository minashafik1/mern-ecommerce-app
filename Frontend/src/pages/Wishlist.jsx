import React from "react";
import { Box, Typography } from "@mui/material";
import WishlistList from "../components/Wishlist/WishlistList";
import { useSelector } from "react-redux";

const WishlistPage = () => {
  const { content: myContent, lang } = useSelector((state) => state.myLang);

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        direction: lang === "ar" ? "rtl" : "ltr", // اتجاه النص
        textAlign: lang === "ar" ? "right" : "left",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        {myContent.wishlistTitle || "Wishlist"}
      </Typography>
      <WishlistList />
    </Box>
  );
};

export default WishlistPage;
