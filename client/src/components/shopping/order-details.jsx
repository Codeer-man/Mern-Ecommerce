import React from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useSelector } from "react-redux";

export default function ShoppingOrderDetailView({ orderDetail }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetail._id}</Label>
          </div>
          <div className="flex mt-3 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{orderDetail.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex mt-3 items-center justify-between">
            <p className="font-medium">orderPrice</p>
            <Label>${orderDetail.totalAmount}</Label>
          </div>
          <div className="flex mt-3 items-center justify-between">
            <p className="font-medium">Order status</p>
            <Label> {orderDetail.oderstatus}</Label>
          </div>
          <div className="flex mt-3 items-center justify-between">
            <p className="font-medium">Payment method</p>
            <Label> {orderDetail.paymentMethod}</Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetail?.cartItems && orderDetail?.cartItems.length > 0
                ? orderDetail?.cartItems.map((item) => (
                    <li
                      key={item._id}
                      className="flex items-center justify-between"
                    >
                      <span>Title: {item.title}</span>
                      <span>Quantity: {item.quantity}</span>
                      <span>Price: ${item.price}</span>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        {/* shipping info  */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user.userName}</span>
              <span>{orderDetail?.addressInfo?.address}</span>
              <span>{orderDetail?.addressInfo?.city}</span>
              <span>{orderDetail?.addressInfo?.pincode}</span>
              <span>{orderDetail?.addressInfo?.phone}</span>
              <span>{orderDetail?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
