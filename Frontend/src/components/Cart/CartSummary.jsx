import { Box, Typography, Divider } from "@mui/material";

export default function CartSummary({ subtotal, myContent }) {
  return (
    <>
      <Divider sx={{ my: 2 }} />
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6">{myContent.subtotal}</Typography>
        <Typography variant="h6">${subtotal}</Typography>
      </Box>
    </>
  );
}
