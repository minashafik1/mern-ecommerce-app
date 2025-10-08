

import React from "react";
import { useSelector } from "react-redux";

const OrderCancel = () => {
  const { myContent } = useSelector((state) => state.language);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">
        {myContent.order.paymentCancelled}
      </h1>
      <p className="mb-4">{myContent.order.paymentFailed}</p>
      <a
        href="/order"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {myContent.order.backToCheckout}
      </a>
    </div>
  );
};

export default OrderCancel;
