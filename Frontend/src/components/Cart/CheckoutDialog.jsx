import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  CircularProgress,
} from "@mui/material";

export default function CheckoutDialog({
  open,
  onClose,
  paymentMethod,
  setPaymentMethod,
  myContent,
  onCheckout,
  orderLoading,
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{myContent.checkout}</DialogTitle>
      <DialogContent>
        <RadioGroup
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel value="cash" control={<Radio />} label={myContent.cash} />
          <FormControlLabel value="card" control={<Radio />} label={myContent.card} />
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{myContent.cancel}</Button>
        <Button
          variant="contained"
          color="success"
          onClick={onCheckout}
          disabled={orderLoading}
          startIcon={orderLoading && <CircularProgress size={18} color="inherit" />}
        >
          {orderLoading ? myContent.processing : myContent.placeOrder}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
