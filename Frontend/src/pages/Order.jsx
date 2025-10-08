import React from "react";
import { useSelector } from "react-redux";
import OrderForm from "../components/Order/orderForm";

const OrderPage = () => {
  const { myContent } = useSelector((state) => state.language);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {myContent.order.checkout}
      </h1>
      <OrderForm />
    </div>
  );
};

export default OrderPage;
