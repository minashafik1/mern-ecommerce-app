
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrderAsync } from "../../redux/slices/orderSlice";

const OrderForm = ({ onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.orders);
  const { myContent } = useSelector((state) => state.language);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(createOrderAsync({ paymentMethod }));

    if (createOrderAsync.fulfilled.match(resultAction)) {
      if (paymentMethod === "cash") {
        onSuccess?.(); // clear cart etc
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex gap-4">
        <label>
          <input
            type="radio"
            value="cash"
            checked={paymentMethod === "cash"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          {myContent.order.cash}
        </label>
        <label>
          <input
            type="radio"
            value="card"
            checked={paymentMethod === "card"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          {myContent.order.card}
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading
          ? myContent.order.processing
          : myContent.order.placeOrder}
      </button>
    </form>
  );
};

export default OrderForm;
