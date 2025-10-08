import React from "react";
import ProductCard from "./ProductCard";
import { Grid } from "@mui/material";

const ProductList = ({ products }) => {
  return (
    <Grid
      container
      spacing={2}
      sx={{ p: 2 }}
      justifyContent="center" 
    >
      {products.map((product) => (
        <Grid
          item
          key={product._id || product.id} 
          xs={12}   
          sm={6}    
          md={4}    
          lg={3}   
          xl={2.4}  
        >
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;
