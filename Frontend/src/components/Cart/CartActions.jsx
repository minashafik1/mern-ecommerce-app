import { Box, Button } from "@mui/material";

export default function CartActions({
  myContent,
  onClear,
  onUpdate,
  onCheckout,
  editedItems,
}) {
  return (
    <Box display="flex" justifyContent="space-between" mt={3}>
      <Button variant="outlined" color="error" onClick={onClear}>
        {myContent.clearCart}
      </Button>
      <Box display="flex" gap={2}>
        <Button
          variant="contained"
          color="primary"
          disabled={!Object.values(editedItems).some(Boolean)}
          onClick={onUpdate}
        >
          {myContent.updateAll}
        </Button>
        <Button variant="contained" color="success" onClick={onCheckout}>
          {myContent.checkout}
        </Button>
      </Box>
    </Box>
  );
}
