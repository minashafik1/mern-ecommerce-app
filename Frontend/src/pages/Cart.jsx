
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartAsync,
  updateCartItemAsync,
  removeCartItemAsync,
  clearCartAsync,
} from "../redux/slices/cartSlice";
import { createOrderAsync } from "../redux/slices/orderSlice";
import { Box, Typography, CircularProgress } from "@mui/material";
import toast from "react-hot-toast";

import CartItem from "../components/Cart/CartItem";
import CartActions from "../components/Cart/CartActions";
import CheckoutDialog from "../components/Cart/CheckoutDialog";
import CartSummary from "../components/Cart/CartSummary";
import CartEmpty from "../components/Cart/CartEmpty";

export default function Cart() {
  const dispatch = useDispatch();
  const { cartItems, totalCartPrice, loading, error } = useSelector(
    (state) => state.cart
  );
  const { loading: orderLoading } = useSelector((state) => state.orders);
  const currentLang = useSelector((state) => state.myLang.lang);
  const myContent = useSelector((state) => state.myLang.content.cartPage); 

  const [quantities, setQuantities] = useState({});
  const [editedItems, setEditedItems] = useState({});
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  useEffect(() => {
    dispatch(fetchCartAsync());
  }, [dispatch]);

  useEffect(() => {
    if (cartItems) {
      const qtys = {};
      cartItems.forEach((item) => (qtys[item.product._id] = item.quantity));
      setQuantities(qtys);
      setEditedItems({});
    }
  }, [cartItems]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleQuantityChange = (productId, newQty, maxStock) => {
    if (isNaN(newQty) || newQty < 1) newQty = 1;
    if (newQty > maxStock) {
      toast.error(`${myContent.onlyInStock} ${maxStock} ${myContent.itemsInStock}`);
      newQty = maxStock;
    }
    setQuantities((prev) => ({ ...prev, [productId]: newQty }));
    setEditedItems((prev) => ({
      ...prev,
      [productId]:
        newQty !== cartItems.find((i) => i.product._id === productId)?.quantity,
    }));
  };

  const handleUpdateAll = async () => {
    const updates = Object.keys(editedItems).filter((id) => editedItems[id]);
    for (let id of updates) {
      const result = await dispatch(
        updateCartItemAsync({ id, quantity: quantities[id] })
      );
      if (updateCartItemAsync.rejected.match(result)) {
        toast.error(result.payload || myContent.updateFailed);
        return;
      }
    }
    toast.success(myContent.updateSuccess);
    setEditedItems({});
    dispatch(fetchCartAsync());
  };

  const handleRemove = async (itemId) => {
    const result = await dispatch(removeCartItemAsync(itemId));
    if (removeCartItemAsync.rejected.match(result)) {
      toast.error(result.payload || myContent.removeFailed);
      return;
    }
    toast.success(myContent.removeSuccess);
    dispatch(fetchCartAsync());
  };

  const handleClear = async () => {
    const result = await dispatch(clearCartAsync());
    if (clearCartAsync.rejected.match(result)) {
      toast.error(result.payload || myContent.clearFailed);
      return;
    }
    toast.success(myContent.clearSuccess);
  };

  const handleCheckout = async () => {
    const orderData = { paymentMethod };
    const result = await dispatch(createOrderAsync(orderData));
    if (createOrderAsync.rejected.match(result)) {
      toast.error(result.payload || myContent.orderFailed);
      return;
    }
    toast.success(myContent.orderSuccess);
    if (paymentMethod === "cash") dispatch(clearCartAsync());
    setCheckoutOpen(false);
  };

  if (!loading && (!cartItems || cartItems.length === 0)) {
    return <CartEmpty myContent={myContent} lang={currentLang} />;
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <Box p={4} bgcolor="#f5f5f5" minHeight="100vh" dir={currentLang === "ar" ? "rtl" : "ltr"}>
      <Typography variant="h4" mb={3}>{myContent.title}</Typography>
      <Box bgcolor="white" p={3} borderRadius={2} boxShadow={2}>
        {cartItems.map((item) => (
          <CartItem
            key={item._id}
            item={item}
            lang={currentLang}
            quantity={quantities[item.product._id]}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemove}
          />
        ))}

        <CartSummary subtotal={totalCartPrice} myContent={myContent} />

        <CartActions
          myContent={myContent}
          onClear={handleClear}
          onUpdate={handleUpdateAll}
          onCheckout={() => setCheckoutOpen(true)}
          editedItems={editedItems}
        />
      </Box>

      <CheckoutDialog
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        myContent={myContent}
        onCheckout={handleCheckout}
        orderLoading={orderLoading}
      />
    </Box>
  );
};
