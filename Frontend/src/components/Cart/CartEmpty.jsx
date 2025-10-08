import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function CartEmpty({ myContent, lang }) {
  return (
    <Box textAlign="center" mt={5} dir={lang === "ar" ? "rtl" : "ltr"}>
      <Typography variant="h5" gutterBottom>
        {myContent.emptyCart}
      </Typography>
      <Button variant="contained" color="success" component={Link} to="/products">
        {myContent.returnToShop}
      </Button>
    </Box>
  );
}
