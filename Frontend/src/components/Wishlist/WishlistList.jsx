
import React from "react";
import { Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import WishlistItem from "./WishlistItem";

const WishlistList = () => {
  const { items } = useSelector((state) => state.wishlist);
  const { content: myContent, lang } = useSelector((state) => state.myLang);

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"}>
      {items.length === 0 ? (
        <Typography
          variant="h6"
          sx={{
            p: 2,
            textAlign: lang === "ar" ? "right" : "left",
          }}
        >
          {myContent.emptyWishlist || "No items in wishlist"}
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {items.map((product) => (
            <Grid item xs={12} sm={6} key={product._id}>
              <WishlistItem product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default WishlistList;
