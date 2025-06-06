import { Card, CardHeader } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

export default function PaypalReturn() {
  const dispatch = useDispatch();
  const locatoin = useLocation();
  const params = new URLSearchParams(locatoin.search);
  const payerId = params.get("PayerID");
  const paymentId = params.get("paymentId");

  useEffect(() => {
    if (paymentId && payerId) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

      dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shop/payment-success";
        }
      });
    }
  }, [paymentId, payerId, dispatch]);

  return (
    <Card>
      <CardHeader>Processing Paymennt.....Please wait</CardHeader>
    </Card>
  );
}
