import { Box, Typography, IconButton, TextField } from "@mui/material";
import { Delete } from "@mui/icons-material";

export default function CartItem({
  item,
  lang,
  quantity,
  onQuantityChange,
  onRemove,
}) {
  const productId = item.product._id;
  const itemId = item._id;
  const productImage =
    item.product.Images?.[0] || "https://via.placeholder.com/80";

  return (
    <Box
      key={itemId}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={2}
      mb={2}
      border="1px solid #ddd"
      borderRadius="8px"
    >
      <Box display="flex" alignItems="center">
        <img
          src={productImage}
          alt={item.product.name || "Product"}
          style={{
            width: "80px",
            height: "80px",
            objectFit: "cover",
            marginRight: lang === "ar" ? 0 : "16px",
            marginLeft: lang === "ar" ? "16px" : 0,
          }}
        />
        <Typography>{item.product.name}</Typography>
      </Box>

      <Typography>${item.price}</Typography>

      <TextField
        type="number"
        value={quantity}
        inputProps={{
          min: 1,
          max: item.product.quantity,
          style: { textAlign: "center" },
        }}
        style={{ width: "80px" }}
        onChange={(e) =>
          onQuantityChange(
            productId,
            parseInt(e.target.value),
            item.product.quantity
          )
        }
      />

      <Typography>${item.price * quantity}</Typography>

      <IconButton color="error" onClick={() => onRemove(itemId)}>
        <Delete />
      </IconButton>
    </Box>
  );
}
