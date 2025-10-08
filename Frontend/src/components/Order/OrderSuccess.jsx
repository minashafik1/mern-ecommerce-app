
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchOrderSuccessAsync } from "../../redux/slices/orderSlice";

const OrderSuccess = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const { currentOrder, loading, error } = useSelector((state) => state.orders);
  const { myContent } = useSelector((state) => state.language);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderSuccessAsync(orderId));
    }
  }, [dispatch, orderId]);

  if (loading)
    return <p className="text-center mt-6">{myContent.order.loadingOrder}</p>;
  if (error)
    return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded text-center">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        {myContent.order.paymentSuccess}
      </h1>

      {currentOrder ? (
        <div className="space-y-2">
          <p>
            <strong>{myContent.order.orderId}</strong> {currentOrder._id}
          </p>
          <p>
            <strong>{myContent.order.totalPaid}</strong> $
            {currentOrder.totalPrice}
          </p>
          <p>
            <strong>{myContent.order.status}</strong> {currentOrder.orderStatus}
          </p>
        </div>
      ) : (
        <p>{myContent.order.noOrderDetails}</p>
      )}

      <a
        href="/"
        className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded"
      >
        {myContent.order.goHome}
      </a>
    </div>
  );
};

export default OrderSuccess;
